import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-requerido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-requerido.component.html',
  styleUrl: './error-requerido.component.scss',
})
export class ErrorRequeridoComponent {
  @Input() form!: AbstractControl;
}
