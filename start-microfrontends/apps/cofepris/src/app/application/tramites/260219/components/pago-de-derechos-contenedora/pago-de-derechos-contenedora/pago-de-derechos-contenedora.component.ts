/**
 * @fileoverview
 * El `PagoDeDerechosContenedoraComponent` es un componente de Angular que actúa como contenedor para gestionar
 * la funcionalidad relacionada con el pago de derechos en el trámite 260219. Este componente utiliza el componente
 * `PagoDeDerechosComponent` y se comunica con el estado del trámite a través del store `Tramite260219Store`.
 *
 * @module PagoDeDerechosContenedoraComponent
 * @description
 * Este componente permite agregar y actualizar los datos relacionados con el pago de derechos en el flujo del trámite 260219.
 */

import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../../constants/remedios-herbolarios.enum';
import { PagoDeDerechosComponent } from '../../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import { Tramite260219Store } from '../../../estados/tramite260219Store.store';

/**
 * @component
 * @name PagoDeDerechosContenedoraComponent
 * @description
 * Componente contenedor que utiliza el componente `PagoDeDerechosComponent` 
 * para gestionar la funcionalidad relacionada con el pago de derechos. 
 * Este componente interactúa con el estado del trámite a través del store `Tramite260219Store`.
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
 * - PagoDeDerechosComponent: Componente compartido para gestionar la funcionalidad de pago de derechos.
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
   * @property {PagoDerechosFormState} pagoDerechos
   * @description
   * Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   */
  public pagoDerechos: PagoDerechosFormState;

  /**
   * @property {string} idProcedimiento
   * @description
   * Identificador único del procedimiento, utilizado para la gestión del trámite.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @property {Observable<boolean>} esFormularioSoloLectura
   * @description
   * Observable que indica si el formulario está en modo solo lectura.
   * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
   */
  esFormularioSoloLectura!: Observable<boolean>;

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260219Store` para gestionar el estado del trámite
   * y el query `ConsultaioQuery` para obtener el estado de la consulta actual.
   * Inicializa la propiedad `pagoDerechos` con el valor actual del store.
   *
   * @param {Tramite260219Store} tramiteStore - Store que administra el estado del trámite 260219.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de la consulta actual.
   */
  constructor(public tramiteStore: Tramite260219Store, private consultaQuery: ConsultaioQuery) {
    this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
    this.esFormularioSoloLectura = this.consultaQuery.selectConsultaioState$.pipe(
      map((seccionState) => {
        if (!seccionState.create && seccionState.procedureId === '260219') {
          return seccionState.readonly;
        }
        return false;
      })
    );
  }

  /**
   * @method updatePagoDerechos
   * @description
   * Actualiza los datos del formulario de pago de derechos en el store del trámite.
   *
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario de pago de derechos.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * const pagoDerechosActualizado = { monto: 1000, referencia: 'ABC123' };
   * this.updatePagoDerechos(pagoDerechosActualizado);
   * ```
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }
}