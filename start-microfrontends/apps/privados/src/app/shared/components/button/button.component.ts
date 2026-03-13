import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'gob-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() type: ButtonType = 'button';
  @Input() className = 'btn-primary';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
