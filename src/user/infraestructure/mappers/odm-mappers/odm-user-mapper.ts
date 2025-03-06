/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { User } from "src/user/domain/user"
import { OdmUserEntity } from "../../entities/odm-entities/odm-user.entity"
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Model } from "mongoose"


export class OdmUserMapper implements IMapper<User, OdmUserEntity>
{
    private readonly userModel: Model<OdmUserEntity>

    constructor( userModel: Model<OdmUserEntity> )
    {
        this.userModel = userModel
    }

    fromDomainToPersistence ( domain: User ): Promise<OdmUserEntity>
    {
        return new Promise( async (resolve, reject) => {
            const user = new this.userModel({
                userId: domain.Id,
                name: domain.Name,
                email: domain.Email,
                password: domain.Password,
                image: domain.Image,
                phone: domain.Phone
            })
            resolve(user)
        })
    }
    async fromPersistenceToDomain ( user: OdmUserEntity ): Promise<User>
    {
        return User.create(
            user.userId,
            user.name,
            user.email,
            user.password,
            user.image,
            user.phone
        )
    }
    
}