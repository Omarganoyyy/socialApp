import {Router} from "express"
import { cloudFileUpload, fileValidation } from "../../utils/multer/cloud.multer"
import { authentication } from "../../middleware/authentication.middleware"
import commentService from "./comment.service"
import * as validators from './comments.validation'
import { validation } from "../../middleware/validation.middleware"

const router=Router({mergeParams:true})

router.post("/",authentication(),
cloudFileUpload({validation:fileValidation.image}).array("attachments",2),
validation(validators.createComment),
commentService.createComment)

router.post("/:commentId/reply",authentication(),
cloudFileUpload({validation:fileValidation.image}).array("attachments",2),
validation(validators.replyOnComment),
commentService.replyOnComment)

export default router