import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ModificacionService } from '../../services/modificacion.service';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';
import { ActivatedRoute, Router } from '@angular/router';
import { ID_PROCEDIMIENTO } from '../../constants/solicitud-de-prorroga-importacion-material-explosivo.enum';

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
  implements OnInit, OnDestroy, AfterViewInit {
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
       * Identificador del procedimiento.
       * Constante que define el ID único del procedimiento actual.
       * 
       * @constant {number} idProcedimiento
       */
      public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Datos de la tabla de proveedores.
   * @property {Proveedor[]} proveedorTablaDatos
   */
  proveedorTablaDatos: Proveedor[] = [];
  /**
  * Indica si el formulario debe mostrarse en modo solo lectura.
  *
  * @type {boolean}
  * @memberof AgregarDestinatarioFinalContenedoraComponent
  * @see https://compodoc.app/
  */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240321Store} tramiteStore - Store de Akita que maneja el estado del trámite.
   * @param {Tramite240321Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @param {ModificacionService} modificacionService - Servicio que maneja la lógica de negocio relacionada con la modificación de datos.
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de la consulta.
   * @see https://compodoc.app/
   * @returns {void}
   */
  constructor(
    private tramiteStore: Tramite240321Store,
    private tramiteQuery: Tramite240321Query,
    private modificacionService: ModificacionService,
    private readonly consultaioQuery: ConsultaioQuery,
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
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
        this.getDestinatariosFinales();
      });

    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.proveedorTablaDatos = data;
        this.getProveedores();
      });
  }


  /**
     * @inheritdoc
     * @description
     * Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente ha sido inicializada.
     * 
     * Suscribe al observable `selectConsultaioState$` para escuchar cambios en el estado de la sección y actualizar
     * la propiedad `esFormularioSoloLectura` según el valor de `readonly` en el estado.
     * 
     * La suscripción se mantiene activa hasta que se emite un valor en `unsubscribe$`, lo que previene fugas de memoria.
     * 
     * @see https://angular.io/api/core/AfterViewInit
     */
  ngAfterViewInit(): void {
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
   * Modifica los datos del destinatario final y navega a la página para agregar un destino final.
   *
   * @param datos - Objeto de tipo `DestinoFinal` que contiene la información del destinatario final a actualizar.
   */
  modificarDestinarioDatos(datos: DestinoFinal): void {
    this.tramiteStore.actualizarDatosDestinatario(datos);
    this.irAAcciones('../agregar-destino-final');
  }

  /**
   * Modifica los datos de un proveedor y actualiza el estado correspondiente en el store.
   * Además, redirige al usuario a la página para agregar un proveedor.
   *
   * @param datos - Objeto de tipo `Proveedor` que contiene la información actualizada del proveedor.
   */
  modificarProveedorDatos(datos: Proveedor): void {
    this.tramiteStore.actualizarDatosProveedor(datos);
    this.irAAcciones('../agregar-proveedor');
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
   * Método que obtiene los destinatarios finales desde el servicio de modificación.
   * Actualiza el store con los datos obtenidos si la tabla está vacía.
   *
   * @method getDestinatariosFinales
   * @returns {void}
   */
  getDestinatariosFinales(): void {
    this.modificacionService.getDestinatariosFinales().pipe(takeUntil(this.unsubscribe$)).subscribe((resp) => {
      const DESTINATARIODATOS = resp.data;
      if (this.destinatarioFinalTablaDatos.length === 0) {
        this.destinatarioFinalTablaDatos = DESTINATARIODATOS;
        this.tramiteStore.updateDestinatarioFinalTablaDatos(this.destinatarioFinalTablaDatos);
      }
    });
  }

  /**
   * Método que obtiene los proveedores desde el servicio de modificación.
   * Actualiza el store con los datos obtenidos si la tabla está vacía.
   *
   * @method getProveedores
   * @returns {void}
   */
  getProveedores(): void {
    this.modificacionService.getProveedores().pipe(takeUntil(this.unsubscribe$)).subscribe((resp) => {
      const PROVEEDOR_DATOS = resp.data;
      if (this.proveedorTablaDatos.length === 0) {
        this.proveedorTablaDatos = PROVEEDOR_DATOS;
        this.tramiteStore.updateProveedorTablaDatos(this.proveedorTablaDatos);
      }
    });
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
}
