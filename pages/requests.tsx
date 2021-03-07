import axios from "axios";
import Layout from "components/Layout";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "../css/page.module.css";

interface Request {
  timeStamp: string;
}

interface RequestsStatus {
  serverStatus: boolean;
  apiRequest: Request[];
  serverRequests: Request[];
  serverConnections: Request[];
}

interface RequestsProps {
  data: any[];
  status: RequestsStatus;
}

interface dataType {
  labels: string[];
  datasets: any;
}

const options = {
  fill: false,
  lineTension: 0.1,
  backgroundColor: "rgba(75,12,192,0.4)",
  borderColor: "#0066af",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: "miter",
  pointBorderColor: "#fff",
  pointBackgroundColor: "#fff",
  pointBorderWidth: 1,
  pointHoverRadius: 3,
  pointHoverBackgroundColor: "#0066af",
  pointHoverBorderColor: "#fff",
  pointHoverBorderWidth: 1,
  pointRadius: 1,
  pointHitRadius: 10,
};

const Requests = (props: RequestsProps): JSX.Element => {
  const [serverReqs, setServerReqs] = useState(props.status.serverRequests);
  const [serverConns, setServerConn] = useState(props.status.serverConnections);
  const [apiReqs, setApiReqs] = useState(props.status.apiRequest);
  const [data1, setData1] = useState<dataType>({
    labels: [],
    datasets: [
      {
        ...options,
        label: "All Connections and Requests last week",
        data: [],
      },
    ],
  });
  const [data2, setData2] = useState<dataType>({
    labels: [],
    datasets: [
      {
        ...options,
        label: "All Connections and Requests last week",
        data: [],
      },
    ],
  });
  const [data3, setData3] = useState<dataType>({
    labels: [],
    datasets: [
      {
        ...options,
        label: "All Connections and Requests last week",
        data: [],
      },
    ],
  });

  let allRequests = new Array(7).fill(0),
    apiRequest = new Array(7).fill(0),
    serverRequests = new Array(7).fill(0);

  const formatDate = (date: any) => {
    let dd: any = date.getDate();
    let mm: any = date.getMonth() + 1;
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    date = `${mm}/${dd}/${date.getFullYear()}`;
    return date;
  };

  const Last7Days = () => {
    const result: string[] = [];
    const result2: object[] = [];
    for (let i = 0; i < 7; i++) {
      const d: any = new Date();
      d.setDate(d.getDate() - i);
      result2.push({ idx: i, timeStamp: d });
      result.push(formatDate(d));
    }

    return { formatedResults: result, result: result2 };
  };

  const {
    formatedResults,
    result,
  }: { formatedResults: string[]; result: object[] } = Last7Days();

  const createDataSetArray = () => {
    serverConns.forEach((time: any) => {
      result.forEach((date: any) => {
        if (
          new Date(date.timeStamp).toDateString() ===
          new Date(time.timeStamp).toDateString()
        )
          allRequests[Math.abs(date.idx - 7) - 1] += 1;
      });
    });

    serverReqs.forEach((time: any) => {
      result.forEach((date: any) => {
        if (
          new Date(date.timeStamp).toDateString() ===
          new Date(time.timeStamp).toDateString()
        ) {
          serverRequests[Math.abs(date.idx - 7) - 1] += 1;
          allRequests[Math.abs(date.idx - 7) - 1] += 1;
        }
      });
    });

    apiReqs.forEach((time: any) => {
      result.forEach((date: any) => {
        if (
          new Date(date.timeStamp).toDateString() ===
          new Date(time.timeStamp).toDateString()
        ) {
          apiRequest[Math.abs(date.idx - 7) - 1] += 1;
          allRequests[Math.abs(date.idx - 7) - 1] += 1;
        }
      });
    });

    setData1({
      labels: formatedResults.reverse(),
      datasets: [
        {
          ...options,
          label: "All Connections and Requests last week",
          data: allRequests,
        },
      ],
    });
    setData2({
      labels: formatedResults.reverse(),
      datasets: [
        {
          ...options,
          label: "All Connections and Requests last week",
          data: serverRequests,
        },
      ],
    });
    setData3({
      labels: formatedResults.reverse(),
      datasets: [
        {
          ...options,
          label: "All Connections and Requests last week",
          data: apiRequest,
        },
      ],
    });
  };

  useEffect(() => {
    allRequests = new Array(7).fill(0);
    apiRequest = new Array(7).fill(0);
    serverRequests = new Array(7).fill(0);
    createDataSetArray();
  }, [serverReqs, serverConns, apiReqs]);

  const clearRequests = () => {
    axios({
      method: "DELETE",
      url: `http://${process.env.host}/deleteReqs/`,
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      setServerConn(res.data.data.serverConnections);
      setServerReqs(res.data.data.serverRequests);
      setApiReqs(res.data.data.apiRequest);
    });
  };

  return (
    <Layout title="status" data={props}>
      <div className={styles.chartGrid}>
        <div className={styles.header}>
          <p>Requests</p>
          <button onClick={clearRequests}>Clear All Requests</button>
        </div>
        <div className={styles.chartTop}>
          <Line data={data1} />
        </div>
        <div style={{ display: "flex" }}>
          <div className={styles.chart}>
            <Line data={data2} />
          </div>
          <div className={styles.chart}>
            <Line data={data3} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const res = await axios.get(`http://${process.env.host}/requestsData`);
  return {
    props: { data: res.data.items.dbs, status: res.data.status },
  };
}

export default Requests;
