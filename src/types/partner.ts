export type PartnershipRole = 'MENTOR' | 'PEER_BUDDY';
export type PartnershipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface AccountabilityPartnership {
  id: string;
  chainId: string;
  userId: string;
  partnerUserId: string;
  partnerFullName: string;
  partnerUsername: string;
  role: PartnershipRole;
  status: PartnershipStatus;
  createdAt: string;
}

export interface CounselNote {
  id: string;
  chainId: string;
  mentorUserId: string;
  mentorFullName: string;
  noteContent: string;
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
