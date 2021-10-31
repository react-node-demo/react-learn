import { createStore } from 'redux'
import { persistStore } from 'redux-persist';

import reducers from './reducers/index'

const store = createStore(reducers)
export const persistor = persistStore(store)

export default store