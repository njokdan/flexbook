import "./App.css";
import logo from "./images/logoWhite.png";

import React, { useState } from "react";
import { Layout, Menu } from "antd";
import GreetingForm from "./components/Form";

const { Header, Content, Footer } = Layout;

function App() {
  const [selected, setSelected] = useState("login");

  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <img src={logo} className="logo" alt="blacbook" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["login"]}>
          <Menu.Item key="login" onClick={() => setSelected("login")}>
            Log in
          </Menu.Item>
          <Menu.Item key="signup" onClick={() => setSelected("signup")}>
            Sign Up
          </Menu.Item>
        </Menu>
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380 }}
        >
          <GreetingForm action={selected} />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Blackbook ©2020</Footer>
    </Layout>
  );
}

export default App;
