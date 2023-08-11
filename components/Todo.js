import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Checkbox from './Checkbox';
import { useState } from 'react';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux';
import { deleteTodoReducer } from '../redux/todoSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Todo({
    id,
    text,
    hour,
    isToday,
    isCompleted,
}){
    const [thisTodoIsToday, setThisTodoIsToday] = hour ? 
    useState(moment(new Date(hour)).isSame(moment(), 'day')) : 
    useState(false)

    const [localHour, setLocalHour] = useState(new Date(hour))
    const listTodos = useSelector(state => state.todo.todos)
    
    const dispatch = useDispatch()
    const handleDeleteTodo = async () => {
        dispatch(deleteTodoReducer(id))
        await AsyncStorage.setItem('@Todos', JSON.stringify(listTodos.filter(todo => todo.id !== id)))
    }
    
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Checkbox
                    id={id}
                    text={text}
                    hour={hour}
                    isToday={thisTodoIsToday}
                    isCompleted={isCompleted}
                    
                />
                <View>
                    <Text 
                        style={isCompleted ? [styles.text, {textDecorationLine: 'line-through', color: '#73737330'}] : styles.text }
                    >{text}</Text>
                    <Text 
                        style={isCompleted ? [styles.time, {textDecorationLine: 'line-through', color: '#73737330'}] : styles.time }
                    >{moment(localHour).format('LT')}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={handleDeleteTodo}>
                <MaterialIcons name='delete-outline' size={24} style={{position: 'absolute', right: 0, top: -20}} color='#73737340'/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
        color: '#737373',
    },
    time: {
        fontSize: 13,
        color: '#a3a3a3',
        fontWeight: '500'
    }
})