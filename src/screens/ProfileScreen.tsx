import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await AuthService.getProfile();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          Alert.alert('Error', response.message || 'Failed to fetch profile');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>No user data</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              // Navigation will be handled automatically by AuthContext
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Logout failed. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Image with Edit Icon */}
      <View style={styles.profileImageContainer}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={100} color="#bbb" />
        )}
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="pencil" size={20} color="#1976d2" />
        </TouchableOpacity>
      </View>
      {/* Name and Email */}
      <Text style={styles.name}>{user.name}</Text>
      <View style={styles.emailContainer}>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      {/* City and Mobile */}
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={18} color="#1976d2" style={{ marginRight: 6 }} />
        <Text style={styles.infoText}>{user.city || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={18} color="#1976d2" style={{ marginRight: 6 }} />
        <Text style={styles.infoText}>{user.mobile || 'N/A'}</Text>
      </View>
      {/* Menu Card */}
      <View style={styles.menuCard}>
        {/* Edit Profile */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="pencil-outline" size={22} color="#1976d2" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
        {/* Change Password */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="lock-closed-outline" size={22} color="#1976d2" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
        {/* Settings */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="settings-outline" size={22} color="#1976d2" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
        {/* Invite a friend */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Invite a friend', 'This feature is coming soon!')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="person-add-outline" size={22} color="#1976d2" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>Invite a friend</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
        {/* Logout */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
          activeOpacity={0.7}
          disabled={isLoggingOut}
        >
          <View style={styles.menuLeft}>
            <Ionicons name="log-out-outline" size={22} color="#e53935" style={styles.menuIcon} />
            <Text style={[styles.menuLabel, { color: '#e53935' }]}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingTop: 90,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
  },
  emailContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 24,
  },
  email: {
    color: '#1976d2',
    fontSize: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#444',
  },
  menuCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
});

export default ProfileScreen; 