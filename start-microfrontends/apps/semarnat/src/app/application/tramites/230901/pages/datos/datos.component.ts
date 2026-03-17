import { Component, EventEmitter, ViewChild, inject, signal } from '@angular/core';

import { CategoriaMensaje, DatosPasos, Notificacion } from '@ng-mf/data-access-user';
import { AVISO, ERROR_FORMA_ALERT, ListaPasosWizard, WizardComponent } from '@ng-mf/data-access-user';

import { PASOS_REGISTRO } from '../../enum/pasos-registro.enum';
import { MSG_REGISTRO_EXITOSO } from '../../enum/230901.enum';

import { DatosTramite230902Service } from '../../services/datos-tramite-230901.service';

import { Tramite230901Store } from '../../estados/store/tramite230901.store';
import { UtilidadesService } from '../../services/utilidades.service';
import { AccionBoton, ValidacionFormularios } from '../../interfaces/catalogos.interface';


/**
 * Componente que representa los pasos de datos en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent {
  //Referencia al componente WizardComponent.
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
   * Inyección de dependencia de servicio para invocar el storage.
   */
  public store = inject(Tramite230901Store)
  /** 
   * Inyección de dependencia de servicio para invocar los servicios de catlogos a necesitar.
  */
  public datosService = inject(DatosTramite230902Service)
  /* Utilidades a reutilizar dentro del tramite
  */
  public utils = inject(UtilidadesService);
  /** 
   * Inicializa el estado del formulario 
  */
  public solicitudState = this.utils.solicitud;

  /** 
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`. 
  */
  public consultaState = this.utils.consultaState;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
     * Valida si el formulario esta validado par continuar el proceso caso contrario habilita el formulario requerido
     */
  esGuardarDatos = signal<ValidacionFormularios>({ isFormValid: false, isGuardForm: false, tabRequired: 0 });

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si hay errores de validación en los formularios que se deben mostrar.
   * Se establece a `true` cuando se intenta avanzar al siguiente paso con formularios inválidos,
   * lo que activa la visualización de mensajes de error en la interfaz.
   */
  esFormaValido = signal<boolean>(true);

  /**
   * @property {Object} formErrorAlert
   * @description
   * Objeto que contiene la configuración del mensaje de error para formularios inválidos.
   * Utiliza la constante `ERROR_FORMA_ALERT` definida en las enumeraciones del trámite.
   * Define el título, mensaje y opciones de visualización para la alerta de error de validación de formularios.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /** Mensaje de alerta relacionado con el aviso de privacidad. */
  mensajeAlertaAvisoPrivacidad: string = AVISO.Aviso;

  // Variable utilizada para almacenar la lista de pasos.
  pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;

  // Variable utilizada para almacenar el índice del paso actual.
  indice = signal<number>(1);

  /** Datos para los pasos en el asistente. */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice(),
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

  /**
  * Notificación que se puede utilizar para mostrar mensajes emergentes (toastr).
  * Null cuando no hay notificación nueva.
  */
  public nuevaNotificacion: Notificacion | null = null;

  /** Indica si la sección de carga de documentos está activa. */
  seccionCargarDocumentos: boolean = true;
  /** Indica si el botón para cargar archivos está habilitado. */
  activarBotonCargaArchivos: boolean = false;
  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

  /** Indica si el formulario está en modo solo lectura. */
  esFormularioSoloLectura = signal<boolean>(this.consultaState().readonly);


  /**
   * Actualiza el valor del índice según el evento del botón de acción.
   * @param e El evento del botón de acción que contiene la acción y el valor.
  */
  public async getValorIndice(e: AccionBoton): Promise<void> {
    const TAB_NO_COMPLETADO = this.solicitudState().pasoUno.find(item => !item.completado)
    const PASO_UNO_COMPLETADO = this.solicitudState().pasoUno.filter(item => item.completado);

    if (PASO_UNO_COMPLETADO.length === 3) {
      this.esFormaValido.set(true)
      this.guardaSolicitud()
    }
    else {
      this.esFormaValido.set(false)
      this.esGuardarDatos.update(currentUser => ({
        ...currentUser,
        isFormValid: false,
        isGuardForm: true,
        tabRequired: TAB_NO_COMPLETADO?.paginaTab || 1
      }));
    }

  }

  /** Metodo para el guardado de la Solicitud */
  async guardaSolicitud() {


    const PAYLOAD = [this.solicitudState()].map(item => ({
      id_solcitud: this.solicitudState().idSolicitud === 0 ? null : +this.solicitudState().idSolicitud,
      aduanas_entrada: item.aduanas_entrada,
      aduanas_salida: item.aduanas_salida,
      cve_clasificacion_regimen: item.cve_clasificacion_regimen,
      cve_regimen: item.cve_regimen,
      rol_capturista: item.rol_capturista,
      destinatario: item.destinatario[0],
      mercancias: item.mercancias,
      movimientos: item.movimientos,
      pago: { ...item.pago, fec_pago: this.utils.formateoFechaPago(item.pago.fec_pago) },
      solicitante: item.solicitante
    }))[0]

    try {
      const data = await this.datosService.crearSolicitud(PAYLOAD);
      const { codigo: CODIGO, datos: { id_solicitud: ID_SOLICITUD } } = data;
      this.store.update({ idSolicitud: ID_SOLICITUD });
      this.alertaNotificacion = {
        tipoNotificacion: 'banner',
        categoria: 'success',
        modo: 'action',
        titulo: '',
        mensaje: MSG_REGISTRO_EXITOSO(String(ID_SOLICITUD)),
        cerrar: true,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      setTimeout(
        () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        0
      );
      this.siguiente()
    } catch (error) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: '',
        mensaje:
          '' || 'Error inesperado al enviar la solicitud.',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      setTimeout(
        () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        0
      );
    }
  }

  /**
  * Método para navegar a la siguiente sección del wizard.
  * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
  * {void} No retorna ningún valor.
  */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice.update(current => current + 1)
  }

  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice.update(current => current - 1)
  }

  /**
  * Método para manejar el evento de carga de documentos.
  * Actualiza el estado de la sección de carga de documentos.
  *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
  * {void} No retorna ningún valor.
  */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }
  /**
    * Método para manejar el evento de carga de documentos.
    * Actualiza el estado del botón de carga de archivos.
    *  carga - Indica si la carga de documentos está activa o no.
    * {void} No retorna ningún valor.
    */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /*
    * Método para manejar el evento de carga en progreso.
    * Actualiza el estado de carga en progreso.
    * carga - Indica si la carga está en progreso.
    * {void} No retorna ningún valor.
    */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
     * Emite un evento para cargar archivos.
     * {void} No retorna ningún valor.
     */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }
}
