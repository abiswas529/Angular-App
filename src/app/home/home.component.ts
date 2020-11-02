import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: Array<Object> | undefined;
  isLoading = false;
  filterForm!: FormGroup;
  categoryList: Array<Object> | undefined;
  glassesList: Array<Object> | undefined;
  ingredientsList: Array<Object> | undefined;
  alcoholicList: Array<Object> | undefined;

  constructor(private quoteService: QuoteService, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.isLoading = true;
    this.quoteService
      .getRandomQuote()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote) => {
        debugger;
        this.quote = quote.map((item: any) => {
          const ingredientsKey = Object.keys(item).filter((i) => i.indexOf('strIngredient') > -1 && item[i]);
          const ingredientsValue: any = [];
          ingredientsKey.forEach((i) => {
            ingredientsValue.push(item[i]);
          });
          const cObj = {
            ...item,
            ingredientsArray: ingredientsValue,
          };
          return cObj;
        });
      });
    this.quoteService.requestDataFromMultipleSources().subscribe((filteObj) => {
      this.categoryList = filteObj[0].drinks;
      this.glassesList = filteObj[1].drinks;
      this.ingredientsList = filteObj[2].drinks;
      this.alcoholicList = filteObj[3].drinks;
    });
  }
  filterData(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.quoteService
      .filterCocktail(this.filterForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote) => {
        this.quote = quote.map((item: any) => {
          const ingredientsKey = Object.keys(item).filter((i) => i.indexOf('strIngredient') > -1 && item[i]);
          const ingredientsValue: any = [];
          ingredientsKey.forEach((i) => {
            ingredientsValue.push(item[i]);
          });
          const cObj = {
            ...item,
            ingredientsArray: ingredientsValue,
          };
          return cObj;
        });
      });
  }
  private createForm() {
    this.filterForm = this.formBuilder.group({
      categories: [''],
      glasses: [''],
      ingredients: [''],
      alcoholic: [''],
    });
  }
}
