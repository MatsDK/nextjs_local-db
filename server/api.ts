import * as express from 'express'

const router = express.Router();

router.post('/test', function(req:express.Request, res:express.Response) {
  console.log("fdasas")
  res.json({msg: 'hello'})
});


export default router

