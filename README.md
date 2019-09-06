# next-static-export

This package creates a workflow for a more comprehensive static export from next.js apps, including dynamic routes, and avoiding unnecessary re-requests without a caching layer.

![NPM Version](https://img.shields.io/npm/v/@tone-row/next-static-export) ![Minified Size](https://img.shields.io/bundlephobia/min/@tone-row/next-static-export) ![Issues](https://img.shields.io/github/issues/tone-row/next-static-export) ![License](https://img.shields.io/github/license/tone-row/next-static-export)

TODO

1. Figure out how to route "data" folder properly, possibly a config option that's passed in. Do this so that you can actually export withAPI from this repo
2. Don't compile the withAPI HOC because it needs to receive runtime instructions about the current environment to behave correctly.
3. Add a way to work with already created data files for faster static phasing
