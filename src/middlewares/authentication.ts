import { NextFunction, Request, Response } from "express";
import Token from "../token";

// TODO: Extends Request interface to include user property
export const verifyToken = (req: any, res: Response, next: NextFunction) => {

  const userToken = req.get('x-token') || '';

  Token.checkToken(userToken)
    .then((decoded: any) => {
      req.user = decoded.user;
      next();
    }).catch( err => {
      res.json({
        ok: false,
        message: 'Invalid token'
      });
    });

}