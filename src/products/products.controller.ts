import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from '../../config';
import { PaginationDto } from '@/common';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const normalizeRpcError = (error: unknown): string | object => {
  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null) return error;

  return { message: 'Unexpected microservice error' };
};

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    // return 'Product created successfully';

    return this.productsClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError((error: unknown) => {
          throw new RpcException(normalizeRpcError(error));
        }),
      );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient
      .send({ cmd: 'find_all_products' }, paginationDto)
      .pipe(
        catchError((error: unknown) => {
          throw new RpcException(normalizeRpcError(error));
        }),
      );
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((error: unknown) => {
        throw new RpcException(normalizeRpcError(error));
      }),
    );

    // try {
    //   return await firstValueFrom(
    //     this.productsClient.send<ProductResponseDto, { id: number }>(
    //       { cmd: 'find_one_product' },
    //       { id },
    //     ),
    //   );
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'remove_product' }, { id }).pipe(
      catchError((error: unknown) => {
        throw new RpcException(normalizeRpcError(error));
      }),
    );
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateProductDto: UpdateProductDto,
  ) {
    return this.productsClient
      .send({ cmd: 'update_product' }, { id, ...UpdateProductDto })
      .pipe(
        catchError((error: unknown) => {
          throw new RpcException(normalizeRpcError(error));
        }),
      );
  }
}
