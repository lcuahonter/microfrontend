import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { BusquedaPermisos140216State, Tramite140216Store } from '../../estados/tramites/tramite140216.store';
import { PermisosVigentesRespuesta } from '../../models/suspension-permiso.model';
import { SuspensionPermisoService } from '../../services/suspension-permiso/suspension-permiso.service';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite140216Query } from '../../estados/queries/tramite140216.query';

/**
 * Componente para mostrar el detalle de un permiso.
 */
@Component({
  selector: 'app-detalle-del-permiso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent
  ],
  templateUrl: './detalle-del-permiso.component.html',
  styleUrl: './detalle-del-permiso.component.scss',
})
export class DetalleDelPermisoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al formulario reactivo de detallePermiso.
   * @type {FormGroup}
   */
  detallePermisoForm!: FormGroup;

  /**
   * Referencia al store de la sección de tramite 140216.
   */
  public busquedaPermisosState!: BusquedaPermisos140216State;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite140216Store - Store para gestionar el estado del trámite 140216.
   * @param tramite140216Query - Query para obtener datos del store del trámite 140216.
   * @param suspensionPermisoService - Servicio para gestionar permisos de suspensión.
   */
  constructor(
    private fb: FormBuilder,
    private tramite140216Store: Tramite140216Store,
    private tramite140216Query: Tramite140216Query,
    private suspensionPermisoService: SuspensionPermisoService,
  ) {
    // El constructor se utiliza para la inyección de dependencias
  }

  /**
   * Inicializa el componente.
   * Suscribe a los cambios en el estado de la sección y crea el formulario reactivo.
   */
  ngOnInit(): void {
    this.tramite140216Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.busquedaPermisosState = seccionState;
        })
      )
      .subscribe();

    // Inicializar el formulario principal
    this.crearDetallePermisoForm();

    this.obtenerDetallePermiso();
  }

  /**
   * Crea el formulario de solicitud.
   * @return {void} No retorna ningún valor.
   */
  crearDetallePermisoForm(): void {
    this.detallePermisoForm = this.fb.group({
      folio: [
        { value: this.busquedaPermisosState?.folio, disabled: true }
      ],
      tipoSolicitud: [
        { value: this.busquedaPermisosState?.tipoSolicitud, disabled: true }
      ],
      regimen: [
        { value: this.busquedaPermisosState?.regimen, disabled: true }
      ],
      clasificacionRegimen: [
        { value: this.busquedaPermisosState?.clasificacionRegimen, disabled: true }
      ],
      vigenciaPeriodo: [
        { value: this.busquedaPermisosState?.vigenciaPeriodo, disabled: true }
      ],
      unidadMedida: [
        { value: this.busquedaPermisosState?.unidadMedida, disabled: true }
      ],
      cantidad: [
        { value: this.busquedaPermisosState?.cantidad, disabled: true }
      ],
      valorFacturaUSD: [
        { value: this.busquedaPermisosState?.valorFacturaUSD, disabled: true }
      ],
      saldo: [
        { value: this.busquedaPermisosState?.saldo, disabled: true }
      ],
      fraccionArancelaria: [
        { value: this.busquedaPermisosState?.fraccionArancelaria, disabled: true }
      ],
      nico: [
        { value: this.busquedaPermisosState?.nico, disabled: true }
      ],
      nicoDescripcion: [
        { value: this.busquedaPermisosState?.nicoDescripcion, disabled: true }
      ],
      acotacion: [
        { value: this.busquedaPermisosState?.acotacion, disabled: true }
      ],
      descripcionMercancia: [
        { value: this.busquedaPermisosState?.descripcionMercancia, disabled: true }
      ],
      paisProcedencia: [
        { value: this.busquedaPermisosState?.paisProcedencia, disabled: true }
      ]
    });
  }

  /**
   * Obtiene el detalle del permiso vigente.
   * @returns {void}
   */
  obtenerDetallePermiso(): void {
    this.suspensionPermisoService.obtenerPermisosVigentes()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (detallePermiso: PermisosVigentesRespuesta) => {
          const PERMISOS_VIGENTES = detallePermiso.data[0];
          this.detallePermisoForm.patchValue({
            folio: PERMISOS_VIGENTES.numeroResolucion,
            tipoSolicitud: PERMISOS_VIGENTES.tipoSolicitud,
            regimen: PERMISOS_VIGENTES.regimen,
            clasificacionRegimen: PERMISOS_VIGENTES.clasificacionRegimen,
            vigenciaPeriodo: PERMISOS_VIGENTES.periodoDeVigencia,
            unidadMedida: PERMISOS_VIGENTES.unidad,
            cantidad: PERMISOS_VIGENTES.cantidadAutorizada,
            valorFacturaUSD: PERMISOS_VIGENTES.valorAutorizado,
            saldo: PERMISOS_VIGENTES.saldo,
            fraccionArancelaria: PERMISOS_VIGENTES.fraccionArancelaria,
            nico: PERMISOS_VIGENTES.nico,
            nicoDescripcion: PERMISOS_VIGENTES.nicoDescripcion,
            acotacion: PERMISOS_VIGENTES.acotacion,
            descripcionMercancia: PERMISOS_VIGENTES.descripcionMercancia,
            paisProcedencia: PERMISOS_VIGENTES.paisProcedencia
          });
        }
      });
  }

  /**
   * Establece los valores en el store de tramite140216.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite140216Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite140216Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}