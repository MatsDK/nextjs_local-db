import axios from "axios";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../css/loc.module.css";
import { ArrowForwardIos } from "@material-ui/icons";
import DataTable from "components/dataTable";

const id = (props: any) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    props.locData.collections.forEach((x) => {
      x.link = `/locations/${props.locData.locId}/collections/${x.colId}`;
    });
    setItems(props.locData.collections);
  }, [props]);

  return (
    <Layout data={props} title={props.locData.name}>
      <p className={styles.pageHeader}>Collections</p>
      <div className={styles.pathWrapper}>
        <Link href="/locations">
          <p className={styles.pathLink}>Locations</p>
        </Link>
        <ArrowForwardIos className={styles.arrow} />

        <p className={styles.currentPathLink}>{props.locData.name}</p>
      </div>
      <div className={styles.collectionsContainer}>
        <DataTable data={items} header={["Name", "Documents", "Size"]} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const res = await axios.get(`http://localhost:3001/api/data/${params!.id}`);

  return {
    props: { data: res.data.items.dbs, locData: res.data.thisLoc },
  };
};

export default id;
