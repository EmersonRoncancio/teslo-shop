import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConncetionClients {
  [id: string]: Socket;
}

@Injectable()
export class WebSocketsService {
  constructor(
    @InjectRepository(User)
    private readonly useRepository: Repository<User>,
  ) {}

  private connectionClientes: ConncetionClients = {};

  async registerClient(client: Socket, clientId: string) {
    const user = this.useRepository.findOneBy({ id: clientId });
    console.log(user);
    if (!user) throw new Error('user not found');
    this.connectionClientes[client.id] = client;
  }

  removeCliente(ClientId: string) {
    delete this.connectionClientes[ClientId];
  }

  getClients() {
    return Object.keys(this.connectionClientes);
  }
}
