import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { ID_PROCEDIMIENTO } from '../../constants/agregar-destinatario.enum';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240112Store } from '../../estados/tramite240112Store.store';
import { CommonModule } from '@angular/common';
import { Tramite240112Query } from '../../estados/tramite240112Query.query';
import { Observable } from 'rxjs';

/**
 * Componente contenedor para agregar proveedores en el trámite 240112.
 *
 * @component
 *
 * @remarks
 * Este componente actúa como contenedor para el componente `AgregarProveedorComponent`, gestionando la
 * interacción con el store `Tramite240112Store` y emitiendo eventos para cerrar el componente.
 *
 * @example
 * ```html
 * <app-agregar-proveedor-contenedora (cerrar)="onCerrar()"></app-agregar-proveedor-contenedora>
 * ```
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent]
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
  public terechosDatos$!: Observable<
    DestinoFinal | Proveedor | null | undefined>;

  /**
* Observable que proporciona los datos de la tabla de proveedores.
* Se obtiene desde `tramiteQuery` y puede ser usado para renderizar
* la tabla o reaccionar a cambios en los datos.
*
* @type {Observable<Proveedor[]>}
*/
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

  /**
   * Evento emitido para indicar que se debe cerrar el componente.
   * 
   * @event cerrar
   * @type {EventEmitter<void>}
   * @remarks
   * Este evento no envía ningún dato, simplemente notifica al componente padre que debe cerrarse el modal o contenedor.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador del procedimiento asociado al trámite.
   * 
   * @readonly
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor que inyecta el store para gestionar el estado del trámite 240112.
   *
   * @param tramite240112Store - Store que administra el estado del trámite.
   * @param tramiteQuery - Query para obtener los datos del trámite.
   */
  constructor(public tramite240112Store: Tramite240112Store, public tramiteQuery: Tramite240112Query) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
* Maneja el evento para cerrar la acción actual.
* Limpia los datos de terceros del store de trámite.
*/
  cerrarEvent(): void {
    this.tramite240112Store.clearTercerosDatos();
  }

  /**
   * Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param event - Lista actualizada de proveedores que se guardará en el store.
   *
   * @returns void
   *
   * @remarks
   * Al actualizar el store, este método también emite el evento `cerrar` para notificar
   * que se debe cerrar el componente.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240112Store.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }
}
