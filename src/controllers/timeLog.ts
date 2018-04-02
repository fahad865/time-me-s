import { default as TimeLog, TimeLogModel } from "../models/TimeLog";
import { Request, Response, NextFunction } from "express";
import { isNull, isNullOrUndefined } from "util";

export let getAllTimeLogs = (req: Request, res: Response) => {
  TimeLog.find({}, (err: any, timeLogs: TimeLogModel[]) => {
    if (err) return res.status(500).send("An error occured while trying to get the timeLogs.");
    res.status(200).send(timeLogs);
  });
};

export let getCompleteTimeLogs = (req: Request, res: Response) => {
  // tslint:disable-next-line:no-null-keyword
  TimeLog.find({ endTime: { $ne: null } }, (err: any, timeLogs: TimeLogModel[]) => {
    if (err) return res.status(500).send("An error occured while trying to get the completed timeLogs.");
    res.status(200).send(timeLogs);
  });
};

const getElapsedTime = (startTime: Date, endTime?: Date) => {
  const endTimestamp = endTime ? endTime.getTime() : Date.now();
  return Math.floor((endTimestamp - startTime.getTime()) / 1000);
};

export let getActiveTimer = (req: Request, res: Response) => {
  TimeLog.findOne({ endTime: undefined }, (err: any, timeLog: TimeLogModel) => {
    if (err) return res.status(500).send("An error occured while trying to get the active timeLog.");
    if (!timeLog) return res.status(404).send("No active timer found.");
    timeLog.timeElapsed = getElapsedTime(timeLog.startTime);
    res.status(200).send(timeLog);
  });
};

export let startTimer = (req: Request, res: Response, next: NextFunction) => {
  TimeLog.create({
    description: req.body.description,
    startTime: new Date(),
    endTime: undefined,
    projectId: req.body.projectId ? req.body.projectId : undefined
  },
    function (err: any, timeLog: TimeLogModel) {
      if (err) return res.status(500).send("An error occured while adding the timeLog.");
      timeLog.timeElapsed = getElapsedTime(timeLog.startTime);
      res.status(200).send(timeLog);
    });
};

export let stopTimer = (req: Request, res: Response) => {
  req.body.endTime = new Date();
  req.body.timeElapsed = getElapsedTime(new Date(req.body.startTime), req.body.endTime);
  TimeLog.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err: any, timeLog: TimeLogModel) => {
    if (err) return res.status(500).send("An error occured while trying to locate the timeLog.");
    if (!timeLog) return res.status(404).send("TimeLog not found.");
    res.status(200).send(timeLog);
  });
};

export let getTimeLog = (req: Request, res: Response) => {
  TimeLog.findById(req.params.id, (err: any, timeLog: TimeLogModel) => {
    if (err) return res.status(500).send("An error occured while trying to locate the timeLog.");
    if (!timeLog) return res.status(404).send("TimeLog not found.");
    res.status(200).send(timeLog);
  });
};

export let createTimeLog = (req: Request, res: Response, next: NextFunction) => {
  TimeLog.create({
    description: req.body.description,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    projectId: req.body.projectId
  },
    function (err: any, timeLog: TimeLogModel) {
      if (err) return res.status(500).send("An error occured while adding the timeLog.");
      res.status(200).send(timeLog);
    });
};

export let deleteTimeLog = (req: Request, res: Response) => {
  TimeLog.findByIdAndRemove(req.params.id, (err: any, timeLog: TimeLogModel) => {
    if (err) return res.status(500).send("An error occured while trying to locate the timeLog.");
    if (!timeLog) return res.status(404).send("TimeLog not found.");
    res.status(200).send("TimeLog: " + timeLog.description + " successfully deleted.");
  });
};

export let updateTimeLog = (req: Request, res: Response) => {
  TimeLog.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err: any, timeLog: TimeLogModel) => {
    if (err) return res.status(500).send("An error occured while trying to locate the timeLog.");
    if (!timeLog) return res.status(404).send("TimeLog not found.");
    res.status(200).send(timeLog);
  });
};