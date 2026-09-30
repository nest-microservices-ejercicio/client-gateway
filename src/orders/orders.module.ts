import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [

    //!- Registramos un microservicio con TCP
    // ClientsModule.register([
    //   {
    //     name: ORDER_SERVICE,
    //     transport: Transport.TCP,
    //     options: {
    //       host: envs.orders_ms_host,
    //       port: envs.orders_ms_port
    //     }
    //   }
    // ])
    
    //*- Registramos un microservicio con NATS
   NatsModule

  ],

  controllers: [OrdersController],
  providers: [],
})
export class OrdersModule {}
