import axios from "axios";
import Layout from "components/Layout";

const status = (props) => {
  return (
    <Layout title="status" data={props}>
      status
    </Layout>
  );
};

export async function getServerSideProps() {
  const res = await axios.get("http://localhost:3001/api/data");

  return {
    props: { data: res.data.dbs },
  };
}

export default status;
