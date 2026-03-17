import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorCustomComponent } from "../../../../shared/components/agregar-proveedor-custom/agregar-proveedor-custom.component";
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constantes/exportacion-armas-explosivo.enum';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240121Store } from '../../estados/tramite240121Store.store';
import { Tramite240121Query } from '../../estados/tramite240121Query.query';
import { Observable } from 'rxjs';

/**
 * @component AgregarProveedorContenedoraComponent
 * @description
 * Componente contenedor que gestiona la adición de proveedores dentro del flujo del trámite 240121.
 * Interactúa con el store para actualizar los datos y emite un evento para cerrar el componente después de guardar.
 *
 * @example
 * ```html
 * <app-agregar-proveedor-contenedora (cerrar)="onCerrar()"></app-agregar-proveedor-contenedora>
 * ```
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorCustomComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {

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
* Observable que emite la lista de proveedores registrados
* en la tabla del trámite.
*
* @type {Observable<Proveedor[]>}
*/
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

  /**
   * Evento emitido para indicar que se debe cerrar el componente.
   * 
   * @event cerrar
   * @type {EventEmitter<void>}
   * @description Notifica al componente padre que debe cerrarse este contenedor.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador único del procedimiento asociado.
   *
   * @readonly
   * @type {number}
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor del componente.
   *
   * @param tramite240121Store - Instancia del store que gestiona el estado del trámite 240121.
   */
  constructor(public tramite240121Store: Tramite240121Store, public tramiteQuery: Tramite240121Query) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
   * Actualiza los datos de la tabla de proveedores en el store del trámite.
   * Luego emite el evento `cerrar` para indicar que la operación ha concluido.
   *
   * @param {Proveedor[]} event - Lista de proveedores a agregar o actualizar.
   * @returns {void}
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240121Store.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }
}
