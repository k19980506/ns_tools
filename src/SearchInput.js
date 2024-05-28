import { Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";
import { Input } from "antd";

const SearchInput = ({ map, isLoaded }) => {
  const [searchInput, setSearchInput] = useState("");
  const autoCompleteRef = useRef(null);

  const handleLoad = (autoComplete) => {
    autoCompleteRef.current = autoComplete;
  };

  const onPlaceChanged = () => {
    if (autoCompleteRef.current !== null) {
      const place = autoCompleteRef?.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSearchInput(place.name);
        map?.setCenter({ lat, lng });
      } else {
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e?.target.value;
    setSearchInput(value);
  };

  const options = {
    componentRestrictions: { country: "tw" },
  };

  return (
    <div className="w-screen">
      {isLoaded ? (
        <Autocomplete
          onLoad={handleLoad}
          onPlaceChanged={onPlaceChanged}
          options={options}
        >
          <div className="flex">
            Location:
            <Input
              value={searchInput}
              onChange={handleInputChange}
              placeholder="輸入地址或地標..."
            />
          </div>
        </Autocomplete>
      ) : (
        <div>正在載入中</div>
      )}
    </div>
  );
};

export default SearchInput;
