/**
 *  Terceros Relacionados Contenedora
 *  Componente contenedor encargado de gestionar los destinatarios finales y proveedores del trámite 240308.  
 */
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { map, Subject } from 'rxjs';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240308Query } from '../../estados/tramite240308Query.query';
import { Tramite240308Store } from '../../estados/tramite240308Store.store';
import { takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { AgregarDestinatarioFinalContenedoraComponent } from '../agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';

/**
 *  Terceros Relacionados Contenedora
 *  Componente contenedor encargado de suscribirse a los datos de destinatarios finales y proveedores del trámite.
 *  Conecta el estado global del store con el componente visual de terceros relacionados.
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
   * Componente modal para mostrar información adicional.
   * Se utiliza para abrir los componentes de agregar destinatario final y proveedor.
   * @property {ModalComponent} modalComponent
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Observable para limpiar las suscripciones activas al destruir el componente.
   * @property {Subject<void>} destroy$
   */
  private unsubscribe$ = new Subject<void>();

  /**
 * Indica si el formulario debe mostrarse en modo solo lectura.
 *
 * @type {boolean}
 * @memberof TercerosRelacionadosContenedoraComponent
 * @default false
 */
  esFormularioSoloLectura: boolean = false;

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
   * Indica si el formulario es de solo lectura.  
   * @property {boolean} esSoloLectura
   */
  esSoloLectura!: boolean;

  /**
   * Identificador del procedimiento.
   * Constante que define el ID único del procedimiento actual.
   * 
   * @constant {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240308Store} tramiteStore - Store de Akita que maneja el estado del trámite.
   * @param {Tramite240308Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @returns {void}
   */
  constructor(
    private tramiteStore: Tramite240308Store,
    private tramiteQuery: Tramite240308Query,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables de destinatarios y proveedores para mostrarlos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
      });
    this.tramiteQuery.getDestinatarioFinalTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
      });

    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.proveedorTablaDatos = data;
      });

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
   * Hook que se ejecuta al destruir el componente.
   * Envía un valor al Subject `unsubscribe$` y lo completa para liberar suscripciones.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
   * Cierra el modal dinámico actualmente abierto utilizando el método del componente modal.
   *
   * @method cerrarModal
   * @returns {void}
   */
  cerrarModal(): void {
    this.modalComponent.cerrar();
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
    this.tramiteStore.actualizarDatosDestinatario(datos);
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
    this.tramiteStore.actualizarDatosProveedor(datos);
    this.openModal('agregar-proveedor');
  }

  /**
* @method eliminarDestinatarioFinal
* @description Elimina el primer DestinoFinal final de la tabla de datos.
* Si no hay DestinoFinal finales seleccionados, no realiza ninguna acción.
*/
  eliminarDestinatarioFinal(datos: DestinoFinal): void {
    if (datos) {
      this.tramiteStore.eliminarDestinatarioFinal(datos);
    }
  }

  /**
  * @method eliminarProveedor
  * @description Elimina el primer Proveedor final de la tabla de datos.
  * Si no hay Proveedor finales seleccionados, no realiza ninguna acción.
  */
  eliminarProveedor(datos: Proveedor): void {
    if (datos) {
      this.tramiteStore.eliminareliminarProveedorFinal(datos);
    }
  }

}
