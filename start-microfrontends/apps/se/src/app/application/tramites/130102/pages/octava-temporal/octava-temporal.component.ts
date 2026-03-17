/* eslint-disable @nx/enforce-module-boundaries */
/**
 * @fileoverview Este archivo contiene la clase OctavaTemporalComponent, que es responsable de manejar la lógica del componente Octava Temporal.
 * 
 * @module OctavaTemporalComponent
 */
import { AVISO_CONTRNIDO, ConsultaioQuery, ConsultaioState, Notificacion} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { DatosPasos, WizardComponent } from '@libs/shared/data-access-user/src';
import { ListaPasosWizard, WizardService } from '@libs/shared/data-access-user/src';
import { Solicitud130102State, Tramite130102Store } from '../../estados/tramites/tramite130102.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CadenaOriginal130102Service } from '../../services/cadena-original.service';
import { CadenaOriginalRequest } from '../../models/request/cadena-original-request.model';
import { CatOctavaTemporalService } from '../../services/cat-octava-temporal.service';
import { CategoriaMensaje } from '@libs/shared/data-access-user/src';
import {ERROR_DE_REGISTRO_ALERT} from '../../constantes/octava-temporal.enum';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { OCTA_TEMPO } from 'libs/shared/data-access-user/src/core/services/130102/octava-temporal.enum';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PartidaMercanciaContrato, SaveReglaOctavaRequest } from '../../models/request/regla-octava-request.model';
import { Tramite130102Query } from '../../estados/queries/tramite130102.query';
import { dataRequestROctavaTemporal } from '../../models/request/data-test';
/**
 * @class OctavaTemporalComponent
 * @classdesc Esta clase representa el componente Octava Temporal.
 */

interface AccionBoton {
  accion: string;
  valor: number;
}

@Component({
  selector: 'app-octava-temporal',
  templateUrl: './octava-temporal.component.html',
})
export class OctavaTemporalComponent implements OnInit, OnDestroy{
     /**
   * Clase CSS para la alerta de información.
   */
  infoAlert = 'alert-danger';
    /**
   * Controla si se debe mostrar la alerta en pantalla.
   * Se activa cuando el subíndice del child componente es 3.
   */
  mostrarAlerta: boolean = false;
 /**
 * Contiene el texto del aviso de privacidad simplificado.
 * 
 * @constant {string} avisoContrnido
 * Se inicializa con la propiedad `aviso` del objeto `AVISO_CONTRNIDO`.
 * 
 * Uso:
 * - Mostrar el aviso de privacidad en la interfaz de usuario.
 * - Reutilizar el contenido del aviso en distintos componentes.
 */
avisoContrnido = AVISO_CONTRNIDO.aviso;
  /**
   * Referencia al componente del asistente (wizard) para controlar su navegación.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {ListaPasosWizard[]} pantallasPasos - Array para almacenar los pasos del wizard.
   */
  pantallasPasos: ListaPasosWizard[] = OCTA_TEMPO;

  /**
   * @property {number} indice - El índice actual del paso.
   */
  indice: number = 1;

  /**
   * @property {DatosPasos} datosPasos - Objeto con la información para el botón de continuar.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud130102State;

  /**
   * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
   * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
   */
  nuevaNotificacion!: Notificacion;

  /**
  * Cadena original generada a partir de los datos del trámite.
  * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
  */
  cadenaOriginal?: string;
    
  /**
   * Bandera que indica si se deben mostrar los errores del formulario.
   */
  mostrarErrorFormularios: boolean = false;

  /**
   * Alerta que se muestra en caso de error en el registro.
   */
  registroAlert = ERROR_DE_REGISTRO_ALERT;

  /*
  * @description Notificador para destruir el componente y cancelar suscripciones.
  */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Subject para destruir notificador y cancelar suscripciones.
   */
  destruirNotificador$: Subject<void> = new Subject();
  /*
  * @description Estado actual de la consulta, obtenido desde el store.
  */
  public consultaState!: ConsultaioState;

