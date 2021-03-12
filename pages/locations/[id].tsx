import axios from "axios";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../css/loc.module.css";
import { ArrowForwardIos, Create } from "@material-ui/icons";
import DataTable from "components/dataTable";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface Collection {
  name: string;
  coldId: string;
  items: number;
  size: number;
  link: string;
}

const id = (props: any) => {
  const [items, setItems] = useState<Array<any>>([]);
  const [data, setData] = useState(props);
  const [renameInpValue, setRenameInpValue] = useState<string>("");
  const [showRenameForm, setShowRenameForm] = useState<boolean>(false);
  const [newLocationFrom, setNewLocationForm] = useState<boolean>(false);
  const [colName, setColName] = useState<string>(props.locData.name);
  const renameInpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColName(props.locData.name);
    parseData(props.locData.collections);
  }, [props]);

  const onSubmit = (data: string) => {
    setNewLocationForm(false);
    if (!data.replace(/\s/g, "").length) return;

    axios({
      method: "POST",
      url: `http://${process.env.host}/createcol/`,
      data: { name: data, locId: props.locData.locId },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      parseData([res.data.data, ...items]);
    });
  };

  const parseData = (data: Array<Collection>) => {
    data.forEach((x: any) => {
      x.link = `/locations/${props.locData.locId}/collections/${x.colId}`;
    });
    setItems(data);
  };

  const deleteClicked = (col: string) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className={styles.customUI}>
            <h2>Confirm to Delete</h2>
            <p>Are you sure you want to delete this collection?</p>
            <div>
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  axios({
                    method: "POST",
                    url: `http://${process.env.host}/deleteCol/`,
                    data: { name: col, locId: props.locData.locId },
                  }).then((res) => {
                    if (res.data.err) return alert(res.data.data);
                    parseData(res.data.data.collections);
                    onClose();
                  });
                }}
              >
                Yes, Delete it
              </button>
            </div>
          </div>
        );
      },
      overlayClassName: "confirmOverlay",
      // buttons: [
      //   {
      //     label: "Yes",
      //     onClick: () => {
      //       axios({
      //         method: "POST",
      //         url: `http://${process.env.host}/deleteCol/`,
      //         data: { name: col, locId: props.locData.locId },
      //       }).then((res) => {
      //         if (res.data.err) return alert(res.data.data);
      //         parseData(res.data.data.collections);
      //       });
      //     },
      //   },
      //   {
      //     label: "No",
      //     onClick: () => {
      //       return;
      //     },
      //   },
      // ],
    });
  };

  useEffect(() => {
    setData(props);
  }, [props]);

  useEffect(() => {
    if (showRenameForm && renameInpRef && renameInpRef.current)
      renameInpRef.current.focus();
  }, [showRenameForm]);

  const renameLoc = (e: any) => {
    e.preventDefault();
    if (!renameInpValue.replace(/\s/g, "").length) return;

    axios({
      method: "POST",
      url: `http://${process.env.host}/renameLoc/`,
      data: { locId: props.locData.locId, name: renameInpValue },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      if (renameInpRef && renameInpRef.current) renameInpRef.current.blur();
      setColName(renameInpValue);
      setShowRenameForm(false);
      setData(res.data);
    });
  };

  return (
    <Layout data={data} title={colName}>
      <div className={styles.pageHeader}>
        <p>Collections</p>
        <button
          className={newLocationFrom ? styles.activeBtn : ""}
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
            style={{ color: showRenameForm ? "#0066af" : "rgb(212, 212, 212)" }}
            onClick={() =>
              setShowRenameForm((showRenameForm) => !showRenameForm)
            }
          />
        </div>
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
  const res = await axios.get(`http://${process.env.host}/data/${params!.id}`);

  return {
    props: { data: res.data.items.dbs, locData: res.data.thisLoc },
  };
};

export default id;
