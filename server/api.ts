import express, {Request, Response} from 'express'

const router = express.Router();

router.post('/test', function(req: Request, res: Response) {
  console.log("hello world")
  res.json({msg: 'hello world'})
});


export default router

