import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32616PerfilesMensajeriaState, Tramite32616PerfilesMensajeriaStore } from '../../estados/tramites/tramite32616_perfilesMensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TEXTOS_ESTATICOS_MANEJO_INVESTIGACION } from '../../constantes/texto-estatico.enum';
import { Tramite32616PerfilesMensajeriaQuery } from '../../estados/queries/perfilesMensajeria.query';

/**
 * Componente encargado de gestionar la sección de "Manejo e Investigación de Incidentes"
 * dentro del trámite 32616. Construye un formulario reactivo con los datos obtenidos
 * desde el estado de la solicitud y permite su sincronización con el store.
 */
@Component({
  selector: 'app-manejo-investigacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './manejo-investigacion.component.html',
  styleUrl: './manejo-investigacion.component.scss'
})
export class ManejoInvestigacionComponent implements OnInit, OnDestroy {
    /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_MANEJO_INVESTIGACION

  /**
   * Formulario reactivo que contiene los campos relacionados con el manejo e investigación de incidentes.
   */
  manejo!: FormGroup;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Solicitud32616PerfilesMensajeriaState;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   *
   * @param fb Constructor de formularios reactivos.
   * @param tramite32616Store Store personalizado del trámite 32616.
   * @param tramite32616Query Query personalizado del trámite 32616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32616Store: Tramite32616PerfilesMensajeriaStore,
    private tramite32616Query: Tramite32616PerfilesMensajeriaQuery,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Hook de inicialización del componente.
   * Se suscribe al estado del query y genera el formulario con datos precargados.
   */
  ngOnInit(): void {
    this.tramite32616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
  }

/**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  inicializarEstadoFormulario(): void {
    this.tramite32616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
      this.crearFormularioDeGestión();
     if (this.esFormularioSoloLectura) {
      Object.keys(this.manejo.controls)
        .map((key) => this.manejo.get(key))
        .map((control) => {
          control?.disable();
          return control;
        });
    } else {
      Object.keys(this.manejo.controls)
        .map((key) => this.manejo.get(key))
        .map((control) => {
          control?.enable();
          return control;
        });
    }
  }

  /**
   * Crea el formulario reactivo utilizando los valores actuales del estado.
   * Cada campo incluye una validación requerida para asegurar su completitud.
   */
  crearFormularioDeGestión(): void {
    this.manejo = this.fb.group({
      relacionadosSeguridad: [this.solicitudState?.relacionadosSeguridad, Validators.required],
      reportarIncidentes: [this.solicitudState?.reportarIncidentes, Validators.required],
      actividadesSospechosas: [this.solicitudState?.actividadesSospechosas, Validators.required],
      brevementeSonsiste: [this.solicitudState?.brevementeSonsiste, Validators.required],
      incidenteSeguridad: [this.solicitudState?.incidenteSeguridad, Validators.required],
      caboInvestigacion: [this.solicitudState?.caboInvestigacion, Validators.required],
      operacionCaboInvestigacion: [this.solicitudState?.operacionCaboInvestigacion, Validators.required]
    });
  }

  /**
   * Establece un valor en el store del trámite llamando dinámicamente al método correspondiente.
   *
   * @param form Formulario que contiene el valor del campo.
   * @param campo Nombre del campo dentro del formulario.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32616PerfilesMensajeriaStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32616Store[metodoNombre] as (value: string) => void)(VALOR);
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
