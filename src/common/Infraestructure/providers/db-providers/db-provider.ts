import { Provider } from "@nestjs/common"
import { connect } from "mongoose"



export const odmDataBaseProviders: Provider =
{
  provide: 'MongoDataSource',
  useFactory: async () =>
  {
    try
    {
      
      // const connection = await connect( process.env.MONGO_DB )
      // console.log(mongoose.connection.readyState);

      // return connection
    } catch ( error )
    {
      // console.log( `Error al conectar a MongoDB: ${ error.message }` )
      throw error
    }
  },
}