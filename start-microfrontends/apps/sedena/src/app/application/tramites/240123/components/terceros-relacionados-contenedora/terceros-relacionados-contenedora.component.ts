import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { DATOS_ESTATICOS, ID_PROCEDIMIENTO } from '../../constants/exportacion-sustancias-quimicas.enum';
import { AgregarDestinatarioFinalContenedoraComponent } from '../../../240123/components/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { OnInit } from '@angular/core';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Subject } from 'rxjs';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240123Query } from '../../estados/tramite240123Query.query';
import { Tramite240123Store } from '../../estados/tramite240123Store.store';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

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
export class TercerosRelacionadosContenedoraComponent implements OnInit {
  
/**
 * Referencia al componente Modal utilizado para mostrar diálogos modales en la vista.
 *
 * @type {ModalComponent}
 * @memberof TercerosRelacionadosContenedoraComponent
 * @see ModalComponent
 * @example
 * this.modalComponent.abrir(Componente, { ... });
 */
@ViewChild('modal', { static: false }) modalComponent!: ModalComponent;
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @type {boolean}
   * @memberof TercerosRelacionadosContenedoraComponent
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property
   * @name idProcedimiento
   * @type {number}
   * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
   */
  idProcedimiento = ID_PROCEDIMIENTO;

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
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240123Store} tramiteStore - Store de Akita que maneja el estado del trámite.
   * @param {Tramite240123Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @param {Router} router - Servicio para navegar entre rutas.
   * @param {ActivatedRoute} activatedRoute - Servicio para acceder a rutas activas.
   * @returns {void}
   */
  constructor(
    private tramiteStore: Tramite240123Store,
    private tramiteQuery: Tramite240123Query,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
    this.tramiteQuery.getDestinatarioFinalTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
      });
      
    this.proveedorTablaDatos = DATOS_ESTATICOS;
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
   * Modifica los datos de un destinatario final y redirige a la vista de modificación.
   * @method modificarDestinarioDatos
   * @param {DestinoFinal} datos - Datos del destinatario final a modificar.
   * @returns {void}
   */
  modificarDestinarioDatos(datos: DestinoFinal): void {
    this.tramiteStore.actualizarDatosDestinatario(datos);
    this.irAAcciones('../agregar-destino-final');
  }

  /**
   * Modifica los datos de un proveedor y redirige a la vista de modificación.
   * @method modificarProveedorDatos
   * @param {Proveedor} datos - Datos del proveedor a modificar.
   * @returns {void}
   */
  modificarProveedorDatos(datos: Proveedor): void {
    this.tramiteStore.actualizarDatosProveedor(datos);
this.modalComponent.abrir(AgregarProveedorContenedoraComponent, {
          cerrarModal: this.cerrarModal.bind(this),
          data: datos
        });
  }

  /**
   * Elimina el primer DestinoFinal de la tabla de datos. Si no hay destinatarios finales seleccionados, no realiza ninguna acción.
   * @method eliminarDestinatarioFinal
   * @param {DestinoFinal} datos - Datos del destinatario final a eliminar.
   * @returns {void}
   */
  eliminarDestinatarioFinal(datos: DestinoFinal): void {
    if (datos) {
      this.tramiteStore.eliminarDestinatarioFinal(datos);
    }
  }

  /**
   * Elimina el primer Proveedor de la tabla de datos. Si no hay proveedores seleccionados, no realiza ninguna acción.
   * @method eliminarProveedor
   * @param {Proveedor} datos - Datos del proveedor a eliminar.
   * @returns {void}
   */
  eliminarProveedor(datos: Proveedor): void {
    if (datos) {
      this.tramiteStore.eliminareliminarProveedorFinal(datos);
    }
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
}
