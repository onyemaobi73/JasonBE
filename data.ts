import http, { IncomingMessage } from "http";
import fs from "fs";
import path from "path";

const mypath = path.join(__dirname, "components", "Anthony.JSON");

interface iData {
  message: string;
  name: string;
  status: number;
  success: boolean;
  data: any;
}
let data: iData = {
  message: "",
  name: "",
  status: 0,
  success: false,
  data: null,
};

interface iDataEntry {
  index: number;
  name: string;
}

let dataEntry: iDataEntry[] = [
  { index: 1, name: "Anthony" },
  { index: 2, name: "john" },
];

const server = http.createServer(
  (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ) => {
    const { method, url } = req;
    let body: any = [];
    req.on("data", (chunk) => {
      body.push(chunk);
      console.log(body);
    });
    req.on("data", () => {
      // for Reading
      if (method === "GET" && url === "/") {
        data.name = "GET method";
        data.message = "GET is working";
        data.status = 200;
        data.success = true;
        data.data = dataEntry;
        // for writing
      } else if (method === "POST" && url === "/") {
        dataEntry.push(JSON.parse(body));
        fs.writeFile(mypath, JSON.stringify(dataEntry), () => {
          console.log("it is written");
        });
        data.name = "POST method";
        data.message = "POST is working";
        data.status = 201;
        data.success = true;
        data.data = dataEntry;
      }

      // for single get method
      else if (method === "GET") {
        let id = req.url?.toString().split("/")[1];
        console.log(id);

        data.name = "GET method";
        data.message = "GET is working";
        data.status = 201;
        data.success = true;
        data.data = dataEntry[parseInt(id!) - 1];
      }
      // for deleting a single
      else if (method === "DELETE") {
        let id = req.url?.toString().split("/")[1];
        console.log(id);
        dataEntry = dataEntry.filter((el) => {
          return (el.index! = parseInt(id!));
        });
        fs.writeFile(mypath, JSON.stringify(dataEntry), () => {
          console.log("it is written");
        });

        data.name = "DELETE_ONE method";
        data.message = "DELETE is working";
        data.status = 201;
        data.success = true;
        data.data = dataEntry;
      }
      // for updating
      else if (method === "PATCH") {
        let id = req.url?.toString().split("/")[1]
        let edit = dataEntry[parseInt(id!)-1]
        edit.name = JSON.parse(body).name
        console.log(edit.name);
        
        fs.writeFile(mypath, JSON.stringify(dataEntry), () => {
          console.log("it is written");
        });

        data.name = "UPDATE method";
        data.message = "UPDATE is working";
        data.status = 201;
        data.success = true;
        data.data = dataEntry;
      }
      
      else {
        data.name = "Error";
        data.message = "404 Error";
        data.status = 404;
        data.success = false;
        data.data = null;
      }
      res.writeHead(data.status, { "content-type": "application/json" });
      res.end(JSON.stringify(data));
    });
  }
);

const port: number = 2030;

server.listen(port, () => {
  console.log("listening on:", port);
});
