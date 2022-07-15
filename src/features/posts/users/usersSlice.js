import { createSlice } from "@reduxjs/toolkit";

// initialState is the hardcoded list of users similar to initialState in the postsSlice which has two hardcoded posts
const initialState = [
    { id: '0', name: 'Mia Thermopolis' },
    { id: '1', name: 'Michael Moscovitz' },
    { id: '2', name: 'Tina Hakim Baba' },
]

const usersSlice = createSlice ({
    name: 'users',
    initialState,
    reducers: {}
})

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer