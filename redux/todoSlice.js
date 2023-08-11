import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    todos: []
}

export const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setTodosReducer: (state, action) => {
            state.todos = action.payload
        },
        addTodoReducer: (state, action) => {
            state.todos.push(action.payload)
        },
        hideCompletedReducer: (state) => {
            state.todos = state.todos.filter((todo) => !todo.isCompleted)
        },
        updateTodoReducer: (state, action) => {
            state.todos = state.todos.map(todo => {
                if(todo.id === action.payload) {
                    return {...todo, isCompleted: !todo.isCompleted}
                }
                return todo
            })
        },
        deleteTodoReducer: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload)
        }
    }
})

export const {
    addTodoReducer,
    setTodosReducer,
    deleteTodoReducer,
    updateTodoReducer,
    hideCompletedReducer,
} = todoSlice.actions

export default todoSlice.reducer
