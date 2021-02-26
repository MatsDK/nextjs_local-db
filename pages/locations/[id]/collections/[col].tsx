import axios from "axios";
import JsonTreeObject from "components/JsonTreeObject";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useCallback, useEffect, useState, useRef } from "react";
import styles from "../../../../css/col.module.css";
import { ArrowForwardIos } from "@material-ui/icons";

const Col = (props: any): JSX.Element => {
  const [items, setItems] = useState(props.items);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [morePosts, setMorePosts] = useState<Boolean>(true);

  const observer: any = useRef();
  const lastPostRef: any = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && morePosts)
            setPageNumber((pageNumber) => pageNumber + 1);
        },
        { threshold: 0.5 }
      );
      if (node) observer.current.observe(node);
    },
    [morePosts]
  );

  useEffect(() => {
    setItems(props.items.slice(0, pageNumber * 10));
    if (pageNumber * 10 >= props.items.length) setMorePosts(false);
  }, [props, pageNumber]);

  return (
    <Layout title={props.col.name} data={props}>
      <div className={styles.colPage}>
        <div className={styles.pathWrapper}>
          <Link href={`/locations`}>
            <p className={styles.pathLink}>Locations</p>
          </Link>
          <ArrowForwardIos className={styles.arrow} />
          <Link href={`/locations/${props.loc.locId}`}>
            <p className={styles.pathLink}>{props.loc.name}</p>
          </Link>
          <ArrowForwardIos className={styles.arrow} />
          <p className={styles.currentPathLink}>{props.col.name}</p>
        </div>
        <div className="jsonObjectsWrapper">
          {items.map((x: any, i: number) => (
            <div
              ref={
                items.length !== 0 && i === items.length - 1
                  ? lastPostRef
                  : undefined
              }
              key={i}
            >
              <JsonTreeObject data={x} />
            </div>
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
