import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud31616PerfilesState,
  Tramite31616PerfilesStore,
} from '../../../../estados/tramites/tramite31616_perfiles.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { TEXTOS_ESTATICOS_SEGURIDAD_PROCESOS } from '../../constantes/texto-estatico-tres.enum';
import { Tramite31616PerfilesQuery } from '../../../../estados/queries/tramite31616_perfiles.query';

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
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} seguridadProcesosForm
   * @description
   * Formulario reactivo que contiene los campos relacionados con la seguridad de los procesos.
   */
  seguridadProcesosForm!: FormGroup;

  /**
   * @property {Solicitud31616PerfilesState} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Solicitud31616PerfilesState;

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
   * @param {Tramite31616PerfilesStore} tramite31616Store - Store para gestionar el estado de la solicitud.
   * @param {Tramite31616PerfilesQuery} tramite31616Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31616Store: Tramite31616PerfilesStore,
    private tramite31616Query: Tramite31616PerfilesQuery
  ) {
    //Añade lógica aquí
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario y suscribe al estado de la solicitud.
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

    this.crearFormularioSeguridadProcesos();
  }

  /**
   * @method crearFormularioSeguridadProcesos
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para la seguridad de los procesos.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearFormularioSeguridadProcesos(): void {
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
    });
  }

  /**
   * @method setValoresStore
   * @description
   * Actualiza el estado del store con el valor de un campo específico del formulario.
   * @param {FormGroup} form - Formulario reactivo que contiene los valores.
   * @param {string} campo - Nombre del campo del formulario.
   * @param {keyof Tramite31616PerfilesStore} metodoNombre - Método del store que se debe invocar.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31616PerfilesStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31616Store[metodoNombre] as (value: string) => void)(VALOR);
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