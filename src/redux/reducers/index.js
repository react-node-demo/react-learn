import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import MenusReducer from './menus'
import UserReducer from './user'

const reducers = combineReducers({
    MenusReducer,
    UserReducer: persistReducer({
        key: 'user',
        storage,
        whitelist: ['userInfo'], // reducer里持久化的数据,除此外均为不持久化数据，[]表示都不持久化
    }, UserReducer)
})


export default reducers