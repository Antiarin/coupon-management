// Vercel serverless function entry point
const { default: app } = require('../dist/server.js');

module.exports = app;