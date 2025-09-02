import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  public notifications = this.notifications$.asObservable();

  constructor() {}

  /**
   * Show a success notification
   */
  success(title: string, message: string, duration: number = 5000): void {
    this.show('success', title, message, duration);
  }

  /**
   * Show an error notification
   */
  error(title: string, message: string, duration: number = 7000): void {
    this.show('error', title, message, duration);
  }

  /**
   * Show an info notification
   */
  info(title: string, message: string, duration: number = 5000): void {
    this.show('info', title, message, duration);
  }

  /**
   * Show a warning notification
   */
  warning(title: string, message: string, duration: number = 6000): void {
    this.show('warning', title, message, duration);
  }

  /**
   * Show a notification
   */
  private show(type: Notification['type'], title: string, message: string, duration: number): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, notification]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  /**
   * Remove a notification by ID
   */
  remove(id: string): void {
    const currentNotifications = this.notifications$.value;
    this.notifications$.next(currentNotifications.filter(n => n.id !== id));
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications$.next([]);
  }

  /**
   * Generate a unique ID for notifications
   */
  private generateId(): string {
    return 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
