import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../../../240114/components/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../../../240114/components/agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240114Query } from '../../estados/tramite240114Query.query';
import { Tramite240114Store } from '../../estados/tramite240114Store.store';

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
})
export class TercerosRelacionadosContenedoraComponent implements OnInit {
  /**
   * Referencia al componente Modal utilizado para mostrar formularios dinámicos.
   * @type {ModalComponent}
   * @memberof TercerosRelacionadosContenedoraComponent
   * @description Componente Modal utilizado para mostrar formularios dinámicos.
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;
  /**
   * Observable para limpiar las suscripciones activas al destruir el componente.
   * @property {Subject<void>} destroy$
   */
  private destroy$ = new Subject<void>();

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
   * @property {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240114Store} tramiteStore - Store de Akita que maneja el estado del trámite.
   * @param {Tramite240114Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de la consulta.
   * @param {Router} router - Router de Angular para la navegación.
   * @param {ActivatedRoute} activatedRoute - ActivatedRoute de Angular para obtener parámetros de ruta.
   * @returns {void}
   */
  constructor(
    private tramiteStore: Tramite240114Store,
    private tramiteQuery: Tramite240114Query,
    private consultaQuery: ConsultaioQuery,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
      });

    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.proveedorTablaDatos = data;
      });
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
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
 * Actualiza la lista de destinatarios finales en el store del trámite.
 *
 * @method modificarDestinarioDatos
 * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
 * @returns {void}
 */
  modificarDestinarioDatos(datos: DestinoFinal): void {
    this.tramiteStore.actualizarDatosDestinatario(datos);
    this.irAAcciones();
  }
  /**
   * Actualiza la lista de proveedores en el store del trámite.
   *
   * @method modificarProveedorDatos
   * @param {Proveedor} datos - Proveedor a modificar.
   * @returns {void}
   */
  modificarProveedorDatos(datos: Proveedor): void {
    this.tramiteStore.actualizarDatosProveedor(datos);
    this.irAAccionesProveedor();
  }

  /**
   * Navega a una ruta relativa dentro del flujo actual.
   * @method irAAcciones
   * @param {string} accionesPath - Ruta relativa a la que se desea navegar.
   * @returns {void}
   */
  irAAcciones(): void {
    this.router.navigate(['../agregar-destino-final'], {
      relativeTo: this.activatedRoute,
    });
  }
  /**
   * Navega a una ruta relativa dentro del flujo actual.
   * @method irAAcciones
   * @param {string} accionesPath - Ruta relativa a la que se desea navegar.
   * @returns {void}
   */
  irAAccionesProveedor(): void {
    this.router.navigate(['../agregar-proveedor'], {
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
}
