// app/login.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function LoginScreen() {
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!matricula.trim() || !senha.trim()) {
            Alert.alert('Erro', 'Por favor, preencha matrícula e senha');
            return;
        }

        setLoading(true);

        try {
            console.log('🔐 Tentativa de login:', { matricula });

            // Autenticação direta - aceita qualquer matrícula/senha não vazios
            const fakeToken = 'fake-jwt-token-' + Date.now();
            const userData = JSON.stringify({
                matricula,
                nome: 'Usuário SIOB'
            });

            await AsyncStorage.setItem('userToken', fakeToken);
            await AsyncStorage.setItem('userData', userData);

            console.log('✅ Login realizado - Redirecionando para Dashboard...');

            // Redireciona para Dashboard
            router.replace('/DashboardScreen');

        } catch (error) {
            Alert.alert('Erro', 'Erro ao fazer login');
            console.error('❌ Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Logo */}
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
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Matrícula</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua matrícula"
                                value={matricula}
                                onChangeText={setMatricula}
                                keyboardType="numeric"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua senha"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.separator} />

                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                loading && styles.loginButtonDisabled
                            ]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.loginButtonText}>
                                {loading ? 'ENTRANDO...' : 'ENTRAR'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoWrapper: {
        width: 120,
        height: 120,
        borderRadius: 20, // Bordas arredondadas
        backgroundColor: '#FFFFFF',
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
        color: '#AE1A16',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 16,
    },
    loginButton: {
        backgroundColor: '#AE1A16',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    loginButtonDisabled: {
        backgroundColor: '#ccc',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});