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
import { TEXTOS_ESTATICOS_CONTROLES_FISICO } from '../../constantes/texto-estatico.enum';
import { Tramite32615PerfilesQuery } from '../../../../estados/queries/tramite32615_perfiles.query';
/**
 * @component ControlesFisicoComponent
 * @description
 * Componente encargado de gestionar el formulario relacionado con los controles físicos.
 * Permite la captura y validación de datos relacionados con procedimientos documentados, mecanismos de control,
 * registros, características de seguridad, y otros aspectos relacionados con los controles físicos.
 */
@Component({
  selector: 'app-controles-fisico',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './controles-fisico.component.html',
  styleUrl: './controles-fisico.component.scss',
})
export class ControlesFisicoComponent implements OnInit, OnDestroy {
   /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_CONTROLES_FISICO
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  public opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} controlesFisico
   * @description
   * Formulario reactivo que contiene los campos relacionados con los controles físicos.
   */
  public controlesFisico!: FormGroup;

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

      this.crearFormularioControlesFisico();

      if (this.esFormularioSoloLectura) {
      Object.keys(this.controlesFisico.controls).forEach((key) => {
        this.controlesFisico.get(key)?.disable();
      });
    } else {
      Object.keys(this.controlesFisico.controls).forEach((key) => {
        this.controlesFisico.get(key)?.enable();
      });
    }
  }

  /**
   * @method crearFormularioControlesFisico
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para los controles físicos.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  public crearFormularioControlesFisico(): void {
    this.controlesFisico = this.fb.group({
      procedimientoDocumentado: [
        this.solicitudState?.procedimientoDocumentado,
        Validators.required,
      ],
      indiqueNumero: [this.solicitudState?.indiqueNumero, Validators.required],
      cargosFunciones: [
        this.solicitudState?.cargosFunciones,
        Validators.required,
      ],
      casoContratarse: [
        this.solicitudState?.casoContratarse,
        Validators.required,
      ],
      casoContar: [this.solicitudState?.casoContar, Validators.required],
      describirProcedimiento: [
        this.solicitudState?.describirProcedimiento,
        Validators.required,
      ],
      indiqueMecanismos: [
        this.solicitudState?.indiqueMecanismos,
        Validators.required,
      ],
      indicarEmpleados: [
        this.solicitudState?.indicarEmpleados,
        Validators.required,
      ],
      indiqueIdentifica: [
        this.solicitudState?.indiqueIdentifica,
        Validators.required,
      ],
      describaEmpresa: [
        this.solicitudState?.describaEmpresa,
        Validators.required,
      ],
      indiqueAsegura: [
        this.solicitudState?.indiqueAsegura,
        Validators.required,
      ],
      procedimientoParaControl: [
        this.solicitudState?.procedimientoParaControl,
        Validators.required,
      ],
      senaleRegistros: [
        this.solicitudState?.senaleRegistros,
        Validators.required,
      ],
      senaleQuien: [this.solicitudState?.senaleQuien, Validators.required],
      describaRecepion: [
        this.solicitudState?.describaRecepion,
        Validators.required,
      ],
      indiqueEncargado: [
        this.solicitudState?.indiqueEncargado,
        Validators.required,
      ],
      indiqueIdentfica: [
        this.solicitudState?.indiqueIdentfica,
        Validators.required,
      ],
      senaleComo: [this.solicitudState?.senaleComo, Validators.required],
      describaCaracteristicas: [
        this.solicitudState?.describaCaracteristicas,
        Validators.required,
      ],
      senaleAccion: [this.solicitudState?.senaleAccion, Validators.required],
      registroVisitantes: [
        this.solicitudState?.registroVisitantes,
        Validators.required,
      ],
      verificarCorrecta: [
        this.solicitudState?.verificarCorrecta,
        Validators.required,
      ],
      restringido: [this.solicitudState?.restringido, Validators.required],
      entregasMensajeria: [
        this.solicitudState?.entregasMensajeria,
        Validators.required,
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