/* eslint-disable class-methods-use-this */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatosCheckInputText } from '../../../core/models/shared/check-input-text.model';


@Component({
  selector: 'lib-check-input-text',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './check-input-text.component.html',
  styleUrl: './check-input-text.component.scss',
})

export class CheckInputTextComponent implements OnChanges {

  /**
   * Identificador único para el checkbox.
   * @required
   */
  @Input({ required: true }) idCheckbox!: string;

  /**
   * Identificador único para el input de texto.
   * @required
   */
  @Input({ required: true }) idInputTexto!: string;

  /**
   * Texto que se muestra en el label del checkbox.
   * @required
   */
  @Input({ required: true }) label!: string;


  /**
   * Indica si el campo es obligatorio.
   */
  @Input({ required: true }) required!: boolean;

  /**
   * Indica la clase CSS que se aplicará al checkbox. 
   * Si reverse es verdadero, se aplicará la clase ''form-check-custome', que pone el checkbox al final
   * de la etiqueta label.
   * Por default la clase es 'form-check', donde el checkbox se encuentra al inicio de la etiqueta label.
   */
  @Input({ required: true }) reverse!: boolean;

  /**
   * Indica si el input de texto está oculto.
   */
  @Input({ required: true }) hidden!: boolean;

  /**
   * Indica el tipo del componente:
   * - 'visible': el input de texto es visible y deshabilitado.
   * - 'invisible': el input de texto es invisible y deshabilitado.
   */
  @Input() tipo!: string;
  @Input() maxLengthValidacion!: number;

  @Input() checkboxValor!: boolean;
  @Input() textoValor!: string;
  @Input() labelText!: string;

  /**
   * Indica si el checkbox debe estar deshabilitado.
   */
  @Input() isDisabled: boolean = false;

  @Output() checkboxChange = new EventEmitter<DatosCheckInputText>();


  /**
   * Formulario reactivo que contiene el checkbox y el input de texto.
   * @required
   */
  forma: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forma = this.fb.group({
      checkbox: [false],
      texto: [{ value: '', disabled: true }],
      disabled:true
    });
  }

  /**
   * @inheritdoc
   * Detecta cambios en las propiedades de entrada del componente.
   * 
   * @param changes - Objeto que contiene los cambios detectados en las propiedades de entrada.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reverse']) {
      this.reverse = changes['reverse'].currentValue;
    }
    if (changes['required']) {
      this.required = changes['required'].currentValue;
    }
    if (changes['maxLengthValidacion']) {
      this.maxLengthValidacion = changes['maxLengthValidacion'].currentValue;
      this.forma.get('texto')?.setValidators([Validators.maxLength(this.maxLengthValidacion)]);
      this.forma.get('texto')?.updateValueAndValidity();
    }

    if (changes['checkboxValor'] && changes['checkboxValor'].currentValue) {
      
      this.checkboxValor = changes['checkboxValor'].currentValue;
      this.forma.get('checkbox')?.setValue(this.checkboxValor);
      this.textoValor = changes['textoValor'].currentValue;
      this.forma.get('texto')?.enable();
      this.forma.get('texto')?.setValue(this.textoValor);
      this.forma.get('texto')?.disable();
    }
    
    // Handle disabled state separately
    if (changes['isDisabled']) {
      this.isDisabled = changes['isDisabled'].currentValue;
      if (this.isDisabled) {
        this.forma.get('checkbox')?.disable();
      } else {
        this.forma.get('checkbox')?.enable();
      }
    }
  }

  /**
   * Cambia el estado del input de texto basado en el tipo y el valor del checkbox.
   * 
   * @returns {void} No retorna ningún valor.
   */
  cambioInputTexto(): void {
    const CHECKBOX = this.forma.get('checkbox')?.value;

    if (this.tipo === 'invisible' && !this.hidden) {
      this.hidden = true;
      // this.activarInputTexto();
    } else if (this.tipo === 'invisible' && this.hidden) {
      this.hidden = false;
      // this.desactivarInputTexto();
    }

    if (CHECKBOX) {
      this.activarInputTexto();

    } else {
      this.desactivarInputTexto();
    }
  }

  /**
   * Activa el campo de texto en el formulario, habilitándolo, 
   * asignando validadores requeridos y actualizando su estado.
   * 
   * @returns {void} No retorna ningún valor.
   */
  activarInputTexto(): void {
    this.forma.get('texto')?.enable();
    this.forma.get('texto')?.setValidators([Validators.required]);
    this.forma.get('texto')?.updateValueAndValidity();
  }

  /**
   * Desactiva el campo de texto en el formulario.
   * - Deshabilita el control.
   * - Elimina los validadores asociados.
   * - Actualiza el estado del control.
   * 
   * @returns {void} No retorna ningún valor.
   */
  desactivarInputTexto(): void {
    this.forma.reset();
    this.forma.get('texto')?.disable();
    this.forma.get('texto')?.clearValidators();
    this.forma.get('texto')?.updateValueAndValidity();

    this.enviarValoresCheckboxInput();
  }

  enviarValoresCheckboxInput(): void {
    const CHECKBOX = this.forma.get('checkbox')?.value;
    const TEXTO = this.forma.get('texto')?.value;
    const DISABLED = this.forma.get('disabled')?.disabled
    const DATOS: DatosCheckInputText = {
      checkbox: CHECKBOX,   
      texto: TEXTO,
      disabled: DISABLED,
    };

    this.checkboxChange.emit(DATOS)
  }
}
