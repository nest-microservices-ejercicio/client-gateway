import { Controller, Get, Post, Body, Param, Inject, Query, Patch, ParseUUIDPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE,  } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto/order-Pagination.dto';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  //? --- Creamos
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  //? --- Tomamos todos, podemos pasar el status como query, pero es mejor como param, en el ejemplo de abajo
  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto)
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  //? --- Tomamos todos, y incluimos el status como Param
  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto, //- tenemos un dto para el status tambien
    @Query() paginationDto: PaginationDto
  ) {
    return this.client.send('findAllOrders', {
      ...paginationDto, 
      status: statusDto.status
    })
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  //? --- Buscamos pr el id
  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    return this.client.send('findOneOrder', {id})
      .pipe(
        catchError(err =>{ throw new RpcException(err)})
      )
      // try {
      //   const order = await firstValueFrom(
      //     this.client.send('findOneOrder', {id})
      //   );

      //   return order;
      // } catch(error) {
      //   throw new RpcException(error)
      // }
  }


  //? --- Cambiamos el status de la orden
  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    return this.client.send('changeOrderStatus', {id, status:statusDto.status})
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }



}
