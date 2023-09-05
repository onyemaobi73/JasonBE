import http from "http"


const port:number= 2030;
const  server: http.Server<typeof http.IncomingMessage, 
typeof http.ServerResponse>
= http.createServer((req: http.IncomingMessage,res:http.ServerResponse) => {

})

server.listen(port, () => {
    console.log("server is now listening");
});



