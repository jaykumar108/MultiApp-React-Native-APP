import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface SuccessDialogModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
  showIcon?: boolean;
  type?: 'success' | 'info' | 'warning';
}

const SuccessDialogModal: React.FC<SuccessDialogModalProps> = ({
  visible,
  onClose,
  title = 'Success!',
  message = 'Operation completed successfully.',
  buttonText = 'OK',
  autoHide = false,
  autoHideDelay = 3000,
  showIcon = true,
  type = 'success',
}) => {
  const scaleValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide if enabled
      if (autoHide) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoHideDelay);

        return () => clearTimeout(timer);
      }
    } else {
      // Reset values when hidden
      scaleValue.setValue(0);
      opacityValue.setValue(0);
    }
  }, [visible, autoHide, autoHideDelay]);

  const handleClose = () => {
    // Animate out
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          name: 'checkmark-circle',
          color: '#10B981',
          backgroundColor: '#D1FAE5',
        };
      case 'info':
        return {
          name: 'information-circle',
          color: '#3B82F6',
          backgroundColor: '#DBEAFE',
        };
      case 'warning':
        return {
          name: 'warning',
          color: '#F59E0B',
          backgroundColor: '#FEF3C7',
        };
      default:
        return {
          name: 'checkmark-circle',
          color: '#10B981',
          backgroundColor: '#D1FAE5',
        };
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'info':
        return '#3B82F6';
      case 'warning':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  const iconConfig = getIconConfig();
  const buttonColor = getButtonColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: opacityValue }]}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            {showIcon && (
              <View style={[styles.iconContainer, { backgroundColor: iconConfig.backgroundColor }]}>
                <Ionicons 
                  name={iconConfig.name} 
                  size={40} 
                  color={iconConfig.color} 
                />
              </View>
            )}
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }]}
            onPress={handleClose}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: width * 0.85,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  content: {
    marginBottom: 32,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SuccessDialogModal;