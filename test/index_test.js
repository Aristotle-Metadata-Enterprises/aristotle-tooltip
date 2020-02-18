// Require all files ending in "_test" from the current directory and all subdirectories, so they can be used as a
// webpack entrypoint

const testsContext = require.context(".", true, /_test$/);
testsContext.keys().forEach(testsContext);