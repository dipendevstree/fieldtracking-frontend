import { useRef, useState, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const libraries: "places"[] = ["places"];

interface LocationSearchBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  onSelectLocation: (place: google.maps.places.PlaceResult | null) => void;
}

export const LocationAutoSearchBox = ({
  value,
  onValueChange,
  onSelectLocation,
}: LocationSearchBoxProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCEkQ_KW66M2BjP03QiJ3R4dyzPWcOfuvw",
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      const formattedAddress = place.name || "";
      setInputValue(formattedAddress);
      onValueChange(formattedAddress);
      onSelectLocation(place);
    }
  };

  if (!isLoaded) {
    return <Input placeholder="Loading map..." disabled />;
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>

      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onValueChange(e.target.value);
          }}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search for an address..."
        />
      </Autocomplete>
    </div>
  );
};
