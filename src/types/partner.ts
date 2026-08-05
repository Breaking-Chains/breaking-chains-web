export type PartnershipRole = 'SPIRITUAL_MENTOR' | 'PEER_BUDDY' | 'MENTOR';
export type PartnershipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'PENDING_TERMINATION' | 'TERMINATED';

export interface AccountabilityPartnership {
  id: string;
  chainId: string;
  userId: string;
  partnerUserId: string;
  partnerFullName: string;
  partnerUsername: string;
  role: PartnershipRole;
  status: PartnershipStatus;
  inviteCode?: string;
  createdAt: string;
  terminationRequestedAt?: string;
}

export interface CounselNote {
  id: string;
  chainId: string;
  mentorUserId: string;
  mentorFullName: string;
  counselText: string;
  createdAt: string;
}

export interface MentorshipChatMessage {
  id: string;
  partnershipId: string;
  senderId: string;
  senderFullName: string;
  senderUsername: string;
  messageContent: string;
  isRead: boolean;
  createdAt: string;
}
