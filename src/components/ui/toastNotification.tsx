import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface ToastNotificationProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  onHide?: () => void;
  showIcon?: boolean;
  actionText?: string;
  onActionPress?: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  position = 'top',
  onHide,
  showIcon = true,
  actionText,
  onActionPress,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      showToast();
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          hideToast();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const showToast = () => {
    const initialValue = position === 'top' ? -100 : position === 'bottom' ? 100 : 0;
    translateY.setValue(initialValue);
    opacity.setValue(0);
    scale.setValue(0.8);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const hideToast = () => {
    const finalValue = position === 'top' ? -100 : position === 'bottom' ? 100 : 0;
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: finalValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          icon: 'checkmark-circle',
          iconColor: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: '#EF4444',
          icon: 'close-circle',
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          icon: 'warning',
          iconColor: '#FFFFFF',
        };
      case 'info':
      default:
        return {
          backgroundColor: '#3B82F6',
          icon: 'information-circle',
          iconColor: '#FFFFFF',
        };
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return {
          top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
        };
      case 'bottom':
        return {
          bottom: 50,
        };
      case 'center':
        return {
          top: height / 2 - 50,
        };
      default:
        return {
          top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
        };
    }
  };

  const toastConfig = getToastConfig();
  const positionStyle = getPositionStyle();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: toastConfig.backgroundColor,
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
          ...positionStyle,
        },
      ]}
    >
      <View style={styles.content}>
        {showIcon && (
          <Ionicons
            name={toastConfig.icon}
            size={20}
            color={toastConfig.iconColor}
            style={styles.icon}
          />
        )}
        
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>

        {actionText && onActionPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onActionPress}
          >
            <Text style={styles.actionText}>{actionText}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideToast}
        >
          <Ionicons
            name="close"
            size={16}
            color={toastConfig.iconColor}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  actionButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ToastNotification;