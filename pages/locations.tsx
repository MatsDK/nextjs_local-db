import axios from "axios";
import Layout from "components/Layout";
import Link from "next/link";

const locations = (props) => {
  return (
    <Layout title="Locations" data={props}>
      locations
      {props.data.map((x: any, i: number) => (
        <Link href={`/locations/${x.locId}`} key={i}>
          {x.name}
        </Link>
      ))}
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
