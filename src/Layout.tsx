import React from "react";
import "./Layout.css";

import { Header } from "./components/Header";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Header></Header>
      <main className="container-fluid">{props.children}</main>
    </>
  );
};

export default Layout;
