import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {Entypo} from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateTodoReducer } from '../redux/todoSlice';

export default function Checkbox({
    id,
    text,
    hour,
    isToday,
    isCompleted,
}){
    const dispatch = useDispatch()
    const listTodos = useSelector(state => state.todo.todos)

    const handleCheckbox = () => {
        try {
            dispatch(updateTodoReducer(id))
            AsyncStorage.setItem('@Todos', JSON.stringify(
                listTodos.map(todo => {
                    if(todo.id === id) {
                        return {...todo, isCompleted: !todo.isCompleted}
                    }
                    
                    return todo
                })
            ))
        } catch (error) {
            
        }
    }
    return isToday ? (
        <TouchableOpacity style={isCompleted ? styles.checked : styles.unChecked} onPress={handleCheckbox}>
            {isCompleted && <Entypo name='check' size={16} color='#FAFAFA'/>}
        </TouchableOpacity>
    )
    :
    (
        <View style={styles.isToday}>

        </View>
    )
}

const styles = StyleSheet.create({
    checked: {
        width: 20,
        height: 20,
        marginRight: 13,
        borderRadius: 6,
        backgroundColor: '#262626',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .3,
        shadowRadius: 5,
        elevation: 5,
    },
    unChecked: {
        width: 20,
        height: 20,
        marginRight: 13,
        borderWidth: 2,
        borderRadius: 6,
        backgroundColor: '#fff',
        marginLeft: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
        elevation: 5,
    },
    isToday: {
        width: 10,
        height: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#262626',
        marginRight: 13,
        marginLeft: 15,
    }
})