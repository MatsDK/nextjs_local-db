import BSON from "bson";
import express, { Request, Response } from "express";
import fs from "fs";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/test", function (req: Request, res: Response) {
  console.log("hello");
  res.json({ msg: "hello world" });
});

router.get("/data", (req: Request, res: Response) => {
  const data = BSON.deserialize(fs.readFileSync("./data/dbData"));

  data.dbs.forEach((element: any) => {
    let thisSize = 0;
    element.collections.forEach((col: any) => {
      thisSize += fs.statSync(`./data/collection-${col.colId}`).size;
    });
    element.size = thisSize;
  });

  res.json(data);
});

router.get("/data/:id", (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((x: any) => x.locId === req.params.id);

  thisLoc.collections.forEach((element) => {
    const thisFile = `./data/collection-${element.colId}`;
    element.items = BSON.deserialize(fs.readFileSync(thisFile)).items.length;
    element.size = fs.statSync(thisFile).size;
  });

  res.json({ thisLoc, items });
});

router.get("/data/:id/col/:colId", (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((x: any) => x.locId === req.params.id);
  const thisCol = thisLoc.collections.find(
    (x: any) => x.colId === req.params.colId
  );

  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${thisCol.colId}`)
  );

  res.json({ items, thisLoc, thisCol, data: data.items });
});

router.post("/createloc", (req: Request, res: Response) => {
  const { name } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  if (items.dbs.find((x: any) => x.name === name))
    return res.json({ err: true, data: "already exists" });

  const thisItem: any = {
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
  const { name, loc } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((x: any) => x.locId === loc);

  if (!thisLoc) return res.json({ err: true, data: "unidentified error" });
  if (thisLoc.collections.find((x: any) => x.name === name))
    return res.json({ err: true, data: "already exists" });

  const newCol: any = {
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

  const idx = items.dbs.findIndex((x: any) => x.locId === name);
  if (!idx && idx !== 0)
    return res.json({ err: true, data: "unidentified error" });

  items.dbs[idx].collections.forEach((col: any) => {
    fs.unlinkSync(`./data/collection-${col.colId}`);
  });
  items.dbs.splice(idx, 1);

  items.dbs.forEach((element: any) => {
    let thisSize = 0;
    element.collections.forEach((col: any) => {
      thisSize += fs.statSync(`./data/collection-${col.colId}`).size;
    });
    element.size = thisSize;
  });

  fs.writeFileSync("./data/dbData", BSON.serialize(items));
  res.json({ err: false, data: items.dbs });
});

router.post("/deleteCol", (req: Request, res: Response) => {
  const { loc, name } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((x: any) => x.locId === loc);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  const idx = thisLoc.collections.findIndex((x: any) => x.colId === name);
  fs.unlinkSync(`./data/collection-${thisLoc.collections[idx].colId}`);

  thisLoc.collections.splice(idx, 1);
  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  thisLoc.collections.forEach((element: any) => {
    const thisFile = `./data/collection-${element.colId}`;
    element.items = BSON.deserialize(fs.readFileSync(thisFile)).items.length;
    element.size = fs.statSync(thisFile).size;
  });

  res.json({ err: false, data: thisLoc });
});

router.post("/renameLoc", (req: Request, res: Response) => {
  const { locId, name } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  if (items.dbs.filter((x: any) => x.name === name).length)
    return res.json({ err: true, data: "already exists" });

  const thisLoc = items.dbs.find((x: any) => x.locId === locId);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  thisLoc.name = name;
  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  res.json({ err: false, data: items.dbs });
});

router.post("/renameCol", (req: Request, res: Response) => {
  const { locId, colId, name } = req.body;
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((x: any) => x.locId === locId);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  const thisCol = thisLoc.collections.find((x: any) => x.colId === colId);
  if (!thisCol) return res.json({ err: true, data: "collection not found" });

  thisCol.name = name;
  fs.writeFileSync("./data/dbData", BSON.serialize(items));

  res.json({ err: false });
});

export default router;
