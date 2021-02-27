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
  const [newLocationFrom, setNewLocationForm] = useState<Boolean>(false);

  useEffect(() => {
    parseData(props.locData.collections);
  }, [props]);

  const onSubmit = (data: string) => {
    setNewLocationForm(false);
    if (!data.replace(/\s/g, "").length) return;

    axios({
      method: "POST",
      url: "http://localhost:3001/api/createcol/",
      data: { name: data, loc: props.locData.locId },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      parseData([res.data.data, ...items]);
    });
  };

  const parseData = (data: any) => {
    data.forEach((x: any) => {
      x.link = `/locations/${props.locData.locId}/collections/${x.colId}`;
    });
    setItems(data);
  };

  const deleteClicked = (col: string) => {
    console.log(props.locData.locId, col);
  };

  return (
    <Layout data={props} title={props.locData.name}>
      <div className={styles.pageHeader}>
        <p>Collections</p>
        <button
          onClick={() =>
            setNewLocationForm((newLocationFrom) => !newLocationFrom)
          }
        >
          New Collection
        </button>
      </div>
      <div className={styles.pathWrapper}>
        <Link href="/locations">
          <p className={styles.pathLink}>Locations</p>
        </Link>
        <ArrowForwardIos className={styles.arrow} />

        <p className={styles.currentPathLink}>{props.locData.name}</p>
      </div>

      <div className={styles.collectionsContainer}>
        <DataTable
          showForm={newLocationFrom}
          data={items}
          functions={{
            submitFunc: onSubmit,
            setNewLocationForm,
            deleteClicked,
          }}
          header={["Name", "Documents", "Size"]}
        />
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
