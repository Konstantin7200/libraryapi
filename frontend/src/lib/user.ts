'use server';

import { apiFetch } from './apiWrapper';

export async function getLogin() {
  const response = await apiFetch<string>('/user/login');
  return response.data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  await apiFetch('/user/password', {
    method: 'POST',
    body: { currentPassword, newPassword },
  });
}

export async function changeLogin(newLogin: string) {
  await apiFetch('/user/login', {
    method: 'POST',
    body: { newLogin },
  });
}