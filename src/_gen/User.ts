import { ApiProperty } from '@nestjs/swagger';

import { AuthProvider, Group, Role } from '@prisma/client';

import { Message } from './Message';
import { UserProfile } from './UserProfile';
import { LocalUser } from './LocalUser';
import { SocialUser } from './SocialUser';
import { Poll } from './Poll';
import { Vote } from './Vote';
import { Response } from './Response';
import { VoteResponse } from './VoteResponse';
import { Board } from './Board';
import { Subscription } from './Subscription';
import { AllowTerms } from './AllowTerms';
import { Comment } from './Comment';
import { BoardLike } from './BoardLike';
import { Payment } from './Payment';

export class User {
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  email!: string;
  @ApiProperty({ type: String })
  username!: string;
  @ApiProperty({ type: Boolean })
  isActive: boolean = true;
  @ApiProperty({ type: Date })
  lastLogin!: Date | null;
  @ApiProperty({ enum: AuthProvider })
  authProvider: AuthProvider = 'Local';
  @ApiProperty({ enum: Group })
  group: Group = 'Normal';
  @ApiProperty({ enum: Role })
  role: Role = 'User';
  @ApiProperty({ type: Boolean })
  receiveMail: boolean = false;
  @ApiProperty({ type: Date })
  createdAt!: Date;
  @ApiProperty({ type: Date })
  updatedAt!: Date;
  @ApiProperty({ type: Date })
  deletedAt!: Date | null;
  @ApiProperty({ isArray: true, type: () => Message })
  sendMessage!: Message[];
  @ApiProperty({ isArray: true, type: () => Message })
  receiveMessage!: Message[];
  @ApiProperty({ type: () => UserProfile })
  userProfile!: UserProfile | null;
  @ApiProperty({ type: () => LocalUser })
  localUser!: LocalUser | null;
  @ApiProperty({ type: () => SocialUser })
  socialUser!: SocialUser | null;
  @ApiProperty({ isArray: true, type: () => Poll })
  poll!: Poll[];
  @ApiProperty({ isArray: true, type: () => Vote })
  vote!: Vote[];
  @ApiProperty({ isArray: true, type: () => Response })
  response!: Response[];
  @ApiProperty({ isArray: true, type: () => VoteResponse })
  voteResponse!: VoteResponse[];
  @ApiProperty({ isArray: true, type: () => Board })
  board!: Board[];
  @ApiProperty({ type: () => Subscription })
  subscription!: Subscription | null;
  @ApiProperty({ isArray: true, type: () => AllowTerms })
  allowTerms!: AllowTerms[];
  @ApiProperty({ isArray: true, type: () => Comment })
  comment!: Comment[];
  @ApiProperty({ isArray: true, type: () => BoardLike })
  boardLike!: BoardLike[];
  @ApiProperty({ isArray: true, type: () => Payment })
  payment!: Payment[];
}
