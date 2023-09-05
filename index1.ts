import http, { ServerResponse } from "http";
import database from "./backend/data.json";

import fs from "fs";
import path from "path";
import crypto from "crypto";

interface iDataEntry {
  id: number;
  course: string;
}
interface iData {
  status: number;
  message: string;
  name: string;
  success: boolean;
  data: iDataEntry | iDataEntry[] | null;
}

const ID1 = crypto.randomUUID();
const ID2 = Math.floor(Math.random() * 1000);

// let dataEntry: iDataEntry[] = [
//   { id: 1, course: "Node" },
//   { id: 2, course: "React" },
// ];
let dataEntry: iDataEntry[] = database;

let data: iData = {
  message: " Request Not found",
  name: " Request Error",
  status: 404,
  success: false,
  data: null,
};

const port: number = 2030;
const datapath = path.join(__dirname, "backend", "data.json");

const server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
> = http.createServer(
  (req: http.IncomingMessage, res: ServerResponse<http.IncomingMessage>) => {
    const { method, url } = req;

    let body: any = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("data", () => {
      // Reading from Static DB
      if (method === "GET" && url === "/") {
        data.message = "Reading from DataBase";
        data.name = "GET Request";
        data.status = 200;
        data.success = true;
        data.data = dataEntry;
      }
      // Writing to Static DB
      else if (method === "POST" && url === "/") {
        dataEntry.push(JSON.parse(body));

        fs.writeFile(datapath, JSON.stringify(dataEntry), () => {
          console.log("Done Writing...!");
        });

        data.message = "Writing to DataBase";
        data.name = "POST Request";
        data.status = 201;
        data.success = true;
        data.data = dataEntry;
      }
      //single from Static DB
      else if (method === "GET") {
        let id = req.url?.split("/")[1];

        data.message = "Reading Single Item from DataBase";
        data.name = "GET-ONE Request";
        data.status = 200;
        data.success = true;
        data.data = dataEntry[parseInt(id!) - 1];
      }
      //Delete from Static DB
      else if (method === "DELETE") {
        let id = parseInt(req.url?.split("/")[1]!) - 1;

        let value = dataEntry.filter((el: any) => {
          return el.id === id;
        });

        data.message = `Deleting "${dataEntry[id].course}" from`;
        data.name = "DELETE-ONE Request";
        data.status = 201;
        data.success = true;
        data.data = value;
      }
      // Update from Static DB
      else if (method === "PATCH") {
        const { course } = JSON.parse(body);
        let id = parseInt(req.url?.split("/")[1]!) - 1;

        dataEntry[id].course = course;

        data.message = `Updating "${dataEntry[id].course}" from`;
        data.name = "UPDATE-ONE Request";
        data.status = 201;
        data.success = true;
        data.data = dataEntry;
      }
      // Reading and show Errors
      else {
        data.message = " Request Not found";
        data.name = " Request Error";
        data.status = 404;
        data.success = false;
        data.data = null;
      }
      res.writeHead(data.status, { "content-type": "application/json" });
      res.end(JSON.stringify(data));
    });
  }
);

server.listen(port, () => {
  console.log("");
  console.log("server is up now");
});
