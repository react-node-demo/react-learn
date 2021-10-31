import initialState from '../states/menus';
import { UPDATE_MENUS, DEL_MENU, EDIT_MENU } from '../constants/menus'
import { filterArray } from '@/assets/utils/index'

const recuder = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case UPDATE_MENUS:
            return {
                ...state,
                menus: filterArray([...state.menus, ...payload], 'id')
            }
        case DEL_MENU:
            for (let i=state.menus.length-1; i>=0; i--) {
                if (state.menus[i].id === payload.id) {
                    state.menus.splice(i, 1)
                }
            }

            return {
                ...state,
                menus: [...state.menus]
            }
        case EDIT_MENU:
            for (let i=state.menus.length-1; i>=0; i--) {
                if (state.menus[i].id === payload.id) {
                    state.menus.splice(i, 1, payload)
                }
            }

            return {
                ...state,
                menus: [...state.menus]
            }
        default:
            return state;
    }
}

export default recuder

