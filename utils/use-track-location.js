import { useState, useContext } from "react";

import { ACTION_TYPES, StoreContext } from "../pages/_app";

export const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext)

  const success = (position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    setLocationErrorMsg("");

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${lat},${long}` },
    });
    setIsFindingLocation(false);
  };

  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    locationErrorMsg,
    handleTrackLocation,
    isFindingLocation,
  };
};
