/* eslint-disable @typescript-eslint/no-explicit-any */
import { ALERTA } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';
import { Location } from '@angular/common';

import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AVISO, CategoriaMensaje, DatosPasos, ListaPasosWizard, LoginQuery, Notificacion, PASOS, SolicitanteQuery, SolicitanteState, Usuario, WizardComponent } from '@ng-mf/data-access-user';
import { GuadarSolicitudRequest } from '../../model/request/guardar-solicitud-request.model';
import { GuardarService } from '../../services/guardar.service';
import { IniciarService } from '../../services/iniciar.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import { Observable, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';

import { Tramite130118Query } from '../../estados/queries/tramite130118.query';

import { MSG_REGISTRO_EXITOSO } from '../../enum/enum-130118';

import { Solicitud130118State, Tramite130118Store } from '../../estados/tramites/tramite130118.store';
import { USUARIO_INFO } from '../../../../shared/enum/datos-usuario-documentos';

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
 * Interfaz que define la estructura del resultado de una solicitud.
 */
interface ResultadoSolicitud {
  /**
   * Indica si la solicitud fue exitosa.
   */
  exito: boolean;

  /**
   * Mensaje de error o éxito de la solicitud.
   */
  mensaje?: string;

  /**
   * Errores del modelo, si los hay.
   */
  erroresModelo?: { campo: string; errores: string[] }[];
}

