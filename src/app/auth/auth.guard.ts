import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {map, Observable, take} from "rxjs";
import {AuthService} from "./auth.service";
import * as fromApp from "../store/app.reducer";

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      map(user => {
        if (!!user) return true;
        return this.router.createUrlTree(['/auth']);
      }));
  }
}
