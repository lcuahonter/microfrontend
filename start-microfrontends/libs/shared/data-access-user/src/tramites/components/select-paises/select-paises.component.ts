import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CatalogoPaises } from '../../../core/models/shared/catalogos.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-paises',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-paises.component.html',
  styleUrl: './select-paises.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectPaisesComponent),
      multi: true,
    },
  ],
  host: {},
})
export class SelectPaisesComponent implements ControlValueAccessor, OnChanges {
  @Input() id!: string;
  @Input() catalogosPaises!: CatalogoPaises[];
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() isDisabled!: boolean;
  @Input() required!: boolean;

  formSelect: FormGroup;
  value: string = '';

  constructor(private fb: FormBuilder) {
    this.formSelect = this.fb.group({
      selectControl: [''],
    });
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line class-methods-use-this, no-empty-function, @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  /**
   * Detecta cambios en las propiedades de entrada y actualiza las validaciones
   * o el estado del control del formulario según corresponda.
   *
   * @param changes - Objeto que contiene los cambios en las propiedades de entrada.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['required']) {
      if (this.required) {
        this.formSelect
          .get('selectControl')
          ?.setValidators([Validators.required]);
      } else {
        this.formSelect.get('selectControl')?.clearValidators();
      }
      this.formSelect.get('selectControl')?.updateValueAndValidity();
    }

    if (changes['isDisabled']) {
      const CONTROL = this.formSelect.get('selectControl');
      if (CONTROL) {
        if (this.isDisabled) {
          CONTROL.disable();
        } else {
          CONTROL.enable();
        }
      }
    }
  }

  /**
   * Maneja el evento de cambio en un elemento select.
   *
   * @param event - Evento de cambio del elemento select.
   * @returns void
   */
  handleChange(event: Event): void {
    const VALUE = (event.target as HTMLSelectElement).value;
    this.onChange(VALUE);
  }

  /**
   * Escribe un valor en el control del formulario.
   *
   * @param value - El valor a establecer en el control.
   * @returns void
   */
  writeValue(value: string): void {
    if (value) {
      this.formSelect.get('selectControl')?.setValue(value);
    }
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @returns {boolean | null} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(): boolean | null {
    const CONTROL = this.formSelect.get('selectControl');
    return CONTROL ? CONTROL.invalid && CONTROL.touched : null;
  }

  /**
   * Registra una función de callback que se ejecuta cuando el valor cambia.
   * @param fn - Función callback que recibe el nuevo valor como argumento.
   * @returns void
   */
  registerOnChange(fn: (_value: string) => void): void {
    this.onChange = fn;
    this.formSelect.get('selectControl')?.valueChanges.subscribe(fn);
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
   * Establece el estado de deshabilitación del componente.
   * @param isDisabled - Indica si el componente debe estar deshabilitado.
   * @returns void
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
