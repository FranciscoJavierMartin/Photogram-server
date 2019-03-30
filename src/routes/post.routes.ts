import { Router, Response, Request } from "express";
import { verifyToken } from "../middlewares/authentication";
import { Post } from "../models/post.model";
import { IFileUpload } from "../interfaces/file-upload.interface";
import FileSystem from "../file-system";

const postRoutes = Router();
const fileSystem = new FileSystem();

// Get all post paginated
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

// Post a post
postRoutes.post('/', [verifyToken], (req:any, res: Response) => {

  const body = req.body;
  body.user = req.user._id;

  const images = fileSystem.moveImagesFromTempToPost(req.user._id);
  body.imgs = images;

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

postRoutes.post('/upload',[verifyToken],async (req: any, res: Response) => {

  if(!req.files){
    res.status(400).json({
      ok: false,
      message: 'File is not uploaded'
    });
  } else {
    const file: IFileUpload = req.files.image;

    if(!file || !file.mimetype.includes('image')){
      res.status(400).json({
        ok: false,
        message: 'File is not uploaded - image'
      })
    }
    
    await fileSystem.saveTempImage(file, req.user._id);

    res.json({
      ok: true,
      file: file.mimetype
    });

  }
});

postRoutes.get('/image/:userid/:img',(req:any, res: Response) => {

  const userId = req.params.userid;
  const img = req.params.img;

  const pathPhoto = fileSystem.getPhotoURL(userId, img);

  res.sendFile(pathPhoto);

});

export default postRoutes;