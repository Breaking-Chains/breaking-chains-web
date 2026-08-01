export type MentorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MentorProfile {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  qualification: string;
  specialization: string;
  yearsOfExperience: number;
  organization?: string;
  bio: string;
  status: MentorStatus;
  isVerified: boolean;
  createdAt: string;
}

export interface MentorRegistrationRequest {
  qualification: string;
  specialization: string;
  yearsOfExperience: number;
  organization?: string;
  bio: string;
  autoApprove?: boolean;
}

export interface UpdateMentorStatusRequest {
  status: MentorStatus;
}
