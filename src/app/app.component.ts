import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {SearchService} from "./search.service";
import {debounceTime, filter, switchMap, tap} from "rxjs";
import {Search} from "./search";
import {SearchItem} from "./search-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  search = new FormControl();
  searchResult: SearchItem[];

  constructor(private readonly searchService: SearchService) {
    this.search.valueChanges.pipe(
      filter(value => value !== ''),
      debounceTime(300),
      switchMap(search => this.searchService.getSearchResults(search)),
      tap(({items}: Search) => this.searchResult = items)
    ).subscribe();
  }
}
