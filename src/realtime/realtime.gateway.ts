import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as ws from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { RealtimeService } from './realtime.service';

// type Rooms = Record<string, Record<string, ws>>;
type Rooms = Record<string, string[]>;

@WebSocketGateway(8080)
export class RealtimeGateway implements OnGatewayConnection {
  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly client: PrismaService,
  ) {}
  handleConnection(client: any, ...args: any[]) {
    console.log('some client connected');
  }
  @WebSocketServer()
  server: ws.Server;
  private rooms: Rooms = {};
  private clients: Record<string, ws> = {};

  @SubscribeMessage('joinAndLeave')
  join(client: ws, data: any): any {
    const uuid = uuidv4();
    const { message, room, meta, userId } = data;

    this.clients[userId] = client;

    if (meta === 'join') {
      // data.rooms.forEach((roomId) => {
      //   if (!this.rooms[roomId]) {
      //     this.rooms[roomId] = {};
      //     this.rooms[roomId][uuid] = client;
      //   } else {
      //     this.rooms[roomId][uuid] = client;
      //   }
      // });
      data.rooms.forEach((roomId: string) => {
        if (!this.rooms[roomId]) {
          this.rooms[roomId] = [];
          this.rooms[roomId].push(userId);
        } else {
          if (this.rooms[roomId].some((id) => id === userId)) return;
          this.rooms[roomId].push(userId);
        }
      });
    } else if (meta === 'leave') {
      // leave room
    }

    console.log(this.rooms);
    // console.log(this.clients);
  }

  //   @SubscribeMessage('events')
  //   onEvent(client: any, data: any): Observable<WsResponse<number>> {
  //     return from([1, 2, 3]).pipe(
  //       map((item) => ({ event: 'events', data: item })),
  //     );
  //   }

  // when i follow a person check if converstaion is created or not => done
  // if it is not crated create the conversation  => done
  // when i go to the messaging page fetch all the conversation and their messages and put to state
  // create a websocket instance and send join with all the converation hashes so that it will join and
  // also send the user id in join to save the messages
  // assign the socket using user id
  // when send message send along the room id ie the conversation hash and it will we saved on the backend
  // and  yeah phew!

  @SubscribeMessage('chatMessage')
  async chatMessage(client: ws, data: any): Promise<any> {
    const { message, room, meta } = data;
    let userId: string | null = null;

    Object.entries(this.clients).forEach(([currId, clientSocket]) => {
      if (clientSocket === client) {
        userId = currId;
      }
    });
    console.log('user who created this message = ', userId);
    // Object.entries(this.rooms[room]).forEach(([_, socket]) => {
    //   socket.send('message from other users' + message);
    // });

    const createdMessage = await this.realtimeService.createMessageWithUserId(
      message,
      room,
      Number(userId),
    );
    console.log(createdMessage);

    const socketMessage = {
      type: 'chatMessage',
      data: createdMessage,
    };

    this.rooms[room].forEach((userId) => {
      this.clients[userId].send(JSON.stringify(socketMessage));
    });
  }

  @SubscribeMessage('connectVideoCall')
  async connectVideoCall(client: ws, data: any) {
    const { message, room, meta, peerId, callingUsername } = data;
    let userId: string | null = null;
    console.log(data);

    Object.entries(this.clients).forEach(([currId, clientSocket]) => {
      if (clientSocket === client) {
        userId = currId;
      }
    });
    console.log('user who created this message = ', userId);
    // Object.entries(this.rooms[room]).forEach(([_, socket]) => {
    //   socket.send('message from other users' + message);
    // });

    const createdMessage = {
      data: {
        room,
        peerId,
        message: 'No message',
        userId,
        username: callingUsername,
      },
      type: 'connectCall',
    };

    console.log(createdMessage);

    this.rooms[room].forEach((id) => {
      this.clients[id].send(JSON.stringify(createdMessage));
    });
  }
}
