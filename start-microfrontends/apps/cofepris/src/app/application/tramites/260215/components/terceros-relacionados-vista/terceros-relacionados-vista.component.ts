import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {Destinatario, Fabricante, Facturador, Proveedor } from "../../../../shared/models/terceros-relacionados.model";
import { Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { ServiciosPermisoSanitarioService } from "../../services/servicios-permiso-sanitario.service";
import { TercerosRelacionadosComponent } from "../../../../shared/components/terceros-relacionados/terceros-relacionados.component";
import { TercerosRelacionadosFebService } from "../../../../shared/services/tereceros-relacionados-feb.service";
import { Tramite260215Query } from "../../estados/queries/tramite260215.query";
import { Tramite260215Store } from "../../estados/tramites/tramite260215.store";


/**
 * @component TercerosRelacionadosVistaComponent
 * @description
 * Componente de solo lectura que muestra las tablas de terceros relacionados:
 * - Fabricantes
 * - Destinatarios finales
 * - Proveedores
 * - Facturadores
 *
 * Consume observables del `Tramite260214Query` para visualizar los datos en la vista
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
   * @property {string[]} elementosRequeridos
   * Lista de elementos requeridos para completar el formulario o proceso.
   */
  public readonly elementosRequeridos = [
    'calle',
    'correoElectronico',
    'denominacionRazon',
    'scian',
    'numeroExterior'
  ];
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

    
     @ViewChild(TercerosRelacionadosComponent)
          tercerosRelacionadosComponent!: TercerosRelacionadosComponent;

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
    private tramiteStore: Tramite260215Store,
    private tramiteQuery: Tramite260215Query,
    private tercerosService: TercerosRelacionadosFebService,
    private importacionDispositivosMedicosUsoService: ServiciosPermisoSanitarioService
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
      .subscribe((data: Facturador[]) => {
        this.facturadorTablaDatos = data;
      });
  }

  /**
   * Método que carga los datos de terceros desde el backend
   * utilizando el servicio `tercerosService`.
   * Llama internamente a los métodos `add*` para actualizar el store.
   */
  cargarDatos(): void {
    this.importacionDispositivosMedicosUsoService
      .getFabricanteTablaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Fabricante[]) => {
        this.addFabricantes(response);
      });

    this.importacionDispositivosMedicosUsoService
      .getDestinatarioTablaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Destinatario[]) => {
        this.addDestinatarios(response);
      });

    this.importacionDispositivosMedicosUsoService
      .getProveedorTablaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Proveedor[]) => {
        this.addProveedores(response);
      });

    this.importacionDispositivosMedicosUsoService
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
   * Maneja el evento de modificación de proveedores.
   * Actualiza el store con la nueva lista.
   * @param proveedor - Lista de objetos `Proveedor` modificados.
   */
  proveedorEventoModificar(proveedor: Proveedor[]): void {
    this.tramiteStore.proveedorTablaModificaDatos(proveedor);
  }

  /**
   * Maneja el evento de modificación de facturadores.
   * Actualiza el store con la nueva lista.
   * @param facturador - Lista de objetos `Facturador` modificados.
   */
  facturadorEventoModificar(facturador: Facturador[]): void {
    this.tramiteStore.facturadorTablaModificaDatos(facturador);
  }
/**
   * @method validarContenedor
   * @description
   * Valida el contenedor delegando la validación al componente hijo.
   * @returns {boolean} True si la validación es exitosa, false en caso contrario.
   */

  validarContenedor(): boolean {
    return (
      this.tercerosRelacionadosComponent?.formularioSolicitudValidacion() ?? false
    );
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
