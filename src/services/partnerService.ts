import { apiFetch } from './apiClient';
import type { CounselNote, MentorshipChatMessage } from '../types/partner';
import type { HabitChain } from '../types/chain';

export async function getMentees(): Promise<HabitChain[]> {
  const res = await apiFetch<HabitChain[]>('/api/v1/partners/mentees', {
    method: 'GET',
  });
  return Array.isArray(res) ? res : [];
}

export async function getCounselNotes(chainId: string): Promise<CounselNote[]> {
  const res = await apiFetch<CounselNote[]>(`/api/v1/chains/${chainId}/counsel-notes`, {
    method: 'GET',
  });
  return Array.isArray(res) ? res : [];
}

export async function sendCounselNote(chainId: string, counselText: string): Promise<CounselNote> {
  return apiFetch<CounselNote>(`/api/v1/chains/${chainId}/counsel-notes`, {
    method: 'POST',
    body: JSON.stringify({ counselText, isPrivate: false }),
  });
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

export async function connectWithMentorCode(inviteCode: string): Promise<any> {
  return apiFetch<any>('/api/v1/partners/accept', {
    method: 'POST',
    body: JSON.stringify({ inviteCode }),
  });
}
