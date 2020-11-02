import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a`,
};
const allCocktail = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a`;
const categoryList = `https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`;
const glassesList = `https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list`;
const ingredientsList = `https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list`;
const alcoholicList = `https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list`;
const filterCoktailUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php`;
export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}
export interface Ifilter {
  // The quote's category: 'dev', 'explicit'...
  alcoholic: string;
  glasses: string;
  categories: string;
  ingredients: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private httpClient: HttpClient) {}

  getRandomQuote(): Observable<Array<Object>> {
    return this.httpClient.get(allCocktail).pipe(
      map((body: any) => body.drinks),
      catchError(() => of('Error, could not load joke :-('))
    );
  }
  requestDataFromMultipleSources(): Observable<any[]> {
    let response1 = this.httpClient.get(categoryList);
    let response2 = this.httpClient.get(glassesList);
    let response3 = this.httpClient.get(ingredientsList);
    let response4 = this.httpClient.get(alcoholicList);
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([response1, response2, response3, response4]);
  }
  filterCocktail(filterObj: Ifilter): Observable<Array<Object>> {
    const createFilterurl =
      filterCoktailUrl +
      `?${filterObj.categories ? `&c=${filterObj.categories}` : ''}${
        filterObj.glasses ? `&g=${filterObj.glasses}` : ''
      }${filterObj.alcoholic ? `&a=${filterObj.alcoholic}` : ''}${
        filterObj.ingredients ? `&i=${filterObj.ingredients}` : ''
      }`;
    return this.httpClient.get(createFilterurl).pipe(
      map((body: any) => body.drinks),
      catchError(() => of('Error, could not load joke :-('))
    );
  }
}
