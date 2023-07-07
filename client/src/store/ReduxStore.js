import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import {reducers} from "../reducers";

function saveToLocalStorage(state){
    try{
        const serializedState = JSON.stringify(state);
        window.localStorage.setItem("state", serializedState);
    }
    catch(e){
        console.log(e);
    }
}

function loadFromLocalStorage(){
    try{
        const serializedState = window.localStorage.getItem("state");
        if(serializedState === null) return undefined;
        return JSON.parse(serializedState);
    }
    catch(e){
        console.log(e);
        return undefined;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; //to make the store available in the redux dev tools extension
const persistedState = loadFromLocalStorage();

const store = createStore(
    reducers,
    persistedState,
    composeEnhancers(applyMiddleware(thunk))
);

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store; 