import { freezeAccount, hardDelete, logout, restoreAccount } from "./user.validation";
import {z} from 'zod'

export type ILogoutDto=z.infer<typeof logout.body>
export type IFreezeAccountDTO=z.infer<typeof freezeAccount.params>
export type IRestoreAccountDTO=z.infer<typeof restoreAccount.params>
export type IHardDeleteAccountDTO=z.infer<typeof hardDelete.params>