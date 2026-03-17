import {
  AlertComponent,
  BtnContinuarComponent,
  DatosPasos,
  ERROR_FORMA_ALERT,
  JSONResponse,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PASOS2,
  PasoFirmaComponent,
  WizardComponent,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MSG_REGISTRO_EXITOSO, TEXTOS } from '../../constantes/constantes';
import {
  Solicitud110207State,
  Tramite110207Store,
} from '../../state/Tramite110207.store';
import { Subject, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import { Tramite110207Query } from '../../state/Tramite110207.query';

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
  imports: [
    ReactiveFormsModule,
    CommonModule,
    WizardComponent,
    SolicitudPageComponent,
    PasoFirmaComponent,
    BtnContinuarComponent,
    AlertComponent,
    PasoUnoComponent,
    NotificacionesComponent
  ],
  standalone: true,
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnDestroy {
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;
  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS2;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /** Identificador numérico de la solicitud actual. */
  idSolicitud: number = 0;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  solicitudState!: Solicitud110207State;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

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
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del primer paso del asistente desde el componente padre.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * @property {string} formErrorAlert
   * @description
   * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

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
     * Textos utilizados en el componente.
     *
     * Esta propiedad contiene textos como instrucciones o mensajes que se muestran
     * en la interfaz del usuario.
     */
  TEXTOS = TEXTOS;

  /**
   * Constructor del componente.
   *
   * Inyecta los servicios necesarios para consultar y gestionar el estado
   * del trámite **110207**.
   * Al inicializarse, establece una suscripción al observable `selectSolicitud$`
   * expuesto por el `Tramite110207Query`, con el fin de mantener sincronizada
   * la propiedad local `solicitudState` en función de los cambios en el store.
   *
   * @param {Tramite110207Store} solicitudStore - Servicio `Store` que administra el estado global
   *                                              del trámite 110207, permitiendo crear, actualizar
   *                                              o resetear los valores del estado.
   * @param {Tramite110207Query} tramiteQuery - Servicio `Query` que expone observables y selectores
   */
  constructor(
    public solicitudStore: Tramite110207Store,
    public tramiteQuery: Tramite110207Query,
    public registroService: RegistroService
  ) {
    this.tramiteQuery.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * Este método controla el cambio de paso en el wizard dependiendo de la acción del botón presionado.
   *
   * Si la acción es 'cont', pasa al siguiente paso. Si la acción es 'atras', regresa al paso anterior.
   *
   * @param e Acción del botón (cont o atras) y el valor asociado a la acción.
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore();
    } else if (e.valor > 0 && e.valor <= this.pasos.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.registroService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }

  /**
   * Guarda los datos proporcionados en el parámetro `item` construyendo un objeto payload y enviándolo al servicio backend.
   * El payload incluye información del solicitante, certificado, destinatario y detalles del certificado.
   *
   * @param item - Objeto que contiene todos los datos necesarios para el payload, incluyendo información del certificado, destinatario y detalles adicionales.
   *
   * @remarks
   * Este método muestra el payload construido en la consola y está diseñado para enviarlo al backend mediante `certificadoService.guardarDatosPost`.
   * La llamada al servicio actualmente está comentada.
   */
  guardar(item: Solicitud110207State): Promise<JSONResponse> {
    const MERCANCIA_SELECCIONADAS =
      this.registroService.buildMercanciaSeleccionadas(item.mercanciaTabla);
    const PAYLOAD = {
      rfc_solicitante: 'AAL0409235E6',
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'ACEROS ALVARADO S.A. DE C.V.',
        actividad_economica: 'Fabricación de productos de hierro y acero',
        correo_electronico: 'contacto@acerosalvarado.com',
        domicilio: {
          pais: item.formCertificado['pais'],
          codigo_postal: '06700',
          estado: 'Ciudad de México',
          municipio_alcaldia: 'Cuauhtémoc',
          localidad: 'Centro',
          colonia: 'Roma Norte',
          calle: 'Av. Insurgentes Sur',
          numero_exterior: '123',
          numero_interior: 'Piso 5, Oficina A',
          lada: '',
          telefono: '123456',
        },
      },
      certificado: {
        tratado_acuerdo: item.formCertificado['entidadFederativa'],
        pais_bloque: item.formCertificado['bloque'],
        fraccion_arancelaria: item.formCertificado['fraccionArancelariaForm'],
        nombre_comercial: item.formCertificado['nombreComercialForm'],
        fecha_inicio: item.formCertificado['fechaInicioInput'],
        fecha_fin: item.formCertificado['fechaFinalInput'],
        mercancias_seleccionadas: MERCANCIA_SELECCIONADAS,
      },
      destinatario: {
        nombre: item.formDatosDelDestinatario['nombres'],
        primer_apellido: item.formDatosDelDestinatario['primerApellido'],
        segundo_apellido: item.formDatosDelDestinatario['segundoApellido'],
        numero_registro_fiscal:
          item.formDatosDelDestinatario['numeroDeRegistroFiscal'],
        razon_social: item.formDatosDelDestinatario['razonSocial'],
        domicilio: {
          ciudad_poblacion_estado_provincia: item.formDestinatario['ciudad'],
          calle: item.formDestinatario['calle'],
          numero_letra: item.formDestinatario['numeroLetra'],
          lada: item.formDestinatario['lada'],
          telefono: item.formDestinatario['telefono'],
          fax: item.formDestinatario['fax'],
          correo_electronico: item.formDestinatario['correoElectronico'],
          pais_destino: item.formDestinatario['paisDestin'],
        },
        medio_transporte: item.medioDeTransporteSeleccion['clave'],
      },
      datos_del_certificado: {
        observaciones: item.formDatosCertificado['observacionesDates'],
        precisa: 'test',
        presenta: item.formDatosCertificado['precisaDates'],
        idioma: item.formDatosCertificado['idiomaDates'],
        representacion_federal: {
          entidad_federativa:
            item.formDatosCertificado['EntidadFederativaDates'],
          representacion_federal:
            item.formDatosCertificado['representacionFederalDates'],
        },
        desea_obtener_certificado: true,
        justificacion: 'qwertyui',
      },
    };

    return new Promise((resolve, reject) => {
      this.registroService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          const API_RESPONSE = doDeepCopy(response);
          if (
            esValidObject(API_RESPONSE) &&
            esValidObject(API_RESPONSE.datos)
          ) {
            if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
              this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
              this.solicitudStore.setIdSolicitud(
                API_RESPONSE.datos.id_solicitud
              );
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.solicitudStore.setIdSolicitud(0);
            }
          }
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
   */
  pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
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

        }
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * @method validarTodosFormulariosPasoUno
   * @description
   * Valida todos los formularios del componente `PasoUnoComponent`.
   * Si la referencia al componente no existe, retorna `true` (no hay formularios que validar).
   * Llama al método `validarFormularios()` del componente hijo y retorna `false` si algún formulario es inválido.
   * Retorna `true` si todos los formularios son válidos.
   *
   * @returns {boolean} Indica si todos los formularios del paso uno son válidos.
   */
  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validateAll();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }

  /**
   * Hook de ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * Su objetivo es limpiar los recursos utilizados durante la vida del componente,
   * principalmente las suscripciones a observables.
   * Para lograrlo, emite un valor (`next()`) y completa (`complete()`)
   * el `Subject` `destroyNotifier$`, el cual se usa junto con `takeUntil`
   * en las suscripciones RxJS.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
