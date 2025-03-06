import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OdmUserEntity extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({required: true})
  name: string;

  @Prop({required: true, unique: true })
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: false})
  image?: string;

  @Prop({ required: false, unique: true })
  phone?: string;


}

export const UserSchema = SchemaFactory.createForClass(OdmUserEntity);