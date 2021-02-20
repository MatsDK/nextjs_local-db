import * as React from "react";
import { AppProps } from "next/app";
import styles from "../css/index.module.css";
import "../css/global.css";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div className={styles.app}>
      <Component {...pageProps} />
    </div>
  );
}
