import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnlaceOperativoComponent } from '../enlace-operativo/enlace-operativo.component';
import { PersonasNotificacionesComponent } from '../personas-notificaciones/personas-notificaciones.component';
import { RepresentanteLegalComponent } from '../representante-legal/representante-legal.component';

/**
 * 
 * Este componente es de tipo `standalone`, por lo que puede ser usado sin necesidad de declarar en un módulo.
 * Coordina la validación de múltiples formularios relacionados con terceros y proporciona
 * una interfaz unificada para la gestión de esta información.
 * 
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    RepresentanteLegalComponent,
    EnlaceOperativoComponent,
    PersonasNotificacionesComponent
  ],
  templateUrl: './terceros-relacionados.component.html',
  styleUrls: ['./terceros-relacionados.component.scss'],
})
export class TercerosRelacionadosComponent {

  /**
   * Referencia al componente RepresentanteLegalComponent para acceder a sus métodos y propiedades.
   * Permite la validación y manipulación del formulario de datos del representante legal.
   * Este componente gestiona la información personal y de contacto del representante legal de la empresa.
   */
  @ViewChild('representanteLegalRef') 
  representanteLegalComponent!: RepresentanteLegalComponent;

  /**
   * Referencia al componente EnlaceOperativoComponent para acceder a sus métodos y propiedades.
   * Permite la validación y manipulación del formulario de datos del enlace operativo.
   * Este componente maneja la información de la persona designada como enlace operativo
   * para las comunicaciones y operaciones con la empresa.
   */
  @ViewChild('enlaceOperativoRef') 
  enlaceOperativoComponent!: EnlaceOperativoComponent;

  /**
   * Valida todos los formularios de terceros relacionados antes de permitir continuar.
   * Este método coordina la validación de múltiples formularios hijo y se asegura de que
   * toda la información requerida esté correctamente completada.
   */
  public validarFormulario(): boolean {
  let isValid = true;
  if (this.enlaceOperativoComponent) {
    if (!this.enlaceOperativoComponent.validarFormulario()) {
      isValid = false;
    }
  } else {
    isValid = false;
  }

  if (this.representanteLegalComponent) {
    if (!this.representanteLegalComponent.validarFormulario()) {
      isValid = false;
    }
  } else {
    isValid = false;
  }

  return isValid;
}
}