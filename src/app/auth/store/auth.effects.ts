import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient} from "@angular/common/http";
import {catchError, map, of, switchMap, tap} from "rxjs";

import * as AuthActions from "./auth.actions";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {User} from "../user.model";
import {AuthService} from "../auth.service";

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
          map(handleAuthentication),
          catchError(handleError)
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
          map(handleAuthentication),
          catchError(handleError)
        );
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthSuccess) => {
      if (authSuccessAction.payload.redirect)
        this.router.navigate(['/']);
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const user: {
        email: string;
        id: string;
        _token: string;
        _tokenExpiration: string;
      } = JSON.parse(localStorage.getItem('userData'));

      if (!user) return {type: 'DUMMY'};

      const loadedUser = new User(user.email, user.id, user._token, new Date(user._tokenExpiration));
      if (loadedUser.token) {
        this.authService.setLogoutTimer(new Date(user._tokenExpiration).getTime() - new Date().getTime());
        return new AuthActions.AuthSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(user._tokenExpiration),
          redirect: false
        });
      }
      return {type: 'DUMMY'};
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }
}

const handleAuthentication = (resData: AuthResponseData) => {
  const expiration = new Date(new Date().getTime() + +resData.expiresIn * 1000);

  const user = new User(resData.email, resData.localId, resData.idToken, expiration);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthSuccess({
    email: resData.email,
    userId: resData.localId,
    token: resData.idToken,
    expirationDate: expiration,
    redirect: true
  });
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';

  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthFail(errorMessage));
  }

  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists!';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Email not found!';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Incorrect password!';
      break;
  }
  return of(new AuthActions.AuthFail(errorMessage));
}

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
