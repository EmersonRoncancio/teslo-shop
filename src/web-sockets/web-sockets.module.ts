import { Module } from '@nestjs/common';
import { WebSocketsService } from './web-sockets.service';
import { WebSocketsGateway } from './web-sockets.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [WebSocketsGateway, WebSocketsService],
  imports: [AuthModule],
})
export class WebSocketsModule {}
