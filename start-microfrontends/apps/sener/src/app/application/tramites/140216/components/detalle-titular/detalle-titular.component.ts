import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { BusquedaPermisos140216State, Tramite140216Store } from '../../estados/tramites/tramite140216.store';
import { SuspensionPermisoService } from '../../services/suspension-permiso/suspension-permiso.service';
import { TitularDetalleRespuesta } from '../../models/suspension-permiso.model';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite140216Query } from '../../estados/queries/tramite140216.query';

/**
 * Componente para mostrar el detalle del titular.
 */
@Component({
  selector: 'app-detalle-titular',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent
  ],
  templateUrl: './detalle-titular.component.html',
  styleUrl: './detalle-titular.component.scss',
})
export class DetalleTitularComponent implements OnInit, OnDestroy {
  /**
   * Referencia al formulario reactivo de solicitud.
   * @type {FormGroup}
   */
  solicitudForm!: FormGroup;

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
    this.crearFormSolicitud();

    this.obtenerDetalleTitular();
  }

  /**
   * Crea el formulario de solicitud.
   * @return {void} No retorna ningún valor.
   */
  crearFormSolicitud(): void {
    this.solicitudForm = this.fb.group({
      datosGenerales: this.fb.group({
        denominacion: [
          { value: this.busquedaPermisosState?.denominacion, disabled: true }
        ],
        actividadEconomica: [
          { value: this.busquedaPermisosState?.actividadEconomica, disabled: true }
        ],
        correoElectronico: [
          { value: this.busquedaPermisosState?.correoElectronico, disabled: true }
        ],
        rfc: [
          { value: this.busquedaPermisosState?.rfc, disabled: true }
        ]
      }),
      domicilioFiscal: this.fb.group({
        calle: [
          { value: this.busquedaPermisosState?.calle, disabled: true }
        ],
        numeroExterior: [
          { value: this.busquedaPermisosState?.numeroExterior, disabled: true }
        ],
        numeroInterior: [
          { value: this.busquedaPermisosState?.numeroInterior, disabled: true }
        ],
        codigoPostal: [
          { value: this.busquedaPermisosState?.codigoPostal, disabled: true }
        ],
        colonia: [
          { value: this.busquedaPermisosState?.colonia, disabled: true }
        ],
        pais: [
          { value: this.busquedaPermisosState?.pais, disabled: true }
        ],
        estado: [
          { value: this.busquedaPermisosState?.estado, disabled: true }
        ],
        localidad: [
          { value: this.busquedaPermisosState?.localidad, disabled: true }
        ],
        municipioAlcaldia: [
          { value: this.busquedaPermisosState?.municipioAlcaldia, disabled: true }
        ],
        telefono: [
          { value: this.busquedaPermisosState?.telefono, disabled: true }
        ],
      })
    });
  }

  /**
   * Obtiene el grupo de formulario 'datosGenerales' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'datosGenerales'.
   */
  get datosGenerales(): FormGroup {
    return this.solicitudForm.get("datosGenerales") as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'domicilioFiscal' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'domicilioFiscal'.
   */
  get domicilioFiscal(): FormGroup {
    return this.solicitudForm.get("domicilioFiscal") as FormGroup;
  }

  /**
   * Obtiene el detalle del titular.
   * @returns {void}
   */
  obtenerDetalleTitular(): void {
    this.suspensionPermisoService.obtenerDetalleTitular()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (respuesta: TitularDetalleRespuesta) => {
          const TITULAR_DETALLE = respuesta.data[0];
          this.datosGenerales.patchValue({
            denominacion: TITULAR_DETALLE.denominacion,
            actividadEconomica: TITULAR_DETALLE.actividadEconomica,
            correoElectronico: TITULAR_DETALLE.correoElectronico,
            rfc: TITULAR_DETALLE.rfc
          });
          this.domicilioFiscal.patchValue({
            calle: TITULAR_DETALLE.calle,
            numeroExterior: TITULAR_DETALLE.numeroExterior,
            numeroInterior: TITULAR_DETALLE.numeroInterior,
            codigoPostal: TITULAR_DETALLE.codigoPostal,
            colonia: TITULAR_DETALLE.colonia,
            pais: TITULAR_DETALLE.pais,
            estado: TITULAR_DETALLE.estado,
            localidad: TITULAR_DETALLE.localidad,
            municipioAlcaldia: TITULAR_DETALLE.municipioAlcaldia,
            telefono: TITULAR_DETALLE.telefono
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
