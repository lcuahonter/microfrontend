import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240311Store } from '../../estados/tramite240311Store.store';
import { Tramite240311Query } from '../../estados/tramite240311Query.query';
import { ID_PROCEDIMIENTO } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';
import { Observable } from 'rxjs';

/**
 * Componente que encapsula la lógica para manejar la adición de proveedores y su interacción con el store del trámite.
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
/**
 * Clase que utiliza el store Tramite240311Store para gestionar el estado del trámite y actualizar la lista de proveedores.
 */
export class AgregarProveedorContenedoraComponent {
  /**
   * Evento que se emite para cerrar el componente contenedor.
   * Se utiliza para notificar al componente padre que se debe cerrar la ventana/modal de agregar proveedores.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * @property terechosDatos$
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   * @description Observable que emite datos relacionados con el destino final o proveedor.
   * Puede ser un objeto de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
   * @command Este observable se utiliza para gestionar y observar los datos de los proveedores o destinos finales en el componente.
   */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * Identificador del procedimiento.
   * @property {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor que inyecta el store Tramite240311Store para gestionar el estado del trámite.
   * El store administra el estado del trámite 240311.
   * @param tramite240311Store Instancia del store para manipular el estado de proveedores.
   */
  constructor(public tramite240311Store: Tramite240311Store,
    public tramiteQuery: Tramite240311Query) { }

  /**
 * Observable que proporciona los datos de la tabla de proveedores.
 * Se obtiene desde `tramiteQuery` y puede ser usado para renderizar
 * la tabla o reaccionar a cambios en los datos.
 *
 * @type {Observable<Proveedor[]>}
 */
  proveedoresTablaDatos$ = this.tramiteQuery.getProveedorTablaDatos$;


  /**
   * Método que actualiza los datos de la tabla de proveedores en el store del trámite.
   * Recibe una lista de proveedores y la envía al store para su actualización.
   * @param event Lista de proveedores a actualizar en el store.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite240311Store.updateProveedorTablaDatos(event);
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
    this.tramite240311Store.clearTercerosDatos();
  }
}