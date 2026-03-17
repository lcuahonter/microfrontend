import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud32614PerfilesState,
  Tramite32614PerfilesStore,
} from '../../estados/tramites/tramite32614_perfiles.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/32614/datos-comunes.enum';
import { TEXTOS_ESTATICOS_SEGURIDAD_COMERCIALES } from '../../constants/texto-estatico-tres.enum';
import { Tramite32614PerfilesQuery } from '../../estados/queries/perfiles.query';
/**
 * @component SociosComercialesComponent
 * @description
 * Componente encargado de gestionar el formulario relacionado con los socios comerciales.
 * Permite la captura y validación de datos relacionados con procedimientos, medidas de seguridad,
 * formatos, periodicidad, y otros aspectos relacionados con los socios comerciales.
 */
@Component({
  selector: 'app-socios-comerciales',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './socios-comerciales.component.html',
  styleUrl: './socios-comerciales.component.scss',
})
export class SociosComercialesComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_COMERCIALES
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} sociosComercialesForm
   * @description
   * Formulario reactivo que contiene los campos relacionados con los socios comerciales.
   */
  sociosComercialesForm!: FormGroup;

  /**
   * @property {Solicitud32614PerfilesState} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Solicitud32614PerfilesState;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @constructor
   * @description
   * Constructor que inicializa los servicios necesarios para el componente.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite32614PerfilesStore} tramite32614Store - Store para gestionar el estado de la solicitud.
   * @param {Tramite32614PerfilesQuery} tramite32614Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32614Store: Tramite32614PerfilesStore,
    private tramite32614Query: Tramite32614PerfilesQuery,
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
      this.crearFormularioSociosComerciales();
   if (this.esFormularioSoloLectura) {
      Object.keys(this.sociosComercialesForm.controls)
        .map((key) => this.sociosComercialesForm.get(key))
        .map((control) => {
          control?.disable();
          return control;
        });
    } else {
      Object.keys(this.sociosComercialesForm.controls)
        .map((key) => this.sociosComercialesForm.get(key))
        .map((control) => {
          control?.enable();
          return control;
        });
    }
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario y suscribe al estado de la solicitud.
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
   * @method crearFormularioSociosComerciales
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para los socios comerciales.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearFormularioSociosComerciales(): void {
    this.sociosComercialesForm = this.fb.group({
      indiqueLleva: [
        this.solicitudState?.indiqueLleva,
        Validators.required,
      ],
      describaProcedimiento: [
        this.solicitudState?.describaProcedimiento,
        Validators.required,
      ],
      indiqueSocios: [
        this.solicitudState?.indiqueSocios,
        Validators.required,
      ],
      indiqueForma: [
        this.solicitudState?.indiqueForma,
        Validators.required,
      ],
      indiqueExisten: [
        this.solicitudState?.indiqueExisten,
        Validators.required,
      ],
      indiqueCuenta: [
        this.solicitudState?.indiqueCuenta,
        Validators.required,
      ],
      procedimientoRealizar: [
        this.solicitudState?.procedimientoRealizar,
        Validators.required,
      ],
      indiquePeriodicidad: [
        this.solicitudState?.indiquePeriodicidad,
        Validators.required,
      ],
      describaComo: [
        this.solicitudState?.describaComo,
        Validators.required,
      ],
      comoAseguran: [
        this.solicitudState?.comoAseguran,
        Validators.required,
      ],
      indiqueFormatos: [
        this.solicitudState?.indiqueFormatos,
        Validators.required,
      ],
      senalarMedidas: [
        this.solicitudState?.senalarMedidas,
        Validators.required,
      ],
      casoSocios: [
        this.solicitudState?.casoSocios,
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
   * @param {keyof Tramite32614PerfilesStore} metodoNombre - Método del store que se debe invocar.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32614PerfilesStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32614Store[metodoNombre] as (value: string) => void)(VALOR);
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
