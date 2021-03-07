import React, { useRef, useState } from "react";
import JSONTree from "react-json-tree";
import { FileCopy, Delete, Create } from "@material-ui/icons";
import styles from "../css/col.module.css";
import axios from "axios";
import { UnControlled as CodeMirror } from "react-codemirror2";
require("react-codemirror2");
require("codemirror/lib/codemirror.css");
require("codemirror/theme/cobalt.css");
import jsbeautifier from "js-beautify";

if (process.browser) require("codemirror/mode/javascript/javascript.js");

const theme = {
  scheme: "monokai",
  base00: "#171b20",
  base01: "#fff",
  base02: "#fff",
  base03: "#fff",
  base04: "#fff",
  base05: "#fff",
  base06: "#fff",
  base07: "#fff",
  base08: "#fff",
  base09: "#ff66af",
  base0A: "#0066af",
  base0B: "#fff",
  base0C: "#0066af",
  base0D: "#0066af",
  base0E: "#fff",
  base0F: "#fff",
};

interface JSONTreeProps {
  data: any;
  update: Function;
  loc: { locId: string; colId: string };
}

const JsonTreeObject = ({ data, update, loc }: JSONTreeProps): JSX.Element => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [thisId] = useState<string>(data._id);
  let thisInput = JSON.stringify(data);
  const copyRef = useRef<HTMLTextAreaElement>(null);

  const copy = (data: object) => {
    if (copyRef && copyRef.current) {
      copyRef.current.value = JSON.stringify(data);
      copyRef.current.select();
      document.execCommand("copy");
    }
  };

  const autoFormatSelection = () => {
    let code = thisInput;
    const formatedCode = jsbeautifier.js_beautify(code);
    thisInput = formatedCode;
  };

  autoFormatSelection();

  const options = {
    mode: "application/ld+json",
    theme: "cobalt",
    lineNumbers: true,
    extraKeys: { "Shift-Tab": autoFormatSelection },
  };

  const checkJSON = () => {
    if (typeof thisInput !== "string") return false;

    try {
      JSON.parse(thisInput);
      return JSON.parse(thisInput);
    } catch (error) {
      return false;
    }
  };

  const deleteDoc = () => {
    axios({
      method: "DELETE",
      url: `http://${process.env.host}/deleteDoc/`,
      data: { docId: data._id, loc },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      update(res.data.data);
    });
  };

  const updateDoc = () => {
    const isValidJSON = checkJSON();
    if (!isValidJSON) return alert("JSON is invalid");
    axios({
      method: "POST",
      url: `http://${process.env.host}/updateDoc/`,
      data: { newDoc: thisInput, docId: thisId, loc },
    }).then((res) => {
      if (res.data.err) return alert(res.data.data);
      update(res.data.data);
      setShowEditor(false);
    });
  };

  return (
    <div className={styles.jsonTree}>
      <div>
        {!showEditor ? (
          <JSONTree
            data={data}
            theme={theme}
            invertTheme={false}
            hideRoot={true}
          />
        ) : (
          <>
            <CodeMirror
              value={thisInput}
              options={options}
              onChange={(editor, data, value) => {
                thisInput = value;
              }}
            />
            <div className={styles.updateBtnWrapper} onClick={updateDoc}>
              <p>update</p>
            </div>
          </>
        )}
        <textarea
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
          }}
          ref={copyRef}
          defaultValue={""}
        />
      </div>
      <div className={styles.JSONBottom}>
        <Create
          className={showEditor ? styles.activeJSONTreeBtn : styles.JSONTreeBtn}
          onClick={() => setShowEditor((showEditor) => !showEditor)}
        />
        <FileCopy className={styles.JSONTreeBtn} onClick={() => copy(data)} />
        <Delete className={styles.JSONTreeBtn} onClick={() => deleteDoc()} />
      </div>
    </div>
  );
};

export default JsonTreeObject;
