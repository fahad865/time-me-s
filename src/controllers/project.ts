import { default as Project, ProjectModel } from "../models/Project";
import { Request, Response, NextFunction } from "express";

export let getAllProjects = (req: Request, res: Response) => {
  Project.find({}, (err: any, projects: ProjectModel[]) => {
    if (err) return res.status(500).send("An error occured while trying to get the projects.");
    res.status(200).send(projects);
  });
};

export let getProject = (req: Request, res: Response) => {
  Project.findById(req.params.id, (err: any, project: ProjectModel) => {
    if (err) return res.status(500).send("An error occured while trying to locate the project.");
    if (!project) return res.status(404).send("Project not found.");
    res.status(200).send(project);
  });
};

export let createProject = (req: Request, res: Response, next: NextFunction) => {
  Project.create({
    name: req.body.name,
    hourlyRate: req.body.hourlyRate,
    currency: req.body.currency
  },
    function (err: any, project: ProjectModel) {
      if (err) return res.status(500).send("An error occured while adding the project.");
      res.status(200).send(project);
    });
};

export let deleteProject = (req: Request, res: Response) => {
  Project.findByIdAndRemove(req.params.id, (err: any, project: ProjectModel) => {
    if (err) return res.status(500).send("An error occured while trying to locate the project.");
    if (!project) return res.status(404).send("Project not found.");
    res.status(200).send("Project: " + project.name + " successfully deleted.");
  });
};

export let updateProject = (req: Request, res: Response) => {
  Project.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err: any, project: ProjectModel) => {
    if (err) return res.status(500).send("An error occured while trying to locate the project.");
    if (!project) return res.status(404).send("Project not found.");
    res.status(200).send(project);
  });
};