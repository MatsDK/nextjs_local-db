import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import BSON from "bson";

const router = express.Router();

interface Collection {
  name: string;
  colId: string;
}

interface Location {
  locId: string;
  name: string;
  collections: Array<Collection>;
}

const logReq = (req: Request, res: Response, next: NextFunction) => {
  const status = BSON.deserialize(fs.readFileSync("./data/status"));
  status.apiRequest.push({ timeStamp: new Date() });
  fs.writeFileSync("./data/status", BSON.serialize(status));
  next();
};

router.use("*", logReq);

router.get("/", (req: Request, res: Response) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData")).dbs;
  const locsArr: object[] = [];

  locs.forEach((loc: Location) => {
    locsArr.push({ name: loc.name, id: loc.locId });
  });

  res.json({ locations: locsArr });
});

router.get("/:loc", (req: Request, res: Response) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData")).dbs;

  const thisLoc: Location = locs.find(
    (loc: Location) =>
      loc.locId === req.params.loc || loc.name === req.params.loc
  );
  if (!thisLoc) return res.json({ err: "location not found" });

  const collections: object[] = [];
  thisLoc.collections.forEach((col: Collection) => {
    collections.push({ name: col.name, id: col.colId });
  });

  res.json({ collections });
});

router.get("/:loc/:col", (req: Request, res: Response) => {
  const { loc, col } = req.params;
  const { p, l } = req.query;

  const locs = BSON.deserialize(fs.readFileSync("./data/dbData")).dbs;

  const thisLoc: Location = locs.find(
    (location: Location) => location.locId === loc || location.name === loc
  );
  if (!thisLoc) return res.json({ err: "location not found" });

  const thisCol = thisLoc.collections.find(
    (collection: Collection) =>
      collection.name === col || collection.colId === col
  );
  if (!thisCol) return res.json({ err: "collection not found" });

  let docs = BSON.deserialize(
    fs.readFileSync(`./data/collection-${thisCol.colId}`)
  ).items;

  let skip = 0;
  if (l) skip = Number(l) * (Number(p) - 1 || 0);
  else if (!l && p) skip = 10 * (Number(p) - 1);
  if (skip < 0) skip = 0;

  docs.splice(0, skip);
  if (l) docs.length = l;
  docs = docs.filter((el: any) => {
    return el !== null;
  });

  res.json({ documents: docs });
});

export default router;
