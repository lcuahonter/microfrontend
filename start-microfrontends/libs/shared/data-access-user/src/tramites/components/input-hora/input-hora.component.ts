import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';

import { CommonModule } from '@angular/common';
import { HORA_PATTERN } from '../../constantes/regex.constants';
import { HoraFormatoDirective } from '../../directives/hora-formato/hora-formato.directive';
import { ValidacionesFormularioService } from '../../../core/services/shared/validaciones-formulario/validaciones-formulario.service';
@Component({
  selector: 'input-hora',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HoraFormatoDirective],
  templateUrl: './input-hora.component.html',
  styleUrl: './input-hora.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputHoraComponent),
      multi: true,
    },
  ],
})
export class InputHoraComponent implements OnChanges, ControlValueAccessor {
  /**
   * Etiqueta para mostrar junto al componente.
   */
  @Input() label: string = '';

  /**
   * Identificador único requerido para el input del componente.
   */
  @Input() inputId: string = '';

  /**
   * Indica si el input es obligatorio.
   */
  @Input() required!: boolean;

  /**
   * Indica si el input está deshabilitado.
   */ 
  @Input() disabled?: boolean = false;


  /**
   * Formulario reactivo que contiene el control 'hora'.
   */
  forma: FormGroup;

  /**
   * Valor del input 'hora'.
   */
  value: string = '';

  /**
   * Notificador para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  constructor(private validacionesService: ValidacionesFormularioService) {
    this.forma = new FormGroup({
      hora: new FormControl('', [Validators.pattern(HORA_PATTERN)]),
    });
  }

  /**
   * Detecta cambios en las propiedades de entrada y actualiza las validaciones del campo 'hora'.
   *
   * @param changes - Cambios detectados en las propiedades de entrada.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['required']) {
      if (this.required) {
        this.forma
          .get('hora')
          ?.setValidators([
            Validators.required,
            Validators.pattern(HORA_PATTERN),
          ]);
      } else {
        this.forma.get('hora')?.clearValidators();
      }
      this.forma.get('hora')?.updateValueAndValidity();
    }
  }

  /**
   * Maneja el evento de cambio de un input tipo text.
   *
   * @param event - Evento de cambio del text.
   * @returns void
   */
  // ✅ Implement `ControlValueAccessor`
  handleChange(event: Event): void {
    const VALUE = (event.target as HTMLSelectElement).value;
    this.onChange(VALUE);
  }

  /**
   * Escribe un valor string en el control de formulario 'hora'.
   *
   * @param value - Valor string a establecer en el control.
   * @returns void
   */
  writeValue(value: string): void {
    this.forma.controls['hora'].setValue(value);

    if (!value) {
      this.forma.controls['hora'].markAsUntouched();
      this.forma.controls['hora'].markAsPristine();
    }
  }

  /**
   * Registra una función que se ejecutará cuando el valor del control cambie.
   * @param fn - Función que se invoca al cambiar el valor del control.
   * @returns void
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
    this.forma.get('hora')?.valueChanges.subscribe(fn);
  }

  /**
   * Registra una función que se ejecutará cuando el control sea marcado como "tocado".
   * @param fn - Función que se ejecutará al marcar el control como tocado.
   * @returns void
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Verifica si el campo 'hora' del formulario tiene errores y ha sido tocado.
   * @returns {boolean | null | undefined} `true` si tiene errores y ha sido tocado, de lo contrario `false`, `null` o `undefined`.
   */
  get isValid(): boolean | null | undefined {
    return this.forma.get('hora')?.errors && this.forma.get('hora')?.touched;
  }

  /**
   * Verifica si el tipo de error es 'required' en el campo 'hora'.
   * @param {string} errorType - Tipo de error a verificar.
   * @returns {boolean} `true` si el error es 'required', de lo contrario `false`.
   */
  getTipoError(errorType: string): boolean | null | undefined {
    return (
      this.forma.get('hora')?.hasError(errorType) &&
      this.forma.get('hora')?.touched
    );
  }
}
