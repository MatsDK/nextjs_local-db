// import { NextPageContext } from "next";
import axios from "axios";
import Layout from "components/Layout";
import { NextPageContext } from "next";

const about = ({ data }): JSX.Element => {
  return (
    <Layout title={"about"}>
      <h1>{data}</h1>
    </Layout>
  );
};

about.getInitialProps = async (ctx: NextPageContext) => {
  const res = await axios.post("http://localhost:3001/api/test");
  return { data: res.data.msg };
};

export default about;
