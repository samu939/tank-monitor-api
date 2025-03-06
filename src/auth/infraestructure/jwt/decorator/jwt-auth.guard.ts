import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Result } from "src/common/Domain/result-handler/Result";
import { JwtPayload } from "./dto/jwt-payload.interface";
import { OdmUserRepository } from "src/user/infraestructure/repositories/odm-repository/odm-user-repository"
import { OdmUserMapper } from "src/user/infraestructure/mappers/odm-mappers/odm-user-mapper"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"

@Injectable()
export class JwtAuthGuard implements CanActivate {

    private userRepository: OdmUserRepository


    constructor(
        private jwtService: JwtService,
        @InjectModel('User') private userModel: Model<OdmUserEntity>,
    ) {
        this.userRepository = new OdmUserRepository( userModel, new OdmUserMapper(this.userModel) )
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()       
        if ( !request.headers['authorization'] ) throw new UnauthorizedException() 
        const [type, token] = request.headers['authorization'].split(' ') ?? []
        if ( type != 'Bearer' || !token ) throw new UnauthorizedException()                       
        try {
            
            const payload = await this.jwtService.verifyAsync( token, { secret: process.env.JWT_SECRET_KEY } )
            const userData = await this.validate( payload )
            // Payload incluye iat y exp, fecha de firma y de vencimiento
            request['user'] = userData
        } catch { throw new UnauthorizedException() }
        return true
    }
    
    private async validate(payload: JwtPayload) {
        const user: Result<OdmUserEntity> | Result<undefined> = await this.userRepository.findUserById( payload.id ); 
        if ( !user.isSuccess() ) throw new Error('Error buscando al usuario a traves del token')
        return user.Value;
    }

}