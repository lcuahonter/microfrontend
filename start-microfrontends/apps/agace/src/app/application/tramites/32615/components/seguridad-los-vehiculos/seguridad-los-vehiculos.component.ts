import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32615PerfilesMensajeriaState, Tramite32615PerfilesMensajeriaStore } from '../../../../estados/tramites/tramite32615_perfilesMensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/32615/datos-comunes.enum';
import { TEXTOS_ESTATICOS_SEGURIDAD_VEHICULOS } from '../../constantes/texto-estatico.enum';
import { Tramite32615PerfilesMensajeriaQuery } from '../../../../estados/queries/tramite32615_perfilesMensajeria.query';

/**
 * Componente encargado de la sección "Seguridad de los vehículos" del trámite 32615.
 * Administra un formulario reactivo con validaciones y sincroniza su estado con el store y query personalizados.
 */
@Component({
  selector: 'app-seguridad-los-vehiculos',
  standalone: true,
  imports: [
    InputRadioComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './seguridad-los-vehiculos.component.html',
  styleUrl: './seguridad-los-vehiculos.component.scss',
})
export class SeguridadLosVehiculosComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_VEHICULOS

  /**
   * Formulario reactivo que contiene los campos de seguridad vehicular.
   */
  public seguridad!: FormGroup;

  /**
   * Opciones para los botones de radio, utilizadas en los campos del formulario.
   */
  public opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

    /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Solicitud32615PerfilesMensajeriaState;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramite32615Store Store personalizado del trámite 32615.
   * @param tramite32615Query Query personalizado del trámite 32615.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32615Store: Tramite32615PerfilesMensajeriaStore,
    private tramite32615Query: Tramite32615PerfilesMensajeriaQuery,
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
   * Suscribe al estado del query y genera el formulario reactivo con valores precargados.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

   /**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  public inicializarEstadoFormulario(): void {
    this.tramite32615Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.crearFormularioDeGestión();
    if (this.esFormularioSoloLectura) {
      Object.keys(this.seguridad.controls).forEach((key) => {
        this.seguridad.get(key)?.disable();
      });
    } else {
      Object.keys(this.seguridad.controls).forEach((key) => {
        this.seguridad.get(key)?.enable();
      });
    }
  }

  /**
   * Crea el formulario reactivo con los valores actuales del estado.
   * Todos los campos son requeridos y están ligados a los valores del estado de solicitud.
   */
  public crearFormularioDeGestión(): void {
    this.seguridad = this.fb.group({
      candadosSeguridad: [this.solicitudState?.candadosSeguridad, Validators.required],
      proveedorExterno: [this.solicitudState?.proveedorExterno, Validators.required],
      susceptibleContaminacion: [this.solicitudState?.susceptibleContaminacion, Validators.required],
      encuentrenVacios: [this.solicitudState?.encuentrenVacios, Validators.required],
      semirremolquesVacios: [this.solicitudState?.semirremolquesVacios, Validators.required],
      utilizarCandado: [this.solicitudState?.utilizarCandado, Validators.required],
      seguridadMismas: [this.solicitudState?.seguridadMismas, Validators.required],
      enliste: [this.solicitudState?.enliste, Validators.required]
    });
  }

  /**
   * Establece un valor en el store del trámite llamando dinámicamente al método correspondiente.
   * 
   * @param form Formulario que contiene el valor del campo.
   * @param campo Nombre del campo dentro del formulario.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32615PerfilesMensajeriaStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32615Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Hook de destrucción del componente.
   * Emite y completa el `destroyNotifier$` para cancelar todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
