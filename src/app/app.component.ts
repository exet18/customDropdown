import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener} from '@angular/core';
import {FormControl} from "@angular/forms";
import {SearchService} from "./search.service";
import {debounceTime, filter, switchMap, tap} from "rxjs";
import {Search} from "./search";
import {SearchItem} from "./search-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  search = new FormControl();
  searchResult: SearchItem[] = [];
  isFocus: boolean;

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const element = (event.target as HTMLElement);
    this.isFocus = element.classList.contains('search-input') ||
      element.classList.contains('search-item-text') || element.classList.contains('search-item');
  }


  get isVisible(): boolean {
    return this.searchResult.length > 0 && this.isFocus && this.search.value;
  }

  constructor(private readonly searchService: SearchService, private readonly cdr: ChangeDetectorRef) {
    this.search.valueChanges.pipe(
      tap(() => this.searchResult = []),
      filter(value => value !== ''),
      debounceTime(300),
      switchMap(search => searchService.getSearchResults(search)),
      tap(({items}: Search) => {
        this.searchResult = items;
        cdr.markForCheck();
      }),
    ).subscribe();
  }

  selectOption(name: string): void {
    this.search.setValue(name, {emitEvent: false});
    this.searchResult = [];
  }
}
