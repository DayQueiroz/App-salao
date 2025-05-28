import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { deleteDoc } from 'firebase/firestore';


export default function EditarAgendamentoScreen({ route, navigation }) {
  const { agendamentoId } = route.params;

  const [clienteNome, setClienteNome] = useState('');
  const [profissionalNome, setProfissionalNome] = useState('');
  const [servicoNome, setServicoNome] = useState('');
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState('08:00');
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false);

  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00',
    '10:30', '11:00', '11:30', '12:00',
    '13:00', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  useEffect(() => {
    const carregarAgendamento = async () => {
      const ref = doc(db, 'agendamentos', agendamentoId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const dados = snap.data();
        setClienteNome(dados.clienteNome);
        setProfissionalNome(dados.profissionalNome);
        setServicoNome(dados.servicoNome);

        const dataHoraFirebase = new Date(dados.dataHora.seconds ? dados.dataHora.seconds * 1000 : dados.dataHora);
        setData(dataHoraFirebase);

        const horaStr = dataHoraFirebase.toTimeString().substring(0, 5);
        setHora(horaStr);
      }
    };

    carregarAgendamento();
  }, []);

  const salvarAlteracoes = async () => {
    if (!clienteNome || !profissionalNome || !servicoNome || !data || !hora) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const [horas, minutos] = hora.split(':');
    const dataHoraFinal = new Date(data);
    dataHoraFinal.setHours(parseInt(horas), parseInt(minutos), 0, 0);

    try {
      await updateDoc(doc(db, 'agendamentos', agendamentoId), {
        clienteNome,
        profissionalNome,
        servicoNome,
        dataHora: dataHoraFinal
      });

      Alert.alert('Agendamento atualizado com sucesso!');
      navigation.navigate('Agendamentos');
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      Alert.alert('Erro ao salvar', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/logo_salao.png')} style={styles.logo} />
      <Text style={styles.titulo}>Editar Agendamento</Text>

      <Text style={styles.label}>Cliente:</Text>
      <TextInput
        style={styles.input}
        value={clienteNome}
        onChangeText={setClienteNome}
      />

      <Text style={styles.label}>Profissional:</Text>
      <TextInput
        style={styles.input}
        value={profissionalNome}
        onChangeText={setProfissionalNome}
      />

      <Text style={styles.label}>Serviço:</Text>
      <TextInput
        style={styles.input}
        value={servicoNome}
        onChangeText={setServicoNome}
      />

      <Text style={styles.label}>Data:</Text>
      <TouchableOpacity style={styles.input} onPress={() => setMostrarDataPicker(true)}>
        <Text>{data.toLocaleDateString('pt-BR')}</Text>
      </TouchableOpacity>

      {mostrarDataPicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setMostrarDataPicker(false);
            if (selectedDate) setData(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Hora:</Text>
      <View style={styles.horaLinha}>
        <Picker
          selectedValue={hora}
          onValueChange={(itemValue) => setHora(itemValue)}
          style={styles.horaPicker}
        >
          <Picker.Item label="Selecione" value="" />
          {horarios.map(h => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.botao} onPress={salvarAlteracoes}>
        <Text style={styles.botaoTexto}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#e53935' }]}
        onPress={() => {
          Alert.alert(
            'Excluir Agendamento',
            'Tem certeza que deseja excluir este agendamento?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await deleteDoc(doc(db, 'agendamentos', agendamentoId));
                    Alert.alert('Agendamento excluído com sucesso!');
                    navigation.navigate('Agendamentos');
                  } catch (error) {
                    console.error('Erro ao excluir:', error);
                    Alert.alert('Erro ao excluir', error.message);
                  }
                }
              }
            ]
          );
        }}
      >
        <Text style={styles.botaoTexto}>Excluir Agendamento</Text>
      </TouchableOpacity>

    </ScrollView>
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
  label: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
  },
  horaLinha: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center'
  },
  horaPicker: {
    height: 100,
    width: '100%',
    marginBottom: 60
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
