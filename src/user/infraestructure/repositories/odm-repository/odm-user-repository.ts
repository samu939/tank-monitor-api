/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { OdmUserEntity } from "../../entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";
import { UserNotFoundException } from "../../exceptions/user-not-found-exception";
import { IUserRepository } from "src/user/domain/repository/user-repository.interface"
import { User } from "src/user/domain/user"
import { OdmUserMapper } from "../../mappers/odm-mappers/odm-user-mapper"

export class OdmUserRepository implements IUserRepository{

    private readonly userModel: Model<OdmUserEntity>
    private readonly odmMapper: OdmUserMapper

    constructor(userModel: Model<OdmUserEntity>, odmMapper: OdmUserMapper){
        this.userModel = userModel
        this.odmMapper = odmMapper
    }

    async saveUser(user: User): Promise<Result<string> | Result<undefined>> {
        try {
            const userOdm = await this.odmMapper.fromDomainToPersistence(user)
            const newUserOdm = new this.userModel(userOdm)
            await newUserOdm.save()
            return Result.success<string>(user.Id, 200)
        } catch (error) {
            return Result.fail<string>(new Error(error.message), 500, "Error al guardar usuario")
        }
    }

    async findUserById(userId: string): Promise<Result<OdmUserEntity> | Result<undefined>> {
        try{
            const user = await this.userModel.findOne( { userId: userId } )
            if(user){
                return Result.success<OdmUserEntity>(user,200)
            }
            return Result.fail<OdmUserEntity>(new UserNotFoundException(), 403, "User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity>( new Error(error.message), 500, "Error al buscar usuario" )
        }
    }

    async findUserByEmail(email: string): Promise<Result<OdmUserEntity> | Result<undefined>> {
        try{
            const user = await this.userModel.findOne( { email: email } )
            if(user){
                return Result.success<OdmUserEntity>(user,200)
            }
            console.log("User not founded")
            return Result.fail<OdmUserEntity>(new UserNotFoundException(), 403, "User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity>( new Error(error.message), 500, "Error al buscar usuario" )
        }
    }

    async findAllUser(): Promise<Result<OdmUserEntity[]> | Result<undefined>> {
        try{
            const user: OdmUserEntity[] = await this.userModel.find().exec()
            if(user){
                return Result.success<OdmUserEntity[]>(user,200)
            }
            return Result.fail<OdmUserEntity[]>(new UserNotFoundException(), 403, "User not founded")
        }catch(error){
            return Result.fail<OdmUserEntity[]>( new Error(error.message), 500, "Error al buscar usuarios" )
        }
    }
    
}