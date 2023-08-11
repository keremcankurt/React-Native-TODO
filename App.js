import Home from './screens/Home';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import AddTodo from './screens/AddTodo';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import  Toast  from 'react-native-toast-message';
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";

const Stack = createStackNavigator()
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator  screenOptions={{
        gestureEnabled: true,
        headerShown: false,
        ...(TransitionPresets.ModalPresentationIOS),
      }}>
          <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
          <Stack.Screen name='AddTodo' component={AddTodo} options={
            {presentation: 'modal', 
            title: 'Add Todo', 
            animation: 'slide_from_bottom',
            }}/>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast/>
    </Provider>
  );
}
