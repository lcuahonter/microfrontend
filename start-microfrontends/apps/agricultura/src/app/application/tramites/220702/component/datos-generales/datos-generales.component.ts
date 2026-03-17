/**
 * @module DatosGeneralesComponent
 * @description
 * Componente para capturar los datos generales de la solicitud.
 */

import { CatalogoSelectComponent, CatalogosSelect, ConfiguracionColumna, SeccionLibQuery, SeccionLibState, SeccionLibStore, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MERCANCIA_SERVICIO, MercanciaInfo } from '../../constantes/acuicola.enum';
import { TramiteState, TramiteStore } from '../../estados/tramite220702.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudInt } from '../../modelos/acuicola.model';
import { FitosanitarioService } from '../../service/fitosanitario.service';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { TramiteStoreQuery } from '../../estados/tramite220702.query';
import { delay } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
import { tap } from 'rxjs';

@Component({
  selector: 'app-datos-generales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './datos-generales.component.html',
})
export class DatosGeneralesComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para capturar los datos generales de la solicitud.
   * @type {FormGroup}
   */
  datosGeneralesForm: FormGroup;

  /**
   * Estado actual del trámite.
   * 
   * @remarks
   * Esta propiedad almacena la información relacionada con el estado del trámite en curso.
   * Se inicializa como un objeto vacío del tipo `TramiteState`.
   */
  tramiteState: TramiteState={} as TramiteState;
  /**
   * Catálogo de aduanas de ingreso.
   * @type {CatalogosSelect}
   */
  aduanaDeIngreso: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de oficinas de inspección.
   * @type {CatalogosSelect}
   */
  oficinaDeInspeccion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de puntos de inspección.
   * @type {CatalogosSelect}
   */
  puntoDeInspeccion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de regímenes a los que se destina la mercancía.
   * @type {CatalogosSelect}
   */
  regimenAlQueDestina: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de datos para movilización nacional.
   * @type {CatalogosSelect}
   */
  datosParaMovilizacion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de puntos de verificación federal.
   * @type {CatalogosSelect}
   */
  puntoDeVerificacion: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Configuración de columnas para la tabla de mercancías.
   * @type {ConfiguracionColumna<MercanciaInfo>[]}
   */
  mercanciaTabla: ConfiguracionColumna<MercanciaInfo>[] = MERCANCIA_SERVICIO;

  /**
   * Datos de la mercancía para la tabla.
   * @type {MercanciaInfo[]}
   */
  immexTableDatos: MercanciaInfo[] = [];

  /**
   * Estado actual de la solicitud.
   * @type {DatosDeLaSolicitudInt}
   */
  solicitudState!: DatosDeLaSolicitudInt;

  /**
   * Subject para notificar la destrucción del componente.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la sección actual.
   * @type {SeccionLibState}
   */
  private seccion!: SeccionLibState;

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `verdadero`, los campos del formulario no se pueden editar.
  */
   esFormularioSoloLectura: boolean = false; 

   /**
    * Indica si el campo debe ser deshabilitado.
    * @property {boolean} campoDeshabilitar
    */
   campoDeshabilitar:boolean= false;
 
   


  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {FitosanitarioService} fitosanitarioService - Servicio para obtener datos relacionados con la acuicultura.
   * @param {TramiteStoreQuery} tramiteStoreQuery - Query para acceder al estado del trámite.
   * @param {TramiteStore} tramiteStore - Store para gestionar el estado del trámite.
   * @param {SeccionLibQuery} seccionQuery - Query para acceder al estado de la sección.
   * @param {SeccionLibStore} seccionStore - Store para gestionar el estado de la sección.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly fitosanitarioService: FitosanitarioService,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private readonly consultaioQuery: ConsultaioQuery
  ) {
    this.datosGeneralesForm = this.fb.group({});
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      ).subscribe();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.iniciarFormulario();
    }  

  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Aquí se configuran las suscripciones a los estados y se inicializa el formulario.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    if (this.esFormularioSoloLectura) {
      this.fitosanitarioService.getDatosGeneralesConsulta()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((loadedData: DatosDeLaSolicitudInt) => {
          this.tramiteStore.setSolicitudTramite(loadedData);
          this.datosGeneralesForm.patchValue(loadedData);
        });
    } else {
      this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState.SolicitudState;
        })
      ).subscribe();
    }

    this.iniciarFormulario();
    this.getAduanaDeIngreso();
    this.getOficinaDeInspeccion();
    this.getPuntoDeInspeccion();
    this.getRegimenAlQue();
    this.getPuntoDeVerificacion();
    this.getDatosParaMovilizacion();
    this.getDatos();

    this.tramiteStoreQuery.selectSolicitudTramite$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState: { SolicitudState: DatosDeLaSolicitudInt }) => {
        if (seccionState) {
          this.solicitudState = seccionState.SolicitudState;
          this.datosGeneralesForm.patchValue(this.solicitudState);
        }
      })
    ).subscribe();

    this.datosGeneralesForm.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap(() => {
          const ACTIVE_STATE = { ...this.datosGeneralesForm.value };
          this.tramiteStore.setSolicitudTramite(ACTIVE_STATE);
        })
      )
      .subscribe();

    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Guarda los datos del formulario y actualiza el estado del componente.
   * Si el formulario está en modo solo lectura, deshabilita los campos.
   * Si no, habilita los campos para permitir la edición.
   *
   * @method guardarDatosFormulario
   * @returns {void} Este método no retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.iniciarFormulario();
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar=true;
      this.datosGeneralesForm.disable();
    } else {
      this.campoDeshabilitar=false;
      this.datosGeneralesForm.enable();
    }

  }

  /**
   * Inicializa el formulario reactivo con los controles necesarios.
   * @method iniciarFormulario
   * @returns {void}
   */
  iniciarFormulario(): void {
    const SOLICITUD_STATE = this.solicitudState || {};
    this.datosGeneralesForm = this.fb.group({
      folioDelTramite: [{ value: SOLICITUD_STATE.folioDelTramite || '', disabled: true }, Validators.required],
      aduanaDeIngreso: [SOLICITUD_STATE.aduanaDeIngreso || '', Validators.required],
      oficinaDeInspeccion: [SOLICITUD_STATE.oficinaDeInspeccion || '', Validators.required],
      puntoDeInspeccion: [SOLICITUD_STATE.puntoDeInspeccion || '', Validators.required],
      numeroDeGuia: [{ value: SOLICITUD_STATE.numeroDeGuia || '', disabled: true }, Validators.required],
      numeroFerrocaril: [{ value: SOLICITUD_STATE.numeroFerrocaril || '', disabled: true }, Validators.required],
      regimenAlQueDestina: [SOLICITUD_STATE.regimenAlQueDestina || '', Validators.required],
      datosParaMovilizacion: [{ value: SOLICITUD_STATE.datosParaMovilizacion || '', disabled: true }, Validators.required],
      puntoDeVerificacion: [SOLICITUD_STATE.puntoDeVerificacion || '', Validators.required],
      identificacionDelTransporte: [{ value: SOLICITUD_STATE.identificacionDelTransporte || '', disabled: true }, Validators.required],
      nombreDeLaEmpresaTransportista: [{ value: SOLICITUD_STATE.nombreDeLaEmpresaTransportista || '', disabled: true }, Validators.required],
    });
  }

  /**
   * Obtiene las aduanas de ingreso desde el servicio.
   * @method getAduanaDeIngreso
   * @returns {void}
   */
  getAduanaDeIngreso(): void {
    this.fitosanitarioService.getAduanaDeIngreso()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.aduanaDeIngreso = {
          labelNombre: 'Aduana de ingreso',
          required: false,
          primerOpcion: 'Selecciona un valor',
          catalogos: RESPONSE,
        };
      }
    });
  }

  /**
   * Obtiene los datos de la mercancía desde el servicio.
   * @method getDatos
   * @returns {void}
   */
  getDatos(): void {
    this.fitosanitarioService.getDatosMercania()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.immexTableDatos = RESPONSE;
      }
    });
  }

  /**
   * Obtiene las oficinas de inspección desde el servicio.
   * @method getOficinaDeInspeccion
   * @returns {void}
   */
  getOficinaDeInspeccion(): void {
    this.fitosanitarioService.getOficinaDeInspeccion()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.oficinaDeInspeccion = {
          labelNombre: 'Oficina de inspección de Sanidad Agropecuaria',
          required: false,
          primerOpcion: 'Selecciona un valor',
          catalogos: RESPONSE,
        };
      }
    });
  }

  /**
   * Obtiene los puntos de inspección desde el servicio.
   * @method getPuntoDeInspeccion
   * @returns {void}
   */
  getPuntoDeInspeccion(): void {
    this.fitosanitarioService.getPuntoDeInspeccion()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.puntoDeInspeccion = {
          labelNombre: 'Punto de inspección',
          required: false,
          primerOpcion: 'Selecciona un valor',
          catalogos: RESPONSE,
        };
      }
    });
  }

  /**
   * Obtiene los regímenes a los que se destina la mercancía desde el servicio.
   * @method getRegimenAlQue
   * @returns {void}
   */
  getRegimenAlQue(): void {
    this.fitosanitarioService.getRegimenAlQue()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.regimenAlQueDestina = {
          labelNombre: 'Régimen al que se destinara la mercancía',
          required: false,
          primerOpcion: 'Selecciona un valor',
          catalogos: RESPONSE,
        };
      }
    });
  }

  /**
   * Obtiene los datos para movilización nacional desde el servicio.
   * @method getDatosParaMovilizacion
   * @returns {void}
   */
  getDatosParaMovilizacion(): void {
    this.fitosanitarioService.getDatosParaMovilizacion()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.datosParaMovilizacion = {
          labelNombre: 'Datos para movilización nacional',
          required: false,
          primerOpcion: 'Selecciona un valor',
          catalogos: RESPONSE,
        };
      }
    });
  }

  /**
   * Obtiene los puntos de verificación federal desde el servicio.
   * @method getPuntoDeVerificacion
   * @returns {void}
   */
  getPuntoDeVerificacion(): void {
    this.fitosanitarioService.getPuntoDeVerificacion()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        this.puntoDeVerificacion = {
          labelNombre: 'Punto de verificación federal',
          required: false,
          primerOpcion: 'Selecciona un valor',
          catalogos: RESPONSE,
        };
      }
    });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Aquí se notifica la destrucción del componente para cancelar suscripciones.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }

}