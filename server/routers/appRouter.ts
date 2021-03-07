import BSON from "bson";
import express, { Request, Response } from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import ip from "ip";
import cors from "cors";
import { exec } from "child_process";
import { tcpServerStatus } from "../tcpServerStatus";

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

  let totalSize: number = 0,
    totalCollections: number = 0,
    totalDocs: number = 0;

  items.dbs.forEach((loc: Location) => {
    let thisSize = 0;
    loc.collections.forEach((col: Collection) => {
      const thisPath = `./data/collection-${col.colId}`;
      totalDocs += BSON.deserialize(fs.readFileSync(thisPath)).items.length;
      thisSize += fs.statSync(thisPath).size;
    });
    loc.size = thisSize;
    totalSize += thisSize;
    totalCollections += loc.collections.length;
  });

  const status = BSON.deserialize(fs.readFileSync("./data/status"));

  fs.writeFileSync("./data/status", BSON.serialize(status));

  const totalRequests =
    status.apiRequest.length +
    status.serverRequests.length +
    status.serverConnections.length;

  res.json({
    totalRequests,
    items,
    totalCollections,
    totalDocs,
    ip: ip.address(),
    status,
    totalSize,
  });
});

router.post("/toggleTCPSserver", async (req: Request, res: Response) => {
  const loc = req.get("host")?.split(":");
  const currentStatus: string = await tcpServerStatus({
    port: 2505,
    host: loc![0],
  });

  if (JSON.parse(currentStatus).isConnected === req.body.newStatus)
    return res.json({ err: false, data: req.body.newStatus });

  if (req.body.newStatus)
    exec("pm2 start TCPServer", (error, stdout, stderr) => {
      if (error) return res.json({ err: true, data: error });
      if (stderr) return res.json({ err: true, data: stderr });
    });
  else if (!req.body.newStatus)
    exec("pm2 stop TCPServer", (error, stdout, stderr) => {
      if (error) return res.json({ err: true, data: error });
      if (stderr) return res.json({ err: true, data: stderr });
    });
  else return;

  res.json({ err: false, data: req.body.newStatus });
});

router.get("/requestsData", (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const status = BSON.deserialize(fs.readFileSync("./data/status"));

  items.dbs.forEach((loc: Location) => {
    let thisSize = 0;
    loc.collections.forEach((col: Collection) => {
      thisSize += fs.statSync(`./data/collection-${col.colId}`).size;
    });
    loc.size = thisSize;
  });

  res.json({ status, items });
});

router.delete("/deleteReqs", (req: Request, res: Response) => {
  const status = BSON.deserialize(fs.readFileSync("./data/status"));
  const newStatus = {
    serverStatus: status.serverStatus,
    apiRequest: [],
    serverRequests: [],
    serverConnections: [],
  };

  fs.writeFileSync("./data/status", BSON.serialize(newStatus));
  res.json({ err: false, data: newStatus });
});

router.get("/getServerStatus", async (req: Request, res: Response) => {
  const loc = req.get("host")?.split(":");
  const currentStatus: string = await tcpServerStatus({
    port: 2505,
    host: loc![0],
  });

  res.json({ err: false, data: JSON.parse(currentStatus).isConnected });
});

router.delete("/deleteDoc", (req: Request, res: Response) => {
  const {
    docId,
    loc: { locId, colId },
  }: { docId: string; loc: { locId: string; colId: string } } = req.body;

  const locs = BSON.deserialize(fs.readFileSync("./data/dbData")).dbs;
  const thisLoc = locs.find((loc: Location) => loc.locId === locId);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  const thisCol: Collection = thisLoc.collections.find(
    (col: Collection) => col.colId === colId
  );
  if (!thisCol) return res.json({ err: true, data: "collection not found" });

  const items = BSON.deserialize(
    fs.readFileSync(`./data/collection-${thisCol.colId}`)
  ).items;

  const idx = items.findIndex((x: any) => x._id === docId);
  if (idx < 0) return res.json({ err: true, data: "Doc not found" });
  items.splice(idx, 1);
  fs.writeFileSync(
    `./data/collection-${thisCol.colId}`,
    BSON.serialize({ items })
  );
  res.json({ err: false, data: items });
});

router.post("/updateDoc", (req: Request, res: Response) => {
  const {
    newDoc,
    docId,
    loc: { locId, colId },
  } = req.body;
  let thisDoc = JSON.parse(newDoc);

  const locs = BSON.deserialize(fs.readFileSync("./data/dbData")).dbs;
  const thisLoc = locs.find((loc: Location) => loc.locId === locId);
  if (!thisLoc) return res.json({ err: true, data: "location not found" });

  const thisCol: Collection = thisLoc.collections.find(
    (col: Collection) => col.colId === colId
  );
  if (!thisCol) return res.json({ err: true, data: "collection not found" });

  const items = BSON.deserialize(
    fs.readFileSync(`./data/collection-${thisCol.colId}`)
  ).items;
  const idx = items.findIndex((x: any) => x._id === docId);

  thisDoc._id = docId;
  items[idx] = thisDoc;

  fs.writeFileSync(
    `./data/collection-${thisCol.colId}`,
    BSON.serialize({ items })
  );
  res.json({ err: false, data: items });
});

export default router;
