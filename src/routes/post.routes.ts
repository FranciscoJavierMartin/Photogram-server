import { Router, Response } from "express";
import { verifyToken } from "../middlewares/authentication";
import { Post } from "../models/post.model";

const postRoutes = Router();

postRoutes.get('/',async(req:any, res: Response) => {

  const itemsPerPage = 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1)*itemsPerPage;

  const posts = await Post.find()
    .sort({created: -1})
    .skip(skip)
    .limit(itemsPerPage)
    .populate('user', '-password')
    .exec();

  res.json({
    ok: true,
    page,
    posts
  });

});

postRoutes.post('/', [verifyToken], (req:any, res: Response) => {

  const body = req.body;
  body.user = req.user._id;

  Post.create(body)
    .then(async postDB => {

      await postDB.populate('user', '-password').execPopulate()

      res.json({
        ok: true,
        post: postDB,
      });
    }).catch( err => {
      res.json(err);
    });

  

});

export default postRoutes;