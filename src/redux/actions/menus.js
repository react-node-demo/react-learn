import { UPDATE_MENUS, DEL_MENU, EDIT_MENU } from '../constants/menus'

export const updateMenus = (data) => ({ type: UPDATE_MENUS, payload: data })

export const delMenu = (data) => ({ type: DEL_MENU, payload: data })

export const editMenu = (data) => ({ type: EDIT_MENU, payload: data })