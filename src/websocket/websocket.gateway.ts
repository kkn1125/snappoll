import whiteList from '@common/whiteList';
import { PrismaService } from '@database/prisma.service';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { allowOrigins } from '@utils/allowOrigins';

const { hosts, ports } = whiteList;
const allowList = allowOrigins(hosts, ports);

@WebSocketGateway({
  cors: {
    origin: allowList, // 실제 운영환경에서는 구체적인 도메인을 지정하세요
    credentials: true,
  },
})
export class WebsocketGateway {
  constructor(private readonly prisma: PrismaService) {}

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    console.log(client, payload);
    if (payload.type === 'pollResponse') {
      const sender = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });
      const poll = await this.prisma.poll.findUnique({
        where: { id: payload.pollId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
      const senderName =
        sender.id === poll.user.id ? '본인의' : `[${sender.username}]님께서`;
      await this.prisma.message.create({
        data: {
          fromId: sender.id,
          toId: poll.user.id,
          message: `${senderName} "${poll.title}" 설문지에 응답했습니다!`,
          checked: false,
        } as Message,
      });
    }
    return 'Hello world!';
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(client: any, payload: any) {
    return this.prisma.message.findMany({ where: { id: payload.userId } });
  }

  @SubscribeMessage('readMessage')
  async handleReadMessage(client: any, payload: any) {
    const { userId, messageId } = payload;
    await this.prisma.message.update({
      where: { id: messageId },
      data: { checked: true },
    });
    return this.prisma.message.findMany({ where: { id: userId } });
  }
}
