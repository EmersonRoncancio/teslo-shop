import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocketsService } from './web-sockets.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly webSocketsService: WebSocketsService) {}

  handleConnection(client: Socket) {
    console.log('El cliente se conecto', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('El cliente se desconecto', client.id);
  }
}
