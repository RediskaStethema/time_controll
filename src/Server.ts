import * as mongoose from "mongoose";
import * as fs from "node:fs";
import express from "express";
import morgan from "morgan";
import {configurations, database, socket} from "./app-config/configure.js";
import {employeeRouter} from "./routers/Emply_router.js";
import {errHandl} from "./error_handlers/Errore_handler.js";
import {firedRouter} from "./routers/FIred_router.js";
import {checkRouter} from "./routers/Check_router.js";
import {Authent, skiprouts} from "./middleware/autent/Autentithication.js";
import {authorize} from "./middleware/autoriz/Autorization.js";
import {Role} from "./utils/timeControlTypes.js";


export const launchServer = () => {
    mongoose.connect(database)
        .then(() => {
            console.log("Connected to server");
        })
        .catch(err => {
            console.log(`Error connecting to server ${err}`);
        });

    const LogStream = fs.createWriteStream("./src/server_access.log", { flags: 'a' });
    const app = express();

    app.listen(configurations.PORT, () => {
        console.log(socket);
    });

    app.use(morgan("dev"));
    app.use(morgan("combined", { stream: LogStream }));
    app.use(express.json());

    app.use(Authent(configurations.service_acc));
    app.use(skiprouts(configurations.skipRouts) as express.RequestHandler);


    app.use("/api", authorize(configurations.pathroles as Record<string, Role[]>), employeeRouter);
    app.use("/fired", authorize(configurations.pathroles as Record<string, Role[]>), firedRouter);
    app.use("/check", authorize(configurations.pathroles as Record<string, Role[]>), checkRouter);

    app.use(errHandl);
};