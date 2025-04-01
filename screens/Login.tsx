import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const [email, setEmail] = useState ('');
    const [senha, setSenha] = useState ('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, senha);
            Alert.alert('Login realizado com sucesso!')
             // Aqui você pode navegar para a tela principal do app
            navigation.navigate('Agenda' as never); // forçando tipagem básica
        } catch (error: any){
            Alert.alert('Erro ao fazer login', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vinda ao App do Salão</Text>

            <TextInput
                placeholder="E-mail"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Senha"
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry            
            />

            <Button title="Entrar" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'fff' // cor de fundo branco
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 20,
        color: '#999' // cor do texto escura
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f9f9f9', // fundo claro no input
        color: '#555' // cor do texto digitado
    }
});