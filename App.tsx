import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import HomeScreen from './sources/Home';
import NoteScreen from './sources/Note';
import Login from './sources/Login';
import Register from './sources/Register';
import { RootStackParamList, Screens } from './types';
import { ThemeProvider } from './sources/ThemeContext';

// Khai báo Stack
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {!user ? (
            <>
              <Stack.Screen
                name={Screens.Login}
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={Screens.Register}
                component={Register}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name={Screens.Home}
                component={HomeScreen}
                options={{
                  title: 'Ghi chú',
                  headerTitleAlign: 'left',
                }}
              />
              <Stack.Screen
                name={Screens.Note}
                component={NoteScreen}
                options={{
                  title: 'Chi tiết ghi chú',
                  headerTitleAlign: 'left',
                }}
              />
              <Stack.Screen
                name={Screens.Settings}
                component={require('./sources/Settings').default}
                options={{
                  title: 'Cài đặt',
                  headerTitleAlign: 'left',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;