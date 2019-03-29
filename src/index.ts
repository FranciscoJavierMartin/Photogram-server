import mongoose from 'mongoose';
import Server from "./server";
import userRoutes from "./routes/users.routes";

const URL_MONGODB: string = 'mongodb://localhost:27017/';
const DATABASE_NAME: string = 'photogram';
const PORT: number = 3000;


const server = new Server(PORT);

server.app.use('/user', userRoutes);

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