import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getStorePictures = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 30,
  });
  const unsplashRes = photos.response.results.map(
    (result) => result.urls["small"]
  );
  return unsplashRes;
};

const foursquareQuery = (query, ll, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${ll}&radius=10000&limit=${limit}`;
};

export const fetchCoffeeStores = async (
  latLong = "3.167357,101.649143",
  limit = 6
) => {
  const photos = await getStorePictures();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FS_API_KEY,
    },
  };
  const response = await fetch(
    foursquareQuery("coffee", latLong, limit),
    options
  );

  const data = await response.json();
  return data.results.map((result, idx) => {
    const neighbourhood = result.location.neighbourhood;
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address || "",
      neighbourhood: neighbourhood?.length > 0 ? neighbourhood[0] : "",
      imgUrl: photos.length > 0 ? photos[idx] : null,
    };
  });
};
