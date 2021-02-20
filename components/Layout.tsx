import React from "react";
import styles from "../css/index.module.css";
import Sidebar from "./Sidebar";

function Layout({ children, title }): JSX.Element {
  console.log(title);
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.mainContainer}>{children}</div>
    </div>
  );
}

export default Layout;
