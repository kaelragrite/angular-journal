import {User} from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.AUTH_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user,
        authError: null,
        loading: false
      };
    case AuthActions.AUTH_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      }
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}
