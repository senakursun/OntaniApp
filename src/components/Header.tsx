import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type HeaderProps = {
  onLoginPress: () => void;
  onSignUpPress: () => void;
};

const Header: React.FC<HeaderProps> = ({ onLoginPress, onSignUpPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>OntaniApp</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onLoginPress}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2B8C96',
    borderBottomWidth: 0.5,//headeer ve navigationbar arasında bir çizgi oluşturuyor
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: '#1a5c63',
  },
  signUpButton: {
    backgroundColor: '#1a5c63',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Header; 