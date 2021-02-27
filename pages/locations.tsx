import axios from "axios";
import Layout from "components/Layout";
import styles from "../css/page.module.css";
import { useEffect, useState } from "react";
import DataTable from "components/dataTable";

const locations = (props: any): JSX.Element => {
  const [items, setItems] = useState([]);
  const [newLocationFrom, setNewLocationForm] = useState<Boolean>(false);

  const onSubmit = (data: string) => {
    setNewLocationForm(false);
    if (!data.replace(/\s/g, "").length) return;

    axios({
      method: "POST",
      url: "http://localhost:3001/api/createloc/",
      data: { name: data },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
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

  const deleteClicked = (locId) => {
    console.log(locId);

    // axios({
    //   method: "POST",
    //   url: "http://localhost:3001/api/deleteLoc/",
    //   data: { name: locId },
    // }).then((res) => {
    //   console.log(res.data);
    //   // if (res.data.err) return alert(res.data.data);
    //   // parseData([res.data.data, ...items]);
    // });
  };

  return (
    <Layout title="Locations" data={props}>
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
  const res = await axios.get("http://localhost:3001/api/data");

  return {
    props: { data: res.data.dbs },
  };
}

export default locations;
