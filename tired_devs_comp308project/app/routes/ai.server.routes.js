const ai = require("../controllers/ai.server.controller");

module.exports = function (app) {
  app.post("/api/training", ai.train);
};
