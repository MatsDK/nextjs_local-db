import React, { useEffect } from "react";
import Router from "next/router";

const Index = (): JSX.Element => {
  useEffect(() => {
    const { pathname } = Router;
    if (pathname == "/") Router.push("/status");
  });
  return <div></div>;
};

export default Index;
