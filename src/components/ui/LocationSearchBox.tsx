import React, { useRef } from 'react'
import { Autocomplete } from '@react-google-maps/api'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface LocationSearchBoxProps {
  onSelectLocation: (place: google.maps.places.PlaceResult | null) => void
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const LocationSearchBox = ({
  onSelectLocation,
  value,
  onChange,
}: LocationSearchBoxProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete
  }

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace()
      onSelectLocation(place)
    }
  }

  return (
    <div className='relative'>
      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
        <Search className='h-4 w-4 text-gray-400' />
      </div>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        fields={['formatted_address', 'geometry', 'address_components']}
        types={['address']}
      >
        <Input
          type='text'
          className='rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
          placeholder='Search for an address...'
          value={value}
          onChange={onChange}
        />
      </Autocomplete>
    </div>
  )
}
