import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RowTypeFormInput } from '../../models/row-type-form-input.model';

/**
 * Componente para mostrar y gestionar un grupo de campos tipo fila en un formulario reactivo.
 * Permite emitir eventos cuando el valor de un campo cambia.
 */
@Component({
  selector: 'row-type-form-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './row-type-form-input.component.html',
  styleUrl: './row-type-form-input.component.scss',
})

export class RowTypeFormInputComponent {

  /** Campos que se mostrarán como fila en el formulario reactivo. */
  @Input() fields: RowTypeFormInput[] = [];

  /** Formulario reactivo que contiene los campos tipo fila. */
  @Input() form!: FormGroup;

  /** Evento que emite el cambio de valor de un campo tipo fila. */
  @Output() emitirValorDeCampo = new EventEmitter<{campo: string, valor: string | number }>();

  /** Emite el evento cuando el valor de un campo tipo fila cambia en el formulario reactivo. */
  enCambioDeCampo(event: Event, campo: string): void {
    this.emitirValorDeCampo.emit({
      campo: campo,
      valor: (event.target as HTMLInputElement).value
    });
  }
}
