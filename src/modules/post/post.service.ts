import type { Request,Response } from "express";
import { successResponse } from "../../utils/response/success.response";
import { UserRepository } from "../../DB/repository/user.repository";
import { UserModel } from "../../DB/model/user.model";
import { PostRepository } from "../../DB/repository/post.repository";
import { HPostDocument, LikeActionEnum, PostModel } from "../../DB/model/post.model";
import { NotFoundException } from "../../utils/response/error.response";
import {v4 as uuid} from 'uuid'
import { deleteFiles, uploadFiles } from "../../utils/multer/s3.config";
import { likePostQueryInputsDto } from "./post.dto";
import { UpdateQuery } from "mongoose";

class PostService {
    constructor(){}
    private userModel=new UserRepository(UserModel)
    private postModel=new PostRepository(PostModel)
    
    
    createPost=async (req:Request,res:Response):Promise<Response> => {
        
       if (
      req.body.tags?.length &&
      (
        await this.userModel.find({
          filter: { _id: { $in: req.body.tags }, freezeAt: { $exists: false } },
        })
      )?.length !== req.body.tags.length
    ) {
      throw new NotFoundException(
        "Some Of The Mentioned Users Are Not Exist"
      );
    }

       let attachments: string[] = [];
    let assetsFolderId: string = uuid();
    if (req.files?.length) {
      attachments = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `users/${req.user?._id}/post/${assetsFolderId}`,
      });
    }
        const [post]=(await this.postModel.create({
            data:[
                {
                    ...req.body,
                    attachments,
                    assetsFolderId,
                    createdBy:req.user?._id,
                }
            ]
        }))||[]
        if(attachments.length)
        {
            await deleteFiles({urls:attachments})
        }
        return successResponse({res,statusCode:201})
    }
    
    
    likePost = async (req: Request, res: Response): Promise<Response> => {
  const { postId } = req.params as { postId: string };
  const { action } = req.query as likePostQueryInputsDto;
  let update: UpdateQuery<HPostDocument> = {
    $addToSet: { likes: req.user?._id },
  };

  if (action === LikeActionEnum.unlike) {
    update = { $pull: { likes: req.user?._id } };
  }

  const post = await this.postModel.findOneAndUpdate(
    {
      filter: { _id: postId },
      update,
    }
  );

  if (!post) {
    throw new NotFoundException("invalid postId or post not exist");
  }

  return successResponse({ res });
};

}
export default new PostService