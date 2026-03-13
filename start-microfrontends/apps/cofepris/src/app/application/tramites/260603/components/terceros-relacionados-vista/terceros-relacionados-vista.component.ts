import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { TercerosRelacionadosComponent } from '../../../../shared/components/shared2606/terceros-relacionados/terceros-relacionados.component';
import { Tramite260603Query } from '../../estados/tramite260603Query.query';
import { Tramite260603Store } from '../../estados/tramite260603Store.store';

/**
 * @component TercerosRelacionadosVistaComponent
 * @description
 * Componente de solo lectura que muestra las tablas de terceros relacionados:
 * - Facturadores
 *
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
  styleUrl: './terceros-relacionados-vista.component.scss',
})
/**
 * @Component TercerosRelacionadosVistaComponent
 * @description
 * Componente de solo lectura que muestra las tablas de terceros relacionados:
 * - Facturadores
 *
 * utilizando el componente `TercerosRelacionadosComponent`.
 */
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy {
  /**
   * @input formularioDeshabilitado
   * @description Indica si el formulario se encuentra en modo deshabilitado (solo lectura).
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * @name idProcedimiento
   * @type {number}
   * @description Identificador numérico del procedimiento. Se utiliza para
   * referenciar el trámite/procedimiento en llamadas a servicios y rutas.
   */
  idProcedimiento: number = 260603;

  /**
   * @name elementosRequeridos
   * @type {string[]}
   * @description Arreglo que contiene los nombres de los elementos que son requeridos
   * en el formulario de terceros relacionados.
   */
  elementosRequeridos: string[] = ['facturador'];

  /**
   * Subject para gestionar la destrucción del componente y cancelar todas las suscripciones activas.
   * Previene fugas de memoria.
   * @private
   */
  private destroy$ = new Subject<void>();

  /**
   * @name facturadorDatos
   * @type {Facturador[]}
   * @description Arreglo que almacena la información del facturador seleccionada
   * o modificada desde el componente hijo.
   * Se actualiza mediante el método `facturadorEventoModificar`.
   */
  public facturadorDatos: Facturador[] = [];

  /**
   * @property {TercerosRelacionadosComponent} TercerosRelacionadosComponent
   * @description Referencia al componente hijo `TercerosRelacionadosComponent`
   * que se utiliza para mostrar las tablas de terceros relacionados.
   */
  @ViewChild(TercerosRelacionadosComponent)
  TercerosRelacionadosComponent!: TercerosRelacionadosComponent;

  /**
   * Constructor que inyecta los servicios necesarios.
   *
   * @param tramiteStore - Store que maneja el estado del trámite.
   * @param tramiteQuery - Query que expone los datos reactivos desde el store.
   */
  constructor(
    public tramite260603Store: Tramite260603Store,
    public tramite260603Query: Tramite260603Query
  ) {}

  /**
   * Hook de inicialización del componente.
   * Suscribe los observables para mostrar los datos en la vista.
   */
  ngOnInit(): void {
    this.tramite260603Query.getFacturadorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.facturadorDatos = data;
      });
  }

  /**
   * @name facturadorEventoModificar
   * @description Método encargado de actualizar los datos del facturador cuando
   * se emite un evento desde el componente hijo.
   * Recibe un arreglo de objetos `Facturador` y actualiza la propiedad
   * `facturadorDatos` del componente.
   */
  facturadorEventoModificar(evento: Facturador[]): void {
    this.facturadorDatos = evento;
  }

  /**
   * @method addFacturadores
   * @description Agrega nuevos facturadores a la tabla de datos del trámite.
   *
   * @param newFacturadores - Lista de objetos `Facturador` a agregar.
   */
  addFacturadores(newFacturadores: Facturador[]): void {
    this.tramite260603Store.updateFacturadorTablaDatos(newFacturadores);
  }

  /**
   * @method validarContenedor
   * @description Método que valida el contenedor del formulario de terceros relacionados.
   * Utiliza el método `formularioSolicitudValidacion` del componente hijo
   * `TercerosRelacionadosComponent` para determinar si el formulario es válido.
   *
   * @returns {boolean} Retorna `true` si el formulario es válido, `false` en caso contrario.
   */
  validarContenedor(): boolean {
    return (
      this.TercerosRelacionadosComponent?.formularioSolicitudValidacion() ??
      false
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
