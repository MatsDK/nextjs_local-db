import axios from "axios";
import Layout from "components/Layout";
import fileSize from "filesize";
import styles from "../css/page.module.css";

const status = (props: any): JSX.Element => {
  return (
    <Layout title="status" data={props}>
      <div className={styles.statusPage}>
        <div className={styles.statusContainer}>
          <div className={styles.statusLeft}>
            <h3>Status</h3>
            <div className={styles.statusSizeHeader}>
              <div className={styles.statusSize}>
                <p>{fileSize(props.totalSize)}</p>
              </div>
            </div>
          </div>
          <div className={styles.statusRight}></div>
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
