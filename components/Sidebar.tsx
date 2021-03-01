import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../css/sidebar.module.css";
import { useRouter } from "next/router";
import helper from "./helper";
import SidebarLocations from "./SidebarLocations";
import {
  HomeOutlined,
  GraphicEqOutlined,
  CastConnectedOutlined,
} from "@material-ui/icons";

const Sidebar = ({ data }): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    setActiveIndex(helper(router.asPath));
  }, [router]);

  return (
    <div className={styles.sideBar}>
      <Link href="/">
        <div
          className={
            activeIndex === 0 ? styles.activeSidebarLink : styles.sidebarLink
          }
        >
          <HomeOutlined />
          <p>Home</p>
        </div>
      </Link>
      <Link href="/status">
        <div
          className={
            activeIndex === 1 ? styles.activeSidebarLink : styles.sidebarLink
          }
        >
          <GraphicEqOutlined />

          <p>Status</p>
        </div>
      </Link>
      <Link href="/requests">
        <div
          className={
            activeIndex === 2 ? styles.activeSidebarLink : styles.sidebarLink
          }
        >
          <CastConnectedOutlined />
          <p>Requests</p>
        </div>
      </Link>

      <SidebarLocations data={data.data} activeIndex={activeIndex} />
    </div>
  );
};

export default Sidebar;
