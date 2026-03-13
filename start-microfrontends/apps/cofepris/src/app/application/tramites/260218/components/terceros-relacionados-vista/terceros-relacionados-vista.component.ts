/**
 * @fileoverview
 * El `TercerosRelacionadosVistaComponent` es un componente de Angular diseñado para mostrar las tablas de terceros relacionados
 * (fabricantes, destinatarios finales, proveedores y facturadores) en modo de solo lectura.
 * Este componente consume observables del store `Tramite260218Store` para renderizar los datos en la vista mediante el componente `TercerosRelacionadosComponent`.
 * 
 * @module TercerosRelacionadosVistaComponent
 * @description
 * Este componente actúa como una vista de solo lectura para mostrar los datos de terceros relacionados en el trámite 260218.
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../constants/pasos.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite260218Query } from '../../estados/tramite260218Query.query';
import { Tramite260218Store } from '../../estados/tramite260218Store.store';

/**
 * @component
 * @name TercerosRelacionadosVistaComponent
 * @description
 * Componente de solo lectura que muestra las tablas de terceros relacionados
 * (fabricantes, destinatarios finales, proveedores y facturadores).
 * Consume observables del store para renderizar los datos en la vista mediante el componente `TercerosRelacionadosComponent`.
 *
 * @selector app-terceros-relacionados-vista
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./terceros-relacionados-vista.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./terceros-relacionados-vista.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - TercerosRelacionadosComponent: Componente compartido para mostrar los datos de terceros relacionados.
 */
@Component({
  selector: 'app-terceros-relacionados-vista',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrl: './terceros-relacionados-vista.component.scss',
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy {

    /**
   * @property elementosRequeridos
   * @description Arreglo de campos requeridos para el formulario de datos de la solicitud,
   * utilizado para propósitos de validación.
   * @type {string[]}
   */
  elementosRequeridos = [
    'fabricante'
  ];

  /**
   * @property {number} idProcedimiento
   * @description
   * Identificador del procedimiento actual.
   */
    idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * @property {Fabricante[]} fabricanteTablaDatos
   * @description
   * Datos de la tabla de fabricantes.
   */
  fabricanteTablaDatos: Fabricante[] = [];

  /**
   * @property {Destinatario[]} destinatarioFinalTablaDatos
   * @description
   * Datos de la tabla de destinatarios finales.
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];

  /**
   * @property {Proveedor[]} proveedorTablaDatos
   * @description
   * Datos de la tabla de proveedores.
   */
  proveedorTablaDatos: Proveedor[] = [];

  /**
   * @property {Facturador[]} facturadorTablaDatos
   * @description
   * Datos de la tabla de facturadores.
   */
  facturadorTablaDatos: Facturador[] = [];

  /**
   * @property {boolean} estaOculto
   * @description
   * Variable booleana que controla si el componente debe estar oculto o no.
   */
  estaOculto: boolean = true;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description
   * Indica si el formulario está en modo solo lectura. Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Subject para gestionar el ciclo de vida del componente y evitar fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  
  @ViewChild(TercerosRelacionadosComponent)
  TercerosRelacionadosComponent!: TercerosRelacionadosComponent;

  /**
   * @constructor
   * @description
   * Constructor que inyecta los servicios necesarios para consultar y actualizar el estado del trámite.
   *
   * @param {Tramite260218Store} tramiteStore - Store que gestiona el estado de los datos del trámite.
   * @param {Tramite260218Query} tramiteQuery - Servicio de consulta que expone observables para leer los datos del store.
   * @param {ConsultaioQuery} consultaQuery - Servicio de consulta para acceder al estado de la consulta.
   */
  constructor(
    private tramiteStore: Tramite260218Store,
    private tramiteQuery: Tramite260218Query,
    private consultaQuery: ConsultaioQuery
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe a varios observables para obtener datos relacionados con fabricantes, destinatarios finales, proveedores y facturadores,
   * y los asigna a las propiedades correspondientes del componente.
   */
  ngOnInit(): void {
    this.tramiteQuery.getFabricanteTablaDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.fabricanteTablaDatos = data;
      });

    this.tramiteQuery.getDestinatarioFinalTablaDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
      });

    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.proveedorTablaDatos = data;
      });

    this.tramiteQuery.getFacturadorTablaDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.facturadorTablaDatos = data;
      });
  }

  /**
   * @method addFabricantes
   * @description
   * Agrega nuevos fabricantes a la tabla de datos del trámite.
   *
   * @param {Fabricante[]} newFabricantes - Lista de objetos `Fabricante` a agregar.
   */
  addFabricantes(newFabricantes: Fabricante[]): void {
    this.tramiteStore.updateFabricanteTablaDatos(newFabricantes);
  }

  /**
   * @method addDestinatarios
   * @description
   * Agrega nuevos destinatarios a la tabla de datos del destinatario final.
   *
   * @param {Destinatario[]} newDestinatarios - Lista de objetos `Destinatario` a agregar.
   */
  addDestinatarios(newDestinatarios: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(newDestinatarios);
  }

  /**
   * @method addProveedores
   * @description
   * Agrega nuevos proveedores a la tabla de datos del trámite.
   *
   * @param {Proveedor[]} newProveedores - Lista de objetos `Proveedor` a agregar.
   */
  addProveedores(newProveedores: Proveedor[]): void {
    this.tramiteStore.updateProveedorTablaDatos(newProveedores);
  }

    validarContenedor(): boolean {
    return (
      this.TercerosRelacionadosComponent?.formularioSolicitudValidacion() ?? false
    );
  }

  /**
   * @method addFacturadores
   * @description
   * Agrega nuevos facturadores a la tabla de datos del trámite.
   *
   * @param {Facturador[]} newFacturadores - Lista de objetos `Facturador` a agregar.
   */
  addFacturadores(newFacturadores: Facturador[]): void {
    this.tramiteStore.updateFacturadorTablaDatos(newFacturadores);
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta antes de destruir el componente.
   * Emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}