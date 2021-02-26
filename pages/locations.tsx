import axios from "axios";
import Layout from "components/Layout";
import styles from "../css/page.module.css";
import { useEffect, useState } from "react";
import DataTable from "components/dataTable";

const locations = (props: any): JSX.Element => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    props.data.forEach((x) => {
      x.items = x.collections.length;
      x.link = `/locations/${x.locId}`;
    });
    setItems(props.data);
  }, [props]);

  return (
    <Layout title="Locations" data={props}>
      <p className={styles.pageHeader}>Locations</p>
      <div className={styles.locationsContainer}>
        <DataTable data={items} header={["Name", "Collections", "Size"]} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const res = await axios.get("http://localhost:3001/api/data");

  return {
    props: { data: res.data.dbs },
  };
}

export default locations;
