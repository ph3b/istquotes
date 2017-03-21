/* @flow */
import React from "react";
import { Col, Preloader } from "react-materialize";

const Loader = () => (
  <Col s={12} style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}>
    <Preloader flashing size="big" />
  </Col>
);

export default Loader;
