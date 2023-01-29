const status = require("statuses");
const {
  getAllLaunches,
  ScheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpgetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpaddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Mission required launch proprerty",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid date",
    });
  }
  await ScheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  const existLaunch = await existLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(404).json({
      erro: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpgetAllLaunches,
  httpaddNewLaunch,
  httpAbortLaunch,
};
