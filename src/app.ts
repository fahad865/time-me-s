import express from "express";
import bodyParser from "body-parser";
// import logger from "morgan";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import socketio from "socket.io";
import http from "http";

const env = process.env.NODE_ENV;
// Load environment variables from .env file
dotenv.config({ path: `.env.${env == "production" ? "prod" : "default"}` });

// Controllers (route handlers)
import * as timeLogController from "./controllers/timeLog";
import * as projectController from "./controllers/project";

// Create Express server
const app = express();
const server = http.createServer(app);
const io = socketio(server);
server.listen(process.env.SOCKET_PORT);

// Socket event handling
io.on("connection", function (socket) {
  console.log("New connection: " + socket.id);
  socket.on("action", (action) => {
    switch (action.type) {
      case "event/projectUpdated":
        console.log("Project updated!", action.data);
        socket.broadcast.emit("refreshProjects");
        break;
      case "event/timeLogUpdated":
        console.log("Timelogs updated!", action.data);
        socket.broadcast.emit("refreshTimeLogs");
        break;
      case "event/timerUpdated":
        console.log("Timer updated!", action.data);
        socket.broadcast.emit("refreshTimer");
        break;
    }
  });
});

// Connect to MongoDB
const mongoUrl = process.env.MONGOLAB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
// app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

// Primary app routes

app.get("/project", projectController.getAllProjects);
app.get("/project/:id", projectController.getProject);
app.post("/project", projectController.createProject);
app.put("/project/:id", projectController.updateProject);
app.delete("/project/:id", projectController.deleteProject);

app.get("/timer", timeLogController.getActiveTimer);
app.post("/timer", timeLogController.startTimer);
app.put("/timer/:id", timeLogController.stopTimer);

app.get("/timelog", timeLogController.getCompleteTimeLogs);
app.get("/timelog/:id", timeLogController.getTimeLog);
app.put("/timelog/:id", timeLogController.updateTimeLog);
app.delete("/timelog/:id", timeLogController.deleteTimeLog);
app.post("/timelog", timeLogController.createTimeLog);

export default app;