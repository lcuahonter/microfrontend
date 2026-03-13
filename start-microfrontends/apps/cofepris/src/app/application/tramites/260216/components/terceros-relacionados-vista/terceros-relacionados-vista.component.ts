/**
 * @fileoverview
 * El `TercerosRelacionadosVistaComponent` es un componente de Angular diseñado para mostrar las tablas de terceros relacionados (fabricantes, destinatarios finales, proveedores y facturadores).
 * Este componente es de solo lectura y consume observables del store para renderizar los datos en la vista mediante el componente `TercerosRelacionadosComponent`.
 * 
 * @module TercerosRelacionadosVistaComponent
 * @description
 * Este componente encapsula la lógica para mostrar los datos de terceros relacionados en el trámite 260216.
 * Permite agregar nuevos datos a las tablas de fabricantes, destinatarios finales, proveedores y facturadores.
 */

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Tramite260216Query } from '../../estados/tramite260216Query.query';
import { Tramite260216Store } from '../../estados/tramite260216Store.store';

@Component({
  selector: 'app-terceros-relacionados-vista',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrl: './terceros-relacionados-vista.component.css',
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario está deshabilitado.
   * @property {boolean} formularioDeshabilitado
   * @defaultValue false
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Datos de la tabla de fabricantes.
   * @property {Fabricante[]} fabricanteTablaDatos
   * @defaultValue []
   */
  fabricanteTablaDatos: Fabricante[] = [];

  @ViewChild(TercerosRelacionadosComponent)
      tercerosRelacionadosComponent!: TercerosRelacionadosComponent;
      

  /**
   * Datos de la tabla de destinatarios finales.
   * @property {Destinatario[]} destinatarioFinalTablaDatos
   * @defaultValue []
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];

  /**
   * Datos de la tabla de proveedores.
   * @property {Proveedor[]} proveedorTablaDatos
   * @defaultValue []
   */
  proveedorTablaDatos: Proveedor[] = [];

  /**
   * Datos de la tabla de facturadores.
   * @property {Facturador[]} facturadorTablaDatos
   * @defaultValue []
   */
  facturadorTablaDatos: Facturador[] = [];

  /**
   * Subject para cancelar suscripciones y evitar fugas de memoria.
   * @property {Subject<void>} destroy$
   * @private
   */
  private destroy$ = new Subject<void>();

   /**
       * @property {string[]} elementosRequeridos
       * @description
       * Lista de elementos requeridos para completar el formulario o proceso.
       */
   public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS;

  /**
   * Constructor del componente.
   * @constructor
   * @param {Tramite260216Store} tramiteStore - Store que gestiona el estado de los datos del trámite.
   * @param {Tramite260216Query} tramiteQuery - Servicio de consulta que expone observables para leer los datos del store.
   */
  constructor(
    private tramiteStore: Tramite260216Store,
    private tramiteQuery: Tramite260216Query
  ) {}

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe los observables para mostrar los datos en la vista.
   * @method ngOnInit
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
   * Agrega nuevos fabricantes a la tabla de datos del trámite.
   * @method addFabricantes
   * @param {Fabricante[]} newFabricantes - Lista de objetos `Fabricante` a agregar.
   */
  addFabricantes(newFabricantes: Fabricante[]): void {
    this.tramiteStore.updateFabricanteTablaDatos(newFabricantes);
  }

  /**
   * Agrega nuevos destinatarios a la tabla de datos del destinatario final.
   * @method addDestinatarios
   * @param {Destinatario[]} newDestinatarios - Lista de objetos `Destinatario` a agregar.
   */
  addDestinatarios(newDestinatarios: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(newDestinatarios);
  }

  /**
   * Agrega nuevos proveedores a la tabla de datos del trámite.
   * @method addProveedores
   * @param {Proveedor[]} newProveedores - Lista de objetos `Proveedor` a agregar.
   */
  addProveedores(newProveedores: Proveedor[]): void {
    this.tramiteStore.updateProveedorTablaDatos(newProveedores);
  }

  /**
   * Agrega nuevos facturadores a la tabla de datos del trámite.
   * @method addFacturadores
   * @param {Facturador[]} newFacturadores - Lista de objetos `Facturador` a agregar.
   */
  addFacturadores(newFacturadores: Facturador[]): void {
    this.tramiteStore.updateFacturadorTablaDatos(newFacturadores);
  }

   validarContenedor(): boolean {
    return (
      this.tercerosRelacionadosComponent?.formularioSolicitudValidacion() ?? false
    );
  }

  /**
   * Hook del ciclo de vida que se ejecuta antes de destruir el componente.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}