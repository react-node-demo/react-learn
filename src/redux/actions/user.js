import { UPDATE_USERINFO, CLEAR_USERINFO } from '../constants/user';

export const updateUserInfo = (data) => ({ type: UPDATE_USERINFO, payload: data })
export const clearUserInfo = (data) => ({ type: CLEAR_USERINFO, payload: data })