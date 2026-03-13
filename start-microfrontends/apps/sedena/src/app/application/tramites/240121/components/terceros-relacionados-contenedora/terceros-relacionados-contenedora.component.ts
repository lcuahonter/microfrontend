import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constantes/exportacion-armas-explosivo.enum';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240121Query } from '../../estados/tramite240121Query.query';
import { Tramite240121Store } from '../../estados/tramite240121Store.store';
import { ActivatedRoute, Router } from '@angular/router';

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
* @description Referencia al componente ModalComponent dentro de la plantilla.
* Utiliza el decorador ViewChild para acceder a la instancia del modal y manipularlo desde el código TypeScript.
* @example
* // Para abrir el modal:
* this.modalComponent.open();
*  
* @see ModalComponent
* 
* @es
* Referencia al componente modal para mostrar u ocultar diálogos modales en la interfaz de usuario.
*/
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Identificador del procedimiento.
   * Constante que define el ID único del procedimiento actual.
   * 
   * @constant {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
 * Observable para limpiar las suscripciones activas al destruir el componente.
 * 
 * @property {Subject<void>} unsubscribe$
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
* Indica si el formulario debe mostrarse en modo solo lectura.
*
* @type {boolean}
* @default false
*/
  esFormularioSoloLectura: boolean = false;

  /**
 * Modifica los datos del destinatario final y navega a la página para agregar un destino final.
 *
 * @param datos - Objeto de tipo `DestinoFinal` que contiene la información del destinatario final a actualizar.
 */
  modificarDestinarioDatos(datos: DestinoFinal): void {
    this.tramiteStore.actualizarDatosDestinatario(datos);
    this.openModal('agregar-destino-final');
  }

  /**
 * Navega a una ruta relativa dentro del flujo actual.
 * @method irAAcciones
 * @param {string} accionesPath - Ruta relativa a la que se desea navegar.
 * @returns {void}
 */
  irAAcciones(url: string): void {
    this.router.navigate([url], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Constructor del componente.
   * Inicializa el componente y permite la inyección de dependencias necesarias.
   *
   * @method constructor
   * @param {Tramite240121Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @param {ConsultaioQuery} consultaQuery - Query de Akita para obtener el estado de la consulta.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240121Query,
    private consultaQuery: ConsultaioQuery,
    private tramiteStore: Tramite240121Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

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
      .subscribe((data: DestinoFinal[]) => {
        this.destinatarioFinalTablaDatos = data;
      });

    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Proveedor[]) => {
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
 * Hook del ciclo de vida que se ejecuta al destruir el componente.
 * Envía un valor al Subject `unsubscribe$` y lo completa para liberar suscripciones.
 *
 * @method ngOnDestroy
 * @returns {void}
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
   * Modifica los datos de un proveedor y actualiza el estado correspondiente en el store.
   * Además, redirige al usuario a la página para agregar un proveedor.
   *
   * @param datos - Objeto de tipo `Proveedor` que contiene la información actualizada del proveedor.
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
