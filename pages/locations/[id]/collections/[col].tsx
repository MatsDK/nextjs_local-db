import axios from "axios";
import JsonTreeObject from "components/JsonTreeObject";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../../../css/col.module.css";

const Col = (props: any): JSX.Element => {
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    setItems(props.items);
  }, [props]);

  return (
    <Layout title={props.col.name} data={props}>
      <div className={styles.colPage}>
        <Link href={`/locations`}>Locations</Link>
        <Link href={`/locations/${props.loc.locId}`}>{props.loc.name}</Link>
        <p>{props.col.name}</p>
        <div className="jsonObjectsWrapper">
          {items.map((x: any, i: number) => (
            <JsonTreeObject data={x} key={i} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const res = await axios.get(
    `http://localhost:3001/api/data/${params!.id}/col/${params!.col}`
  );

  return {
    props: {
      data: res.data.items.dbs,
      loc: res.data.thisLoc,
      col: res.data.thisCol,
      items: res.data.data,
    },
  };
};

export default Col;
