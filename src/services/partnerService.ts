import { apiFetch } from './apiClient';
import type { CounselNote, MentorshipChatMessage } from '../types/partner';

export async function getCounselNotes(chainId: string): Promise<CounselNote[]> {
  return apiFetch<CounselNote[]>(`/api/v1/chains/${chainId}/counsel-notes`, {
    method: 'GET',
  });
}

export async function getPartnershipMessages(partnershipId: string): Promise<MentorshipChatMessage[]> {
  return apiFetch<MentorshipChatMessage[]>(`/api/v1/partnerships/${partnershipId}/messages`, {
    method: 'GET',
  });
}

export async function sendPartnershipMessage(
  partnershipId: string,
  messageContent: string
): Promise<MentorshipChatMessage> {
  return apiFetch<MentorshipChatMessage>(`/api/v1/partnerships/${partnershipId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ messageContent }),
  });
}
