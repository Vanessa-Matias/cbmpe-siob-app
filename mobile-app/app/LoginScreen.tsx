import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SIOB_COLORS = {
  primary: '#AE1A16',
  white: '#FFFFFF',
  text: '#212529',
  background: '#f8f9fa',
  cardBg: '#FFFFFF',
  border: '#dee2e6',
  inputBackground: '#FFFFFF',
  placeholder: '#6c757d',
  error: '#dc3545',
};

export default function LoginScreen() {
  const router = useRouter();
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ matricula: '', senha: '' });

  const validateForm = () => {
    const newErrors = { matricula: '', senha: '' };
    let isValid = true;

    if (!matricula.trim()) {
      newErrors.matricula = 'Matrícula é obrigatória';
      isValid = false;
    }

    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulação de login - aceita qualquer matrícula/senha não vazios
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Login bem sucedido - redireciona para Dashboard
      console.log('✅ Login realizado com sucesso');
      router.replace('/DashboardScreen');
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../assets/images/SIOBIOGO.png')}
                  style={styles.logo}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.logoText}>SIOB</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Matrícula</Text>
              <View style={[
                styles.inputContainer,
                errors.matricula ? styles.inputError : null
              ]}>
                <MaterialIcons name="person" size={20} color={SIOB_COLORS.placeholder} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua matrícula"
                  placeholderTextColor={SIOB_COLORS.placeholder}
                  value={matricula}
                  onChangeText={setMatricula}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.matricula ? <Text style={styles.errorText}>{errors.matricula}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={[
                styles.inputContainer,
                errors.senha ? styles.inputError : null
              ]}>
                <MaterialIcons name="lock" size={20} color={SIOB_COLORS.placeholder} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor={SIOB_COLORS.placeholder}
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={SIOB_COLORS.placeholder}
                  />
                </TouchableOpacity>
              </View>
              {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
            </View>

            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Versão 1.0.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SIOB_COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 20, // Bordas arredondadas
    backgroundColor: SIOB_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden', // Importante para a imagem respeitar o borderRadius
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: SIOB_COLORS.primary,
  },
  formContainer: {
    backgroundColor: SIOB_COLORS.cardBg,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: SIOB_COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SIOB_COLORS.inputBackground,
    borderWidth: 1,
    borderColor: SIOB_COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  inputError: {
    borderColor: SIOB_COLORS.error,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: SIOB_COLORS.text,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: SIOB_COLORS.error,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  loginButton: {
    backgroundColor: SIOB_COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: SIOB_COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: SIOB_COLORS.placeholder,
    textAlign: 'center',
    lineHeight: 16,
  },
});