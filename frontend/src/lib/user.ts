'use server';

import { apiFetch } from './apiWrapper';

export async function getLogin() {
  const response = await apiFetch('/user/login');
  if (!response.ok) throw new Error(await response.text());
  return await response.text();
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const response = await apiFetch('/user/password', {
    method: 'POST',
    body: { currentPassword, newPassword },
  });
  if (!response.ok) throw new Error(await response.text());
}

export async function changeLogin(newLogin: string) {
  const response = await apiFetch('/user/login', {
    method: 'POST',
    body: { newLogin },
  });
  if (!response.ok) throw new Error(await response.text());
}
