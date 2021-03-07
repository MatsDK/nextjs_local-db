import axios from "axios";
import Layout from "components/Layout";
import fileSize from "filesize";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../css/page.module.css";

const status = (props: any): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);
  const [apiRequests24Hour, setApiRequests24Hour] = useState<number>(0);
  const [serverRequests24Hour, setServerRequests24Hour] = useState<number>(0);
  const [
    serverConnections24Hour,
    setServerConnections24Hour,
  ] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    axios({
      url: `http://${process.env.host}/getServerStatus/`,
      method: "GET",
    }).then((res) => {
      if (mounted) {
        if (res.data.err) return alert(res.data.data);
        setServerStatus(res.data.data);
      }
    });

    const tsYesterday = Math.round(new Date().getTime() / 1000) - 24 * 3600;
    let last24HoursReqs: number = 0,
      last24HoursConnections: number = 0,
      last24HoursApiReqs: number = 0;

    props.status.serverRequests.forEach((time: any) => {
      const thisDate = Math.round(new Date(time.timeStamp).getTime() / 1000);

      if (tsYesterday < thisDate) last24HoursReqs++;
    });

    props.status.serverConnections.forEach((time: any) => {
      const thisDate = Math.round(new Date(time.timeStamp).getTime() / 1000);

      if (tsYesterday < thisDate) last24HoursConnections++;
    });

    props.status.apiRequest.forEach((time: any) => {
      const thisDate = Math.round(new Date(time.timeStamp).getTime() / 1000);

      if (tsYesterday < thisDate) last24HoursApiReqs++;
    });

    setApiRequests24Hour(last24HoursApiReqs);
    setServerConnections24Hour(last24HoursConnections);
    setServerRequests24Hour(last24HoursReqs);

    return () => {
      mounted = false;
    };
  }, []);

  const toggleServerStatus = () => {
    setLoading(true);
    axios({
      method: "POST",
      url: `http://${process.env.host}/toggleTCPSserver/`,
      data: { newStatus: !serverStatus },
    }).then((res) => {
      setLoading(false);
      if (res.data.err) return alert(res.data.data);
      setServerStatus(res.data.data);
    });
  };

  return (
    <Layout title="Status" data={props}>
      <div className={styles.statusPage}>
        <div className={styles.statusContainer}>
          {loading && (
            <div className={styles.loadingOverlay}>
              <h3>Loading...</h3>
            </div>
          )}
          <div className={styles.statusLeft}>
            <h3>Status</h3>
            <div className={styles.statusSizeHeader}>
              <div className={styles.statusSize}>
                <p>{fileSize(props.totalSize)}</p>
              </div>
            </div>
            <div className={styles.statusDataItems}>
              {props.items.dbs.length}{" "}
              <p>Location{props.items.dbs.length > 1 && "s"}</p>
            </div>
            <div className={styles.statusDataItems}>
              {props.totalCollections}{" "}
              <p>Collection{props.totalCollections > 1 && "s"}</p>
            </div>
            <div className={styles.statusDataItems}>
              {props.totalDocs} <p>Document{props.totalDocs > 1 && "s"}</p>
            </div>
            <div className={styles.statusDataItems}>
              {props.totalRequests}{" "}
              <Link href="/requests">
                <p className={styles.requestsLink}>
                  Total Request{props.totalRequests > 1 && "s"}
                </p>
              </Link>
            </div>
          </div>
          <div className={styles.statusRight}>
            <p className={styles.statusServerHeader}>TCP Server Status</p>
            <div className={styles.statusServer}>
              <div className={styles.statusServerLeft}>
                {serverStatus === null ? (
                  <div className={styles.statusServerLeftWrapperLoading}>
                    <p>Loading</p>
                  </div>
                ) : (
                  <div
                    onClick={toggleServerStatus}
                    className={
                      serverStatus
                        ? styles.statusServerLeftWrapperActive
                        : styles.statusServerLeftWrapperInActive
                    }
                  >
                    <p>{serverStatus ? "Online" : "Offline"}</p>
                  </div>
                )}
              </div>
              <div className={styles.statusServerRight}>
                <div className={styles.statusServerRightItem}>
                  {props.status.serverConnections.length}{" "}
                  <p>
                    Connection{props.status.serverConnections.length > 1 && "s"}{" "}
                    to server{" "}
                    <span> {serverConnections24Hour} last 24 hours</span>
                  </p>
                </div>
                <div className={styles.statusServerRightItem}>
                  {props.status.serverRequests.length}{" "}
                  <p>
                    Request{props.status.serverRequests.length > 1 && "s"} to
                    server <span>{serverRequests24Hour} last 24 hours</span>
                  </p>
                </div>
                <div className={styles.statusRightUrl}>
                  Url: {props.ip}:<p>2505</p>
                </div>
              </div>
            </div>
            <p className={styles.statusServerHeader}>HTTP API Status</p>
            <div className={styles.statusServer}>
              <div className={styles.statusServerLeft}>
                <div className={styles.statusServerLeftWrapperActive}>
                  <p>Online</p>
                </div>
              </div>
              <div className={styles.statusServerRight}>
                <div className={styles.statusServerRightItem}>
                  {props.status.apiRequest.length}{" "}
                  <p>
                    Request{props.status.apiRequest.length > 1 && "s"} to api{" "}
                    <span> {apiRequests24Hour} last 24 hours</span>
                  </p>
                </div>

                <div className={styles.statusRightUrl}>
                  Url: {props.ip}:<p>2504</p>/api
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const res = await axios.get(`http://${process.env.host}/statusData`);
  return {
    props: { data: res.data.items.dbs, ...res.data },
  };
}

export default status;
