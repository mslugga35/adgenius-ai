import toast from 'react-hot-toast';

/**
 * Simple notification service using react-hot-toast
 * Provides user feedback with styled toasts
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Show a notification to the user
 */
export const showNotification = (
  message: string, 
  type: NotificationType = 'info',
  duration: number = 4000
): void => {
  const styles = {
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  };

  switch (type) {
    case 'success':
      toast.success(message, {
        duration,
        position: 'top-right',
        style: {
          ...styles,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      });
      break;

    case 'error':
      toast.error(message, {
        duration: duration + 1000, // Errors stay longer
        position: 'top-right',
        style: {
          ...styles,
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      });
      break;

    case 'warning':
      toast(message, {
        icon: '⚠️',
        duration,
        position: 'top-right',
        style: {
          ...styles,
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#fff',
        },
      });
      break;

    case 'info':
    default:
      toast(message, {
        icon: 'ℹ️',
        duration,
        position: 'top-right',
        style: {
          ...styles,
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#fff',
        },
      });
      break;
  }
};

/**
 * Specialized notification for paywall events
 */
export const showPaywallNotification = (message: string): void => {
  toast(message, {
    icon: '🔒',
    duration: 5000,
    position: 'top-center',
    style: {
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      color: '#fff',
      padding: '16px 24px',
      fontSize: '15px',
      fontWeight: 'bold',
      boxShadow: '0 15px 35px rgba(139, 92, 246, 0.3)',
    },
  });
};

/**
 * Loading notification with promise
 */
export const showLoadingNotification = (
  promise: Promise<any>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      position: 'top-right',
      style: {
        borderRadius: '10px',
        background: '#1f2937',
        color: '#fff',
        padding: '12px 16px',
        fontSize: '14px',
      },
    }
  );
};

/**
 * Dismiss all notifications
 */
export const dismissAllNotifications = () => {
  toast.dismiss();
};

/**
 * Export individual notification functions for convenience
 */
export const notify = {
  success: (message: string, duration?: number) => 
    showNotification(message, 'success', duration),
  error: (message: string, duration?: number) => 
    showNotification(message, 'error', duration),
  warning: (message: string, duration?: number) => 
    showNotification(message, 'warning', duration),
  info: (message: string, duration?: number) => 
    showNotification(message, 'info', duration),
  paywall: showPaywallNotification,
  loading: showLoadingNotification,
  dismissAll: dismissAllNotifications,
};