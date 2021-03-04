import net from "net";

export const tcpServerStatus = async ({ port, host }): Promise<string> => {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(port, host, () => {
      client.write(JSON.stringify({ testConnection: true }));
    });

    client.once("data", (data) => {
      resolve(data.toString());
      client.end();
    });

    client.once("close", (err) =>
      resolve(JSON.stringify({ isConnected: false }))
    );
    client.once("error", (err) =>
      resolve(JSON.stringify({ isConnected: false }))
    );
  });
};
