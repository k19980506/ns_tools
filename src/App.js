import { useState } from "react";
import SearchInput from "./SearchInput";
import Map from "./Map";
import { useJsApiLoader } from "@react-google-maps/api";
import { Button } from "antd";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_PLACES_API_KEY,
    libraries: ["places"],
    language: "zh-tw",
  });

  const [map, setMap] = useState(null);

  const onClickButton = () => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = map.getCenter();

    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          alert(
            "Selected location is: " + response.results[0].formatted_address,
          );
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  };

  return (
    <div>
      <div className="flex justify-between p-4">
        <SearchInput isLoaded={isLoaded} map={map} />
        <Button onClick={() => onClickButton()}>Check position</Button>
      </div>

      <Map isLoaded={isLoaded} map={map} setMap={setMap} />
    </div>
  );
}

export default App;
