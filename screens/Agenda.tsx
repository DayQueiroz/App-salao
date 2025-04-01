import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Pressable } from 'react-native';
import { format } from 'date-fns';
import DropDownPicker from 'react-native-dropdown-picker';



export default function Agenda() {
  const [nome, setNome] = useState('');
  const [hora, setHora] = useState('');
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [data, setData] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [horariosLivres, setHorariosLivres] = useState<string[]>([]);
  const [openServico, setOpenServico] = useState(false); // controla se o menu está aberto
  const [servicoSelecionado, setServicoSelecionado] = useState(''); // guarda o valor escolhido
  const [itensServico, setItensServico] = useState([
    { label: 'Cabelo', value: 'Cabelo' },
    { label: 'Unha', value: 'Unha' },
    { label: 'Sobrancelha', value: 'Sobrancelha' },
  ]);
  const [openHora, setOpenHora] = useState(false);
  const [itensHora, setItensHora] = useState<any[]>([]);
  const [openProfissional, setOpenProfissional] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [itensProfissional, setItensProfissional] = useState([
    { label: 'Kelly', value: 'Kelly' },
    { label: 'Val', value: 'Val' },
  ]);
  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
  const handleAgendar = async () => {
    console.log('nome:', nome);
    console.log('hora:', hora);
    console.log('servico:', servicoSelecionado);
    console.log('profissional:', profissionalSelecionado);

    if (!nome || !hora || !servicoSelecionado || !profissionalSelecionado) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    const dataFormatada = format(data, 'yyyy-MM-dd');

    try {
      await addDoc(collection(db, 'agendamentos'), {
        nome,
        hora,
        servicoSelecionado,
        profissionalSelecionado,
        data: dataFormatada,
        criadoEm: Timestamp.now(),
      });
      setNome('');
      setHora('');
      setServicoSelecionado('');
    } catch (error) {
      Alert.alert('Erro ao agendar', (error as Error).message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'agendamentos'), (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAgendamentos(dados);

      // Filtrar horários ocupados na data selecionada
      const dataFormatada = format(data, 'yyyy-MM-dd');
      const agendamentosDoDia = dados.filter((item) => item.data === dataFormatada && item.profissionalSelecionado === profissionalSelecionado);
      const horariosOcupados = agendamentosDoDia.map((item) => item.hora);
      const horariosLivresAtualizados = horariosDisponiveis.filter(
        (hora) => !horariosOcupados.includes(hora)
      );
      setHorariosLivres(horariosLivresAtualizados);
      // Atualiza os itens do DropDownPicker de horário
      setItensHora(horariosLivresAtualizados.map((h) => ({ label: h, value: h })));
    });

    return unsubscribe;
  }, [data]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Agendamento</Text>

      <TextInput
        placeholder="Nome do cliente"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <View style={{ zIndex: 5000 }}>
        <Text style={styles.label}>Profissional</Text>
        <DropDownPicker
          open={openProfissional}
          value={profissionalSelecionado}
          items={itensProfissional}
          setOpen={setOpenProfissional}
          setValue={setProfissionalSelecionado}
          setItems={setItensProfissional}
          placeholder="Selecione o profissional"
          style={styles.dropdown}
          dropDownContainerStyle={{ backgroundColor: '#fff' }}
          zIndex={5000}
          zIndexInverse={1000}
        />
      </View>

      <View style={{ zIndex: 4000 }}>
        <Text style={styles.label}>Data</Text>
        <Pressable
          onPress={() => setMostrarPicker(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
          <Text>{format(data, 'dd/MM/yyyy')}</Text>
        </Pressable>
      </View>


      {mostrarPicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || data;
            setMostrarPicker(false);
            setData(currentDate);
          }}
        />
      )}

      <View style={{ zIndex: 3000 }}>
        <Text style={styles.label}>Serviço</Text>
        <DropDownPicker
          open={openServico}
          value={servicoSelecionado}
          items={itensServico}
          setOpen={setOpenServico}
          setValue={setServicoSelecionado}
          setItems={setItensServico}
          placeholder="Selecione o serviço"
          style={styles.dropdown}
          dropDownContainerStyle={{ backgroundColor: '#fff' }}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>

      <View style={{ zIndex: 2000 }}>
        <Text style={styles.label}>Horário</Text>
        <DropDownPicker
          open={openHora}
          value={hora}
          items={itensHora}
          setOpen={setOpenHora}
          setValue={setHora}
          setItems={setItensHora}
          placeholder="Selecione o horário"
          style={styles.dropdown}
          dropDownContainerStyle={{ backgroundColor: '#fff' }}
          zIndex={2000}
          zIndexInverse={1000}
        />
      </View>


      <Button title="Agendar" onPress={handleAgendar} />




      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.agendamento}>
            <Text>{item.nome} - {item.servicoSelecionado} às {item.hora} com {item.profissionalSelecionado}
            </Text>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  agendamento: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  dropdown: {
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 6,
  }



});
