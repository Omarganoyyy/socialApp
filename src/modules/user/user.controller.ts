import {Router} from "express"
import userService from "./user.service"
import { authentication,authorization} from "../../middleware/authentication.middleware"
import { validation } from "../../middleware/validation.middleware"
import * as validators from './user.validation'
import { TokenEnum } from "../../utils/security/token.security"
import { cloudFileUpload, StorageEnum,fileValidation } from "../../utils/multer/cloud.multer"
import { endpoint } from "./user.authorization"
const router=Router()

router.get("/",authentication(),userService.profile)
router.post("/refresh-token",authentication(TokenEnum.refresh),userService.refreshToken)
router.post("/logout",authentication(),validation(validators.logout),userService.logout)
router.patch("/profile-image",authentication(),cloudFileUpload({validation:fileValidation.image,storageApproach:StorageEnum.disk}).single("image"),userService.profileImage)
router.patch("/profile-cover-image",authentication(),cloudFileUpload({validation:fileValidation.image,storageApproach:StorageEnum.disk}).array("image",2),userService.profileCoverImage)
router.delete("{/:userId}/freeze-account",authentication(),validation(validators.freezeAccount),userService.freezeAccount)
router.patch("/:userId/restore-account",authorization(endpoint.restoreAccount),validation(validators.restoreAccount),userService.restoreAccount)
router.delete("/:userId",authorization(endpoint.hardDelete),validation(validators.freezeAccount),userService.hardDeleteAccount)

export default router