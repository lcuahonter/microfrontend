import { Catalogo, CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { AtencionRenovacion40403State, Tramite40403Store } from '../../estados/tramite40403.store';
import { CAAT } from '../../models/atencion-de-renovacion.model';
import { CommonModule } from '@angular/common';
import { Tramite40403Query } from '../../estados/tramite40403.query';
import { Tramite40403Service } from '../../estados/tramite40403.service';

/**
 * Componente para gestionar los datos del trámite de renovación.
 */
@Component({
  selector: 'app-datos-tramite-renovacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent
  ],
  templateUrl: './datos-tramite-renovacion.component.html',
  styleUrls: ['./datos-tramite-renovacion.component.scss'],
})
export class DatosTramiteRenovacionComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Formulario reactivo utilizado para capturar los datos del trámite.
   */
  formulario!: FormGroup;
  /**
   * Catálogo de tipos de CAAT aéreo.
   */
  public tipoDeCaatAerea!: Catalogo[];

  /**
   * Catálogo de códigos de transportación aérea.
   */
  public ideCodTransportacionAerea!: Catalogo[];

  /**
   * Estado actual de la sección de atención a la renovación, gestionado por el store.
   */
  public atencionRenovacionState!: AtencionRenovacion40403State;

  /**
   * Notificador para gestionar la destrucción de suscripciones activas.
   */
  private destroyNotifier$ = new Subject<void>();


   /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

    /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * @property {boolean} mostrarError
   * @description Indica si se debe mostrar el mensaje de error cuando el campo claveFolioCAAT está vacío.
   * @default false
   */
  mostrarError: boolean = false;

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para inicializar el formulario reactivo.
   * @param tramite40403Service - Servicio para interactuar con la API relacionada con el trámite.
   * @param tramite40403Store - Almacén para gestionar el estado del trámite.
   * @param tramite40403Query - Consulta para obtener datos del estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite40403Service: Tramite40403Service,
    private tramite40403Store: Tramite40403Store,
    private tramite40403Query: Tramite40403Query,
     private consultaioQuery: ConsultaioQuery,
  ) { }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.tramite40403Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.atencionRenovacionState = seccionState;
        })
      )
      .subscribe();

      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.inicializarFormulario();

    this.tipoDeCaatAereaData();
    this.ideCodTransportacionAereaData();
  }
  /**
   * @method ngAfterViewInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta después de que Angular ha inicializado completamente la vista del componente.
   * Sincroniza el estado de la propiedad `mostrarError` del componente con el valor almacenado en el store del trámite.
   * Obtiene el valor actual de `mostrarError` desde el store utilizando el query para mantener la coherencia en la UI.
   * 
   * @returns {void}
   */
  ngAfterViewInit(): void {
    this.mostrarError = this.tramite40403Query.getValue().mostrarError;
  }

  /**
  * @method inicializarEstadoFormulario
  * @description Inicializa el estado del formulario según el modo de solo lectura.
  * 
  * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
  * En caso contrario, habilita los controles del formulario.
  * 
  * @returns {void}
  */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.formulario?.disable();
    }
  }

  /**
   * Inicializa el formulario reactivo con los campos necesarios.
   */
  public inicializarFormulario(): void {
    this.formulario = this.fb.group({
      claveFolioCAAT: [
        this.atencionRenovacionState?.claveFolioCAAT,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[a-zA-Z0-9]*$')
        ]
      ],
      cveFolioCaat: [
        { value: this.atencionRenovacionState?.cveFolioCaat, disabled: true }
      ],
      descripcionTipoCaat: [
        { value: this.atencionRenovacionState?.descripcionTipoCaat, disabled: true }
      ],
      tipoDeCaatAerea: [
        this.atencionRenovacionState?.tipoDeCaatAerea
      ],
      ideCodTransportacionAerea: [
        this.atencionRenovacionState?.ideCodTransportacionAerea
      ],
      codIataIcao: [
        { value: this.atencionRenovacionState?.codIataIcao, disabled: true }
      ]
    });
       this.inicializarEstadoFormulario();
  }

  /**
   * Convierte el valor del campo `claveFolioCAAT` a mayúsculas.
   * @param event - Evento que contiene el valor ingresado por el usuario.
   */
  caatConMayusculas(event: Event): void {
    const TARGET = event.target as HTMLInputElement | null;
    const VALOR = TARGET?.value || '';
    this.formulario.get('claveFolioCAAT')?.setValue(VALOR.toUpperCase());
  }

  /**
   * Busca una solicitud utilizando el valor de `claveFolioCAAT` proporcionado en el formulario.
   */
  buscarSolicitudPorCAAT(): void {
    const CLAVECAAT = this.formulario.get('claveFolioCAAT')?.value;
    if(!CLAVECAAT) {
      this.mostrarError = true;
      this.tramite40403Store.setMostrarError(true);
    }
    else{
      this.mostrarError = false;
      this.tramite40403Store.setMostrarError(false);
    this.tramite40403Service
      .buscarSolicitudPorCAATe()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta) {
          const CAAT_DATOS = respuesta.data[0];
          this.formulario.patchValue({
            cveFolioCaat: CAAT_DATOS.cveFolioCaat || '',
            descripcionTipoCaat: CAAT_DATOS.descripcionTipoCaat || '',
            tipoDeCaatAerea: CAAT_DATOS.tipoDeCaatAerea || '',
            ideCodTransportacionAerea: CAAT_DATOS.ideCodTransportacionAerea || '',
            codIataIcao: CAAT_DATOS.codIataIcao || ''
          });
          this.establecerCampoValor(CAAT_DATOS);
        }
      });
    }
  }

  /**
   * Establece los valores en el store de tramite40403 a partir de los datos del CAAT.
   *
   * @param {CAAT} CAAT_DATOS - Objeto que contiene los datos del CAAT.
   * @returns {void}
   */
  establecerCampoValor(CAAT_DATOS: CAAT): void {
    this.tramite40403Store.establecerCveFolioCaat(CAAT_DATOS.cveFolioCaat);
    this.tramite40403Store.establecerDescripcionTipoCaat(CAAT_DATOS.descripcionTipoCaat);
    this.tramite40403Store.establecerTipoDeCaatAerea(CAAT_DATOS.tipoDeCaatAerea);
    this.tramite40403Store.establecerIdeCodTransportacionAerea(CAAT_DATOS.ideCodTransportacionAerea);
    this.tramite40403Store.establecerCodIataIcao(CAAT_DATOS.codIataIcao);
  }

  /**
   * Carga los datos del catálogo de tipos de CAAT aéreo desde el servicio.
   */
  tipoDeCaatAereaData(): void {
    this.tramite40403Service
      .getTipoDeCaatAerea()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.tipoDeCaatAerea = data;
      });
  }

  /**
   * Carga los datos del catálogo de códigos de transportación aérea desde el servicio.
   */
  ideCodTransportacionAereaData(): void {
    this.tramite40403Service
      .geTideCodTransportacionAerea()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.ideCodTransportacionAerea = data;
      });
  }

  /**
   * Establece los valores en el store de tramite40403.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite40403Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite40403Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}