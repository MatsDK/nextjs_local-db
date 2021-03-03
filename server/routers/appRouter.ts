import BSON from "bson";
import express, { Request, Response } from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import ip from "ip";
import cors from "cors";

const router = express.Router();

interface CollectionBasic {
  name: string;
  colId: string;
}

interface Collection extends CollectionBasic {
  items?: number;
  size?: number;
}

interface LocationBasic {
  locId: string;
  name: string;
  collections: Array<Collection>;
}

interface Location extends LocationBasic {
  size?: number;
}

router.get("/data", (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));

  items.dbs.forEach((loc: Location) => {
    let thisSize = 0;
    loc.collections.forEach((col: Collection) => {
      thisSize += fs.statSync(`./data/collection-${col.colId}`).size;
    });
    loc.size = thisSize;
  });

  res.json(items);
});

router.get("/data/:id", (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find(
    (loc: Location) => loc.locId === req.params.id
  );

  thisLoc.collections.forEach((col: Collection) => {
    const thisFile = `./data/collection-${col.colId}`;
    col.items = BSON.deserialize(fs.readFileSync(thisFile)).items.length;
    col.size = fs.statSync(thisFile).size;
  });

  res.json({ thisLoc, items });
});

router.get("/data/:id/col/:colId", (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find(
    (loc: Location) => loc.locId === req.params.id
  );
  const thisCol = thisLoc.collections.find(
    (col: Collection) => col.colId === req.params.colId
  );

  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${thisCol.colId}`)
  );

  res.json({ items, thisLoc, thisCol, data: data.items });
});

router.post("/createloc", (req: Request, res: Response) => {
  const { name }: { name: string } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  if (items.dbs.find((loc: Location) => loc.name === name))
    return res.json({ err: true, data: "already exists" });

  const thisItem: Location = {
    locId: nanoid(),
    name,
    collections: [],
  };

  items.dbs.push(thisItem);
  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  thisItem.size = 0;
  res.json({ err: false, data: thisItem });
});

router.post("/createcol", (req: Request, res: Response) => {
  const { name, locId } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((loc: Location) => loc.locId === locId);

  if (!thisLoc) return res.json({ err: true, data: "unidentified error" });
  if (thisLoc.collections.find((col: Collection) => col.name === name))
    return res.json({ err: true, data: "already exists" });

  const newCol: Collection = {
    name,
    colId: nanoid(),
  };
  fs.writeFileSync(
    `./data/collection-${newCol.colId}`,
    BSON.serialize({ items: [] })
  );

  thisLoc.collections.push(newCol);
  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  newCol.items = 0;
  newCol.size = fs.statSync(`./data/collection-${newCol.colId}`).size;
  res.json({ err: false, data: newCol });
});

router.post("/deleteLoc", (req: Request, res: Response) => {
  const { name } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));

  const idx = items.dbs.findIndex((loc: Location) => loc.locId === name);
  if (!idx && idx !== 0)
    return res.json({ err: true, data: "unidentified error" });

  items.dbs[idx].collections.forEach((col: Collection) => {
    fs.unlinkSync(`./data/collection-${col.colId}`);
  });
  items.dbs.splice(idx, 1);

  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  items.dbs.forEach((loc: Location) => {
    let thisSize = 0;
    loc.collections.forEach((col: Collection) => {
      thisSize += fs.statSync(`./data/collection-${col.colId}`).size;
    });
    loc.size = thisSize;
  });

  res.json({ err: false, data: items.dbs });
});

router.post("/deleteCol", (req: Request, res: Response) => {
  const { locId, name } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((loc: Location) => loc.locId === locId);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  const idx = thisLoc.collections.findIndex(
    (col: Collection) => col.colId === name
  );
  fs.unlinkSync(`./data/collection-${thisLoc.collections[idx].colId}`);

  thisLoc.collections.splice(idx, 1);
  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  thisLoc.collections.forEach((col: Collection) => {
    const thisFile = `./data/collection-${col.colId}`;
    col.items = BSON.deserialize(fs.readFileSync(thisFile)).items.length;
    col.size = fs.statSync(thisFile).size;
  });

  res.json({ err: false, data: thisLoc });
});

router.post("/renameLoc", (req: Request, res: Response) => {
  const { locId, name } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  if (items.dbs.filter((loc: Location) => loc.name === name).length)
    return res.json({ err: true, data: "already exists" });

  const thisLoc = items.dbs.find((loc: Location) => loc.locId === locId);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  thisLoc.name = name;
  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  res.json({ err: false, data: items.dbs });
});

router.post("/renameCol", (req: Request, res: Response) => {
  const { locId, colId, name } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((loc: Location) => loc.locId === locId);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  if (thisLoc.collections.find((col: Collection) => col.name === name))
    return res.json({ err: true, data: "already exists" });
  const thisCol = thisLoc.collections.find(
    (col: Collection) => col.colId === colId
  );
  if (!thisCol) return res.json({ err: true, data: "collection not found" });

  thisCol.name = name;
  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  res.json({ err: false });
});

interface InsertProps {
  JSON: object;
  locId: string;
  colId: string;
}

router.post("/insertDoc", cors(), (req, res) => {
  const { JSON, locId, colId }: InsertProps = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((loc: Location) => loc.locId === locId);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  const thisCol: Collection = thisLoc.collections.find(
    (col: Collection) => col.colId === colId
  );
  if (!thisCol) return res.json({ err: true, data: "collection not found" });
  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${thisCol.colId}`)
  );

  data.items = [
    {
      _id: nanoid(),
      ...JSON,
    },
    ...data.items,
  ];

  fs.writeFileSync(`./data/collection-${thisCol.colId}`, BSON.serialize(data));

  res.json({ err: false, data: data.items });
});

router.get("/statusData", async (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));

  let totalSize = 0;
  items.dbs.forEach((loc: Location) => {
    let thisSize = 0;
    loc.collections.forEach((col: Collection) => {
      thisSize += fs.statSync(`./data/collection-${col.colId}`).size;
    });
    loc.size = thisSize;
    totalSize += thisSize;
  });

  const status = BSON.deserialize(fs.readFileSync("./data/status"));

  res.json({ items, ip: ip.address(), status, totalSize });
});

export default router;
