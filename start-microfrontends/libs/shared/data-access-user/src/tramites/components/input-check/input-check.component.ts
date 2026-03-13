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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-input-check',
  standalone: true,
  templateUrl: './input-check.component.html',
  styleUrl: './input-check.component.scss',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckComponent),
      multi: true,
    },
  ],
})
export class InputCheckComponent implements OnChanges, ControlValueAccessor {
  /**
   * Identificador único requerido para el checkbox del componente.
   * @required
   * @type {string}
   */
  @Input({ required: true }) id!: string;

  /**
   * Etiqueta para mostrar junto al componente.
   * @required
   * @type {string}
   */
  @Input({ required: true }) label!: string;

  /**
   * Indica si el checkbox es obligatorio.
   * @required
   * @type {boolean}
   */
  @Input({ required: true }) required!: boolean;

  /**
   * Indica si el checkbox está deshabilitado.
   * @required
   * @type {boolean}
   */
  @Input() isDisabled: boolean = false;

  /**
   * Indica la clase CSS que se aplicará al checkbox.
   * Si reverse es verdadero, se aplicará la clase ''form-check-custome', que pone el checkbox al final
   * de la etiqueta label.
   * Por default la clase es 'form-check', donde el checkbox se encuentra al inicio de la etiqueta label.
   */
  @Input() reverse!: boolean;
  
  @Input() fontWeight!: boolean;

  /**
   * Control de formulario que contiene el estado del checkbox.
   */
  forma: FormGroup;

  constructor() {
    this.forma = new FormGroup({
      check: new FormControl(false),
    });
  }

  /**
   * Función de callback que se ejecuta cuando el valor cambia.
   * @param value Indica el nuevo valor booleano.
   */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  private onChange: (value: boolean) => void = () => {};

  /**
   * Función que se llama cuando el control es marcado como "tocado".
   * @returns void
   */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  /**
   * Detecta cambios en las propiedades de entrada y actualiza las validaciones del control de formulario 'checkbox'.
   *
   * @param changes - Cambios detectados en las propiedades de entrada.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['required']) {
      const CONTROL = this.forma.get('check');
      if (this.required) {
        CONTROL?.setValidators([Validators.requiredTrue]);
      } else {
        CONTROL?.clearValidators();
      }
      CONTROL?.updateValueAndValidity();
    }

    if (changes['isDisabled']) {
      const CONTROL = this.forma.get('check');
      if (this.isDisabled) {
        CONTROL?.disable(); // Desactiva el control
      } else {
        CONTROL?.enable(); // Activa el control
      }
      CONTROL?.updateValueAndValidity();
    }
  }

  /**
   * Maneja el evento de cambio de un input tipo checkbox.
   *
   * @param event - Evento de cambio del checkbox.
   * @returns void
   */
  handleChange(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).checked;
    this.onChange(VALUE);
  }

  /**
   * Escribe un valor booleano en el control de formulario 'check'.
   *
   * @param value - Valor booleano a establecer en el control.
   * @returns void
   */
  writeValue(value: boolean): void {
    this.forma.controls['check'].setValue(value);
  }

  /**
   * Registra una función de callback que se ejecutará cuando el valor del control cambie.
   * @param fn - Función que recibe el nuevo valor booleano del control.
   * @returns void
   */
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
    this.forma.get('check')?.valueChanges.subscribe(fn);
  }

  /**
   * Registra una función que se ejecutará cuando el control sea marcado como "tocado".
   * @param fn - Función que se invoca al marcar el control como tocado.
   * @returns void
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Verifica si el campo 'check' del formulario tiene errores y ha sido tocado.
   * @returns {boolean | null | undefined} `true` si tiene errores y ha sido tocado, de lo contrario `false`, `null` o `undefined`.
   */
  get isValid(): boolean | null | undefined {
    return this.forma.get('check')?.errors && this.forma.get('check')?.touched;
  }
}
