import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocketsService } from './web-sockets.service';
import { Socket } from 'socket.io';
import { MessageClientDTO } from './dto/message-client.dto';

@WebSocketGateway({ cors: true })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Socket;

  constructor(private readonly webSocketsService: WebSocketsService) {}

  handleConnection(client: Socket) {
    this.webSocketsService.registerClient(client);
    this.wss.emit('clients-updated', this.webSocketsService.getClients());
  }

  handleDisconnect(client: Socket) {
    this.webSocketsService.removeCliente(client.id);
    this.wss.emit('clients-updated', this.webSocketsService.getClients());
  }

  @SubscribeMessage('pruebaCliente')
  onMessageClient(client: Socket, message: MessageClientDTO) {
    client.broadcast.emit('serverMessage', {
      message: message.message,
    });

    this.wss.emit('serverMessage', {
      message: message.message,
    });
  }
}
