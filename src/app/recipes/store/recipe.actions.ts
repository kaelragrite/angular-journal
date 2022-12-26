import {Action} from '@ngrx/store';

import {Recipe} from "../recipe.model";

export const SET_RECIPES = 'SET_RECIPES';
export const FETCH_RECIPES = 'FETCH_RECIPES';
export const ADD_RECIPE = 'ADD_RECIPE';
export const UPDATE_RECIPE = 'UPDATE_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const STORE_RECIPES = 'STORE_RECIPES';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {
  }
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {
  }
}

export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;

  constructor(public payload: { index: number; recipe: Recipe[] }) {
  }
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) {
  }
}

export class StoreRecipes implements Action {
  readonly type = STORE_RECIPES;
}

export type RecipesActions =
  | SetRecipes
  | FetchRecipes
  | AddRecipe
  | UpdateRecipe
  | DeleteRecipe
  | StoreRecipes;


// private recipes: Recipe[] = [
//   new Recipe(
//     'Schnitzel',
//     'A super-tasty Schnitzel!',
//     'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
//     [
//       new Ingredient('Meat', 1),
//       new Ingredient('French Fries', 20)
//     ]),
//   new Recipe(
//     'Big Fat Burger',
//     'What else you need to say?>',
//     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
//     [
//       new Ingredient('Buns', 2),
//       new Ingredient('Meat', 2)
//     ])
// ];
