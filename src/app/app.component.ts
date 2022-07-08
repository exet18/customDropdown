import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {FormControl} from "@angular/forms";
import {SearchService} from "./search.service";
import {debounceTime, filter, fromEvent, Subject, switchMap, takeUntil, tap} from "rxjs";
import {Search} from "./search";
import {SearchItem} from "./search-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit{
  search = new FormControl();
  searchResult: SearchItem[] = [];
  private isFocus = false;
  @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement>;


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

  ngAfterViewInit(): void {
    fromEvent<MouseEvent>(document, 'click').pipe(
      tap(event => {
        this.isFocus = event.target === this.inputElement.nativeElement;
        this.cdr.markForCheck();
      }),
    ).subscribe();
  }

  selectOption(name: string): void {
    this.search.setValue(name, {emitEvent: false});
    this.searchResult = [];
  }
}
