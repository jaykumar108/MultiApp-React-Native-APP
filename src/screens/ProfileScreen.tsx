import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const user = {
  name: 'Jay Sharma',
  email: 'jaysharma@gmail.com',
  image: 'https://res.cloudinary.com/dzgr4iqt7/image/upload/v1752564843/attendance_system/ivkbqhwdxwlshvftvku7.png',
};

const menu = [
  { label: 'Edit Profile', icon: 'pencil-outline', onPress: () => {} },
  { label: 'Change Password', icon: 'lock-closed-outline', onPress: () => {} },
  { label: 'Settings', icon: 'settings-outline', onPress: () => {} },
  { label: 'Invite a friend', icon: 'person-add-outline', onPress: () => {} },
];

const ProfileScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    {/* Profile Image with Edit Icon */}
    <View style={styles.profileImageContainer}>
      <Image source={{ uri: user.image }} style={styles.profileImage} />
      <TouchableOpacity style={styles.editIcon}>
        <Ionicons name="pencil" size={20} color="#1976d2" />
      </TouchableOpacity>
    </View>
    {/* Name and Email */}
    <Text style={styles.name}>{user.name}</Text>
    <View style={styles.emailContainer}>
      <Text style={styles.email}>{user.email}</Text>
    </View>
    {/* Menu Card */}
    <View style={styles.menuCard}>
      {menu.map((item, idx) => (
        <TouchableOpacity
          key={item.label}
          style={styles.menuItem}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <Ionicons name={item.icon} size={22} color="#1976d2" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdbdbd" />
        </TouchableOpacity>
      ))}
      {/* Logout */}
      <TouchableOpacity style={styles.menuItem} onPress={() => {}} activeOpacity={0.7}>
        <View style={styles.menuLeft}>
          <Ionicons name="log-out-outline" size={22} color="#e53935" style={styles.menuIcon} />
          <Text style={[styles.menuLabel, { color: '#e53935' }]}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

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