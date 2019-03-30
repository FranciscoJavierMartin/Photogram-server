import express from 'express';

export default class Server {
  
  public app: express.Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  start(callback: Function){
    this.app.listen(this.port, callback);
  }
}