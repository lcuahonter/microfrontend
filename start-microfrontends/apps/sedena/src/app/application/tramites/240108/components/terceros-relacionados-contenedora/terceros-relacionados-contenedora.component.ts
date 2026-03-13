import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-explosivo.enum';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240108Query } from '../../estados/tramite240108Query.query';
import { Tramite240108Store } from '../../estados/tramite240108Store.store';

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
export class TercerosRelacionadosContenedoraComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no son editables por el usuario.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Referencia al componente modal para abrir y cerrar diálogos.
   * @type {ModalComponent}
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Identificador del procedimiento.
   * @property {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

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
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240108Store} tramiteStore - Store de Akita que maneja el estado del trámite.
   * @param {Tramite240108Query} tramiteQuery - Query de Akita para obtener datos del trámite.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240108Query,
    private tramiteStore: Tramite240108Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
    this.irAAcciones('../agregar-destino-final');
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
    this.irAAcciones('../agregar-destino-final')
  }

  /**
   * Navega a una ruta relativa dentro del flujo actual.
   * @method irAAcciones
   * @param {string} accionesPath - Ruta relativa a la que se desea navegar.
   * @returns {void}
   */
  irAAcciones(accionesPath: string): void {
    this.router.navigate([accionesPath], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * 
   * Emite y completa el observable `destroy$` para limpiar suscripciones activas
   * y prevenir fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
