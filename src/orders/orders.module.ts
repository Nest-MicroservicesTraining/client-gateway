import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { envs } from '../../config';
import { ORDERS_SERVICE } from '../../config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: ORDERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.ORDERS_MICROSERVICE_HOST,
          port: envs.ORDERS_MICROSERVICE_PORT,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
