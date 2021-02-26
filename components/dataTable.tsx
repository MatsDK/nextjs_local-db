import { ArrowForwardIos } from "@material-ui/icons";
import { useEffect, useState } from "react";
import tableStyles from "../css/table.module.css";
import Link from "next/link";
import fileSize from "filesize";

const SortArrow = ({ dir }) => {
  if (!dir) return <></>;

  if (dir === "desc")
    return (
      <div className={tableStyles.headingArrow}>
        <ArrowForwardIos
          style={{ height: "20px", width: "20px" }}
          className={tableStyles.downArrow}
        />
      </div>
    );
  else
    return (
      <div className={tableStyles.headingArrow}>
        <ArrowForwardIos
          style={{ height: "20px", width: "20px" }}
          className={tableStyles.upArrow}
        />
      </div>
    );
};

const orderBy = (data: any, value: any, dir: any) => {
  if (dir === "asc")
    return data.sort((a: any, b: any) => (a[value] > b[value] ? 1 : -1));
  if (dir === "desc")
    return data.sort((a: any, b: any) => (a[value] > b[value] ? -1 : 1));

  return data;
};

const DataTable = ({ data, header }): JSX.Element => {
  const [items, setItems] = useState(data);
  const [dir, setDir] = useState<String>();
  const [value, setValue] = useState<String>();

  useEffect(() => {
    setItems(orderBy(data, value, dir));
  }, [value, dir, data]);

  const switchDir = () => {
    if (!dir) setDir("desc");
    else if (dir === "desc") setDir("asc");
    else setDir("");
  };

  const setValueAndDir = (value: any): void => {
    switchDir();
    setValue(value);
  };

  return (
    <>
      <div className={tableStyles.heading}>
        <button
          className={tableStyles.headingName}
          onClick={() => setValueAndDir("name")}
        >
          <div>{header[0]}</div>
          {value === "name" ? <SortArrow dir={dir} /> : ""}
        </button>
        <button
          className={tableStyles.headingDocs}
          onClick={() => setValueAndDir("items")}
        >
          <div>{header[1]}</div>
          {value === "items" ? <SortArrow dir={dir} /> : ""}
        </button>
        <button
          className={tableStyles.headingSize}
          onClick={() => setValueAndDir("size")}
        >
          <div>{header[2]}</div>
          {value === "size" ? <SortArrow dir={dir} /> : ""}
        </button>
      </div>
      {items.map((x: any, i: number) => (
        <Link href={x.link} key={i}>
          <div className={tableStyles.row}>
            <div className={tableStyles.name}>{x.name}</div>
            <div className={tableStyles.items}>{x.items}</div>
            <div className={tableStyles.size}>{fileSize(x.size)}</div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default DataTable;
