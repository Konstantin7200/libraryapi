'use client';

import { useContext } from 'react';
import { ToastContext } from './toastContext';

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');

  const showSuccess = (msg: string) => ctx.showToast(msg, 'success');
  const showError = (msg: string) => ctx.showToast(msg, 'error');
  const showWarning = (msg: string) => ctx.showToast(msg, 'warning');
  const showInfo = (msg: string) => ctx.showToast(msg, 'info');

  return { showToast: ctx.showToast, showSuccess, showError, showWarning, showInfo };
}
