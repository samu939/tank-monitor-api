import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SignUpUserEntryInfraDto {
    
    @ApiProperty({ example: 'carlonsozoa@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'arrozconcanela22' })
    @IsString()
    password: string
  
    @ApiProperty({ example: 'Carlos' })
    @IsString()
    name: string
  
    @ApiProperty({ example: '04131234123' })
    @IsString()
    phone: string

    @ApiProperty({ example: 'base64Image' })
    @IsString()
    image: string

}