import { fetchCoffeeStores } from "../../lib/coffee-stores-data";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const fetched = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(fetched);
  } catch (err) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "Opps, something went wrong ", err });
  }
};

export default getCoffeeStoresByLocation