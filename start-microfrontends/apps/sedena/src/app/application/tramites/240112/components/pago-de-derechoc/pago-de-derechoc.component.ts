import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ID_PROCEDIMIENTO } from '../../constants/agregar-destinatario.enum';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { Tramite240112Query } from '../../estados/tramite240112Query.query';
import { Tramite240112Store } from '../../estados/tramite240112Store.store';

/**
 * Componente que maneja el formulario de pago de derechos para el trámite 240112.
 *
 * @component
 * @example
 * <app-pago-de-derechoc [formularioDeshabilitado]="true"></app-pago-de-derechoc>
 */
@Component({
  /**
   * Selector para utilizar este componente en plantillas HTML.
   */
  selector: 'app-pago-de-derechoc',

  /**
   * Archivo HTML que define la estructura visual del componente.
   */
  templateUrl: './pago-de-derechoc.component.html',

  /**
   * Archivo SCSS con los estilos específicos para este componente.
   */
  styleUrl: './pago-de-derechoc.component.scss',

  /**
   * Indica que el componente es standalone y los módulos que importa.
   */
  standalone: true,
  imports: [PagoDeDerechosComponent]
})
export class PagoDeDerechocComponent implements OnInit, OnDestroy {

  /**
   * Indica si el formulario debe estar deshabilitado.
   * Cuando es `true`, los controles del formulario están inactivos y no permiten edición.
   * 
   * @input
   * @type {boolean}
   * @default false
   */
  @Input() formularioDeshabilitado: boolean = false;   

  /**
   * Identificador único del procedimiento asociado.
   * 
   * @readonly
   * @type {number}
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Estado actual del formulario de pago de derechos.
   * 
   * @type {PagoDerechosFormState}
   */
  public pagoDerechoFormState!: PagoDerechosFormState;

  /**
   * Subject para manejar la destrucción de suscripciones y evitar fugas de memoria.
   * 
   * @private
   * @type {Subject<void>}
   */
  private destroy$ = new Subject<void>();

  /**
   * Constructor del componente.
   *
   * @param tramiteQuery Query para obtener el estado reactivo del pago de derechos.
   * @param tramiteStore Store para actualizar el estado del pago de derechos.
   */
  constructor(
    public tramiteQuery: Tramite240112Query,
    public tramiteStore: Tramite240112Store
  ) {}

  /**
   * Inicializa el componente y suscribe al observable de estado del pago de derechos.
   * Actualiza la propiedad `pagoDerechoFormState` con los datos emitidos por el query.
   */
  ngOnInit(): void {
    this.tramiteQuery.getPagoDerechos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.pagoDerechoFormState = data;
      });
  }

  /**
   * Método llamado al destruir el componente.
   * Realiza la limpieza de las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Actualiza el estado del formulario de pago de derechos en el store.
   *
   * @param event Estado actualizado del formulario de pago de derechos.
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechosFormState(event);
  }
}
