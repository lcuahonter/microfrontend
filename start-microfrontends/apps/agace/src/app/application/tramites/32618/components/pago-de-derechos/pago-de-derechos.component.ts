import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { PAGO_DE_DERECHOS } from '../../constants/pago-de-derechos.enum';


/** Componente para gestionar el formulario de pago de derechos */
@Component({
  selector: 'pago-de-derechos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './pago-de-derechos.component.html',
  
})

export class PagoDeDerechosComponent {

  /** Estado actual del formulario de pago de derechos. */
  @Input() estado!: {[key: string]: unknown};

  /** Estado de consulta que determina el modo de visualización y edición del formulario. */
  @Input() consultaState!: ConsultaioState;

  /** Evento que emite los cambios de valor realizados en el formulario de pago de derechos. */
  @Output() emitirCambioValor = new EventEmitter<{ campo: string; valor: string | number | object }>();
  
  /** Formulario reactivo principal para el pago de derechos. */
  public pagoDerechosForm: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({})
  });

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup`*/
  get ninoFormGroup(): FormGroup {
    return this.pagoDerechosForm.get('ninoFormGroup') as FormGroup;
  }

  /** Datos de configuración dinámica para el formulario de pago de derechos. */
  public pagoDerechosFormData = PAGO_DE_DERECHOS;

  /** Emite el evento con el cambio de valor realizado en el formulario de pago de derechos. */
  establecerCambioDeValor(event: {campo: string, valor: string | number | object}): void {
    this.emitirCambioValor.emit({
    campo: event.campo,
    valor: event.valor
    });
  }

  /** Limpia todos los campos del formulario de pago de derechos. */
  borrar(): void {
    this.pagoDerechosForm.reset();
  }

}