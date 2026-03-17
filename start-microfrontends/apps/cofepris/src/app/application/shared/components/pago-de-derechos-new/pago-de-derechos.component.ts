import { AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  Catalogo,
  InputFecha,
  InputFechaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component'; 
import { CommonModule } from '@angular/common';
import { FECHA } from '../../constantes/pago-de-derechos.enum';

/**
 * Componente que representa el formulario de pago de derechos.
 * Permite capturar y gestionar los datos relacionados con el pago.
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputFechaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
})
export class PagoDeDerechosComponent implements OnChanges {
  /**
   * Formulario reactivo que captura los datos del pago de derechos.
   */
  @Input() formularioPagoDerechos!: FormGroup;

  /**
   * Lista de bancos disponibles para seleccionar.
   */
  @Input() banco!: Catalogo[];

  /**
   * Fecha de pago seleccionada o ingresada.
   */
  @Input() fecPago!: Date | string;

  /**
   * Configuración para el campo de fecha de pago.
   */
  fechaPago: InputFecha = {
    labelNombre: 'Fecha de pago:',
    required: false,
    habilitado: true,
  };
  
  /**
   * Indica si el formulario está deshabilitado.
   * Si es true, el formulario no se puede editar.
   */

  @Input() isDisabled: boolean = false;

  /**
   * Configuración de la fecha final para el campo "Fecha de Pago".
   */
  configuracionFechaFinal: InputFecha = FECHA;

  /**
   * Evento emitido para establecer valores en el store.
   * Contiene el formulario, el campo a actualizar y el nombre del método.
   */
  @Output() setValoresStoreEvent = new EventEmitter<{
    formularioPagoDerechos: FormGroup;
    campo: string;
  }>();

  /**
   * Constructor del componente.
   */
  constructor() {
    //
  }

 
  ngOnChanges(changes: SimpleChanges): void {
   if (changes['isDisabled']) {
    if (this.isDisabled) {
      this.formularioPagoDerechos.disable();
    } else {
      this.formularioPagoDerechos.enable();
    }
  }
  }

  /**
   * Capitaliza el valor ingresado en un campo y lo guarda en el store.
   * campo - Nombre del campo del formulario.
   * nombreMetodo - Nombre del método del store a invocar.
   * evento - Evento de entrada del usuario.
   */
  capitalizarYGuardar(campo: string, nombreMetodo: string, evento: Event): void {
    const ELEMENTO_INPUT = evento.target as HTMLInputElement;
    const VALOR_CAPITALIZADO = ELEMENTO_INPUT.value.toUpperCase();
    this.formularioPagoDerechos.get(campo)?.setValue(VALOR_CAPITALIZADO);
    this.setValoresStore(this.formularioPagoDerechos, campo);
  }

  /**
   * Establece valores en el store.
   * formularioPagoDerechos - El formulario reactivo.
   * campo - El campo a actualizar.
   */
  setValoresStore(
    formularioPagoDerechos: FormGroup,
    campo: string
  ): void {
    this.setValoresStoreEvent.emit({
      formularioPagoDerechos,
      campo
    });
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.formularioPagoDerechos.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  
  /**
   * Método para validar cambios en un campo de formulario relacionado con fechas futuras.
   * Monitorea los cambios de valor del campo especificado y actualiza su estado de validación sin emitir eventos adicionales.
   * Utiliza operadores de RxJS como distinctUntilChanged y takeUntil para manejar suscripciones de forma eficiente y evitar fugas de memoria.
   *
   * @param {string} fecPago - El nombre del campo de formulario que se validará.
   */
  public validarFechaFutura(fecPago:string): void {
    this.formularioPagoDerechos.get(fecPago)?.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Maneja el cambio de fecha desde el componente input-fecha.
   * Actualiza el valor del form control y ejecuta la validación.
   * @param fecha - Nueva fecha seleccionada en formato DD/MM/YYYY
   */
  public onFechaCambiada(fecha: string): void {
    if (fecha) {
      const [DD, MM, YYYY] = fecha.split('/');
      const FECHA_FORMATTED = `${YYYY}-${MM}-${DD}`;
      
      this.formularioPagoDerechos.patchValue({ fecPago: FECHA_FORMATTED });
      this.formularioPagoDerechos.get('fecPago')?.markAsTouched();
      
      this.validarFechaFutura('fecPago');
      
      this.setValoresStore(this.formularioPagoDerechos, 'fecPago');
    } else {
      this.formularioPagoDerechos.patchValue({ fecPago: null });
    }
  }

  /**
   * Validador personalizado para fechas límite.
   * Valida que la fecha ingresada no sea posterior a la fecha actual.
   * @returns Función validadora que retorna error si la fecha es futura
   */
  public static fechaLimValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const VAL = control.value;
      if (VAL) {
        const [YEAR, MONTH, DAY] = VAL.split('-').map((str: string) => Number(str));
        const FECHA = new Date(YEAR, MONTH - 1, DAY);
        const TODAY = new Date();
        if (FECHA.getTime() > TODAY.getTime()) {
          return { fechaLim: true };
        }
      }
      return null;
    };
  }

}