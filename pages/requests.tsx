import axios from "axios";
import Layout from "components/Layout";

const Requests = (props) => {
  return (
    <Layout title="status" data={props}>
      requests
    </Layout>
  );
};

export async function getServerSideProps() {
  const res = await axios.get("http://localhost:3001/api/data");

  return {
    props: { data: res.data.dbs },
  };
}

export default Requests;
