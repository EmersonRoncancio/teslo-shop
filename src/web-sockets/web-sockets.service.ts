import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConncetionClients {
  [id: string]: Socket;
}

@Injectable()
export class WebSocketsService {
  private connectionClientes: ConncetionClients = {};

  registerClient(client: Socket) {
    this.connectionClientes[client.id] = client;
  }

  removeCliente(ClientId: string) {
    delete this.connectionClientes[ClientId];
  }

  getClients() {
    return Object.keys(this.connectionClientes);
  }
}
