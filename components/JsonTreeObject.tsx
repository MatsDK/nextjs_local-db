import React, { useRef } from "react";
import JSONTree from "react-json-tree";
import styles from "../css/col.module.css";
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

const JsonTreeObject = ({ data }: any) => {
  const copyRef = useRef<HTMLTextAreaElement>(null);

  const copy = (data: any) => {
    if (copyRef && copyRef.current) {
      copyRef.current.value = JSON.stringify(data);
      copyRef.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <div className={styles.jsonTree} onClick={() => copy(data)}>
      <JSONTree data={data} theme={theme} invertTheme={false} hideRoot={true} />
      <textarea
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
        }}
        ref={copyRef}
        defaultValue={"fjslfjsl"}
      />
    </div>
  );
};

export default JsonTreeObject;
