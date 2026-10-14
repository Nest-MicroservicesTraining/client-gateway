import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from '../../config';
import { catchError } from 'rxjs';
import { normalizeRpcError, PaginationDto } from '@/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.send('createOrder', createOrderDto).pipe(
      catchError((error: unknown) => {
        throw new RpcException(normalizeRpcError(error));
      }),
    );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.send('findAllOrders', orderPaginationDto).pipe(
      catchError((error: unknown) => {
        throw new RpcException(normalizeRpcError(error));
      }),
    );
    // return `this.ordersService.findAll()`;
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.send('findOneOrder', { id }).pipe(
      catchError((error: unknown) => {
        throw new RpcException(normalizeRpcError(error));
      }),
    );
  }
  @Get(':status')
  findAllByStatus(
    @Param() StatusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ordersService
      .send('findAllOrders', { ...StatusDto, ...paginationDto })
      .pipe(
        catchError((error: unknown) => {
          throw new RpcException(normalizeRpcError(error));
        }),
      );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.ordersService
      .send('changeOrderStatus', { id, ...statusDto })
      .pipe(
        catchError((error: unknown) => {
          throw new RpcException(normalizeRpcError(error));
        }),
      );
  }
}
