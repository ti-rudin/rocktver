import { writable } from 'svelte/store'
import { browser } from '$app/env';

const isAuthenticated_defaultValue = false;
const isAuthenticated_initialValue = browser ? window.localStorage.getItem('isAuthenticated') ?? isAuthenticated_defaultValue : isAuthenticated_defaultValue;
 
export const isAuthenticated = writable(isAuthenticated_initialValue);
//isAuthenticated.subscribe((value) => localStorage.isAuthenticated = String(value))

//interface User {
//    id: string,
//    bdate: string,
//    name: string,
//    photo: string,
//    city: string,
//    country: string,
//    followers_count: string,
//    sex: string
//}


const user_defaultValue = {};
const user_initialValue = browser ? window.localStorage.getItem('user') ?? user_defaultValue : user_defaultValue;
 
export const user = writable(user_initialValue);


//export const user = writable(JSON.parse(localStorage.getItem('user')))

//user.subscribe((value) => localStorage.user = JSON.stringify(value))



//export const isAuthenticated = writable(false)
//export const user = writable({})
export const popupOpen = writable(false)
export const error = writable()
