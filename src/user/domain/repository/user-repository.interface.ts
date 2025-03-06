import { Result } from "src/common/Domain/result-handler/Result"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { User } from "../user"




export interface IUserRepository {

    saveUser(user: User): Promise<Result<string> | Result<undefined>>

    findUserById(userId: string): Promise<Result<OdmUserEntity> | Result<undefined>>

    findUserByEmail(email: string): Promise<Result<OdmUserEntity> | Result<undefined>>
    
    findAllUser(): Promise<Result<OdmUserEntity[]> | Result<undefined>>
    
}