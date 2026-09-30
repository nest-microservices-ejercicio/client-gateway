import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { envs, NATS_SERVICE } from 'src/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [

    //*! Ejemplo microservicio con TCP,
    //- TCP tenemos que pasarle el host y el port
    // ClientsModule.register([
    //   {
    //     name: PRODUCT_SERVICE,
    //     transport: Transport.TCP,
    //     options: {
    //       host: envs.products_ms_host,
    //       port: envs.products_ms_port
    //     }
    //   }

    //?- Nats
    NatsModule

  ],
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule {}
