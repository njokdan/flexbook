export default ({ markup }) => {
  return `<!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
    name="description"
    content="Template HTML for MERN stack apps"
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    />
    <title>Skeleton</title>
    <base href="/" />
    </head>
    <body>
    <div id="root">${markup}</div>
    <script type="text/javascript" src="/dist/bundle.js">
    </script>
    </body>
    </html>`;
};