  /**
   * @property wizardService
   * @description
   * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
   * @type {WizardService}
   */
  private wizardService = inject(WizardService);


  /**
   * Constructor del componente/servicio.
   * Inyecta los servicios necesarios para la consulta del estado y la gestión del formulario de registro.
   *
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado actual desde el store.
   * @param {FormularioRegistroService} formularioRegistroService - Servicio para gestionar el formulario de registro.
   */
  constructor(
    private consultaQuery: ConsultaioQuery, 
    private formularioRegistroService: FormularioRegistroService,
    private catOctavaTemporalService: CatOctavaTemporalService,
    private tramite130102Query: Tramite130102Query,
    private tramite130102Store: Tramite130102Store,
    private cadena: CadenaOriginal130102Service,
  ) {}

  /**
   * Método del ciclo de vida `ngOnInit`.
   * Inicializa el componente y sus dependencias.
   * Se suscribe al observable del estado de consulta para obtener el estado actual desde el store.
   * Al recibir un nuevo estado, lo asigna a la propiedad `consultaState`.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
      this.consultaState = seccionState;
      }
    )).subscribe();

    this.tramite130102Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
    
  }

  /**
   * Maneja el cambio de índice en el flujo del wizard.
   * Valida los formularios antes de avanzar o retroceder.
   * 
   * @param e - Objeto que contiene la acción y el nuevo valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    if (!this.consultaState.readonly) {
      const TODOS_VALIDOS = this.formularioRegistroService.validarTodosFormularios();

      if (!TODOS_VALIDOS) {
        this.mostrarErrorFormularios = true;
        return;
      }
      this.mostrarErrorFormularios = false;
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.datosPasos.indice = e.valor;
        if (e.accion === 'cont' && !this.mostrarErrorFormularios) {
          this.indice = e.valor + 1;
          this.datosPasos.indice = e.valor + 1;
          this.wizardService.cambio_indice(this.datosPasos.indice);
          this.wizardComponent.siguiente();
        } else if (e.accion === 'ant' && !this.mostrarErrorFormularios){
          this.indice = e.valor - 1;
          this.datosPasos.indice = e.valor - 1;
          this.wizardComponent.atras();
        }
      }
    } else {
      if (e.valor > 0 && this.pantallasPasos.length) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
    }
    
  }

  /**
   * Método para ejecutar la notificación del trámite.
   * @param numFolioTramite - Número de folio del trámite.
   */
  ejecutarNotificacion(numFolioTramite : string): void {
      this.catOctavaTemporalService.getIniciarNotificacion(numFolioTramite ).pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((data) => {

        if(data.codigo === '200'){
          alert(data.mensaje);
        } else {
          alert(`Error: ${data.error} - Causa: ${data.causa}`);
        }
      });

  } 

