import { ArrowForwardIos, Delete, Close } from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
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

interface functionProps {
  submitFunc: Function;
  setNewLocationForm: Function;
  deleteClicked: Function;
}

interface DataTableProps {
  data: Array<any>;
  header: Array<string>;
  functions: functionProps;
  showForm: boolean;
}

const DataTable = ({
  data,
  header,
  functions,
  showForm,
}: DataTableProps): JSX.Element => {
  const { submitFunc, setNewLocationForm, deleteClicked } = functions;

  const [items, setItems] = useState(data);
  const [dir, setDir] = useState<String>();
  const [value, setValue] = useState<String>();
  const [inpValue, setInpValue] = useState("");
  const inpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(orderBy(data, value, dir));
  }, [value, dir, data]);

  useEffect(() => {
    if (inpRef && inpRef.current && showForm) inpRef.current.focus();
  }, [showForm]);

  const switchDir = () => {
    if (!dir) setDir("desc");
    else if (dir === "desc") setDir("asc");
    else setDir("");
  };

  const setValueAndDir = (value: any): void => {
    switchDir();
    setValue(value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (inpRef && inpRef.current) {
      inpRef.current.blur();
      inpRef.current.value = "";
    }
    setInpValue("");
    submitFunc(inpValue);
  };

  const deleteItem = (e: any, id: string): void => {
    e.preventDefault();
    deleteClicked(id);
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
      {showForm && (
        <div className={tableStyles.inpRow}>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className={tableStyles.inpForm}
          >
            <input
              ref={inpRef}
              defaultValue={inpValue}
              onChange={(e) => setInpValue(e.target.value)}
              type="text"
              className={tableStyles.newInput}
              placeholder="Enter a name..."
            />
          </form>
          <div className={tableStyles.items}>0</div>
          <div className={tableStyles.size}>0</div>
          <button
            onClick={() => setNewLocationForm((showForm: boolean) => !showForm)}
            className={tableStyles.closeBtn}
          >
            <Close />
          </button>
        </div>
      )}
      {items.map((x: any, i: number) => (
        <Link href={x.link} key={i}>
          <div className={tableStyles.row}>
            <div className={tableStyles.name}>{x.name}</div>
            <div className={tableStyles.items}>{x.items}</div>
            <div className={tableStyles.size}>{fileSize(x.size)}</div>
            <Delete
              onClick={(e) => deleteItem(e, x.locId || x.colId)}
              className={tableStyles.deleteBtn}
            />
          </div>
        </Link>
      ))}
    </>
  );
};

export default DataTable;
