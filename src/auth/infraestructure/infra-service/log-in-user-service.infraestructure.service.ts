import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IJwtGenerator } from "../../../common/Application/jwt-generator/jwt-generator.interface";
import { IEncryptor } from "../../../common/Application/encryptor/encryptor.interface";
import { LogInEntryDto } from "./dto/entry/log-in-entry.infraestructure.dto";
import { LogInResponseDto } from "./dto/response/log-in-response.dto";
import { IncorrectPasswordException } from "../exceptions/incorrect-password-exception copy";
import { IUserRepository } from "src/user/domain/repository/user-repository.interface"

export class LogInUserInfraService implements IApplicationService<LogInEntryDto, LogInResponseDto> { 
    
    private readonly userRepository: IUserRepository
    private readonly tokenGenerator: IJwtGenerator<string>;
    private readonly encryptor: IEncryptor; 

    constructor(
        userRepository: IUserRepository,
        tokenGenerator: IJwtGenerator<string>,
        encryptor: IEncryptor,
    ){
        this.userRepository = userRepository
        this.tokenGenerator = tokenGenerator,
        this.encryptor = encryptor 
    }
    
    async execute(logInDto: LogInEntryDto): Promise<Result<LogInResponseDto> | Result<undefined>> {
        const findResult = await this.userRepository.findUserByEmail( logInDto.email )
        if ( !findResult.isSuccess() ) return Result.fail( findResult.Error, findResult.StatusCode, findResult.Message )
        const userResult = await findResult.Value
        const checkPassword = await this.encryptor.comparePlaneAndHash(logInDto.password, userResult!!.password)
        if (!checkPassword) return Result.fail( new IncorrectPasswordException(), 403, 'Incorrect password' )
        const token = this.tokenGenerator.generateJwt( userResult!!.userId )
        const answer = {
            token: token,
            user: {
                id: userResult!!.userId,
                email: userResult!!.email,
                name: userResult!!.name,
                phone: userResult!!.phone,
            }               
        }
        return Result.success( answer, 200)
    }
    
    get name(): string { return this.constructor.name }
}