import axios from "axios";
import Layout from "components/Layout";
// import styles from "../css/index.module.css";

const Index = (props): JSX.Element => {
  return (
    <Layout data={props} title={"Home"}>
      <h1>hello</h1>
    </Layout>
  );
};

export async function getServerSideProps() {
  const res = await axios.get("http://localhost:3001/data");

  return {
    props: { data: res.data.dbs },
  };
}

export default Index;
