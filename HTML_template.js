// require("./client/assets/images/favicon.ico");

export default ({ markup, css }) => {
  return `<!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
    name="description"
    content="Template HTML for MERN stack apps"/>
    <link rel="icon" type="image/png" href="dist/favicon.ico"/>
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style type="text/css">body {margin: 0}</style>
    <title>FlexBook</title>
    <base href="/" />
    </head>
    <body>
    <div id="root">${markup}</div>
    <style id="jss-server-side">${css}</style>
    <script type="text/javascript" src="/dist/bundle.js">
    </script>
    </body>
    </html>`;
};
