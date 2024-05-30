import { useState, useRef } from "react";
import { Input } from "antd";
import { LoaderCircle } from "lucide-react";

const SearchInput = ({ map, isLoaded }) => {
  const [searchValue, setSearchValue] = useState("");
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPlaceInfo = (placeId) => {
    if (!window?.google?.maps?.places) return;
    let service = new window.google.maps.places.PlacesService(map);
    if (service && service?.getDetails) {
      service.getDetails({ placeId }, (place, status) => {
        if (!place && status !== "OK") {
          console.info(status);
          return;
        }
        if (!place.geometry) return;
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
        setPredictions([]);
        setSearchValue("");
        setShowPredictions(false);
      });
    }
  };

  const handleSearchChange = async (value) => {
    setLoading(true);
    setShowPredictions(true);
    setSearchValue(value);
    if (!window?.google?.maps?.places) return;
    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions({ input: value }, (predictions) => {
      console.log(predictions);
      if (predictions) {
        const newPrediction = { place_id: "", description: value };
        setPredictions([newPrediction, ...predictions]);
        setLoading(false);
      }
      return;
    });
    // if (
    //   AutocompleteService &&
    //   AutocompleteService?.getPlacePredictions({ input: value })
    // ) {
    //   AutocompleteService.getPlacePredictions(
    //     { value },
    //     function showPredictions(res, status) {
    //       console.log("res", res);
    //       if (!res && status !== "OK") {
    //         setLoading(false);
    //         return;
    //       }
    //       let predictionResponse = [];
    //       if (res && res.length > 0) {
    //         predictionResponse = res.map((place) => {
    //           return {
    //             description: place.description,
    //             matchedSubString: place.matched_substrings,
    //             placeId: place.place_id,
    //           };
    //         });
    //       }
    //       setPredictions(predictionResponse);
    //       setLoading(false);
    //     },
    //   );
    // }
  };

  return (
    <div className="w-screen">
      <div className="flex">
        Location:
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="輸入地址或地標..."
        />
      </div>
      {searchValue && showPredictions && (
        <ul>
          {loading && (
            <li>
              <LoaderCircle />
            </li>
          )}
          {!loading &&
            predictions.length > 0 &&
            predictions.map((place) => (
              <li
                key={place.place_id}
                onClick={() => getPlaceInfo(place.place_id)}
              >
                <p>{place.description}</p>
              </li>
            ))}
          {!loading && !predictions.length && <li>No results</li>}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
