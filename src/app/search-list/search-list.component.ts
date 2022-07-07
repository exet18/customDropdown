import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {SearchItem} from "../search-item";

const ARROW_DOWN_CODE = 40;
const ARROW_UP_CODE = 38;
const ENTER_CODE = 13;

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchListComponent {
  @ViewChildren('items') items: QueryList<ElementRef>;

  @ViewChild('list') list: ElementRef;

  @Input() searchList: SearchItem[];

  @Input() height: number;

  @Output() onSelected = new EventEmitter();

  private keyDownCounter = -1;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case ARROW_UP_CODE: {
        this.arrowUp();
        break;
      }
      case ARROW_DOWN_CODE: {
        this.arrowDown();
        break;
      }
      case ENTER_CODE: {
        this.chooseItem();
        break;
      }
    }
  }

  chooseItem(): void {
    const selectedItem = this.items.filter(item => item.nativeElement.classList.contains('selected-search-item'))[0];

    if (!selectedItem) {
      return;
    }
    const selectedItemIdNumber = this.getOptionIdNumber(selectedItem.nativeElement.id);

    this.onSelected.emit(this.searchList[selectedItemIdNumber].title);
  }

  private arrowUp(): void {
    this.keyDownCounter--;

    if (this.keyDownCounter < 0) {
      this.keyDownCounter = this.searchList.length - 1;
    }

    this.changeSelectedOption(this.keyDownCounter);
  }

  private arrowDown(): void {
    this.keyDownCounter++;

    if (this.keyDownCounter > this.searchList.length - 1) {
      this.keyDownCounter = 0;
    }

    this.changeSelectedOption(this.keyDownCounter);
  }

  private changeSelectedOption(elementIndex: number) {
    this.items.forEach((element, index) => {
      if (element.nativeElement.classList.contains('selected-search-item')) {
        element.nativeElement.classList.remove('selected-search-item');
      } else if (elementIndex === index) {

        this.list.nativeElement.scrollTo({
          top: element.nativeElement.offsetTop,
          behavior: "smooth"
        })

        element.nativeElement.classList.add('selected-search-item');
      }
    })
  }

  private getOptionIdNumber(id: string): number {
    return Number(id.replace(/\D/g, ''));
  }
}
