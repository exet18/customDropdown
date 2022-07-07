import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {FocusState} from "./focus-state";

@Directive({
  selector: '[appFocusState]'
})
export class FocusStateDirective {

  @Output() onChangeFocus = new EventEmitter<FocusState>();

  @HostListener("focus")
  emmitInputFocus(): void {
    this.onChangeFocus.emit({isFocus: true});
  }

  @HostListener("blur")
  emmitInputFocusOut(): void {
    this.onChangeFocus.emit({isFocus: false});
  }
}
