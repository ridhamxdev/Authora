import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    addOrderItems(@Body() createOrderDto: any, @Request() req: any) {
        return this.ordersService.create({ ...createOrderDto, user: req.user._id });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('myorders')
    getMyOrders(@Request() req: any) {
        return this.ordersService.findMyOrders(req.user._id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getOrderById(@Param('id') id: string) {
        return this.ordersService.findById(id);
    }
}
