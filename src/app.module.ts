import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './user/infraestructure/entities/odm-entities/odm-user.entity'
import { odmDataBaseProviders } from './common/Infraestructure/providers/db-providers/db-provider'
import { AuthController } from './auth/infraestructure/controller/auth.controller'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '48h' }
    }),
    MongooseModule.forRoot( process.env.MONGO_DB!!, { dbName: 'tank-monitor-db', } ),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, },
      
    ])
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, odmDataBaseProviders],
})
export class AppModule {}
