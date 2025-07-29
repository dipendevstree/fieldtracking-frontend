import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2, Search, X } from "lucide-react"

// Declare window.google for TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
}

interface PlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
  types: string[]
}

interface AddressComponents {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface PlacesAutocompleteProps {
  value?: string
  onChange?: (value: string) => void
  onSelect?: (prediction: PlacePrediction) => void
  onAddressComponents?: (components: AddressComponents) => void
}

export default function PlacesAutocomplete({ 
  value = "", 
  onChange, 
  onSelect,
  onAddressComponents
}: PlacesAutocompleteProps) {
  const [searchValue, setSearchValue] = useState(value)
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  
  // Check if Google Maps API is available
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setApiAvailable(true)
        return true
      }
      return false
    }

    // Check immediately
    if (checkGoogleMapsLoaded()) return

    // If not loaded, check again after a delay
    const interval = setInterval(() => {
      if (checkGoogleMapsLoaded()) {
        clearInterval(interval)
      }
    }, 500)

    // Clean up
    return () => clearInterval(interval)
  }, [])

  // Update internal value when prop changes
  useEffect(() => {
    setSearchValue(value || "")
  }, [value])

  const searchPlaces = useCallback((query: string) => {
    if (!query.trim() || !apiAvailable) {
      setPredictions([])
      return
    }
    
    setIsLoading(true)
    
    try {
      const autocompleteService = new window.google.maps.places.AutocompleteService()
      autocompleteService.getPlacePredictions(
        { 
          input: query,
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: ['us', 'ca', 'in', 'gb', 'au'] }
        },
        (results: google.maps.places.AutocompletePrediction[] | null, status: string) => {
          setIsLoading(false)
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results &&
            results.length > 0
          ) {
            setPredictions(results as unknown as PlacePrediction[])
          } else {
            setPredictions([])
          }
        }
      )
    } catch (_error) {
      // Silent error handling
      setIsLoading(false);
      setPredictions([]);
    }
  }, [apiAvailable])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    setShowSuggestions(true)
    if (onChange) onChange(newValue)
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      searchPlaces(newValue)
    }, 300)
  }

  const handleSuggestionClick = (prediction: PlacePrediction) => {
    setSearchValue(prediction.description)
    setShowSuggestions(false)
    setPredictions([])
    if (onChange) onChange(prediction.description)
    if (onSelect) onSelect(prediction)
    
    // Get address components and other details
    if (apiAvailable && onAddressComponents) {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      
      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['address_component', 'geometry', 'formatted_address']
        },
        (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place?.address_components
          ) {
            const addressComponents: AddressComponents = {};
            
            // Extract address components
            place.address_components.forEach(component => {
              const types = component.types;
              
              if (types.includes('street_number') || types.includes('route')) {
                addressComponents.street = addressComponents.street 
                  ? `${addressComponents.street} ${component.long_name}`
                  : component.long_name;
              }
              
              if (types.includes('locality')) {
                addressComponents.city = component.long_name;
              }
              
              if (types.includes('administrative_area_level_1')) {
                addressComponents.state = component.short_name;
              }
              
              if (types.includes('postal_code')) {
                addressComponents.postalCode = component.long_name;
              }
              
              if (types.includes('country')) {
                addressComponents.country = component.short_name.toLowerCase();
              }
            });
            
            onAddressComponents(addressComponents);
          }
        }
      );
    }
  }

  const handleClearInput = () => {
    setSearchValue('');
    setPredictions([]);
    if (onChange) onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const handleInputFocus = () => {
    if (searchValue.length > 0 && apiAvailable) {
      setShowSuggestions(true)
      searchPlaces(searchValue)
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || predictions.length === 0) return
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHoveredIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setHoveredIndex((prev) => (prev > 0 ? prev - 1 : predictions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (hoveredIndex >= 0 && predictions[hoveredIndex]) {
          handleSuggestionClick(predictions[hoveredIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setHoveredIndex(-1)
        break
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          id="location-search"
          name="location-search"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search for an address..."
          disabled={!apiAvailable}
        />
        {searchValue && (
          <button 
            type="button"
            onClick={handleClearInput}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {!apiAvailable && (
        <div className="text-sm text-red-500 mt-1">
          Google Maps API not available. Please check your internet connection.
        </div>
      )}
      
      {showSuggestions && searchValue.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-3 py-4 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          ) : predictions.length > 0 ? (
            <>
              <div className="py-1">
                {predictions.map((prediction, index) => (
                  <div
                    key={prediction.place_id || index}
                    className={`px-3 py-2.5 cursor-pointer flex items-start gap-3 hover:bg-gray-50 ${
                      hoveredIndex === index ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleSuggestionClick(prediction)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(-1)}
                  >
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{prediction.structured_formatting.main_text}</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {prediction.structured_formatting.secondary_text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-end">
                  <span className="text-xs text-gray-500">powered by </span>
                  <span className="text-xs font-medium ml-1">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </span>
                </div>
              </div>
            </>
          ) : searchValue.length > 2 && !isLoading ? (
            <div className="px-3 py-4 text-center text-sm text-gray-500">No locations found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
