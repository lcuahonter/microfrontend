import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ConfirmarNotificacionIniciarResponse } from '../../../core/models/confirmar-notificacion/response/confirmar-notificacion-iniciar-response.model';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@Component({
  selector: 'app-notificacion-acto-administrativo',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, TooltipModule],
  templateUrl: './notificacion-acto-administrativo.component.html',
  styleUrl: './notificacion-acto-administrativo.component.css',
})
export class NotificacionActoAdministrativoComponent implements OnChanges {

  /**
   * Datos de la notificación del acto administrativo.
   * Se espera que sea un objeto de tipo ConfirmarNotificacionIniciarResponse.
   */
  @Input() datosNotificacion: ConfirmarNotificacionIniciarResponse | null = null;

  /**
   * Formulario reactivo que contiene los campos de la notificación.
   * Los campos están inicialmente deshabilitados.
   */
  notificacionForm: FormGroup;

  constructor(
    private fb: FormBuilder) {
      
    // Inicializa el formulario con campos deshabilitados
    this.notificacionForm = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }],
      fechaHora: [{ value: '', disabled: true }],
    });
  }

  /**
   * Detecta cambios en los datos de la notificación y actualiza el formulario.
   * @param changes Cambios detectados en las propiedades del componente.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosNotificacion'] && this.datosNotificacion) {
      this.actualizarFormulario();
    }
  }

  /**
   * Actualiza el formulario con los datos de la notificación.
   */
  private actualizarFormulario(): void {
    this.notificacionForm.patchValue({
      nombre: this.datosNotificacion?.nombre_completo,
      rfc: this.datosNotificacion?.rfc,
      fechaHora: this.datosNotificacion?.fecha_envio_notificacion,
    });
  }
}
