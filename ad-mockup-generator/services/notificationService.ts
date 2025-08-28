import toast, { Toaster } from 'react-hot-toast';

/**
 * Notification service for user feedback
 * Replaces the non-existent window.showNotification
 */

export const notify = {
  /**
   * Success notification
   */
  success: (message: string, duration: number = 4000) => {
    return toast.success(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: 'bold',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  },

  /**
   * Error notification
   */
  error: (message: string, duration: number = 5000) => {
    return toast.error(message, {
      duration,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    });
  },

  /**
   * Warning notification
   */
  warning: (message: string, duration: number = 4000) => {
    return toast(message, {
      icon: '⚠️',
      duration,
      position: 'top-right',
      style: {
        background: '#f59e0b',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    });
  },

  /**
   * Info notification
   */
  info: (message: string, duration: number = 4000) => {
    return toast(message, {
      icon: 'ℹ️',
      duration,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    });
  },

  /**
   * Upgrade prompt notification
   */
  upgrade: (message: string, action?: () => void) => {
    return toast(
      (t) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span>{message}</span>
          </div>
          {action && (
            <button
              onClick={() => {
                action();
                toast.dismiss(t.id);
              }}
              className="ml-4 px-3 py-1 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100"
            >
              Upgrade
            </button>
          )}
        </div>
      ),
      {
        duration: 6000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          fontSize: '14px',
          minWidth: '350px',
        },
      }
    );
  },

  /**
   * Celebration notification
   */
  celebrate: (message: string) => {
    return toast(message, {
      icon: '🎉',
      duration: 5000,
      position: 'top-center',
      style: {
        background: 'linear-gradient(135deg, #84fab0, #8fd3f4)',
        color: '#1f2937',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      },
    });
  },

  /**
   * Loading notification
   */
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-center',
      style: {
        background: '#1f2937',
        color: '#fff',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '14px',
      },
    });
  },

  /**
   * Custom notification with action
   */
  custom: (content: React.ReactNode, duration: number = 4000) => {
    return toast.custom(content, {
      duration,
      position: 'top-right',
    });
  },

  /**
   * Dismiss a notification
   */
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  /**
   * Promise-based notification
   */
  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: msgs.loading,
        success: msgs.success,
        error: msgs.error,
      },
      {
        position: 'top-center',
        style: {
          borderRadius: '10px',
          padding: '16px',
          fontSize: '14px',
        },
      }
    );
  },
};

/**
 * Activity feed notification (shows in bottom-left)
 */
export const showActivity = (activity: string) => {
  toast(activity, {
    duration: 4000,
    position: 'bottom-left',
    style: {
      background: '#1f2937',
      color: '#fff',
      borderRadius: '10px',
      padding: '12px 16px',
      fontSize: '13px',
      border: '1px solid #374151',
    },
    icon: '🔥',
  });
};

/**
 * Show multiple activities in sequence
 */
export const showActivityFeed = (activities: string[], interval: number = 2000) => {
  activities.forEach((activity, index) => {
    setTimeout(() => {
      showActivity(activity);
    }, index * interval);
  });
};

/**
 * Paywall trigger notification
 */
export const showPaywallTrigger = (
  message: string,
  onUpgrade: () => void
) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onUpgrade();
              toast.dismiss(t.id);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            Upgrade Now
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Later
          </button>
        </div>
      </div>
    ),
    {
      duration: 8000,
      position: 'top-center',
      style: {
        background: '#1f2937',
        color: '#fff',
        borderRadius: '12px',
        padding: '20px',
        minWidth: '400px',
        border: '2px solid #667eea',
      },
    }
  );
};

/**
 * Export Toaster component for app root
 */
export { Toaster };

// Make notify available globally for backward compatibility
if (typeof window !== 'undefined') {
  (window as any).notify = notify;
  (window as any).showNotification = notify.info;
}