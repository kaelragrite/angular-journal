import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {map, switchMap, withLatestFrom} from "rxjs";

import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import {Recipe} from "../recipe.model";
import {Store} from "@ngrx/store";

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes$ = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(_ => {
      return this.http.get<Recipe[]>('https://ng-coursep-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }),
    map(recipes => new RecipesActions.SetRecipes(recipes))
  );

  @Effect({dispatch: false})
  storeRecipes$ = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([_, recipesState]) => {
      return this.http.put('https://ng-coursep-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipesState.recipes)
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {
  }
}
