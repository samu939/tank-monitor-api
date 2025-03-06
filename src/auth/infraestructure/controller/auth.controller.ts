import { Body, Controller, Get, Post, Put } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";
import { Logger } from "@nestjs/common";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { JwtGenerator } from "../jwt/jwt-generator";
import { EncryptorBcrypt } from "../../../common/Infraestructure/encryptor/encryptor-bcrypt";
import { SignUpUserApplicationService } from "src/auth/application/services/sign-up-user-service.application.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../jwt/decorator/jwt-auth.guard";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { GetUser } from "../jwt/decorator/get-user.param.decorator";
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { LogInUserEntryInfraDto } from "./dto/entry/log-in-user-entry.dto";
import { SignUpUserEntryInfraDto } from "./dto/entry/sign-up-user-entry.dto";
import { CurrentUserSwaggerResponseDto } from "./dto/response/current-user-swagger-response.dto";
import { LogInUserSwaggerResponseDto } from "./dto/response/log-in-user-swagger-response.dto";
import { SignUpUserSwaggerResponseDto } from "./dto/response/sign-up-user-swagger-response.dto";
import { LogInUserInfraService } from "../infra-service/log-in-user-service.infraestructure.service";
import { IJwtGenerator } from "src/common/Application/jwt-generator/jwt-generator.interface";
import { IEncryptor } from "src/common/Application/encryptor/encryptor.interface";
import { OdmUserRepository } from "src/user/infraestructure/repositories/odm-repository/odm-user-repository";
import { InjectModel } from "@nestjs/mongoose";
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";
import { PerformanceDecorator } from "src/common/Application/application-services/decorators/decorators/performance-decorator/performance.decorator"
import { IUserRepository } from "src/user/domain/repository/user-repository.interface"
import { OdmUserMapper } from "src/user/infraestructure/mappers/odm-mappers/odm-user-mapper"

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger: Logger
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>
    private readonly encryptor: IEncryptor

    private readonly userRepository: IUserRepository

    private secretCodes = []
    
    constructor(
        @InjectModel('User') private userModel: Model<OdmUserEntity>,
        private jwtAuthService: JwtService
    ) {
        this.logger = new Logger('AuthController')
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator(jwtAuthService)
        this.encryptor = new EncryptorBcrypt()

        this.userRepository = new OdmUserRepository( userModel, new OdmUserMapper(this.userModel) )
    }
    
    @Get('current')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Obtener usuario actual', type: CurrentUserSwaggerResponseDto })
    @ApiBearerAuth()
    async currentUser( @GetUser() user ) {  

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            image: user.image
        } 
    }

    @Post('login')
    @ApiOkResponse({ description: 'Iniciar sesion de usuario', type: LogInUserSwaggerResponseDto })
    async logInUser(@Body() logInDto: LogInUserEntryInfraDto) {
        const data = { userId: 'none', ...logInDto } 
        const logInUserService = new ExceptionDecorator( 
            new LoggingDecorator(
                new PerformanceDecorator(
                    new LogInUserInfraService(
                        this.userRepository,
                        this.tokenGenerator,
                        this.encryptor
                    ),
                    new NativeLogger(this.logger) 
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        return (await logInUserService.execute(data)).Value
    }
    
    @Post('register')
    @ApiOkResponse({ description: 'Registrar un nuevo usuario en el sistema', type: SignUpUserSwaggerResponseDto })
    async signUpUser(@Body() signUpDto: SignUpUserEntryInfraDto) {
        var data = { userId: 'none', ...signUpDto }


        
        const signUpApplicationService = new ExceptionDecorator( 
            new LoggingDecorator(
                new PerformanceDecorator(    
                    new SignUpUserApplicationService(
                        this.userRepository,
                        this.uuidGenerator
                    ), 
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        const resultService = (await signUpApplicationService.execute({
            userId: 'none',
            email: data.email,
            name: data.name,
            phone: data.phone,
            password: data.password,
            image: data.image
        }));

        return { id: resultService.Value!!.id }
    }

}

