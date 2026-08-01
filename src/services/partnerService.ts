import { apiFetch } from './apiClient';
import type { CounselNote, MentorshipChatMessage } from '../types/partner';

export async function getCounselNotes(chainId: string): Promise<CounselNote[]> {
  const res = await apiFetch<CounselNote[]>(`/api/v1/chains/${chainId}/counsel-notes`, {
    method: 'GET',
  });
  return Array.isArray(res) ? res : [];
}

export async function getPartnershipMessages(partnershipId: string): Promise<MentorshipChatMessage[]> {
  const res = await apiFetch<MentorshipChatMessage[]>(`/api/v1/partnerships/${partnershipId}/messages`, {
    method: 'GET',
  });
  return Array.isArray(res) ? res : [];
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
