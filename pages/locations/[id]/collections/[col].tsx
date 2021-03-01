import axios from "axios";
import JsonTreeObject from "components/JsonTreeObject";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useCallback, useEffect, useState, useRef } from "react";
import styles from "../../../../css/col.module.css";
import { ArrowForwardIos, Create } from "@material-ui/icons";
import InsertEditor from "../../../../components/insertEditor";

const Col = (props: any): JSX.Element => {
  const [items, setItems] = useState(props.items);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [morePosts, setMorePosts] = useState<boolean>(true);
  const [showRenameForm, setShowRenameForm] = useState<boolean>(false);
  const [colName, setColName] = useState<string>(props.col.name);
  const [renameInpValue, setRenameInpValue] = useState<string>("");
  const [showInsertEditor, setShowInsertEditor] = useState<boolean>(false);
  const renameInpRef = useRef<HTMLInputElement>(null);

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
    setColName(props.col.name);
    setItems(props.items.slice(0, pageNumber * 10));
    if (pageNumber * 10 >= props.items.length) setMorePosts(false);
  }, [props, pageNumber]);

  const renameLoc = (e: any) => {
    e.preventDefault();
    if (!renameInpValue.replace(/\s/g, "").length) return;

    axios({
      method: "POST",
      url: "http://localhost:3001/renameCol/",
      data: {
        locId: props.loc.locId,
        colId: props.col.colId,
        name: renameInpValue,
      },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      if (renameInpRef && renameInpRef.current) renameInpRef.current.blur();
      setColName(renameInpValue);
      setShowRenameForm(false);
    });
  };

  useEffect(() => {
    if (showRenameForm && renameInpRef && renameInpRef.current)
      renameInpRef.current.focus();
  }, [showRenameForm]);

  const updateItems = (newData: Array<any>) => {
    setPageNumber(1);
    setShowInsertEditor(false);
    setItems(newData.slice(0, 10));
  };

  return (
    <Layout title={props.col.name} data={props}>
      <div className={styles.colPage}>
        <div className={styles.pageHeader}>
          <div className={styles.pathWrapper}>
            <Link href={`/locations`}>
              <p className={styles.pathLink}>Locations</p>
            </Link>
            <ArrowForwardIos className={styles.arrow} />
            <Link href={`/locations/${props.loc.locId}`}>
              <p className={styles.pathLink}>{props.loc.name}</p>
            </Link>
            <ArrowForwardIos className={styles.arrow} />
            <div className={styles.rightPath}>
              {!showRenameForm && (
                <p className={styles.currentPathLink}>{colName}</p>
              )}
              {showRenameForm && (
                <form className={styles.renameForm} onSubmit={renameLoc}>
                  <input
                    ref={renameInpRef}
                    defaultValue={colName}
                    type="text"
                    placeholder="Enter a name"
                    onChange={(e) => setRenameInpValue(e.target.value)}
                  />
                </form>
              )}
              <Create
                className={styles.renameIcon}
                style={{
                  color: showRenameForm ? "#0066af" : "rgb(212, 212, 212)",
                }}
                onClick={() =>
                  setShowRenameForm((showRenameForm) => !showRenameForm)
                }
              />
            </div>
          </div>
          <button
            className={showInsertEditor ? styles.activeBtn : ""}
            onClick={() =>
              setShowInsertEditor((showInsertEditor) => !showInsertEditor)
            }
          >
            Insert Doc
          </button>
        </div>
        {showInsertEditor && (
          <InsertEditor
            updateFunc={updateItems}
            loc={{ locId: props.loc.locId, colId: props.col.colId }}
          />
        )}
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
    `http://localhost:3001/data/${params!.id}/col/${params!.col}`
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
