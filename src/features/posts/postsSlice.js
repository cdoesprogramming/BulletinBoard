// This file is where you divide up the state.
import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
    posts: [],
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

// createAsyncThunk accepts two arguments. 1. a string that is used as the prefix for
// the generated action type
// 2. a payload creator callback this function should return a promise 
// that contains some data or a rejected promise with an error
// The callback is async and we make a request to axios url and get a response with the data. We get the 
// data from jsonplaceholder which is a fake api that accepts post and get requests. We can send and receive
// responses.

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost){
                existingPost.reactions[reaction]++
            }
        }
    },
    // Sometimes a slice reducers needs to respond to other actions that weren't defined as part of the slice's reducer
    // builder parameter is an object that lets us define additional case reducers that run in response to actions defined outside of the slice
    extraReducers(builder) {
        builder
        // the cases are listening for the promise status action types dispatched by the fetch posts thunk 
        //  I respond by setting state accordingly
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            // if a promise is pending I set the state status to loading
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                // if the promise is fulfilled I set the status to succeeded
                let min = 1;  // defining a minute variable
                const loadedPosts = action.payload.map(post => {
                    // mapping over the loadedPosts from the action payload because the fake api doesn't have the date data that we need
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    // we set the date with the sub function and increasing the minutes for each post
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    // the post reactions are not coming from the api. They just needed to be added and then the post returned
                    return post;
                });

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })    
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
    }
})

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const { postAdded, reactionAdded } = postSlice.actions

export default postSlice.reducer