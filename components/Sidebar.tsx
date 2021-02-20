import React from "react";
import Link from "next/link";
import styles from "../css/sidebar.module.css";

const Sidebar = (): JSX.Element => {
  return (
    <div className={styles.sideBar}>
      <Link href="/about">about</Link>
    </div>
  );
};

export default Sidebar;
