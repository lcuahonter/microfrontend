import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import {ELEMENTOS_REQUERIDOS} from '../../constants/destinados-donacio.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite260209Query } from '../../estados/tramite260209Query.query';
import { Tramite260209Store } from '../../estados/tramite260209Store.store';


/**
 * @component TercerosRelacionadosVistaComponent
 * @description Componente de solo lectura que muestra las tablas de terceros relacionados
 * (fabricantes, destinatarios finales, proveedores y facturadores).
 * Consume observables del store para renderizar los datos en la vista mediante el componente
 * `TercerosRelacionadosComponent`.
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
   * @property {Fabricante[]} fabricanteTablaDatos
   * @description Almacena la lista de fabricantes que se muestran en la tabla correspondiente.
   * Esta propiedad contiene todos los datos de fabricantes asociados al trámite actual
   * y se actualiza automáticamente cuando el store notifica cambios.
   * @public
   * @type {Fabricante[]}
   * @default []
   */
  fabricanteTablaDatos: Fabricante[] = [];

  /**
   * @property {Destinatario[]} destinatarioFinalTablaDatos
   * @description Almacena la lista de destinatarios finales que se muestran en la tabla correspondiente.
   * Esta propiedad contiene todos los datos de destinatarios finales asociados al trámite actual
   * y se actualiza automáticamente cuando el store notifica cambios.
   * @public
   * @type {Destinatario[]}
   * @default []
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];

  /**
   * @property {Proveedor[]} proveedorTablaDatos
   * @description Almacena la lista de proveedores que se muestran en la tabla correspondiente.
   * Esta propiedad contiene todos los datos de proveedores asociados al trámite actual
   * y se actualiza automáticamente cuando el store notifica cambios.
   * @public
   * @type {Proveedor[]}
   * @default []
   */
  proveedorTablaDatos: Proveedor[] = [];

  
    @ViewChild('TercerosRelacionadosComponent')
    tercerosRelacionadosComponent!: TercerosRelacionadosComponent;
       
 /**
    * @property {string[]} elementosRequeridos
    * @description
    * Lista de elementos requeridos para completar el formulario o proceso.
    */
   public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS; 
 
  /**
   * @property {Facturador[]} facturadorTablaDatos
   * @description Almacena la lista de facturadores que se muestran en la tabla correspondiente.
   * Esta propiedad contiene todos los datos de facturadores asociados al trámite actual
   * y se actualiza automáticamente cuando el store notifica cambios.
   * @public
   * @type {Facturador[]}
   * @default []
   */
  facturadorTablaDatos: Facturador[] = [];

  /**
   * @property {Subject<void>} destroy$
   * @description Subject utilizado para el patrón de cancelación de suscripciones RxJS.
   * Se utiliza para evitar fugas de memoria cancelando todas las suscripciones activas
   * cuando el componente es destruido. Emite un valor en ngOnDestroy() y luego se completa.
   * @private
   * @type {Subject<void>}
   */
  private destroy$ = new Subject<void>();

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado. Por defecto es `false`.
   */
  @Input()
  formularioDeshabilitado: boolean = false;

  /**
   * @constructor
   * @description Constructor del componente que inyecta las dependencias necesarias para
   * gestionar el estado del trámite y configurar las suscripciones iniciales.
   * Inicializa la suscripción al estado de consulta para determinar si el formulario
   * debe estar en modo de solo lectura.
   *
   * @param {Tramite260209Store} tramiteStore - Store que gestiona el estado global de los datos del trámite 260209.
   *                                            Proporciona métodos para actualizar las tablas de terceros relacionados.
   * @param {Tramite260209Query} tramiteQuery - Servicio de consulta que expone observables para leer los datos del store.
   *                                            Permite suscribirse a cambios en las tablas de datos.
   * @param {ConsultaioQuery} consultaQuery - Servicio de consulta que maneja el estado de la consulta,
   *                                          incluyendo si el formulario está en modo de solo lectura.
   * 
   * @memberof TercerosRelacionadosVistaComponent
   * @since 1.0.0
   */
  constructor(
    private tramiteStore: Tramite260209Store,
    private tramiteQuery: Tramite260209Query,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío, se inyectan los servicios necesarios para el funcionamiento del componente.
  }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida de Angular que se ejecuta después de que Angular
   * haya inicializado todas las propiedades del componente. Configura todas las suscripciones
   * a los observables del store para mantener sincronizados los datos de las tablas
   * con el estado global del trámite.
   * 
   * Suscribe a los siguientes observables:
   * - getFabricanteTablaDatos$: Para actualizar la tabla de fabricantes
   * - getDestinatarioFinalTablaDatos$: Para actualizar la tabla de destinatarios finales
   * - getProveedorTablaDatos$: Para actualizar la tabla de proveedores
   * - getFacturadorTablaDatos$: Para actualizar la tabla de facturadores
   * 
   * @returns {void} No retorna ningún valor.
   * @memberof TercerosRelacionadosVistaComponent
   * @implements {OnInit}
   * @since 1.0.0
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
   * @description Método público que permite agregar nuevos fabricantes a la tabla de datos del trámite.
   * Utiliza el store para actualizar el estado global y notificar a todos los suscriptores
   * sobre los cambios en la lista de fabricantes.
   * 
   * @param {Fabricante[]} newFabricantes - Lista de objetos `Fabricante` que se van a agregar
   *                                        a la tabla existente. Cada fabricante debe contener
   *                                        las propiedades requeridas del modelo Fabricante.
   * @returns {void} No retorna ningún valor.
   * @memberof TercerosRelacionadosVistaComponent
   * @since 1.0.0
   * @example
   * ```typescript
   * const nuevosFabricantes: Fabricante[] = [
   *   { id: 1, nombre: 'Fabricante 1', rfc: 'FAB123456' },
   *   { id: 2, nombre: 'Fabricante 2', rfc: 'FAB789012' }
   * ];
   * this.addFabricantes(nuevosFabricantes);
   * ```
   */
  addFabricantes(newFabricantes: Fabricante[]): void {
    this.tramiteStore.updateFabricanteTablaDatos(newFabricantes);
  }

  /**
   * @method addDestinatarios
   * @description Método público que permite agregar nuevos destinatarios finales a la tabla de datos del trámite.
   * Utiliza el store para actualizar el estado global y notificar a todos los suscriptores
   * sobre los cambios en la lista de destinatarios finales.
   *
   * @param {Destinatario[]} newDestinatarios - Lista de objetos `Destinatario` que se van a agregar
   *                                            a la tabla existente. Cada destinatario debe contener
   *                                            las propiedades requeridas del modelo Destinatario.
   * @returns {void} No retorna ningún valor.
   * @memberof TercerosRelacionadosVistaComponent
   * @since 1.0.0
   * @example
   * ```typescript
   * const nuevosDestinatarios: Destinatario[] = [
   *   { id: 1, nombre: 'Destinatario 1', direccion: 'Calle 123' },
   *   { id: 2, nombre: 'Destinatario 2', direccion: 'Avenida 456' }
   * ];
   * this.addDestinatarios(nuevosDestinatarios);
   * ```
   */
  addDestinatarios(newDestinatarios: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(newDestinatarios);
  }

  validarContenedor(): boolean {
    return (
      this.tercerosRelacionadosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
  /**
   * @method addProveedores
   * @description Método público que permite agregar nuevos proveedores a la tabla de datos del trámite.
   * Utiliza el store para actualizar el estado global y notificar a todos los suscriptores
   * sobre los cambios en la lista de proveedores.
   *
   * @param {Proveedor[]} newProveedores - Lista de objetos `Proveedor` que se van a agregar
   *                                       a la tabla existente. Cada proveedor debe contener
   *                                       las propiedades requeridas del modelo Proveedor.
   * @returns {void} No retorna ningún valor.
   * @memberof TercerosRelacionadosVistaComponent
   * @since 1.0.0
   * @example
   * ```typescript
   * const nuevosProveedores: Proveedor[] = [
   *   { id: 1, nombre: 'Proveedor 1', rfc: 'PRO123456' },
   *   { id: 2, nombre: 'Proveedor 2', rfc: 'PRO789012' }
   * ];
   * this.addProveedores(nuevosProveedores);
   * ```
   */
  addProveedores(newProveedores: Proveedor[]): void {
    this.tramiteStore.updateProveedorTablaDatos(newProveedores);
  }

  /**
   * @method addFacturadores
   * @description Método público que permite agregar nuevos facturadores a la tabla de datos del trámite.
   * Utiliza el store para actualizar el estado global y notificar a todos los suscriptores
   * sobre los cambios en la lista de facturadores.
   *
   * @param {Facturador[]} newFacturadores - Lista de objetos `Facturador` que se van a agregar
   *                                         a la tabla existente. Cada facturador debe contener
   *                                         las propiedades requeridas del modelo Facturador.
   * @returns {void} No retorna ningún valor.
   * @memberof TercerosRelacionadosVistaComponent
   * @since 1.0.0
   * @example
   * ```typescript
   * const nuevosFacturadores: Facturador[] = [
   *   { id: 1, nombre: 'Facturador 1', rfc: 'FAC123456' },
   *   { id: 2, nombre: 'Facturador 2', rfc: 'FAC789012' }
   * ];
   * this.addFacturadores(nuevosFacturadores);
   * ```
   */
  addFacturadores(newFacturadores: Facturador[]): void {
    this.tramiteStore.updateFacturadorTablaDatos(newFacturadores);
  }

   /**
   * @method ngOnDestroy
   * @description Hook del ciclo de vida de Angular que se ejecuta justo antes de que el componente sea destruido.
   * Implementa el patrón de limpieza de suscripciones RxJS para evitar fugas de memoria.
   * 
   * Este método:
   * 1. Emite un valor a través del observable `destroy$` para notificar a todos los suscriptores
   *    que el componente está siendo destruido
   * 2. Completa el observable `destroy$` para liberar todos los recursos asociados
   * 3. Cancela automáticamente todas las suscripciones que utilizan `takeUntil(this.destroy$)`
   *
   * @returns {void} No retorna ningún valor.
   * @memberof TercerosRelacionadosVistaComponent
   * @implements {OnDestroy}
   * @since 1.0.0
   * @see {@link https://angular.io/guide/lifecycle-hooks#ondestroy} Documentación oficial de Angular sobre OnDestroy
   * @example
   * ```typescript
   * // Este método se llama automáticamente por Angular
   * // No es necesario llamarlo manualmente
   * ```
   */
   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
