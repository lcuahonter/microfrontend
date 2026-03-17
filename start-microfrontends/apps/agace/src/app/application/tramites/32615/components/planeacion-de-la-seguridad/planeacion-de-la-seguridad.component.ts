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
import { TEXTOS_ESTATICOS_PLANEACION } from '../../constantes/texto-estatico-dos.enum';
import { Tramite32615PerfilesQuery } from '../../../../estados/queries/tramite32615_perfiles.query';
/**
 * @component ProfilesDomocilioDelaComponent
 * @description
 * Componente que gestiona el formulario de contingencia relacionado con los perfiles de domicilio.
 * Permite la captura y validación de datos relacionados con seguridad, auditorías y planes de emergencia.
 */
@Component({
  selector: 'app-planeacion-de-la-seguridad',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './planeacion-de-la-seguridad.component.html',
  styleUrls: ['./planeacion-de-la-seguridad.component.scss'],
})
export class PlaneacionDelaSeguridadComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_PLANEACION
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  public opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} contingencyForm
   * @description
   * Formulario reactivo que contiene los campos relacionados con la contingencia.
   */
  public contingencyForm!: FormGroup;

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

    this.crearContingencyFormulario();

    if (this.esFormularioSoloLectura) {
      Object.keys(this.contingencyForm.controls).forEach((key) => {
        this.contingencyForm.get(key)?.disable();
      });
    } else {
      Object.keys(this.contingencyForm.controls).forEach((key) => {
        this.contingencyForm.get(key)?.enable();
      });
    }
  }

  /**
   * @method crearContingencyFormulario
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para la contingencia.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  public crearContingencyFormulario(): void {
    this.contingencyForm = this.fb.group({
      actualizacion: [
        this.solicitudState?.actualizacion,
        Validators.required,
      ],
      comiteSeguridad: [
        this.solicitudState?.comiteSeguridad,
        Validators.required,
      ],
      fuentesInformacion: [
        this.solicitudState?.fuentesInformacion,
        Validators.required,
      ],
      politica: [this.solicitudState?.politica, Validators.required],
      indique: [this.solicitudState?.indique, Validators.required],
      periodicidad: [this.solicitudState?.periodicidad, Validators.required],
      programa: [this.solicitudState?.programa, Validators.required],
      capacitacion: [this.solicitudState?.capacitacion, Validators.required],
      procedimiento: [this.solicitudState?.procedimiento, Validators.required],
      descripcionProcedimiento: [
        this.solicitudState?.descripcionProcedimiento,
        Validators.required,
      ],
      nombreProcedimiento: [
        this.solicitudState?.nombreProcedimiento,
        Validators.required,
      ],
      programacionAuditoria: [
        this.solicitudState?.programacionAuditoria,
        Validators.required,
      ],
      participantesAuditoria: [
        this.solicitudState?.participantesAuditoria,
        Validators.required,
      ],
      enfoqueAuditoria: [
        this.solicitudState?.enfoqueAuditoria,
        Validators.required,
      ],
      procesosAuditados: [
        this.solicitudState?.procesosAuditados,
        Validators.required,
      ],
      registrosAuditoria: [
        this.solicitudState?.registrosAuditoria,
        Validators.required,
      ],
      programacion: [this.solicitudState?.programacion, Validators.required],
      registrosNombre: [
        this.solicitudState?.registrosNombre,
        Validators.required,
      ],
      registrosEmpresa: [
        this.solicitudState?.registrosEmpresa,
        Validators.required,
      ],
      planEmergencia: [
        this.solicitudState?.planEmergencia,
        Validators.required,
      ],
      situacionesContempladas: [
        this.solicitudState?.situacionesContempladas,
        Validators.required,
      ],
      mecanismosContinuidad: [
        this.solicitudState?.mecanismosContinuidad,
        Validators.required,
      ],
      simulacrosDocumentacion: [
        this.solicitudState?.simulacrosDocumentacion,
        Validators.required,
      ],
      naturaleza: [ this.solicitudState?.naturaleza, Validators.required],
      resultados: [
        this.solicitudState?.resultados, Validators.required
      ]
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
   * @property {boolean} anexe
   * @description
   * Propiedad booleana que indica si se debe anexar información adicional.
   * Se actualiza en función del valor de un checkbox mediante el método `inputChecked`.
   * Valor inicial: `false`.
   */
  public anexe = false;

  /**
   * @method inputChecked
   * @description
   * Método que verifica el valor de un checkbox y actualiza la propiedad `anexe` en función de este.
   * Si el valor del checkbox es `'1'`, establece `anexe` como `true`. En caso contrario, lo establece como `false`.
   * @param {string | number} checkBoxValue - Valor del checkbox que se evalúa.
   */
  public inputChecked(checkBoxValue: string | number): void {
    if (checkBoxValue === '1') {
      this.anexe = true;
    } else {
      this.anexe = false;
    }
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
