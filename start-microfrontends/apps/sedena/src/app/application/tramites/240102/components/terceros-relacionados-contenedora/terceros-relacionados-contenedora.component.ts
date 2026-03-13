import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarDestinatarioFinalContenedoraComponent } from '../agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from '../agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite240102Query } from '../../estados/tramite240102Query.query';

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
  implements OnInit, OnDestroy
{

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

  public idProcedimiento = ID_PROCEDIMIENTO; // ID del procedimiento actual
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
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @type {boolean}
   * @memberof TercerosRelacionadosContenedoraComponent
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @constructor
   * @param {Tramite240102Query} tramiteQuery - Query de Akita para obtener los datos del trámite.
   * @param {ConsultaioQuery} consultaQuery - Query para consultar información adicional.
   * @returns {void}
   */
  constructor(
    private tramiteQuery: Tramite240102Query,
    private consultaQuery: ConsultaioQuery
  ) {}

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
}
