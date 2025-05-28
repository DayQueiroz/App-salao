import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditarAgendamentoScreen from './screens/EditarAgendamentoScreen';

import LoginScreen from './screens/LoginScreen';
import AgendamentosScreen from './screens/AgendamentosScreen';

import NovoAgendamentoScreen from './screens/NovoAgendamentoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Agendamentos" component={AgendamentosScreen} />
        <Stack.Screen name="NovoAgendamento" component={NovoAgendamentoScreen} />
        <Stack.Screen name="EditarAgendamento" component={EditarAgendamentoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
