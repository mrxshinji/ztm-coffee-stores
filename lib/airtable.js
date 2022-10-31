var Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

var base = Airtable.base(process.env.AIRTABLE_BASE_KEY);

export const table = base("coffee-stores");

export const getMinifiedRecord = (records) => {
  return records.map((record) => {
    return {
      recordId: record.id,
      ...record.fields,
    };
  });
};

export const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecord = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
  if (findCoffeeStoreRecord.length !== 0) {
    return getMinifiedRecord(findCoffeeStoreRecord)
  }
  return [];
};
