import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapPin, LocateFixed } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "90vh",
};

const LocationBtn = ({ handleUserLocation }) => {
  return <LocateFixed className="absolute  z-0" onClick={handleUserLocation} />;
};

const Map = ({ isLoaded, map, setMap, setSelected }) => {
  // 設置使用者現在的位置
  const [currentPosition, setCurrentPosition] = useState(null);
  const [showPosition, setShowPosition] = useState(false);
  // map 是 google maps 的物件，設置 state的變數去追蹤他的變化
  // 當地圖停止拖曳時為 true
  const [isMapIdle, setIsMapIdle] = useState(false);
  const [currentInfoWindow, setCurrentInfoWindow] = useState(null);
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);

  const options = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
    }),
    [],
  );
  const location = {
    lat: 25.033671,
    lng: 121.564427,
  };

  const handleLoad = useCallback((map) => {
    setMap(map);
    map.setZoom(18);
    map.setCenter(location);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (map) {
      // 監聽地圖是否拖曳停止
      const listener = map.addListener("idle", () => {
        setIsMapIdle(true);
      });
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }
  }, [map]);

  useEffect(() => {
    if (isMapIdle) {
      // 如果地圖拖曳停止，則顯示以下資料
      setShowPosition(true);
      setIsMapIdle(false);
    }
  }, [map, isMapIdle]);

  useEffect(() => {
    if (map) {
      const clickListener = map.addListener("click", () => {
        if (currentInfoWindow) {
          currentInfoWindow.close();
          setCurrentInfoWindow(null);
          setSelected(null);
        }
      });
      return () => {
        window.google.maps.event.removeListener(clickListener);
      };
    }
  }, [map, currentInfoWindow, setSelected, setCurrentInfoWindow]);

  const handleUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map?.setCenter(userPosition);
        setCurrentPosition(userPosition);
        setShowPosition(true);
        setIsLoading(true);
      },
      () => {
        alert("請允許存取使用者位置來使用此功能");
      },
    );
  };

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          options={options}
          onLoad={handleLoad}
        >
          <MapPin
            size={100}
            color="#ff0000"
            strokeWidth={2.75}
            className=" absolute left-1/2 top-1/2 z-0 -mx-12 -my-24"
          />
          <MapPin
            size={5}
            color="#1e00ff"
            strokeWidth={2.75}
            className="z--1 absolute left-1/2 top-1/2"
          />

          <LocationBtn handleUserLocation={handleUserLocation} />
        </GoogleMap>
      ) : (
        <div>Map is Loading</div>
      )}
    </>
  );
};

export default Map;
