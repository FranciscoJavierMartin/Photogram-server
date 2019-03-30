import { Router, Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import Token from "../token";
import { verifyToken } from "../middlewares/authentication";

const userRoutes = Router();

userRoutes.post('/login', (req: Request, res: Response) => {

  const body = req.body;

  User.findOne({
    email: body.email
  }, (err, userDB) => {
    if(err){
      // Error handler
    }

    if(!userDB){
      res.json({
        ok: false,
        message: 'User or password are not correct'
      });
    }else{
      if(userDB.comparePassword(body.password)){

        const tokenUser = Token.getJwtToken({
          _id: userDB._id,
          name: userDB.eventNames,
          email: userDB.email,
          avatar: userDB.avatar
        });

        res.json({
          ok:true,
          token: tokenUser
        });

      }else{
        res.json({
          ok: false,
          message: 'User or password are not correct'
        })
      }
    }

    


  });

});

userRoutes.post('/create', (req:Request, res: Response) => {

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar
  };

  User.create(user).then(userDB =>{

    const tokenUser = Token.getJwtToken({
      _id: userDB._id,
      name: userDB.eventNames,
      email: userDB.email,
      avatar: userDB.avatar
    })

    res.json({
      ok:true,
      token: tokenUser
    });

    res.json({
      ok: true,
      user: userDB
    });

  }).catch(err => {
    res.json({
      ok: false,
      err
    });
  });

});

userRoutes.post('/update', verifyToken, (req:any, res: Response) => {

  const user = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    avatar: req.body.avatar || req.user.avatar,
  }

  User.findByIdAndUpdate(req.user._id, user, {new: true}, (err, userDB) => {
    
    if(err){
      //TODO: Handle error
    } else  if(!userDB){
      res.json({
        ok: false,
        message: 'User does not exists on database'
      });
    } else {

    }

  });

  res.json({
    ok:true,
    user: req.user
  });
});

userRoutes.get('/', [verifyToken], (req:any, res: Response) => {
  const user = req.user;

  res.json({
    ok:true,
    user
  });

});

export default userRoutes;