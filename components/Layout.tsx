import React from "react";
import Head from "next/head";
import styles from "../css/index.module.css";
import Sidebar from "./Sidebar";

const Layout = ({ children, title, data }): JSX.Element => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.page}>
        <Sidebar data={data} />
        <div className={styles.mainContainer}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
