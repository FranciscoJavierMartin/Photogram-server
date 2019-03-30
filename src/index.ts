import mongoose from 'mongoose';
import Server from "./server";
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import userRoutes from "./routes/users.routes";
import postRoutes from './routes/post.routes';

const URL_MONGODB: string = 'mongodb://localhost:27017/';
const DATABASE_NAME: string = 'photogram';
const PORT: number = 3000;


const server = new Server(PORT);


server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

server.app.use(fileUpload({useTempFiles: true}));

server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);


mongoose.connect(URL_MONGODB + DATABASE_NAME,
  { useNewUrlParser: true, useCreateIndex: true}, (err) => {
    
    if(err){
      throw err;
    } else {
      console.log(`Database ${DATABASE_NAME} is online`)
    }

  });

server.start(() => {
  console.log(`Server running on port ${server.port}`);
});