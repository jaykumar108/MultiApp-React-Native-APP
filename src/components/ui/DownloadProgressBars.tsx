import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';

type DownloadProgressBarsProps = {
  progress?: number; // 0-100 or 0-1
  title?: string;
  subtitle?: string;
  indeterminate?: boolean;
  onCancel?: () => void;
  containerStyle?: ViewStyle;
  barColor?: string;
  trackColor?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toPercent = (value: number | undefined) => {
  if (value === undefined || value === null) return 0;
  return value <= 1 ? clamp(value * 100, 0, 100) : clamp(value, 0, 100);
};

const DownloadProgressBars: React.FC<DownloadProgressBarsProps> = ({
  progress = 0,
  title = 'Downloading',
  subtitle,
  indeterminate = false,
  onCancel,
  containerStyle,
  barColor = '#7563F7',
  trackColor = '#E5E7EB',
}) => {
  const percent = toPercent(progress);

  return (
    <View
      style={[
        {
          padding: 16,
          borderRadius: 16,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#F3F4F6',
        },
        containerStyle,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text
          style={{
            flex: 1,
            fontFamily: 'Poppins-SemiBold',
            color: '#111827',
            fontSize: 16,
          }}
        >
          {title}
        </Text>
        {!indeterminate && (
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              color: '#6B7280',
              fontSize: 12,
            }}
          >
            {Math.round(percent)}%
          </Text>
        )}
      </View>

      {subtitle ? (
        <Text
          style={{
            marginBottom: 10,
            fontFamily: 'Poppins-Regular',
            color: '#6B7280',
            fontSize: 12,
          }}
        >
          {subtitle}
        </Text>
      ) : null}

      {/* Track */}
      <View
        style={{
          height: 10,
          borderRadius: 9999,
          backgroundColor: trackColor,
          overflow: 'hidden',
        }}
      >
        {indeterminate ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="small" color={barColor} />
          </View>
        ) : (
          <View
            style={{
              width: `${percent}%`,
              height: '100%',
              backgroundColor: barColor,
            }}
          />
        )}
      </View>

      {onCancel ? (
        <View style={{ marginTop: 12, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={onCancel}
            activeOpacity={0.7}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              backgroundColor: '#F3F4F6',
              borderRadius: 9999,
            }}
          >
            <Text style={{ fontFamily: 'Poppins-Medium', color: '#374151', fontSize: 12 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default DownloadProgressBars;

