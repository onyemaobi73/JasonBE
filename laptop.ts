import { read, write } from "fs";

// we have four method
// write
// read
// update
// delete
import http from "http";

interface iData {
  Message: string;
  name: string;
  status: number;
  success: boolean;
  data: any;
}
let data: iData = {
  Message:"",
  name:"",
  status:0,
  success:false,
  data:null
};

interface iDataEntry {
  index:number,
  name:string
}

let dataEntry:iDataEntry|any 

const server = http.createServer((req: http.IncomingMessage,
   res: http.ServerResponse<http.IncomingMessage>) =>{
    const { method, url } = req;

    let body:any = []
    req.on("data", (chunk) =>{
      body.push(chunk)
      console.log(body);
    })
    req.on("data", ()=>{
      // for Reading
      if(method==='GET' && url==='/'){

        data.name = "GET method"
        data.Message = "GET is working"
        data.status = 200
        data.success = true
        data.data = dataEntry

      }
    })
   }) 
