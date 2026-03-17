import { Component, ViewChild } from '@angular/core';
import { Subject, map } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240305Query } from '../../estados/tramite240305Query.query';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';
import { takeUntil } from 'rxjs';
import { ID_PROCEDIMIENTO } from '../../constants/permiso-ordinario-importacion-substancias-quimicas.enum';

/**
 * @title Terceros Relacionados Contenedora
 * @description Componente contenedor encargado de suscribirse a los datos de destinatarios finales y proveedores del trámite.
 * @summary Conecta el estado global del store con el componente visual de terceros relacionados.
 */

@Component({
  selector: 'app-terceros-relacionados-contenedora',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent, ModalComponent],
  templateUrl: './terceros-relacionados-contenedora.component.html',
  styleUrl: './terceros-relacionados-contenedora.component.scss',
})
export class TercerosRelacionadosContenedoraComponent
  implements OnInit, OnDestroy {
  /**
   * Referencia al componente modal.
   *
   * Esta propiedad utiliza el decorador `@ViewChild` para acceder a una instancia del
   * componente `ModalComponent` dentro de la plantilla. Se utiliza cuando se necesita
   * controlar o manipular el modal directamente desde el componente padre.
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Observable para limpiar las suscripciones activas al destruir el componente.
   * @property {Subject<void>} destroy$
   */
  private unsubscribe$ = new Subject<void>();

  /**
    * Identificador del procedimiento.
    * @property {number} idProcedimiento
    */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Datos de la tabla de destinatarios finales.
   * @property {DestinoFinal[]} destinatarioFinalTablaDatos
   */
  destinatarioFinalTablaDatos: DestinoFinal[] = [];

  /**
   * Datos de la tabla de proveedores.
   * @property {Proveedor[]} proveedorTablaDatos
   */
  proveedorTablaDatos: Proveedor[] = [];

  /**
    * Indica si el formulario debe mostrarse en modo solo lectura.
    *
    * @type {boolean}
    * @memberof TercerosRelacionadosContenedoraComponent
    * @default false
    */
  esFormularioSoloLectura: boolean = false;

  /**
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240305Store} tramite240305Store - Store de Akita que maneja el estado del trámite.
   * @param {Tramite240305Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @returns {void}
   */
  constructor(
    private tramite240305Store: Tramite240305Store,
    private tramite240305Query: Tramite240305Query,
    private consultaQuery: ConsultaioQuery
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables de destinatarios y proveedores para mostrarlos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite240305Query.getDestinatarioFinalTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
      });

    this.tramite240305Query.getProveedorTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.proveedorTablaDatos = data;
      });
  }

  /**
 * Abre el modal correspondiente según el nombre del evento recibido.
 *
 * Si el evento es `'Datosmercancia'`, se carga el componente `DatosMercanciaContenedoraComponent`
 * dentro del modal y se le pasa una función de cierre como input.
 *
 * @method openModal
 * @param {string} event - Nombre del evento que indica qué componente se debe mostrar en el modal.
 * @returns {void}
 */
  openModal(event: string): void {
    if (event === 'agregar-destino-final') {
      this.modalComponent.abrir(AgregarDestinatarioFinalContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    } else if (event === 'agregar-proveedor') {
      this.modalComponent.abrir(AgregarProveedorContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    }
  }

  /**
  * Modifica los datos del destinatario en el store y navega a la sección de acciones.
  * 
  * Llama al método `actualizarDatosDestinatario` del store con el objeto recibido,
  * y luego ejecuta la función `irAAcciones()` para continuar con el flujo.
  *
  * @param {DestinoFinal} datos - Objeto que contiene los datos actualizados del destinatario.
  * @returns {void}
  */
  modificarDestinarioDatos(datos: DestinoFinal): void {
    this.tramite240305Store.actualizarDatosDestinatario(datos);
    this.openModal('agregar-destino-final');
  }

  /**
   * Modifica los datos del proveedor en el store.
   * 
   * Llama al método `actualizarDatosProveedor` del store con el objeto recibido.
   *
   * @param {Proveedor} datos - Objeto que contiene los datos actualizados del proveedor.
   * @returns {void}
   */
  modificarProveedorDatos(datos: Proveedor): void {
    this.tramite240305Store.actualizarDatosProveedor(datos);
    this.openModal('agregar-proveedor');
  }

  /**
* @method eliminarDestinatarioFinal
* @description Elimina el primer DestinoFinal final de la tabla de datos.
* Si no hay DestinoFinal finales seleccionados, no realiza ninguna acción.
*/
  eliminarDestinatarioFinal(datos: DestinoFinal): void {
    if (datos) {
      this.tramite240305Store.eliminarDestinatarioFinal(datos);
    }
  }

  /**
  * @method eliminarProveedor
  * @description Elimina el primer Proveedor final de la tabla de datos.
  * Si no hay Proveedor finales seleccionados, no realiza ninguna acción.
  */
  eliminarProveedor(datos: Proveedor): void {
    if (datos) {
      this.tramite240305Store.eliminareliminarProveedorFinal(datos);
    }
  }

  /**
   * Cierra el modal dinámico actualmente abierto utilizando el método del componente modal.
   *
   * @method cerrarModal
   * @returns {void}
   */
  cerrarModal(): void {
    this.modalComponent.cerrar();
  }

  /**
   * Hook que se ejecuta al destruir el componente.
   * Envía un valor al Subject `unsubscribe$` y lo completa para liberar suscripciones.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
