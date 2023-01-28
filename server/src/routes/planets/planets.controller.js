const { getAllPlanets } = require("../../models/planets.model");

async function httpgetAllPlanets(req, res) {
  // console.log(await getAllPlanets());
  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpgetAllPlanets,
};
