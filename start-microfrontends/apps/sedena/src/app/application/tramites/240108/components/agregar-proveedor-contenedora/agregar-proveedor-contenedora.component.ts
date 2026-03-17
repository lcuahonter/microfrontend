import { Component, EventEmitter, Output } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-explosivo.enum';
import { Observable } from 'rxjs';
import { Tramite240108Query } from '../../estados/tramite240108Query.query';
import { Tramite240108Store } from '../../estados/tramite240108Store.store';

@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {

  /**
   * Evento que se emite para notificar el cierre del componente.
   * Los componentes padres pueden suscribirse a este evento para ejecutar acciones al cerrar.
   *
   * @type {EventEmitter<void>}
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador del procedimiento.
   * @property {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Observable que emite los datos del tercero (destinatario o proveedor),
   * que pueden ser `DestinoFinal`, `Proveedor`, `null` o `undefined`.
   * 
   * Se utiliza para obtener la información actual del tercero desde una fuente reactiva.
   *
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260214Store` para gestionar el estado del trámite.
   *
   * @param tramite260214Store - Store que administra el estado del trámite 260214.
   */
  constructor(public tramite240108Store: Tramite240108Store, private tramiteQuery: Tramite240108Query) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza los datos de la tabla de proveedores en el store del trámite.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240108Store.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }

  /**
* @method ngOnInit
* @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
* @command Este método asigna un observable `terechosDatos$` con los datos obtenidos desde `tramiteQuery`.
*/
  ngOnInit(): void {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
* Maneja el evento para cerrar la acción actual.
* Limpia los datos de terceros del store de trámite.
*/
  cerrarEvent(): void {
    this.tramite240108Store.clearTercerosDatos();
  }
}
