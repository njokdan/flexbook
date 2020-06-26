import express from "express";

// Modules for server side rendering
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import MainRouter from "../../client/MainRouter";
import HTML_template from "../../HTML_template";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/styles";
import theme from "../../client/theme";

const router = express.Router();

const serverRender = (req, res) => {
  const sheets = new ServerStyleSheets();
  const context = {};
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );

  if (context.url) {
    // console.log(context);
    return res.redirect(303, context.url);
  } else {
    const css = sheets.toString();
    return res.status(200).send(
      HTML_template({
        markup: markup,
        css: css,
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
