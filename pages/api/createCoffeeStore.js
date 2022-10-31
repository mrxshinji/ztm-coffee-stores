import { table, findRecordByFilter } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  const { id, name, address, neighbourhood, voting, imgUrl } = req.body;
  // find and check a record and check
  if (req.method === "POST") {
    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.json({ records });
        } else {
          // create record
          if (name) {
            const createdRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            res.json({
              message: "create a record",
              record: createdRecord[0].fields,
            });
          } else {
            res.status(400).res.json({ message: "Name is missing" });
          }
        }
      } else {
        res.status(400).res.json({ message: "Id is missing" });
      }
    } catch (err) {
      console.error("Error Creating/Finding store", err);
      res.status(500).json({ message: "Error Creating/Finding store", err });
    }
  }
};

export default createCoffeeStore;
