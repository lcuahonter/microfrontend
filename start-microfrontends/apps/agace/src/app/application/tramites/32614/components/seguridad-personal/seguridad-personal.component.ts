import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32614PerfilesMensajeriaState, Tramite32614PerfilesMensajeriaStore } from '../../estados/tramites/tramite32614_perfilesMensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/32614/datos-comunes.enum';
import { TEXTOS_ESTATICOS_SEGURIDAD_PERSONAL } from '../../constants/texto-estatico-tres.enum';
import { Tramite32614PerfilesMensajeriaQuery } from '../../estados/queries/perfilesMensajeria.query';

/**
 * Componente encargado de gestionar la sección de "Seguridad del Personal"
 * dentro del trámite 32614. Administra un formulario con validaciones y se
 * sincroniza con el store y el query personalizados para persistir el estado.
 */
@Component({
  selector: 'app-seguridad-personal',
  standalone: true,
  imports: [
    InputRadioComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './seguridad-personal.component.html',
  styleUrl: './seguridad-personal.component.scss'
})
export class SeguridadPersonalComponent implements OnInit,OnDestroy{
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_PERSONAL

  /**
   * Formulario reactivo que contiene los campos relacionados con la seguridad del personal.
   */
  seguridadPersonal!: FormGroup;

  /**
   * Opciones de selección para botones de radio reutilizables en el formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Solicitud32614PerfilesMensajeriaState;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

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
      this.crearFormularioDeGestión();
  if (this.esFormularioSoloLectura) {
      Object.keys(this.seguridadPersonal.controls)
        .map((key) => this.seguridadPersonal.get(key))
        .map((control) => {
          control?.disable();
          return control;
        });
    } else {
      Object.keys(this.seguridadPersonal.controls)
        .map((key) => this.seguridadPersonal.get(key))
        .map((control) => {
          control?.enable();
          return control;
        });
    }
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
   * Crea el formulario reactivo utilizando los valores actuales del estado.
   * Cada campo incluye una validación requerida para asegurar su completitud.
   */
  crearFormularioDeGestión(): void {
    this.seguridadPersonal = this.fb.group({
      describaContratacion: [this.solicitudState?.describaContratacion, Validators.required],
      documentacionExigida: [this.solicitudState?.documentacionExigida, Validators.required],
      examenesSolicitados: [this.solicitudState?.examenesSolicitados, Validators.required],
      conformeAnalisis: [this.solicitudState?.conformeAnalisis, Validators.required],
      periodicidad: [this.solicitudState?.periodicidad, Validators.required],
      confidencialidad: [this.solicitudState?.confidencialidad, Validators.required],
      contratacionPersonal: [this.solicitudState?.contratacionPersonal, Validators.required],
      describaProcedimientoPersonal: [this.solicitudState?.describaProcedimientoPersonal, Validators.required],
      seguimientoProcedimiento: [this.solicitudState?.seguimientoProcedimiento, Validators.required],
      identificaciones: [this.solicitudState?.identificaciones, Validators.required],
      sistemasInformaticos: [this.solicitudState?.sistemasInformaticos, Validators.required],
      proveedoresServicios: [this.solicitudState?.proveedoresServicios, Validators.required],
      administracionPersonal: [this.solicitudState?.administracionPersonal, Validators.required],
      expliqueBrevemente: [this.solicitudState?.expliqueBrevemente, Validators.required]
    });
  }

  /**
   * Establece un valor en el store del trámite llamando dinámicamente al método correspondiente.
   * 
   * @param form Formulario que contiene el valor del campo.
   * @param campo Nombre del campo dentro del formulario.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32614PerfilesMensajeriaStore): void {
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
