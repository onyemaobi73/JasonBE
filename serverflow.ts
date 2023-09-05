import http from "http";

const food = ["Rice", "Beans", "Yam", "Eba", "Fufu", "Tea", "Bread"];

const data: any = [];

Array.from({ length: 5 }, () => {
  let numb = Math.floor(Math.random() * food.length);
  let cost = Math.floor(Math.random() * 1000);
  data.push({ item: food[numb], price: cost });
});
console.log(data);

const port3: number = 5000;
const serverSide: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
> = http.createServer(
  (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ) => {
    // Reading to our server
    const { method, url } = req;
    if (method === "GET" && url === "/read") {
      res.writeHead(200, { "content-type": "aplication/json" });
      res.write("We are Good...!");
      res.write(JSON.stringify(data));
      // const urls = req.url
      //   console.log(req);

      res.end();
    } else {
      if (method === "POST" && url === "/write") {
        let container = "";
        let rawInfo: {}[] = [];
        req.on("data", (chunk: Buffer) => {
          container += chunk;
          console.log(chunk);
        });

        req.on("close", () => {
          let response: {} = JSON.parse(container);
          console.log(response);
          rawInfo.push(response);
          res.write(JSON.stringify(rawInfo))
          res.end();
        });
      }
    }
  }
);

serverSide.listen(port3, () => {
  console.log("server is now listening");
});
