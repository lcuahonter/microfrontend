import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { ImportacionProductosService } from '../../services/importacion-productos.service';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TercerosRelacionadosFebService } from '../../../../shared/services/tereceros-relacionados-feb.service';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';
import { Tramite260101Store } from '../../estados/tramite260101Store.store';

/**
 * @component TercerosRelacionadosVistaComponent
 * @description
 * Componente de solo lectura que muestra las tablas de terceros relacionados:
 * - Fabricantes
 * - Destinatarios finales
 * - Proveedores
 * - Facturadores
 *
 * Consume observables del `Tramite260101Query` para visualizar los datos en la vista
 * utilizando el componente `TercerosRelacionadosComponent`.
 *
 * @example
 * <app-terceros-relacionados-vista [formularioDeshabilitado]="true"></app-terceros-relacionados-vista>
 */
@Component({
  selector: 'app-terceros-relacionados-vista',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrl: './terceros-relacionados-vista.component.css',
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy {
  /**
   * @input formularioDeshabilitado
   * @description Indica si el formulario se encuentra en modo deshabilitado (solo lectura).
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Lista de fabricantes mostrados en la tabla.
   */
  fabricanteTablaDatos: Fabricante[] = [];

  /**
   * Lista de destinatarios finales mostrados en la tabla.
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];

  /**
   * Lista de proveedores mostrados en la tabla.
   */
  proveedorTablaDatos: Proveedor[] = [];

  /**
   * Lista de facturadores mostrados en la tabla.
   */
  facturadorTablaDatos: Facturador[] = [];

  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Subject para gestionar la destrucción del componente y cancelar todas las suscripciones activas.
   * Previene fugas de memoria.
   * @private
   */
  private destroy$ = new Subject<void>();

  /**
   * Constructor que inyecta los servicios necesarios.
   *
   * @param tramiteStore - Store que maneja el estado del trámite.
   * @param tramiteQuery - Query que expone los datos reactivos desde el store.
   * @param tercerosService - Servicio que obtiene los datos de terceros desde el backend.
   */
  constructor(
    private tramiteStore: Tramite260101Store,
    private tramiteQuery: Tramite260101Query,
    private tercerosService: TercerosRelacionadosFebService,
    private importacionProductosService: ImportacionProductosService
  ) {}

  /**
   * Hook de inicialización del componente.
   * Se suscribe a los observables del store para obtener los datos iniciales.
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
   * Método que carga los datos de terceros desde el backend
   * utilizando el servicio `tercerosService`.
   * Llama internamente a los métodos `add*` para actualizar el store.
   */
  cargarDatos(): void {
    this.importacionProductosService
      .getFabricanteTablaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Fabricante[]) => {
        this.addFabricantes(response);
      });

    this.importacionProductosService
      .getDestinatarioTablaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Destinatario[]) => {
        this.addDestinatarios(response);
      });

    this.importacionProductosService
      .getProveedorTablaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Proveedor[]) => {
        this.addProveedores(response);
      });

    this.importacionProductosService
      .getFacturadorTablaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Facturador[]) => {
        this.addFacturadores(response);
      });
  }

  /**
   * Agrega una lista de fabricantes al store.
   * @param newFabricantes - Arreglo de objetos `Fabricante`.
   */
  addFabricantes(newFabricantes: Fabricante[]): void {
    this.tramiteStore.updateFabricanteTablaDatos(newFabricantes);
  }

  /**
   * Agrega una lista de destinatarios al store.
   * @param newDestinatarios - Arreglo de objetos `Destinatario`.
   */
  addDestinatarios(newDestinatarios: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(newDestinatarios);
  }

  /**
   * Agrega una lista de proveedores al store.
   * @param newProveedores - Arreglo de objetos `Proveedor`.
   */
  addProveedores(newProveedores: Proveedor[]): void {
    this.tramiteStore.updateProveedorTablaDatos(newProveedores);
  }

  /**
   * Agrega una lista de facturadores al store.
   * @param newFacturadores - Arreglo de objetos `Facturador`.
   */
  addFacturadores(newFacturadores: Facturador[]): void {
    this.tramiteStore.updateFacturadorTablaDatos(newFacturadores);
  }

  /**
   * Maneja el evento de modificación de fabricantes.
   * Actualiza el store con la nueva lista.
   * @param fabricante - Lista de objetos `Fabricante` modificados.
   */
  fabricanteEventoModificar(fabricante: Fabricante[]): void {
    this.tramiteStore.fabricanteTablaModificaDatos(fabricante);
  }

  /**
   * Maneja el evento de modificación de destinatarios.
   * Actualiza el store con la nueva lista.
   * @param destinatario - Lista de objetos `Destinatario` modificados.
   */
  destinatarioEventoModificar(destinatario: Destinatario[]): void {
    this.tramiteStore.destinatarioFinalTablaModificaDatos(destinatario);
  }

  /**
   * Hook de destrucción del componente.
   * Emite y completa el subject `destroy$` para cancelar todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
