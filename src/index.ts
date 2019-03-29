import Server from "./server";

const PORT: number = 3000;


const server = new Server(PORT);

server.start(() => {
  console.log(`Server running on port ${server.port}`);
});