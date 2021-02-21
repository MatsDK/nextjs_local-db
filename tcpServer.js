const BSON = require("bson");
const fs = require("fs");
const { nanoid } = require("nanoid");
const net = require("net");
const reqHandler = require("./utils/reqHandler");

if (!fs.existsSync("./data/users"))
  fs.writeFileSync(
    "./data/users",
    BSON.serialize({ users: [{ name: "admin", dbToken: nanoid() }] })
  );

if (!fs.existsSync("./data/dbData"))
  fs.writeFileSync("./data/dbData", BSON.serialize({ dbs: [] }));

const server = net.createServer((conn) => {
  conn.on("data", (data) => {
    const req = JSON.parse(data.toString());

    if (req.connect) {
      const data = BSON.deserialize(fs.readFileSync("./data/users"));
      const user = data.users.find((x) => x.name === "admin");

      if (!user) return conn.write(JSON.stringify({ err: "not valid user" }));

      return conn.write(JSON.stringify({ user, loc: req.loc }));
    } else reqHandler(conn, req);
  });

  conn.once("end", () => {});
  conn.once("close", () => {});

  conn.once("error", (err) => {
    if (err) throw err;
  });
});

const PORT = 3000;

server.listen(PORT, "127.0.0.1", () =>
  console.log(`TCP server running on port ${PORT}`)
);
