const net = require("net");

module.exports = async function ({ port, host }, query) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(port, host, () => {
      client.write(JSON.stringify(query));
    });

    client.once("data", (data) => {
      const res = JSON.parse(data.toString());
      resolve(res);
      client.end();
    });

    client.once("close", () => {});
    client.once("error", () => reject);
  });
};
