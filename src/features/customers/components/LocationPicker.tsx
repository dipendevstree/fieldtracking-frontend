import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import type { Libraries } from "@react-google-maps/api";
import { ENV } from "@/config/env";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 23.0225,
  lng: 72.5714,
};

const libraries: Libraries = ["places"];

// Define the shape of the data that will be passed back to the parent
interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (data: LocationData) => void;
  latLng?: string;
}

export default function LocationPicker({
  open,
  onOpenChange,
  onLocationSelect,
  latLng,
}: LocationPickerProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: ENV.GOOGLE_MAP_API_KEY,
    libraries,
  });

  // Reset internal state when the dialog is closed
  useEffect(() => {
    if (!open) {
      setMarker(null);
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
      setPostalCode("");

      // Clear input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [open]);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      reverseGeocode({ lat, lng });
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (latLng) {
      const parts = latLng.split(/[\s,]+/);

      if (parts.length >= 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);

        if (!isNaN(lat) && !isNaN(lng)) {
          reverseGeocode({ lat, lng });
        }
      }
    }
  }, [latLng]);

  const reverseGeocode = ({ lat, lng }: { lat: number; lng: number }) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const fullAddress = results[0].formatted_address;
        setAddress(fullAddress);

        const components = results[0].address_components;
        const cityComponent = components.find((c) =>
          c.types.includes("locality")
        );
        const stateComponent = components.find((c) =>
          c.types.includes("administrative_area_level_1")
        );
        const countryComponent = components.find((c) =>
          c.types.includes("country")
        );
        const postalCodeComponent = components.find((c) =>
          c.types.includes("postal_code")
        );

        setCity(cityComponent?.long_name || "");
        setState(stateComponent?.long_name || "");
        setCountry(countryComponent?.long_name || "");
        setPostalCode(postalCodeComponent?.long_name || "");

        if (latLng) {
          onLocationSelect({
            lat,
            lng,
            address: fullAddress,
            city: cityComponent?.long_name || "",
            state: stateComponent?.long_name || "",
            country: countryComponent?.long_name || "",
            postalCode: postalCodeComponent?.long_name || "",
          });
        }
      } else {
        setAddress("Address not found");
        setCity("");
        setState("");
        setCountry("");
        setPostalCode("");
      }
    });
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarker({ lat, lng });
      mapRef.current?.panTo({ lat, lng });
      mapRef.current?.setZoom(15);
      reverseGeocode({ lat, lng });
    }
  };

  const handleSubmit = () => {
    if (marker) {
      onLocationSelect({
        lat: marker.lat,
        lng: marker.lng,
        address,
        city,
        state,
        country,
        postalCode,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="p-4 w-full max-w-4xl! max-h-[90vh] overflow-y-auto rounded-lg [&>button]:hidden"
        style={{ zIndex: 9999 }}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {isLoaded ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Add Location</h3>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <Autocomplete
              onLoad={(auto) => (autocompleteRef.current = auto)}
              onPlaceChanged={handlePlaceSelect}
            >
              <Input
                ref={inputRef}
                placeholder="Search for a location..."
                defaultValue=""
                className="w-full"
              />
            </Autocomplete>
            <div className="w-full h-[400px] rounded-md overflow-hidden border">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={marker || defaultCenter}
                zoom={marker ? 15 : 10}
                onLoad={onLoad}
                onClick={onMapClick}
              >
                {marker && <Marker position={marker} />}
              </GoogleMap>
            </div>

            {marker && (
              <div className="p-4 bg-gray-50 rounded-md border text-sm space-y-2">
                <p>
                  <strong>Address:</strong> {address}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <p>
                    <strong>City:</strong> {city}
                  </p>
                  <p>
                    <strong>State:</strong> {state}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!marker}>
                Confirm Location
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            Loading map...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
