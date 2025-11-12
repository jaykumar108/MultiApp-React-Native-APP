import React, { useState, useCallback, ReactNode, useEffect } from 'react';
import ToastNotification from './toastNotification';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// Global reference to the toast manager instance
let toastManagerInstance: {
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
} | null = null;

interface ToastManagerProps {
  children: ReactNode;
}

const ToastManager: React.FC<ToastManagerProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({
      visible: true,
      message,
      type,
    });
  }, []);

  // Set the global instance when component mounts
  useEffect(() => {
    toastManagerInstance = { showToast };
    return () => {
      toastManagerInstance = null;
    };
  }, [showToast]);

  const handleHide = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <>
      {children}
      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        position="top"
        onHide={handleHide}
      />
    </>
  );
};

// Export functions for direct use
export const showSuccessToast = (message: string) => {
  if (toastManagerInstance) {
    toastManagerInstance.showToast(message, 'success');
  } else {
    console.warn('ToastManager not initialized. Toast message:', message);
  }
};

export const showErrorToast = (message: string) => {
  if (toastManagerInstance) {
    toastManagerInstance.showToast(message, 'error');
  } else {
    console.warn('ToastManager not initialized. Toast message:', message);
  }
};

export const showWarningToast = (message: string) => {
  if (toastManagerInstance) {
    toastManagerInstance.showToast(message, 'warning');
  } else {
    console.warn('ToastManager not initialized. Toast message:', message);
  }
};

export const showInfoToast = (message: string) => {
  if (toastManagerInstance) {
    toastManagerInstance.showToast(message, 'info');
  } else {
    console.warn('ToastManager not initialized. Toast message:', message);
  }
};

export default ToastManager;

