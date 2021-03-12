import axios from "axios";
import Layout from "components/Layout";
import styles from "../css/page.module.css";
import { useEffect, useState } from "react";
import DataTable from "components/dataTable";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const locations = (props: any): JSX.Element => {
  const [items, setItems] = useState([]);
  const [data, setData] = useState(props);
  const [newLocationFrom, setNewLocationForm] = useState<boolean>(false);

  useEffect(() => {
    setData(props);
  }, [props]);

  const onSubmit = (newName: string) => {
    setNewLocationForm(false);
    if (!newName.replace(/\s/g, "").length) return;

    axios({
      method: "POST",
      url: `http://${process.env.host}/createloc/`,
      data: { name: newName },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      setData({ data: [res.data.data, ...data.data] });
      parseData([res.data.data, ...items]);
    });
  };

  useEffect(() => {
    parseData(props.data);
  }, [props]);

  const parseData = (data: any) => {
    data.forEach((x: any) => {
      x.items = x.collections.length;
      x.link = `/locations/${x.locId}`;
    });
    setItems(data);
  };

  const deleteClicked = (locId: string) => {
    confirmAlert({
      overlayClassName: "confirmOverlay",
      customUI: ({ onClose }) => {
        return (
          <div className={styles.customUI}>
            <h2>Confirm to Delete</h2>
            <p>Are you sure you want to delete this Location?</p>
            <div>
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  axios({
                    method: "POST",
                    url: `http://${process.env.host}/deleteLoc/`,
                    data: { name: locId },
                  }).then((res) => {
                    if (res.data.err) return alert(res.data.data);
                    setData(res.data);
                    parseData(res.data.data);
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
    });
  };

  return (
    <Layout title="Locations" data={data}>
      <div className={styles.locPage}>
        <div className={styles.pageHeader}>
          <p>Locations</p>
          <button
            className={newLocationFrom ? styles.activeBtn : ""}
            onClick={() =>
              setNewLocationForm((newLocationFrom) => !newLocationFrom)
            }
          >
            New Location
          </button>
        </div>
        <div className={styles.locationsContainer}>
          <DataTable
            data={items}
            functions={{
              submitFunc: onSubmit,
              setNewLocationForm,
              deleteClicked,
            }}
            showForm={newLocationFrom}
            header={["Name", "Collections", "Size"]}
          />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const res = await axios.get(`http://${process.env.host}/data`);

  return {
    props: { data: res.data.dbs },
  };
}

export default locations;
