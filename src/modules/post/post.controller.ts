import postService from './post.service'
import * as validators from './post.validation'
import {authentication} from '../../middleware/authentication.middleware'
import {Router} from 'express'
import { cloudFileUpload ,fileValidation} from '../../utils/multer/cloud.multer'
import { validation } from '../../middleware/validation.middleware'
const router=Router()

router.post('/',authentication(),cloudFileUpload({validation:fileValidation.image}).array("attachmnets",2),validation(validators.createPost),postService.createPost)

router.patch("/:postId/like",authentication(),validation(validators.likePost),postService.likePost)

export default router