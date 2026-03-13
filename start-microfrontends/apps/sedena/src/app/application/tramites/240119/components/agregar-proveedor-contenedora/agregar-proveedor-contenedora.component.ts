import { Component, EventEmitter, Output } from '@angular/core';
import {
  DestinoFinal,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { AgregarProveedorCustomComponent } from '../../../../shared/components/agregar-proveedor-custom/agregar-proveedor-custom.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Tramite240119Query } from '../../estados/tramite240119Query.query';
import { Tramite240119Store } from '../../estados/tramite240119Store.store';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';

@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorCustomComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {
  /**
   * Evento que notifica al componente padre que debe cerrarse
   * el formulario o modal actual.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Observable que emite información sobre el destino final, proveedor o un valor nulo/indefinido.
   *
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   *
   * @remarks
   * Este observable se utiliza para gestionar los datos relacionados con los derechos
   * y destinatarios finales en el contexto de la aplicación.
   */
  public terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
* Observable que proporciona los datos de la tabla de proveedores.
* Se obtiene desde `tramiteQuery` y puede ser usado para renderizar
* la tabla o reaccionar a cambios en los datos.
*
* @type {Observable<Proveedor[]>}
*/
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

  /**
 * Identificador del procedimiento actual.
 * Se utiliza para determinar el flujo y las validaciones específicas del trámite.
 */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240119;

  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite240119Store` para gestionar el estado del trámite.
   *
   * @param tramite240119Store - Store que administra el estado del trámite 240119.
   */
  constructor(
    public tramite240119Store: Tramite240119Store,
    public tramiteQuery: Tramite240119Query
  ) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240119Store.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }
}
