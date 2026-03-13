import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud32615PerfilesState,
  Tramite32615PerfilesStore,
} from '../../../../estados/tramites/tramite32615_perfiles.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/32615/datos-comunes.enum';
import { TEXTOS_ESTATICOS_SEGURIDAD_PROCESOS } from '../../constantes/texto-estatico-tres.enum';
import { Tramite32615PerfilesQuery } from '../../../../estados/queries/tramite32615_perfiles.query';

/**
 * @component SeguridadProcesosComponent
 * @description
 * Componente encargado de gestionar el formulario relacionado con la seguridad de los procesos.
 * Permite la captura y validación de datos relacionados con almacenes, tecnologías, procesamiento,
 * validación, y otros aspectos relacionados con la seguridad de los procesos.
 */
@Component({
  selector: 'app-seguridad-procesos',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './seguridad-procesos.component.html',
  styleUrl: './seguridad-procesos.component.scss',
})
export class SeguridadProcesosComponent implements OnInit, OnDestroy {
    /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_SEGURIDAD_PROCESOS
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  public opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} seguridadProcesosForm
   * @description
   * Formulario reactivo que contiene los campos relacionados con la seguridad de los procesos.
   */
  public seguridadProcesosForm!: FormGroup;

    /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @property {Solicitud32615PerfilesState} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Solicitud32615PerfilesState;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Constructor que inicializa los servicios necesarios para el componente.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite32615PerfilesStore} tramite32615Store - Store para gestionar el estado de la solicitud.
   * @param {Tramite32615PerfilesQuery} tramite32615Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32615Store: Tramite32615PerfilesStore,
    private tramite32615Query: Tramite32615PerfilesQuery,
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
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario y suscribe al estado de la solicitud.
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

    this.crearFormularioSeguridadProcesos();
    if (this.esFormularioSoloLectura) {
      Object.keys(this.seguridadProcesosForm.controls).forEach((key) => {
        this.seguridadProcesosForm.get(key)?.disable();
      });
    } else {
      Object.keys(this.seguridadProcesosForm.controls).forEach((key) => {
        this.seguridadProcesosForm.get(key)?.enable();
      });
    }
  }

  /**
   * @method crearFormularioSeguridadProcesos
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para la seguridad de los procesos.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  public crearFormularioSeguridadProcesos(): void {
    this.seguridadProcesosForm = this.fb.group({
      indiqueAlmacenes: [
        this.solicitudState?.indiqueAlmacenes,
        Validators.required,
      ],
      expliqueBrevemente: [
        this.solicitudState?.expliqueBrevemente,
        Validators.required,
      ],
      indiqueCerciora: [
        this.solicitudState?.indiqueCerciora,
        Validators.required,
      ],
      indiqueEstos: [
        this.solicitudState?.indiqueEstos,
        Validators.required,
      ],
      indiquePertenecen: [
        this.solicitudState?.indiquePertenecen,
        Validators.required,
      ],
      indiqueResponsable: [
        this.solicitudState?.indiqueResponsable,
        Validators.required,
      ],
      indiqueTecnologia: [
        this.solicitudState?.indiqueTecnologia,
        Validators.required,
      ],
      describirProcesamiento: [
        this.solicitudState?.describirProcesamiento,
        Validators.required,
      ],
      detalleComo: [
        this.solicitudState?.detalleComo,
        Validators.required,
      ],
      indiqueUtiliza: [
        this.solicitudState?.indiqueUtiliza,
        Validators.required,
      ],
      detalleValida: [
        this.solicitudState?.detalleValida,
        Validators.required,
      ],
      comoNumero: [
        this.solicitudState?.comoNumero,
        Validators.required,
      ],
      senaleAsociados: [
        this.solicitudState?.senaleAsociados,
        Validators.required,
      ],
      estosEmpresa: [
        this.solicitudState?.estosEmpresa,
        Validators.required,
      ],
      recintoFiscalizado: [
        this.solicitudState?.recintoFiscalizado,
        Validators.required,
      ],
      indiqueCuenta: [
        this.solicitudState?.indiqueCuenta,
      ],
    });
  }

  /**
   * @method setValoresStore
   * @description
   * Actualiza el estado del store con el valor de un campo específico del formulario.
   * @param {FormGroup} form - Formulario reactivo que contiene los valores.
   * @param {string} campo - Nombre del campo del formulario.
   * @param {keyof Tramite32615PerfilesStore} metodoNombre - Método del store que se debe invocar.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32615PerfilesStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32615Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}