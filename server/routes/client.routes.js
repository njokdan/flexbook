import express from "express";

const { setAliases } = require("require-control");
const path = require("path");

setAliases({
  "styled-components": path.resolve(
    path.join(__dirname, "../node_modules/styled-components")
  ),
});

// Modules for server side rendering
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { ServerStyleSheet } from "styled-components";
import MainRouter from "../../client/MainRouter";
import HTML_template from "../../HTML_template";

const router = express.Router();

// CSS (styled-components) SSR - needs to happen only once
const sheet = new ServerStyleSheet();

const generateCSS = () => {
  try {
    ReactDOMServer.renderToString(
      sheet.collectStyles(
        <StaticRouter>
          <MainRouter />
        </StaticRouter>
      )
    );
    return sheet.getStyleTags();
  } catch (e) {
    console.log(e);
  } finally {
    sheet.seal();
  }
};

const styleTags = generateCSS();

const serverRender = (req, res) => {
  const context = {};

  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <MainRouter />
    </StaticRouter>
  );

  if (context.url) {
    res.redirect(303, context.url);
  } else {
    res.status(200).send(
      HTML_template({
        markup: markup,
        styleTags: styleTags,
      })
    );
  }
};

router.route("^/$").get(serverRender);
router.route("/signup").get(serverRender);
router.route("/signin").get(serverRender);
router.route("/users").get(serverRender);
router.route("/user/edit/:userId").get(serverRender);
router.route("/user/:userId").get(serverRender);

export default router;