/**
 * Componente que representa la página de solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
export class SolicitudPageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente (wizard).
   * Permite controlar la navegación entre los pasos.
   */
  @ViewChild('wizard', { static: false }) wizardComponent!: WizardComponent;


  /**
   * Referencia al componente del primer paso.
   * Permite acceder a los métodos y propiedades del paso uno.
   */
  @ViewChild('pasoUno') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Clase CSS para mostrar una alerta de información.
   */
  public infoAlert = 'alert-info';

  /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger';

  /**
   * Texto del aviso de privacidad simplificado.
   */
  TEXTOS = AVISO.Aviso;

  /**
   * URL de la página actual.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

  /**
 * Estado del tramite Folio
 */
  public folioTemporal: number = 0;

  /**
   * Mensaje de alerta a mostrar en caso de error.
   */
  ALERTA = ALERTA;

  /**
   * Indica si el formulario es válido.
   */
  esValido = true;

  /**
   * URL de la página actual.
   */
  public solicitudState!: Solicitud130118State;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;

  /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;

  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones.
   * Se utiliza para evitar fugas de memoria al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  datosUsuario: Usuario = USUARIO_INFO;

  /**
   * Estado del solicitante.
   */
  solicitante!: SolicitanteState

  /** Indica si el solicitante es una persona moral.
   * Se utiliza para determinar qué campos mostrar en el formulario.
   */
  esPersonaMoral: boolean = false;

  /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true; 

  /*
  * Valor del RFC obtenido del estado de login.
  */
  public rfcValor: string = '';

  /**
   * Indica si se debe mostrar un mensaje en la interfaz de usuario de servicio validar.
   * 
   * Cuando es `true`, el mensaje se muestra; cuando es `false`, el mensaje permanece oculto.
  */
  mostrarMensajeServicio: boolean = false;

  /**
   * Datos de error en validacion
  */
  mensajeErrores: string[] = [];

  /**
   * Notificación que se muestra al usuario.
   * Se utiliza para mostrar mensajes de éxito, error o información.
   */
  constructor(
    private iniciarService: IniciarService,
    private location: Location,
    private guardarService: GuardarService,
    private tramite130118Store: Tramite130118Store,
    private tramite130118Query: Tramite130118Query,
    private solicitanteQuery: SolicitanteQuery,
    private loginQuery: LoginQuery,
  ) { }

  /**
   * Datos de los pasos del asistente, incluyendo textos de botones y el índice actual.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la sección y obtiene la URL actual.
   * Si el estado de la consulta indica que hay datos actualizados, se guardan los datos del formulario.
   * Si no, se establece que hay datos de respuesta disponibles.
   */
  ngOnInit(): void {
    this.tramite130118Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();

    this.solicitanteQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.solicitante = state as SolicitanteState;
          this.esPersonaMoral = this.solicitante.tipo_persona === 'M';
        })
      )
      .subscribe();

      this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
  }


  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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
   * Obtiene el valor del índice de la acción del botón y controla la navegación del asistente.
   * Valida el formulario del primer paso antes de avanzar.
   * @param e Acción del botón.
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const FORM_VALIDO = this.pasoUnoComponent?.validarFormulario() ?? false;
      this.esValido = FORM_VALIDO;

      if (!this.esValido) {
        this.datosPasos.indice = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      this.enviaSolicitudRequest()
        .pipe(
          takeUntil(this.destroyNotifier$),
          tap((respuesta) => {
            if (!respuesta.exito) {
               this.mostrarMensajeServicio = true;
              const ERRORESEXTRA = (respuesta.erroresModelo || [])
                .map((err) => `${err.campo}: ${err.errores.join(', ')}`)
                .join('<br>');

              const MENSAJEFINAL = `${respuesta.mensaje || 'Error inesperado al enviar la solicitud.'}${ERRORESEXTRA}`;

              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: 'Error',
                mensaje: MENSAJEFINAL || 'Error inesperado al enviar la solicitud.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };

              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
              this.indice = 1;
              this.wizardComponent.indiceActual = 1;
              this.actualizarDatosPasos();
              return;
            }

            if (e.valor > 0 && e.valor < 5) {
              this.alertaNotificacion = {
                tipoNotificacion: 'banner',
                categoria: 'success',
                modo: 'action',
                titulo: '',
                mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
                cerrar: true,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              this.indice = e.valor;
              this.actualizarDatosPasos();
              if (e.accion === 'cont') {
                this.wizardComponent.siguiente();
              } else {
                this.wizardComponent.atras();
              }
            }
          }),
          catchError((err) => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: err?.mensaje || 'Error inesperado al enviar la solicitud.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            return of(false);
          })
        )
        .subscribe();
    } else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        this.actualizarDatosPasos();
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se suscribe a los cambios en el estado de la sección y obtiene la URL actual.
   */
  enviaSolicitudRequest(): Observable<ResultadoSolicitud> {
    const FORM = this.pasoUnoComponent?.solicitudComponent?.form;
    const FORMVALUE = FORM.getRawValue();

    const DATOS_REGIMEN = FORMVALUE.datosRegimen;
    const DATOS_MERCANCIA = FORMVALUE.datosMercancia;
    const DATOS_PRODUCTO = FORMVALUE.datosProducto;
    const REGISTRO_FEDERAL = FORMVALUE.registroFederal;

    // Construye el payload para la solicitud
    const PAYLOAD: GuadarSolicitudRequest = {
      id_solcitud:
        this.solicitudState.idSolicitud === 0
          ? null
          : this.solicitudState.idSolicitud,
      cve_regimen: DATOS_REGIMEN.regimenMercancia,
      cve_clasificacion_regimen: DATOS_REGIMEN.clasifiRegimen,

      mercancia: {
        cve_fraccion_arancelaria: DATOS_MERCANCIA.fraccionArancelaria,
        cve_subdivision: DATOS_MERCANCIA.nico,
        descripcion: DATOS_MERCANCIA.valueTA,
        cve_unidad_medida_tarifaria: DATOS_MERCANCIA.unidadMedidaTarifaria === '-1' ? '1' : DATOS_MERCANCIA.unidadMedidaTarifaria,
        cve_pais_origen: DATOS_MERCANCIA.paisOrigen,
        cve_pais_destino: DATOS_MERCANCIA.paisDestino,
        cantidad_tarifaria: DATOS_MERCANCIA.cantidadTarifaria,
        valor_factura_usd: DATOS_MERCANCIA.valorFacturaUSD.toString(),
        precio_unitario: DATOS_MERCANCIA.precioUnitarioUSD,
        lote: DATOS_MERCANCIA.lote,
        fecha_salida: this.convertirFechaISO(DATOS_MERCANCIA.fechaSalida),
        observaciones: DATOS_MERCANCIA.observaciones
      },

      productor: {
        tipo_persona: DATOS_PRODUCTO.tipoPersona === 'pmoral',
        nombre: DATOS_PRODUCTO.nombre || null,
        apellido_paterno: DATOS_PRODUCTO.apellidoPaterno || null,
        apellido_materno: DATOS_PRODUCTO.apellidoMaterno || null,
        razon_social: DATOS_PRODUCTO.razonSocial ?? '',
        descripcion_ubicacion: DATOS_PRODUCTO.domicilio,
        rfc: 'LEQI8101314S7',
        pais: DATOS_MERCANCIA.paisOrigen
      },

      solicitante: {
        rfc: this.solicitante.rfc_original,
        nombre: this.esPersonaMoral
          ? this.solicitante.razon_social
          : `${this.solicitante.nombre ?? ''} ${this.solicitante.ap_paterno ?? ''} ${this.solicitante.ap_materno ?? ''}`.trim(),
        es_persona_moral: this.esPersonaMoral,
        certificado_serial_number: '3082054030820428a00302010',
        rol_capturista: "PersonaFisica",
     },

      representacion_federal: {
        cve_entidad_federativa: REGISTRO_FEDERAL.estado,
        cve_unidad_administrativa: REGISTRO_FEDERAL.representacionFederal
      }
  };

    return this.guardarService.postSolicitud(PAYLOAD).pipe(
    map((response) => {

      // Si la respuesta es exitosa, actualiza el ID de la solicitud en el store
      if (response?.codigo === '00' && response?.datos?.id_solicitud) {
        this.mostrarMensajeServicio = false;
        this.tramite130118Store.setIdSolicitud(response.datos.id_solicitud);
        this.folioTemporal = response.datos.id_solicitud
        return { exito: true };
      }
      this.mensajeErrores = [response.causa || 'Error desconocido'];

      const MENSAJE =
        response?.error ||
        response?.mensaje ||
        response?.causa ||
        'Ocurrió un error al guardar la solicitud.';

      const ERRORESMODELO = (response?.errores_modelo || []).map((error: any) => {
        return {
          campo: error.campo || 'general',
          errores: Array.isArray(error.errores) ? error.errores : [String(error.errores)],
        };
      });

      return {
        exito: false,
        MENSAJE,
        erroresModelo: ERRORESMODELO,
      } as ResultadoSolicitud;
    }),
    catchError((error) => {
      const MENSAJE =
        error?.error?.error ||
        error?.message ||
        'Error inesperado al guardar la solicitud.';

      return of({
        exito: false,
        MENSAJE,
        erroresModelo: error?.error?.errores_modelo || []
      });
    }),
    takeUntil(this.destroyNotifier$)
  );
  }

// eslint-disable-next-line class-methods-use-this
convertirFechaISO(fecha: string): string {
  const [DIA, MES, ANIO] = fecha.split('/');
  return `${ANIO}-${MES}-${DIA}`;
}

/**
 * Método para manejar el evento de regreso a la sección de carga de documentos.
 * Emite un evento para regresar a la sección de carga de documentos.
 * {void} No retorna ningún valor.
 */
// anteriorSeccionCargarDocumento(): void {
//   this.regresarSeccionCargarDocumentoEvento.emit();
// }

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
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  ngOnDestroy(): void {
    this.tramite130118Store.reset();
  }
}