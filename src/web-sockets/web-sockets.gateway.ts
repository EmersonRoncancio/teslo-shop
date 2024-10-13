import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocketsService } from './web-sockets.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Socket;

  constructor(private readonly webSocketsService: WebSocketsService) {}

  handleConnection(client: Socket) {
    this.webSocketsService.registerClient(client);
    console.log(this.webSocketsService.getClients());
    this.wss.emit('clients-updated', this.webSocketsService.getClients());
  }

  handleDisconnect(client: Socket) {
    this.webSocketsService.removeCliente(client.id);
    console.log(this.webSocketsService.getClients());
    this.wss.emit('clients-updated', this.webSocketsService.getClients());
  }
}
