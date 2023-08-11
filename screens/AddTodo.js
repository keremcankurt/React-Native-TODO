import { useState } from 'react';
import {StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addTodoReducer } from '../redux/todoSlice';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import moment from 'moment';
import * as Notifications from 'expo-notifications'

export default function AddTodo() {
  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date())
  const [isToday, setIsToday] = useState(false)
  const [withAlert, setWithAlert] = useState(false)
  const [openHour, setOpenHour] = useState(false)
  const listTodos = useSelector(state => state.todo.todos)

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const addTodo = async() => { 
    const tomorrowDate = new Date();
    tomorrowDate.setDate(date.getDate() + 1);

    const adjustedDate = isToday ? date.toISOString() : tomorrowDate.toISOString();

    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      text: name,
      hour: isToday ? date.toISOString() : adjustedDate,
      isToday: isToday,
      isCompleted: false,
    }
    console.log(newTodo)
    try {
      await AsyncStorage.setItem('@Todos', JSON.stringify([...listTodos, newTodo]))
      dispatch(addTodoReducer(newTodo))
      withAlert && await scheduleTodoNotification(newTodo)
      Toast.show({
        type: 'success',
        text1: 'Add Todo',
        text2: 'Todo Added successfully',
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
      navigation.goBack()
    } catch (error) {
      
    }
  }
  const scheduleTodoNotification = async(todo) => {
    const trigger = new Date(todo.hour)
    try{
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "It's time!",
          body: todo.text,
        },
        trigger,
      })
    } catch(error) {
      alert('The notification failed to schedule, make sure the hour is valid')
    }
  }
  return (
    <View style={styles.container}>
        <Text style={styles.title}>
          Add Task
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>
            Name
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder='Task'
            placeholderTextColor='#00000030'
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>
            Hour
          </Text>
          <TouchableOpacity onPress={() => setOpenHour(true)} style={styles.timeButton}>
            <Text style={{color: 'white'}}>
             {moment(date).format('LT')}
            </Text>
          </TouchableOpacity>
          {
            openHour &&
            <DateTimePicker
              value={date}
              mode={'time'}
              ia24Hour={true}
              onChange={(event, selectedDate) => { setTimeout(() => (setDate(selectedDate)),1);setOpenHour(false); event.nativeEvent()}}
              style={{width: '10% !important'}}
            />
          }
        </View>
        <View style={[styles.inputContainer, {alignItems: 'center'}]}>
          <View>
            <Text style={styles.inputTitle}>
              Today
            </Text>
            <Text style={{maxWidth: '85%', color: '#00000040', fontSize: 12}}>If you disable today, the task will be considered as tomorrow</Text>
          </View>
          <Switch
            value={isToday}
            onValueChange={(value) => setIsToday(value)}
          />
        </View>
        <View style={[styles.inputContainer, {alignItems: 'center'}]}>
          <View>
            <Text style={styles.inputTitle}>
              Alert
            </Text>
            <Text style={{maxWidth: '85%', color: '#00000040', fontSize: 12}}>You will receive an alert at the time you set for this reminder</Text>
          </View>
          <Switch
            value={withAlert}
            onValueChange={(value) => setWithAlert(value)}
          />
        </View>
          <TouchableOpacity onPress={addTodo} style={styles.button}>
            <Text style={{color: 'white'}}>Done</Text>
          </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 35,
    marginTop: 10,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24
  },
  textInput: {
    borderBottomColor: '#00000030',
    borderBottomWidth: 1,
    width: '80%'
  },
  inputContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 30
  },
  timeButton: {
    backgroundColor: '#CACACA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  button:{
    marginTop: 30,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    height: 46,
    borderRadius: 11,
  }
});
