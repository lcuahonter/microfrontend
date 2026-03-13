import { AVISO } from '@libs/shared/data-access-user/src/core/enums/constantes-alertas.enum';

import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';

import { AcuseComponent, AlertComponent, BtnContinuarComponent, CategoriaMensaje, FIRMAR_SOLICITUD, LoginQuery, Notificacion, PASOS_CARGAR_ARCHIVOS, TITULO_ACUSE, Usuario } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeccionLibState, SeccionLibStore } from '@ng-mf/data-access-user';
import { SolicitudTramiteRequest } from '../../models/request/solicitud-guardar-request.model';

import { CodigoRespuesta } from '../../../../core/enums/aga-core-enum';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PasoCuatroComponent } from '../paso-cuatro/paso-cuatro.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from "../paso-tres/paso-tres.component";
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SeccionLibQuery } from '@ng-mf/data-access-user';
import { TiposDocumentosService } from '../../service/tipos-documentos.service';
import { WizardComponent } from '@ng-mf/data-access-user';

import { Solicitud701State, Tramite701Store } from '../../estados/tramite/tramite701.store';
import { ALERTA } from '../../enum/enum-701';
import { Tramite701Query } from '../../estados/query/tramite701.query';
import { USUARIO_INFO } from '../../../11202/enum/enum-11202';


