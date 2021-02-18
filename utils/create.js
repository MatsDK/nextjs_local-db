const { nanoid } = require("nanoid");
const BSON = require("bson");
const fs = require("fs");

const createLocation = (conn, req) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const exists = dbs.dbs.find((x) => x.name === req.name);

  if (exists)
    return conn.write(JSON.stringify({ err: "location already exists" }));

  dbs.dbs.push({
    locId: nanoid(),
    name: req.name,
    collections: new Array(),
  });
  fs.writeFileSync(`./data/dbData`, BSON.serialize(dbs));

  conn.write(JSON.stringify({ err: false }));
};

const createCollection = (conn, req) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));

  const loc = dbs.dbs.find((x) => x.name === req.loc);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  if (loc.collections.find((x) => x.name === req.colName))
    return conn.write(JSON.stringify({ err: "collection already exists" }));

  const colId = nanoid();
  loc.collections.push({ name: req.colName, colId });

  fs.writeFileSync(`./data/dbData`, BSON.serialize(dbs));
  fs.writeFileSync(`./data/collection-${colId}`, BSON.serialize({ items: [] }));

  conn.write(JSON.stringify({ err: false }));
};

module.exports = { createLocation, createCollection };
