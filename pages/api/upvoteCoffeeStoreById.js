import {
  table,
  findRecordByFilter,
  getMinifiedRecord,
} from "../../lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      // find coffeestores
      const { id } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          // increase voting count
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + parseInt(1);
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecord = getMinifiedRecord(updateRecord);
            res.json(minifiedRecord);
          }
        } else {
          res.json({ message: "This coffee-store does not exists", id });
        }
      } else {
        res.json({ message: "Id is missing", id });
      }
    } catch (err) {
      res.status(500).json({ message: "Error upvoting coffee store in api ", err });
    }
  }
};

export default upvoteCoffeeStoreById;
