import express from "express";

// Modules for server side rendering
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import MainRouter from "../../client/MainRouter";
import HTML_template from "../../HTML_template";

const router = express.Router();

const serverRender = (req, res) => {
  const context = {};
  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <MainRouter />
    </StaticRouter>
  );

  if (context.url) {
    return res.redirect(303, context.url);
  } else {
    res.status(200).send(
      HTML_template({
        markup: markup,
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
