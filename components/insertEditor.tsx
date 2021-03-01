import axios from "axios";
import { useState } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import styles from "../css/col.module.css";
require("react-codemirror2");
require("codemirror/lib/codemirror.css");
require("codemirror/theme/cobalt.css");

if (process.browser) require("codemirror/mode/javascript/javascript.js");

const options = {
  mode: "application/ld+json",
  theme: "cobalt",
  lineNumbers: true,
};

const InsertEditor = ({ loc, updateFunc }) => {
  const { locId, colId }: { locId: string; colId: string } = loc;
  const [JSONInput, setJSONInput] = useState<string>("");

  const checkJSON = () => {
    if (typeof JSONInput !== "string") return false;

    try {
      JSON.parse(JSONInput);
      return JSON.parse(JSONInput);
    } catch (error) {
      return false;
    }
  };

  const insertDoc = () => {
    const isValidJSON = checkJSON();
    if (!isValidJSON) return alert("JSON isn't valid");
    if (isValidJSON.hasOwnProperty("_id"))
      return alert("JSON object can't contain '_id' property");

    axios({
      method: "PUT",
      url: "http://localhost:3001/insertDoc/",
      data: { JSON: isValidJSON, locId, colId },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      updateFunc(res.data.data);
    });
  };

  return (
    <div className={styles.editorWrapper}>
      <CodeMirror
        value={`{

}`}
        options={options}
        onChange={(editor, data, value) => {
          setJSONInput(value);
        }}
      />
      <div className={styles.insertEditorBottom}>
        <button onClick={insertDoc}>Insert</button>
      </div>
    </div>
  );
};

export default InsertEditor;
