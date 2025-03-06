import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { SignUpEntryDto } from "../dto/entry/sign-up-entry.application.dto";
import { SignUpResponseDto } from "../dto/response/sign-up-response.application.dto";
import { User } from "src/user/domain/user";
import { IUserRepository } from "src/user/domain/repository/user-repository.interface"
import { EncryptorBcrypt } from "src/common/Infraestructure/encryptor/encryptor-bcrypt"
export class SignUpUserApplicationService implements IApplicationService<SignUpEntryDto, SignUpResponseDto> {
    
    private readonly userRepository: IUserRepository
    private readonly uuidGenerator: IdGenerator<string>
        
    constructor(
        userRepository: IUserRepository,
        uuidGenerator: IdGenerator<string>,
    ){
        this.userRepository = userRepository
        this.uuidGenerator = uuidGenerator
    }
    
    async execute(signUpDto: SignUpEntryDto): Promise<Result<SignUpResponseDto> | Result<undefined>> {
        
        const findResult = await this.userRepository.findUserByEmail( signUpDto.email )

        if ( findResult.isSuccess() ) return Result.fail( findResult.Error, 400, "Usuario existente" )
        const idUser = await this.uuidGenerator.generateId()

        const encryptor = new EncryptorBcrypt()
        const password = await encryptor.hashPassword( signUpDto.password )

        const create = User.create(
            idUser, 
            signUpDto.name,
            signUpDto.email,
            password,
            signUpDto.image,
            signUpDto.phone,
        )
        const userResult = await this.userRepository.saveUser( create )
        if ( !userResult.isSuccess() ) return Result.fail( userResult.Error, userResult.StatusCode, userResult.Message )        
        
        const answer = { 
            id: idUser,
            email: signUpDto.email,
            name: signUpDto.name 
        }
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }
}