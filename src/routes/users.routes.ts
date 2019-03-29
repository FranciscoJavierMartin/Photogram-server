import { Router, Request, Response } from "express";

const userRoutes = Router();

userRoutes.get('/', (req:Request, res: Response) => {
  res.json({
    ok: true,
    message: 'All works fine'
  })
});

export default userRoutes;