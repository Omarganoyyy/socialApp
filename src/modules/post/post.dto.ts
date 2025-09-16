import {z} from 'zod'
import {likePost} from './post.validation'

export type likePostQueryInputsDto = z.infer<typeof likePost.query>