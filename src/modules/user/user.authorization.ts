import { RoleEnum } from "../../DB/model/user.model";
import { restoreAccount } from "./user.validation";

export const endpoint={
    profile:[RoleEnum.user],
    restoreAccount:[RoleEnum.admin],
    hardDelete:[RoleEnum.admin],
    dashboard:[RoleEnum.admin,RoleEnum.superAdmin]
}