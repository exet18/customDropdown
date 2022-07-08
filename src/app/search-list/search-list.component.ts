import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {SearchItem} from "../search-item";
import {fromEvent, Subject, takeUntil, tap} from "rxjs";

const ARROW_DOWN_CODE = 'ArrowDown';
const ARROW_UP_CODE = 'ArrowUp';
const ENTER_CODE = 'Enter';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchListComponent implements OnDestroy, AfterViewInit {
  selectedOptionIndex = -1;
  private destroy$ = new Subject<void>();

  @ViewChild('listContainer') listContainer: ElementRef<HTMLDivElement>;
  @ViewChildren('option') optionList: QueryList<ElementRef<HTMLDivElement>>;
  @Input() searchList: SearchItem[];
  @Input() height: number;
  @Output() onSelected = new EventEmitter<string>();

  constructor(private readonly cdr: ChangeDetectorRef) {
  }

  chooseItem(index?: number): void {
    if (index) {
      this.selectedOptionIndex = index;
    }

    if (!this.selectedOptionIndex) {
      return;
    }

    this.onSelected.emit(this.searchList[this.selectedOptionIndex].title);
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(window, 'keydown').pipe(
      tap(({key}) => this.chooseAction(key)),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private arrowUp(): void {
    this.selectedOptionIndex--;

    if (this.selectedOptionIndex < 0) {
      this.selectedOptionIndex = this.searchList.length - 1;
    }
    this.scrollContainer();
    this.cdr.markForCheck();
  }

  private arrowDown(): void {
    this.selectedOptionIndex++;

    if (this.selectedOptionIndex > this.searchList.length - 1) {
      this.selectedOptionIndex = 0;
    }
    this.scrollContainer();
    this.cdr.markForCheck();
  }

  private scrollContainer() {
    const selectedOption = this.optionList.get(this.selectedOptionIndex)?.nativeElement;

    if (selectedOption) {
      this.listContainer.nativeElement.scrollTop = selectedOption.offsetTop;
    }
  }

  private chooseAction(code: string) {
    switch (code) {
      case ARROW_UP_CODE:
        this.arrowUp();
        break;
      case ARROW_DOWN_CODE:
        this.arrowDown();
        break;
      case ENTER_CODE:
        this.chooseItem();
        break;
    }
  }
}
