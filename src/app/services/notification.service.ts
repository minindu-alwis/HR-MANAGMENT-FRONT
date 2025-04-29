import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

type Severity = 'success' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) { }

  showNotification(severity: Severity, summary: string, detail: string): void {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: 5000
    });
  }

  showSuccess(message: string): void {
    this.showNotification('success', 'Success', message);
  }

  showError(message: string): void {
    this.showNotification('error', 'Error', message);
  }

  showInfo(message: string): void {
    this.showNotification('info', 'Information', message);
  }

  showWarning(message: string): void {
    this.showNotification('warn', 'Warning', message);
  }

  clear(): void {
    this.messageService.clear();
  }
}