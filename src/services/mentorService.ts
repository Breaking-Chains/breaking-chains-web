import { apiFetch } from './apiClient';
import type {
  MentorProfile,
  MentorRegistrationRequest,
  UpdateMentorStatusRequest,
} from '../types/mentor';

export async function registerMentor(request: MentorRegistrationRequest): Promise<MentorProfile> {
  return apiFetch<MentorProfile>('/api/v1/mentors/register', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getMyMentorProfile(): Promise<MentorProfile | null> {
  try {
    return await apiFetch<MentorProfile>('/api/v1/mentors/me', {
      method: 'GET',
    });
  } catch {
    return null;
  }
}

export async function getVerifiedMentors(): Promise<MentorProfile[]> {
  return apiFetch<MentorProfile[]>('/api/v1/mentors/verified', {
    method: 'GET',
  });
}

export async function getAllMentorApplications(): Promise<MentorProfile[]> {
  return apiFetch<MentorProfile[]>('/api/v1/mentors/applications', {
    method: 'GET',
  });
}

export async function updateMentorStatus(
  profileId: string,
  request: UpdateMentorStatusRequest
): Promise<MentorProfile> {
  return apiFetch<MentorProfile>(`/api/v1/mentors/applications/${profileId}/status`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}
