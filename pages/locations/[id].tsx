import axios from "axios";
import Layout from "components/Layout";
import { useRouter } from "next/dist/client/router";
import React from "react";

function id(props) {
  const router = useRouter();
  const { id } = router.query;
  const loc = props.data.find((x) => x.locId === id);

  return (
    <Layout data={props} title="location">
      {loc.name}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const res = await axios.get(`http://localhost:3001/api/data/${params.id}`);

  return {
    props: { data: res.data.dbs },
  };
}

export default id;
