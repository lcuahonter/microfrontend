/**
 * @fileoverview
 * El `TercerosRelacionadosVistaComponent` es un componente de Angular diseñado para mostrar las tablas de terceros relacionados
 * (fabricantes, destinatarios finales, proveedores y facturadores) en modo de solo lectura.
 * Este componente consume observables del store `Tramite260213Store` para renderizar los datos en la vista mediante el componente `TercerosRelacionadosComponent`.
 * 
 * @module TercerosRelacionadosVistaComponent
 * @description
 * Este componente actúa como una vista de solo lectura para mostrar los datos de terceros relacionados en el trámite 260213.
 */

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {ELEMENTOS_REQUERIDOS} from '../../constants/medicos-uso.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite260213Query } from '../../estados/tramite260213Query.query';
import { Tramite260213Store } from '../../estados/tramite260213Store.store';


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
 * @styleUrl ./terceros-relacionados-vista.component.css
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - TercerosRelacionadosComponent: Componente compartido para mostrar los datos de terceros relacionados.
 * - HttpClientModule: Proporciona servicios HTTP para la comunicación con APIs.
 */
@Component({
  selector: 'app-terceros-relacionados-vista',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrl: './terceros-relacionados-vista.component.css',
})
export class TercerosRelacionadosVistaComponent implements OnInit {
  /**
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;
      /**
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los elementos del componente no serán editables.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;


  /**
   * @property {Fabricante[]} fabricanteTablaDatos
   * @description
   * Datos de la tabla de fabricantes.
   */
  fabricanteTablaDatos: Fabricante[] = [];


  /**
       * @property {string[]} elementosRequeridos
       * @description
       * Lista de elementos requeridos para completar el formulario o proceso.
       */
  public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS

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
   * @property {Subject<void>} destroy$
   * @description
   * Subject para cancelar suscripciones y evitar fugas de memoria.
   * @private
   */
  private destroy$ = new Subject<void>();
  /**
   * Propiedad que mantiene el estado actual de la consulta dentro del componente.
   */
  public consultaState!: ConsultaioState;
    /**
   * @property {TercerosRelacionadosComponent} TercerosRelacionadosComponent
   * @description Referencia al componente hijo `TercerosRelacionadosComponent`
   * que se utiliza para mostrar las tablas de terceros relacionados.
   */
  @ViewChild(TercerosRelacionadosComponent) TercerosRelacionadosComponent!: TercerosRelacionadosComponent;

  /**
   * @constructor
   * @description
   * Constructor que inyecta los servicios necesarios para consultar y actualizar el estado del trámite.
   * 
   * @param {Tramite260213Store} tramiteStore - Store que gestiona el estado de los datos del trámite.
   * @param {Tramite260213Query} tramiteQuery - Servicio de consulta que expone observables para leer los datos del store.
   */
  constructor(
    private tramiteStore: Tramite260213Store,
    private tramiteQuery: Tramite260213Query,
   private consultaQuery: ConsultaioQuery  
     ) { 
      this.consultaQuery.selectConsultaioState$
          .pipe(takeUntil(this.destroy$))
          .subscribe((seccionState) => {
            this.esFormularioSoloLectura = seccionState.readonly;
            this.consultaState = seccionState;



          });
     }
   
  

  /**
   * @method ngOnInit
   * @description
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe los observables para mostrar los datos en la vista.
   */
  ngOnInit(): void {
    this.tramiteQuery.getFabricanteTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.fabricanteTablaDatos = data;
      });

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

    this.tramiteQuery.getFacturadorTablaDatos$
      .pipe(takeUntil(this.destroy$))
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
   * @description
   * Método que se encarga de validar el formulario contenido en
   * el componente `TercerosRelacionadosComponent`.
   *
   * Utiliza el método `formularioSolicitudValidacion()` del componente hijo
   * para comprobar si el formulario es válido.
   * En caso de que el hijo no esté inicializado o devuelva `null/undefined`,
   * se retorna `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el formulario es válido.
   * - `false`: si el formulario no es válido o el componente hijo aún no está disponible.
   */
  validarContenedor(): boolean {
    return (
      this.TercerosRelacionadosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
}