import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud31616PerfilesMensajeriaState, Tramite31616PerfilesMensajeriaStore } from '../../../../estados/tramites/tramite31616_perfilesMensajeria.store';
import { Subject, map , takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TEXTOS_ESTATICOS } from '../../constantes/texto-estatico.enum';
import { Tramite31616PerfilesMensajeriaQuery } from '../../../../estados/queries/tramite31616_perfilesMensajeria.query';

/**
 * Componente encargado de gestionar la sección de "Capacitación en Seguridad"
 * dentro del trámite 31616. Construye un formulario reactivo con los datos obtenidos
 * desde el estado de la solicitud y permite su sincronización con el store.
 */
@Component({
  selector: 'app-capacitacion-seguridad',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './capacitacion-seguridad.component.html',
  styleUrl: './capacitacion-seguridad.component.scss'
})
export class CapacitacionSeguridadComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS

  /**
   * Formulario reactivo que contiene los campos relacionados con la capacitación.
   */
  capacitacion!: FormGroup;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Solicitud31616PerfilesMensajeriaState;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   *
   * @param fb Constructor de formularios reactivos.
   * @param tramite31616Store Store personalizado del trámite 31616.
   * @param tramite31616Query Query personalizado del trámite 31616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31616Store: Tramite31616PerfilesMensajeriaStore,
    private tramite31616Query: Tramite31616PerfilesMensajeriaQuery
  ) {
    //Añade lógica aquí
  }

  /**
   * Hook de inicialización del componente.
   * Se suscribe al estado del query y genera el formulario con datos precargados.
   */
  ngOnInit(): void {
    this.tramite31616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.crearFormularioDeGestion();
  }

  /**
   * Crea el formulario reactivo utilizando los valores actuales del estado.
   * Cada campo incluye una validación requerida para asegurar su completitud.
   */
  crearFormularioDeGestion(): void {
    this.capacitacion = this.fb.group({
      mediosTransporte: [this.solicitudState?.mediosTransporte, Validators.required],
      estaDifusion: [this.solicitudState?.estaDifusion, Validators.required],
      enunciativaLimitativa: [this.solicitudState?.enunciativaLimitativa, Validators.required],
      procedimientosEmpresa: [this.solicitudState?.procedimientosEmpresa, Validators.required],
      mediosDeTransporte: [this.solicitudState?.mediosDeTransporte, Validators.required]
    });
  }

  /**
   * Establece un valor en el store del trámite llamando dinámicamente al método correspondiente.
   *
   * @param form Formulario que contiene el valor del campo.
   * @param campo Nombre del campo dentro del formulario.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite31616PerfilesMensajeriaStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31616Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Hook de destrucción del componente.
   * Cancela todas las suscripciones activas emitiendo y completando el `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
