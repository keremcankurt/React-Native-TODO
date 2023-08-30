import { Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TodoList from '../components/TodoList';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setTodosReducer } from '../redux/todoSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'
import moment from 'moment';


Notifications.setNotificationHandler({
  handleNotification: async() => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: true
  })
})
export default function Home() {
    const todos = useSelector(state => state.todo.todos)
    const dispatch = useDispatch()

    const navigation = useNavigation()
    useEffect(() => {
      const getTodos = async () => {
        try {
          const todos = await AsyncStorage.getItem('@Todos')
          if(todos !== null){
            const todosData = JSON.parse(todos)
            const todosDataFiltered = todosData.filter(todo => {
              return moment(new Date(todo.hour)).isSameOrAfter(moment(), 'day')
            })
            if(todosDataFiltered !== null){
              await AsyncStorage.setItem('@Todos', JSON.stringify(todosDataFiltered))
              dispatch(setTodosReducer(JSON.parse(todosDataFiltered)))
            }
          }
        } catch (error) {
        }
      }
      getTodos()
    },[])
  return (
    <View style={styles.container}>
        <Image
            source={require('../assets/user.jpg')}
            style={styles.pic}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={styles.title}>Today</Text> 
        </View>
        <TodoList todosData={todos.filter((todo) => moment(new Date(todo.hour)).isSame(moment(), 'day'))}/>
        <Text style={styles.title}>Tomorrow</Text>
        <TodoList todosData={todos.filter((todo) => moment(new Date(todo.hour)).isAfter(moment(), 'day'))}/>
        <TouchableOpacity onPress={() => navigation.navigate('AddTodo')} style={styles.button}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 70,
  },
  pic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignSelf: 'flex-end'
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 35,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 30,
    right: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: .5,
    shadowRadius: 5,
    elevation: 5
  },
  plus: {
    fontSize: 40,
    color: '#fff',
    position: 'absolute',
    top: -9,
    left: 9
  }
  
});
