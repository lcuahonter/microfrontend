/**
 * Componente utilizado en el trámite 260101 para gestionar la funcionalidad relacionada con el pago de derechos.
 *
 * Este archivo contiene la definición del componente `PagoDeDerechosContenedoraComponent`, que utiliza el componente
 * `PagoDeDerechosComponent` para gestionar y actualizar los datos del formulario de pago de derechos.
 * También interactúa con el estado global del trámite a través del store `Tramite260101Store`.
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../../constants/medicos-uso.enum';
import { PagoDeDerechosComponent } from '../../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import { Tramite260101Store } from '../../../estados/tramite260101Store.store';

/**
 * @component
 * @name PagoDeDerechosContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `PagoDeDerechosComponent`
 * para gestionar la funcionalidad relacionada con el pago de derechos.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260101Store`.
 *
 * @selector app-pago-de-derechos-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./pago-de-derechos-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./pago-de-derechos-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - PagoDeDerechosComponent: Componente compartido para gestionar el formulario de pago de derechos.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent {
  /**
   * @property {boolean} formularioDeshabilitado
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Identificador numérico del procedimiento actual.
   * Se inicializa con el valor constante `ID_PROCEDIMIENTO`.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   */
  public pagoDerechos: PagoDerechosFormState;

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260101Store` para gestionar el estado del trámite.
   * Inicializa la propiedad `pagoDerechos` con el valor actual del store.
   *
   * @param {Tramite260101Store} tramiteStore - Store que administra el estado del trámite 260101.
   */
  constructor(public tramiteStore: Tramite260101Store) {
    this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
  }

  /**
   * @method updatePagoDerechos
   * @description
   * Actualiza los datos del formulario de pago de derechos en el store del trámite.
   *
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario de pago de derechos.
   * @returns {void} Este método no retorna ningún valor.
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }
}
