import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AgendamentosScreen({ navigation }) {
  const [agendamentos, setAgendamentos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const carregarAgendamentos = async () => {
        const snapshot = await getDocs(collection(db, 'agendamentos'));
        const lista = snapshot.docs.map(doc => {
          const agendamento = doc.data();
          const dataHoraFormatada = agendamento.dataHora?.seconds
            ? new Date(agendamento.dataHora.seconds * 1000).toLocaleString('pt-BR')
            : new Date(agendamento.dataHora).toLocaleString('pt-BR');

          return {
            id: doc.id,
            cliente: agendamento.clienteNome,
            profissional: agendamento.profissionalNome,
            servico: agendamento.servicoNome,
            dataHora: dataHoraFormatada,
            status: agendamento.status || 'agendado'
          };
        });

        setAgendamentos(lista);
      };

      carregarAgendamentos();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo_salao.png')} style={styles.logo} />
      <Text style={styles.titulo}>Agendamentos</Text>

      <FlatList
        data={agendamentos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditarAgendamento', { agendamentoId: item.id })}
          >
            <View style={styles.card}>
              <Text style={styles.label}>Cliente:</Text>
              <Text>{item.cliente}</Text>

              <Text style={styles.label}>Profissional:</Text>
              <Text>{item.profissional}</Text>

              <Text style={styles.label}>Serviço:</Text>
              <Text>{item.servico}</Text>

              <Text style={styles.label}>Data e Hora:</Text>
              <Text>{item.dataHora}</Text>

              <Text style={styles.label}>Status:</Text>
              <Text>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('NovoAgendamento')}
      >
        <Text style={styles.botaoTexto}>Novo Agendamento</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 50
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5
  },
  botao: {
    marginTop: 10,
    backgroundColor: '#A78EB4',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
