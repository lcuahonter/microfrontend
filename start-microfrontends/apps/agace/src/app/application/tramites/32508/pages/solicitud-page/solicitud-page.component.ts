import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DatosPasos, Notificacion } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';
import { Tramite32508Query } from '../../state/Tramite32508.query';
import { Tramite32508Store } from '../../state/Tramite32508.store';
import { AdaceService } from '../../services/adace.service';
import { take } from 'rxjs';
import {
  GuardarSolicitudRequest,
  SolicitanteRequest,
  DictamenRequest,
  RepresentacionFederalRequest,
} from '../../models/adace.model';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import {
  ALERTA_FIRMA,
  ALERTA_PASO_UNO,
  ALERT_TEXTO,
  MSG_REGISTRO_EXITOSO,
  WARN_CARGA_DOCUMENTOS,
} from '../../constantes/adace32508.enum';

/**
 * Texto de alerta para terceros.
 */
const TERCEROS_TEXTO_DE_ALERTA =
  'La solicitud ha quedado registrada con el número temporal 202757598 Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';
/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   */
  valor: number;
}
/**
 * Componente que representa la página de solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnDestroy {
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;
  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente.
   */
  @ViewChild('wizardRef') wizardComponent!: WizardComponent;

  /**
   * Referencia al componente paso-dos para acceder a sus métodos de carga de documentos.
   */
  @ViewChild(PasoDosComponent) pasoDosComponent!: PasoDosComponent;

  /**
   * Referencia al componente paso-uno para acceder a la validación del formulario de aviso.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Datos de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Nueva notificación para mostrar mensajes al usuario.
   */
  nuevaNotificacion!: Notificacion;

  /**
   * Controla la visibilidad de la sección de carga de documentos.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si el botón de carga de archivos debe estar habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la carga de documentos está en progreso.
   */
  cargaEnProgreso: boolean = false;

  /** Texto de alerta para paso uno.
   * @type {string}
   */
  TEXTO_PASO_UNO: string = ALERTA_PASO_UNO;

  /**
   * @description Texto que se muestra en la alerta del formulario.
   * Este texto es utilizado para proporcionar información al usuario sobre el propósito del formulario.
   * @type {string}
   */
  protected readonly alertText = ALERT_TEXTO;

  /**
   * ID de la solicitud guardada.
   * Se obtiene del store después de guardar exitosamente.
   */
  idSolicitud: string = '';

  /**
   * @description mensaje de registro de solicitud exitoso.
   * @type {string}
   * @protected
   */
  protected readonly MSG_REGISTRO_EXITOSO = MSG_REGISTRO_EXITOSO;

  /**
   * @description mensaje de advertencia para la carga de documentos
   * @type {string}
   * @protected
   */
  protected readonly WARN_CARGA_DOCUMENTOS = WARN_CARGA_DOCUMENTOS;

  /**
   * @description mensaje de alerta antes de la firma de la solicitud.
   * @type {string}
   * @protected
   */
  protected readonly ALERTA_FIRMA = ALERTA_FIRMA;

  /**
   * Controla la visibilidad del alert de firma.
   * Se oculta cuando el acuse es visible.
   */
  mostrarAlertaFirma: boolean = true;

  constructor(
    private tramiteQuery: Tramite32508Query,
    private tramiteStore: Tramite32508Store,
    private adaceService: AdaceService
  ) {}

  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * Solo maneja navegación del wizard, sin lógica de negocio.
   * @param e Acción del botón.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Maneja las acciones específicas de cada paso antes de avanzar.
   * @param e Acción del botón.
   */
  getBtnGuardarAction(e: AccionBoton): void {
    switch (this.indice) {
      case 1:
        // Validar formulario antes de guardar
        if (this.pasoUnoComponent?.validarAviso()) {
          this.guardarSolicitud();
        }
        break;
      case 3:
        break;
      default:
        // Para pasos sin lógica especial, solo navegar
        this.getValorIndice(e);
        break;
    }
  }

  /**
   * Guarda la solicitud del trámite 32508.
   * Construye el request con todos los datos necesarios y llama al servicio.
   */
  guardarSolicitud(): void {
    this.tramiteQuery.selectSolicitud$.pipe(take(1)).subscribe({
      next: (tramiteState) => {
        console.log('Estado del trámite para guardar:', tramiteState);

        // 1️⃣ Construir objeto SOLICITANTE
        const SOLICITANTE: SolicitanteRequest = {
          rfc: tramiteState.rfc,
          nombre: tramiteState.nombre,
          es_persona_moral: tramiteState.tipoPersona === 'M',
        };

        // 2️⃣ Construir objeto DICTAMEN
        const TIPO_DICT = tramiteState.tipoDictamen;

        const DICTAMEN: DictamenRequest = {
          clave_recinto: tramiteState.claveFiscalizado,
          rfc: tramiteState.rfcCpi,
          nombre: tramiteState.nombreCpi,
          numero_inscripcion: tramiteState.numeroInscripcion,

          // ✅ Año y mes con valores por defecto temporales
          anio_periodo: tramiteState.anoSeleccionado,
          mes_periodo: tramiteState.mesSeleccionado,

          fec_elaboracion: tramiteState.fechaElaboracion,

          // ✅ Saldos anteriores según tipo de dictamen
          saldo_compensar_anterior: tramiteState.saldoPendienteCompensarAnterior,
          saldo_disminuir_anterior: tramiteState.saldoPendienteDisminuirAnterior,

          aprovechamiento_total: tramiteState.aprovechamiento,

          // ✅ Campos opcionales como null si están vacíos
          compensacion_aplicada: tramiteState.compensacionAplicada || '',
          disminucion_aplicada: tramiteState.disminucionAplicada || '',
          saldo_compensar: tramiteState.saldoPendienteCompensar || '',
          saldo_disminuir: tramiteState.saldoPendienteDisminuir || '',
          cantidad_pagada: tramiteState.cantidad || '',
          llave_de_pago: tramiteState.llaveDePago || '',
          fecha_pago: tramiteState.fechaPago || '',

          tipo_dictamen: tramiteState.tipoDictamen,
          pago_aprovechamiento: tramiteState.radioParcial || 'no',
          aprovechamiento: tramiteState.radioTotal || 'no',
          total_ingresos_prestracion: tramiteState.ingresos || '',
          cantidad_dictaminada: tramiteState.dictaminadaCantidad || '',

          // ✅ Determinar plantillas según tipo de dictamen
          plantilla_disminucion: TIPO_DICT === 'disminucion' || TIPO_DICT === 'disminucionYCompensacion',
          plantilla_compensacion: TIPO_DICT === 'compensacion' || TIPO_DICT === 'disminucionYCompensacion',
        };

        const REP_FED: RepresentacionFederalRequest = {
          cve_entidad_federativa: tramiteState.cveEntidadFederativa,
          cve_unidad_administrativa: tramiteState.cveUnidadAdministrativa,
        };

        // 3️⃣ Construir REQUEST completo
        const DATOS_GUARDAR: GuardarSolicitudRequest = {
          solicitante: SOLICITANTE,
          dictamen: DICTAMEN,
          representacion_federal: REP_FED,
          lista_disminucion: tramiteState.listaDisminucion || [],
          lista_compensacion: tramiteState.listaCompensacion || [],
        };

        // console.log('Request a enviar:', JSON.stringify(DATOS_GUARDAR, null, 2));

        // 4️⃣ Llamar al servicio para guardar
        this.adaceService
          .guardarSolicitud(DATOS_GUARDAR)
          .pipe(take(1))
          .subscribe({
            next: (respuesta) => {
              // console.log('Respuesta del servidor:', respuesta);

              if (respuesta.codigo === '00' || respuesta.codigo === '200') {
                // ✅ Guardar ID de solicitud en el store
                this.tramiteStore.setIdSolicitud(String(respuesta.datos?.id_solicitud));
                this.idSolicitud = respuesta.datos?.id_solicitud || '';

                // ✅ Mostrar notificación de éxito
                this.nuevaNotificacion = {
                  tipoNotificacion: 'toastr',
                  categoria: 'success',
                  modo: '',
                  titulo: 'Éxito',
                  mensaje: 'La solicitud se guardó correctamente',
                  cerrar: false,
                  txtBtnAceptar: '',
                  txtBtnCancelar: '',
                };

                this.continuar();
              } else {
                const mensajeError = respuesta.error || 'Error al guardar la solicitud';
                this.mostrarNotificacionError(mensajeError);
              }
            },
            error: (error) => {
              const mensaje = error?.error?.mensaje || 'Error al guardar la solicitud. Intente nuevamente.';
              this.mostrarNotificacionError(mensaje);
            },
          });
      },
      error: (error) => {
        this.mostrarNotificacionError('Error al obtener los datos de la solicitud');
      },
    });
  }

  /**
   * Avanza al siguiente paso del wizard.
   */
  continuar(): void {
    this.getValorIndice({ accion: 'cont', valor: this.indice + 1 });
  }

  /**
   * Muestra una notificación de error al usuario.
   * @param mensaje Mensaje de error a mostrar
   */
  private mostrarNotificacionError(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'toastr',
      categoria: 'error',
      modo: '',
      titulo: 'Error',
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    };
  }

  /**
   * Maneja el evento cuando se completa la carga de documentos.
   * @param cargaRealizada Indica si la carga fue exitosa
   */
  onCargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
    if (cargaRealizada) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: 'success',
        modo: '',
        titulo: 'Carga exitosa',
        mensaje: 'Los documentos se cargaron correctamente',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Maneja el evento de habilitación del botón de carga de archivos.
   * @param activar Indica si se debe activar el botón
   */
  onActivarBotonCargaArchivos(activar: boolean): void {
    this.activarBotonCargaArchivos = activar;
  }

  /**
   * Maneja el evento de carga en progreso.
   * @param enProgreso Indica si la carga está en progreso
   */
  onCargaEnProgreso(enProgreso: boolean): void {
    this.cargaEnProgreso = enProgreso;
  }

  /**
   * Dispara el evento de carga de archivos desde el componente paso-dos.
   */
  onClickCargaArchivos(): void {
    if (this.pasoDosComponent) {
      this.pasoDosComponent.dispararCargaArchivos();
    }
  }

  /**
   * Maneja el evento cuando el acuse se hace visible en paso-tres.
   * Oculta el alert de firma cuando el acuse es mostrado.
   * @param esAcuse Indica si el acuse está visible
   */
  onEsAcuseChange(esAcuse: boolean): void {
    this.mostrarAlertaFirma = !esAcuse;
  }

  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Resetea el store del trámite para limpiar el estado cuando el usuario sale del flujo.
   */
  ngOnDestroy(): void {
    this.tramiteStore.reset();
  }
}
