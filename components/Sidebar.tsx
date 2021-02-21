import React, { useEffect } from "react";
import Link from "next/link";
import styles from "../css/sidebar.module.css";

const Sidebar = ({ data }): JSX.Element => {
  useEffect(() => {}, []);

  return (
    <div className={styles.sideBar}>
      <Link href="/locations/fjaksdfjasl">about</Link>
      <div className={styles.locations}>
        {data.data.map((x: any, i: number) => (
          <Link key={i} href={`/locations/${x.locId}`}>
            <p className={styles.locationLink}> {x.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
