import { Component, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../../../240311/components/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../../../240311/components/agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240311Query } from '../../estados/tramite240311Query.query';
import { Tramite240311Store } from '../../estados/tramite240311Store.store';
import { ID_PROCEDIMIENTO } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';

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

/**
 * Clase que representa el componente contenedor de terceros relacionados.
 * Este componente se encarga de gestionar la lógica de negocio relacionada con los destinatarios finales y proveedores
 * del trámite 240311, suscribiéndose a los datos del store y proporcionando funcionalidades
 */
export class TercerosRelacionadosContenedoraComponent
  implements OnInit, OnDestroy {
  /**
 * Referencia al componente Modal para controlar su apertura
 * y cierre desde el componente padre.
 */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Observable para limpiar las suscripciones activas al destruir el componente.
   * @property {Subject<void>} destroy$
   */
  private unsubscribe$ = new Subject<void>();

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
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

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
   * @param {Tramite240311Store} tramiteStore - Store de Akita que maneja el estado del trámite.
   * @param {Tramite240311Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @returns {void}
   */
  constructor(
    private tramiteStore: Tramite240311Store,
    private tramiteQuery: Tramite240311Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Constructor del componente
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
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
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables de destinatarios y proveedores para mostrarlos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
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

  /**
   * Hook que se ejecuta al destruir el componente.
   * Envía un valor al Subject `unsubscribe$` y lo completa para liberar suscripciones.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
