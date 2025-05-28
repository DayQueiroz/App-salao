import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function NovoAgendamentoScreen({ navigation }) {
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

  const salvarAgendamento = async () => {
    if (!clienteNome || !profissionalNome || !servicoNome || !data || !hora) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const [horas, minutos] = hora.split(':');
    const dataHoraFinal = new Date(data);
    dataHoraFinal.setHours(parseInt(horas), parseInt(minutos), 0, 0);

    try {
      await addDoc(collection(db, 'agendamentos'), {
        clienteNome,
        profissionalNome,
        servicoNome,
        dataHora: dataHoraFinal,
        status: 'agendado'
      });

      Alert.alert('Agendamento salvo com sucesso!');
      navigation.navigate('Agendamentos');
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      Alert.alert('Erro ao salvar', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Image source={require('../assets/logo_salao.png')} style={styles.logo} />
        <Text style={styles.titulo}>Novo Agendamento</Text>

        <Text style={styles.label}>Cliente:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do cliente"
          value={clienteNome}
          onChangeText={setClienteNome}
        />

        <Text style={styles.label}>Profissional:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do profissional"
          value={profissionalNome}
          onChangeText={setProfissionalNome}
        />

        <Text style={styles.label}>Serviço:</Text>
        <TextInput
          style={styles.input}
          placeholder="Serviço"
          value={servicoNome}
          onChangeText={setServicoNome}
        />

        <Text style={styles.label}>Data:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setMostrarDataPicker(true)}
        >
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
            {horarios.map((horaItem) => (
              <Picker.Item key={horaItem} label={horaItem} value={horaItem} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.botao} onPress={salvarAgendamento}>
          <Text style={styles.botaoTexto}>Salvar Agendamento</Text>
        </TouchableOpacity>

        <View style={{ height: 200 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 60,
    justifyContent: 'center'
  },
  horaPicker: {
    height: 100,
    width: '100%',
    marginBottom: 60
  },
  botao: {
    marginTop: 15,
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