  generaContratoSolicitud(): SaveReglaOctavaRequest {

    const DATA_PARTIDA_MERCANCIA: PartidaMercanciaContrato[] = this.solicitudState.partidas_tabla!.map((partida) => ({
      cantidad: partida.cantidadPartidas,
      descripcion: partida.descripcion,
      valor_autorizado: partida.valor_autorizado,
      cve_fraccion: partida.cve_fraccion,
      importe_Unitario: partida.importe_Unitario,
      importe_partida_total_usd: partida.importe_partida_total_usd
    }));
    const DATA: SaveReglaOctavaRequest = {
        cve_regimen: this.solicitudState.regimen || '',
        cve_clasificacion_regimen: this.solicitudState.clasificacionRegimen || '',
        numero_autorizado_programa_prosec_pex:"9419", /* Valor fijo temporalmente */
        cve_usuario_capturista: "USUARIO123", /** Valor temporal */
        lista_paises: this.solicitudState.paises || [],
        mercancia: {
            cve_fraccion_arancelaria: this.solicitudState.fraccionArancelaria || '',
            cve_subdivision: "7202199901", /* Valor fijo temporalmente */
            descripcion: this.solicitudState.descripcion || '',
            cve_unidad_medida_tarifaria: this.solicitudState.unidadMedida || '',
            cantidad_tarifaria: this.solicitudState.cantidad || 0,
            valor_factura_usd: parseFloat(this.solicitudState.valorFacturaUSD) || 0,
            ide_condicion_mercancia: this.solicitudState.productos || 'CONDMER.N',
        },
        solicitante: {
            rfc: "AAL0409235E6", /* Valor fijo temporalmente */
            nombre: "Juan Pérez", /* Valor fijo temporalmente */
            es_persona_moral: true, /* Valor fijo temporalmente */
            certificado_serial_number: "20001000000100001815" /* Valor fijo temporalmente */
        },
        representacion_federal: {
            cve_entidad_federativa: this.solicitudState.entidad || '',
            cve_unidad_administrativa:  this.solicitudState.representacion,
        },
        partidas_mercancia: DATA_PARTIDA_MERCANCIA || [],
        cantidad_total: this.solicitudState.cantidadTotal || 0,
        cantidad_total_usd: parseFloat(this.solicitudState.valorTotalUSD) || 0,
        lista_fracciones_prosec: this.solicitudState.lista_fracciones_prosec || [],
    
    }

    return DATA;
  }
  /**
   * Método que invoca al servicio de guardado de la solicitud.
   * @param data - Datos de la solicitud a guardar.
   */
  ejecutarGuardadoSolicitud(e: AccionBoton): void {
    this.formularioRegistroService.quitarFormulario('formDelLa');
    const formValido =this.formularioRegistroService.validarTodosFormularios();
    if (!formValido) {
      this.mostrarErrorFormularios = true;
      return;
    }
    this.mostrarErrorFormularios = false;
    this.generaContratoSolicitud();
    const DATA_REQUEST : SaveReglaOctavaRequest = this.generaContratoSolicitud();
    this.catOctavaTemporalService.saveDataRequest(DATA_REQUEST).subscribe({
      next: (data) => {
        if (data.codigo !== '00') {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: data.mensaje || 'Error al guardar la solicitud verifica los datos ingresados.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          return;
        }
        if (data.datos.id_solicitud) {
          this.tramite130102Store.setIdSolicitud(data.datos.id_solicitud);
          this.tramite130102Store.setDynamicFieldValue('idSolicitud', data.datos.id_solicitud);
          this.obtenerCadenaOriginal(data.datos.id_solicitud);
          this.getValorIndice(e);
          // reset de formularios
          this.formularioRegistroService.resetFormularios();
        } else {
          
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: data.mensaje || 'Error al guardar la solicitud.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (error) => {
        this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: error.mensaje || 'Error al guardar la solicitud.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
      }
    }
    );
  }

    /**
     * Método para obtener la cadena original del trámite.
     * Este método se encarga de llamar al servicio correspondiente para generar la cadena original.
     */
    obtenerCadenaOriginal(idSol: number): void {
      const PAYLOAD: CadenaOriginalRequest = {
        boolean_extranjero: true,
        solicitante: {
          rfc: "AAL0409235E6",
          nombre: "Juan Pérez",
          es_persona_moral: true,
          certificado_serial_number: "string"
        },
        cve_rol_capturista: "CapturistaGubernamental",
        cve_usuario_capturista: "Gubernamental",
        fecha_firma: "2025-07-01 20:01:25"
      };
   
      this.cadena.obtenerCadenaOriginal(String(idSol), PAYLOAD).subscribe({
        next: (resp) => {
          if (resp.codigo !== '00') {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: resp.error || 'Error al generar la cadena original.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
   
            return;
          }
          this.tramite130102Store.setCadenaOriginal(resp.datos as string);
          this.cadenaOriginal = typeof resp.datos === 'string' ? resp.datos : undefined;
        },
        error: (error) => {

          const MENSAJE = error?.error?.error || 'Error inesperado al iniciar trámite.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
    }
    
  /*
    * Método que se ejecuta al destruir el componente.
  */
   ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
