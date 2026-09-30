import { ClientProxy, RpcException } from '@nestjs/microservices';
import {  Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {

  constructor(
    //- Insertamos el Microservicio que vamos a usar, lo tenemos creado el products.module
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}
  

  //? -----------------
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({cmd: 'create_product'}, createProductDto)
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }


  //? -----------------
  @Get()
  findAllProduct(@Query() paginationDto: PaginationDto){
    return this.client.send({cmd: 'find_all_products'}, paginationDto)
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }
  

  //? -----------------
  @Get(':id')
  async findOneProduct(@Param('id') id: string){

    return this.client.send({cmd: 'find_one_product'}, {id})
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )

    // try {
    //   //- firstValueFrom - espera el primer valor que este observable va a emitir, asi nos permite capturar el error desde el microservicio
    //   const product = await firstValueFrom(
    //     this.client.send({cmd: 'find_one_product'}, {id})
    //   )

    //   return product

    // } catch(error) {
    //   //- cuando captura un error va a pasar por el error en main -> app.useGlobalFilters(new RpcCustomExceptionFilter())
    //   throw new RpcException(error)
    // }
  }
  

  //? -----------------
  @Delete(':id')
  deleteOneProduct(@Param('id') id:string){
    return this.client.send({cmd: 'delete_product'}, {id})
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }
  

  //? -----------------
  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id:string,
    @Body() body:CreateProductDto
  ){
    return this.client.send({cmd: 'update_product'}, {id, ...body})
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }



}
