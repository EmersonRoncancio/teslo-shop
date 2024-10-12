import { Module } from '@nestjs/common';
import { WebSocketsService } from './web-sockets.service';
import { WebSocketsGateway } from './web-sockets.gateway';

@Module({
  providers: [WebSocketsGateway, WebSocketsService],
})
export class WebSocketsModule {}
