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
  const [newLocationFrom, setNewLocationForm] = useState<Boolean>(false);

  useEffect(() => {
    setData(props);
  }, [props]);

  const onSubmit = (newName: string) => {
    setNewLocationForm(false);
    if (!newName.replace(/\s/g, "").length) return;

    axios({
      method: "POST",
      url: "http://localhost:3001/createloc/",
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
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this Location.",
      overlayClassName: "confirmOverlay",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios({
              method: "POST",
              url: "http://localhost:3001/deleteLoc/",
              data: { name: locId },
            }).then((res) => {
              if (res.data.err) return alert(res.data.data);
              setData(res.data);
              parseData(res.data.data);
            });
          },
        },
        {
          label: "No",
          onClick: () => {
            return;
          },
        },
      ],
    });
  };

  return (
    <Layout title="Locations" data={data}>
      <div className={styles.locPage}>
        <div className={styles.pageHeader}>
          <p>Locations</p>
          <button
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
  const res = await axios.get("http://localhost:3001/data");

  return {
    props: { data: res.data.dbs },
  };
}

export default locations;
