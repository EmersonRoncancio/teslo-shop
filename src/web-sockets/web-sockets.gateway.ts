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
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from 'src/auth/interfaces/jwt.interface';

@WebSocketGateway({ cors: true })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Socket;

  constructor(
    private readonly webSocketsService: WebSocketsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(client.handshake.headers.token);
    const token = client.handshake.headers.token as string;
    let payload: jwtPayload;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      payload = this.jwtService.verify(token);
      console.log({ payload });

      await this.webSocketsService.registerClient(client, payload.id);
      this.wss.emit('clients-updated', this.webSocketsService.getClients());
    } catch (error) {
      client.disconnect();
      console.log('Error al conectar');
      return;
    }
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
