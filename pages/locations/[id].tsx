import axios from "axios";
import Layout from "components/Layout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React from "react";

function id(props) {
  const router = useRouter();
  const { id } = router.query;
  const data = props.data.find((x: any) => x.locId === id);

  return (
    <Layout data={props} title={data.name}>
      <Link href="/locations">Locations</Link>
      {data.name}
      <br />
      {data.collections.map((x, i) => (
        <Link href={`/locations/${data.locId}/collections/${x.colId}`} key={i}>
          {x.name}
        </Link>
      ))}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const res = await axios.get(`http://localhost:3001/api/data/${params!.id}`);

  return {
    props: { data: res.data.dbs },
  };
};

export default id;
