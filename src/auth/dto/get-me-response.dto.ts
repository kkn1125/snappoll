import { Plan } from '@/_gen/Plan';
import { Poll } from '@/_gen/Poll';
import { Response } from '@/_gen/Response';
import { Subscription } from '@/_gen/Subscription';
import { UserProfile } from '@/_gen/UserProfile';
import { Vote } from '@/_gen/Vote';
import { VoteResponse } from '@/_gen/VoteResponse';

export class GetMeResponseDto {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  lastLogin: Date;
  authProvider: 'Local' | 'Kakao' | 'Google';
  group: string;
  role: string;
  receiveMail: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  userProfile: Pick<UserProfile, 'id'>;
  poll: Omit<Poll, 'user' | 'questions' | 'responses' | 'sharePoll'>[];
  vote: Omit<Vote, 'user' | 'voteOptions' | 'voteResponses' | 'shareVote'>[];
  response: Response[];
  voteResponse: VoteResponse[];
  subscription: Subscription & { plan: Plan };
  limit: {
    poll: number;
    vote: number;
  };
  totalUsage: {
    poll: number;
    vote: number;
  };
}
