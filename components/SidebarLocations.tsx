import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../css/sidebar.module.css";
import { Storage, ArrowDropDown } from "@material-ui/icons";
import { useRouter } from "next/router";

const SidebarLocations = ({ data, activeIndex }): JSX.Element => {
  const [showLocations, setShowLocations] = useState<Boolean>(false);
  const [activeLoc, setActiveLoc] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setShowLocations(activeIndex === 4);
    if (activeIndex === 4)
      setActiveLoc(data.findIndex((x: any) => x.locId === router.query.id));
  }, [activeIndex, router]);

  const handleClick = () => {
    setShowLocations((showLocations) => !showLocations);
  };

  return (
    <div className={styles.locationsWrapper}>
      <div
        className={showLocations ? styles.locationsActive : styles.locationBtn}
      >
        <Link href="/locations">
          <div
            className={
              activeIndex === 3 ? styles.activeSidebarLink : styles.sidebarLink
            }
          >
            <Storage />
            <p>Locations</p>
          </div>
        </Link>
        <ArrowDropDown
          onClick={handleClick}
          className={showLocations ? styles.activeArrow : styles.arrow}
        />
      </div>

      <div className={styles.locs}>
        <div
          className={showLocations ? styles.activeLocations : styles.locations}
        >
          {data.map((x: any, i: number) => (
            <Link href={`/locations/${x.locId}`} key={i}>
              <p
                className={
                  activeLoc === i
                    ? styles.activeLocationLink
                    : styles.locationLink
                }
              >
                - {x.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLocations;