/**
 * Interfaz para la acción del botón.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente para la página de solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  standalone: true,

  imports: [
    AlertComponent,
    BtnContinuarComponent,
    CommonModule,
    FormsModule,
    PasoCuatroComponent,
    PasoDosComponent,
    PasoUnoComponent,
    ReactiveFormsModule,
    WizardComponent,
    PasoTresComponent,
    AcuseComponent
  ],
})
export class SolicitudPageComponent implements OnInit, OnDestroy {
  /**
   * Mostrar titulo de carga
   */
  mostrarTituloCarga: boolean = false;

  /**
   * Texto del aviso de privacidad simplificado.
   */
  TEXTOS = AVISO.Alerta;

  /**
   * Clase CSS para mostrar una alerta de información.
   */
  public infoAlert = 'alert-info';
  
  /**
   * Alerta que se muestra en el componente.
   */
  alerta = {
    MENSAJE: ''
  };

  /**
   * Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS_CARGAR_ARCHIVOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Valor del RFC obtenido del estado de login.
   */
  public rfcValor: string = '';

  /**
   * RFC del solicitante
   */
  rfcSolicitante!: string;

  /**
   * URL de la página actual.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Estado de la sección.
   */
  public seccion: SeccionLibState | undefined;

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Tipos de documentos seleccionados.
   */
  tiposDocumentoSeleccionados: number[] = [];

  /**
   * ID de la solicitud
   */
  idSolicitud!: number;

  /**
   * Estado de la solicitud del trámite 701.
   */
  public solicitudState!: Solicitud701State;


  /**
   * Referencia al componente del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
* Indica si la sección de carga de documentos está activa.
* Se inicializa en true para mostrar la sección de carga de documentos al inicio.
*/
  seccionCargarDocumentos: boolean = true;

  /**
 * Evento que se emite para cargar archivos.
 * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
 */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
  * Indica si el botón para cargar archivos está habilitado.
  */
  activarBotonCargaArchivos: boolean = false;

  /** Información del usuario */
  datosUsuario: Usuario = USUARIO_INFO;

  /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
  * @description Mensaje de alerta que se muestra al usuario en la página de acuse.
  */
  txtAlerta!: string;

  /**
   * @description Subtítulo que se muestra en la página de acuse.
   */
  subtitulo = TITULO_ACUSE;

  /**
   * @description Indica si el componente de acuse debe ser visible o no.
   * Inicialmente es falso y se establece en verdadero después de generar el acuse.
   */
  isAcuseVisible: boolean = false;

  /**
 * Indica si el formulario es válido.
 */
  esValido = false;

  /**
  * Clase CSS para mostrar una alerta de error.
  */
  infoError = 'alert-danger';

  /**
   * Mensaje de alerta a mostrar en caso de error.
   */
  ALERTA = ALERTA;

  /**
   * Número de solicitud generado para el trámite.
   */
  numeroSolicitud: string = '';

  /**
   * Indica si se debe mostrar un mensaje adicional.
   */
  mostrarMensaje: boolean = false;

  /**
   * Datos de los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * @param seccionQuery Consulta de la sección.
   * @param seccionStore Almacenamiento de la sección.
   */
  constructor(
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private loginQuery: LoginQuery,
    private tiposDocumentoService: TiposDocumentosService,
    private tramite701Store: Tramite701Store,
    private tramite701Query: Tramite701Query,
  ) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {

    this.tramite701Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();


    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
          this.alerta.MENSAJE = FIRMAR_SOLICITUD.MENSAJE.replace('{NUMERO}', '-');
        })
      )
      .subscribe();
  }

  /**
   * Selecciona una pestaña del wizard.
   * @param {number} i - Índice de la pestaña.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice del evento.
   * @param {AccionBoton} e - Evento con la acción y el valor.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont' && this.indice === 1) {
      this.guardarSolicitudDigitalizacion();
      return;
    }
    if (e.accion === 'cont' && this.indice === 2) {
      if (!this.solicitudState.documentos || this.solicitudState.documentos.length === 0) {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        this.esValido = true;
        this.mostrarMensaje = true;
        this.datosPasos.indice = this.indice;
        return;
      }
      this.esValido = false;
      this.guardarTiposDocumento();
       this.seccionCargarDocumentos = true;
      this.activarBotonCargaArchivos = false;
      setTimeout(() => {
        this.indice = e.valor;
        this.datosPasos.indice = this.indice;
        this.wizardComponent.siguiente();
      }, 500);
      return;
    }
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.validarSeccionPorIndice();
        this.wizardComponent.siguiente();
      } else {
        this.validarSeccionPorIndice();
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
    this.validarSeccionPorIndice();
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   */
  onTiposDocumentoChange(tipos: number[]): void {
    this.tiposDocumentoSeleccionados = tipos;
  }

  /**
   * Guarda los tipos de documento seleccionados.
   * @param indice Índice del paso al que se desea avanzar.
   */
  guardarTiposDocumento(): void {

    if (!this.idSolicitud) {
      return;
    }

    const DOCUMENTOS = this.solicitudState.documentos;

    if (!DOCUMENTOS || DOCUMENTOS.length === 0) {
      return;
    }

    const PAYLOAD = DOCUMENTOS.map(doc => ({
      id_tipo_documento: doc.cve_doc,
      id_persona: doc.cve_persona,
      id_documento_solicitud: doc.id_documento_solicitud || null,
    }));

    this.tiposDocumentoService.postGuardarTiposDocumentos(this.idSolicitud, PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo !== CodigoRespuesta.EXITO) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response?.error || 'Error al guardar tipos de documentos.',
              mensaje: response?.causa || response?.mensaje || 'Error al guardar tipos de documentos.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          } else if (response.codigo === CodigoRespuesta.EXITO && response.datos?.length) {
            // Tipos de documentos guardados correctamente
            const DOCUMENTOS_ACTUALES = [...this.solicitudState.documentos];

            response.datos.forEach(respDoc => {
              const INDEX = DOCUMENTOS_ACTUALES.findIndex(
                d => d.cve_doc === respDoc.id_tipo_documento
              );

              if (INDEX >= 0) {
                DOCUMENTOS_ACTUALES[INDEX] = {
                  ...DOCUMENTOS_ACTUALES[INDEX],
                  id_documento_solicitud: respDoc.id_documento_solicitud
                };
              }
            });

            this.tramite701Store.setDocumentos(DOCUMENTOS_ACTUALES);
          }
        }, error: () => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: 'Error al guardar tipos de documento.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * Servicio que permite guardar una solicitud de digitaliación.
   */
  guardarSolicitudDigitalizacion(): void {
    const PAYLOAD = this.construirPayloadSolicitud();
    this.tiposDocumentoService.postGuardarSolicitudDigitalizacion(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO && response?.datos) {

            this.idSolicitud = response.datos.id_solicitud;
            this.tramite701Store.setIdSolicitud(response.datos.id_solicitud);
            this.alerta.MENSAJE = FIRMAR_SOLICITUD.MENSAJE
              .replace('{NUMERO}', this.idSolicitud.toString());
            this.mostrarMensaje = true;
            this.wizardComponent.siguiente();
            this.indice = 2;
            this.datosPasos.indice = 2;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response?.error || 'Error al guardar la solicitud.',
              mensaje: response?.causa || response?.mensaje || 'Error al guardar la solicitud.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        }, error: () => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: 'Error al guardar la solicitud.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * Construye el payload para la solicitud de digitalización.
   * @returns 
   */
  private construirPayloadSolicitud(): SolicitudTramiteRequest {
    return {
      id_solicitud:
        this.solicitudState.idSolicitud === 0
          ? null
          : this.solicitudState.idSolicitud,
      id_tipo_tramite: '701',
      rfc: this.rfcValor,
      rol_capturista: 'Solicitante',
      cve_unidad_administrativa: null,
      costo_total: null,
      certificado_serial_number: null,
      numero_folio_tramite_original: null,
      representante_legal: {
        nombre: null,
        ap_paterno: null,
        ap_materno: null,
        telefono: null,
      }
    };
  }

  /**
 * Actualiza los datos de los pasos del asistente.
 * Se utiliza para reflejar el número de pasos, el índice actual y los textos de los botones.
 */
  actualizarDatosPasos(): void {
    this.datosPasos = {
      nroPasos: this.pasos.length,
      indice: this.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };
  }

  /**
  * Emite un evento para cargar archivos.
  * {void} No retorna ningún valor.
  */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
 * Método para navegar a la siguiente sección del wizard.
 * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
 * {void} No retorna ningún valor.
 */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
    this.validarSeccionPorIndice();
  }

  /**
   * Método para validar la sección según el índice actual.
   * Activa o desactiva la sección de carga de documentos según el índice.
   * {void} No retorna ningún valor.
   */
  private validarSeccionPorIndice(): void {
  if (this.indice === 3) {
    this.seccionCargarDocumentos = true;
    this.activarBotonCargaArchivos = false; 
  } else {
    this.seccionCargarDocumentos = false;
  }
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
    * Maneja el evento de carga en progreso emitido por un componente hijo.
    * Actualiza el estado de cargaEnProgreso según el valor recibido.
    * @param cargando Valor booleano que indica si la carga está en progreso.
    */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }

  /**
* Maneja el evento cuando se genera un acuse.
* Actualiza el texto de alerta y el estado de visibilidad del acuse en el componente.
*
* @param event - Objeto que contiene los datos del acuse generado.
* @param event.txtAlerta - Texto del mensaje de alerta a mostrar.
* @param event.isVisible - Indica si el acuse debe mostrarse o no.
*/
  onAcuseGenerado(event: { txtAlerta: string; isVisible: boolean }): void {
    this.txtAlerta = event.txtAlerta;
    this.isAcuseVisible = event.isVisible;
  }

  /**
   * Controla la visibilidad del título de carga.
   * 
   * @param valor - true para mostrar el título de carga, false para ocultarlo.
   */
  cambiarTituloCarga(valor: boolean): void {
    this.mostrarTituloCarga = valor;
  }

  /**
   * Muestra una alerta de error.
   * @param mensaje 
   */
  mostrarAlerta(mensaje: string): void {
    this.ALERTA = mensaje;
    this.esValido = true;
  }

  /**
   * Limpia la alerta de error.
   */
  limpiarAlerta(): void {
    this.esValido = false;
  }

  /**
  * @method ngOnDestroy
  * @description Método que se ejecuta cuando el componente es destruido.
  * Implementa la limpieza necesaria para evitar fugas de memoria cancelando
  * todas las suscripciones activas mediante el subject destroyNotifier$.
  * Es una implementación estándar del patrón de limpieza en Angular que asegura
  * que todas las suscripciones del componente sean correctamente finalizadas
  * cuando el componente se destruye, liberando recursos del sistema.
  * @returns {void} No retorna ningún valor.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.tramite701Store.reset();
  }
}
