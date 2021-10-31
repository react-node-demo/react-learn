import initialState from '../states/user';
import { UPDATE_USERINFO, CLEAR_USERINFO } from '../constants/user';

const reducer = (state = initialState, action) => {
    const { type,  payload } = action

    switch (type) {
        case UPDATE_USERINFO:
            return {
                ...state,
                userInfo: { ...state.userInfo, ...payload }
            }
        case CLEAR_USERINFO:
            return {
                ...state,
                userInfo: null
            }
        default:
            return state
    }
}

export default reducer