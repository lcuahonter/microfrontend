import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud32614PerfilesMensajeriaState,
  Tramite32614PerfilesMensajeriaStore,
} from '../../estados/tramites/tramite32614_perfilesMensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TEXTOS_ESTATICOS } from '../../constants/texto-estatico.enum';
import { Tramite32614PerfilesMensajeriaQuery } from '../../estados/queries/perfilesMensajeria.query';
/**
 * Componente encargado de gestionar la sección de "Capacitación en Seguridad"
 * dentro del trámite 32614. Construye un formulario reactivo con los datos obtenidos
 * desde el estado de la solicitud y permite su sincronización con el store.
 */
@Component({
  selector: 'app-capacitacion-seguridad',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './capacitacion-seguridad.component.html',
  styleUrl: './capacitacion-seguridad.component.scss',
})
export class CapacitacionSeguridadComponent implements OnInit, OnDestroy {
  /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
  public textos = TEXTOS_ESTATICOS;

  /**
   * Formulario reactivo que contiene los campos relacionados con la capacitación.
   */
  capacitacion!: FormGroup;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Solicitud32614PerfilesMensajeriaState;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   *
   * @param fb Constructor de formularios reactivos.
   * @param tramite32614Store Store personalizado del trámite 32614.
   * @param tramite32614Query Query personalizado del trámite 32614.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32614Store: Tramite32614PerfilesMensajeriaStore,
    private tramite32614Query: Tramite32614PerfilesMensajeriaQuery,
    private consultaioQuery: ConsultaioQuery
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
    this.tramite32614Query.selectSolicitud$
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
    this.tramite32614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearFormularioDeGestion();
    if (this.esFormularioSoloLectura) {
      Object.keys(this.capacitacion.controls)
        .map((key) => this.capacitacion.get(key))
        .map((control) => {
          control?.disable();
          return control;
        });
    } else {
      Object.keys(this.capacitacion.controls)
        .map((key) => this.capacitacion.get(key))
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
  crearFormularioDeGestion(): void {
    this.capacitacion = this.fb.group({
      mediosTransporte: [
        this.solicitudState?.mediosTransporte,
        Validators.required,
      ],
      estaDifusion: [this.solicitudState?.estaDifusion, Validators.required],
      enunciativaLimitativa: [
        this.solicitudState?.enunciativaLimitativa,
        Validators.required,
      ],
      procedimientosEmpresa: [
        this.solicitudState?.procedimientosEmpresa,
        Validators.required,
      ],
      mediosDeTransporte: [
        this.solicitudState?.mediosDeTransporte,
        Validators.required,
      ],
    });
  }

  /**
   * Establece un valor en el store del trámite llamando dinámicamente al método correspondiente.
   *
   * @param form Formulario que contiene el valor del campo.
   * @param campo Nombre del campo dentro del formulario.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32614PerfilesMensajeriaStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32614Store[metodoNombre] as (value: string) => void)(VALOR);
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
