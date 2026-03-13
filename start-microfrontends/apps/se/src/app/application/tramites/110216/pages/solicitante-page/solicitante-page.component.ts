
import {
  CategoriaMensaje,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  TipoNotificacionEnum,
  WizardComponent,
  WizardService,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import {
  PASOS,
  TEXTOS,
} from '../../constants/inicialmente-certificado-origen.enum';
import {
  Tramite110216State,
  Tramite110216Store,
} from '../../../../estados/tramites/tramite110216.store';
import { AccionBoton } from '../../models/certificado-origen.model';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';

/**
 * Componente para gestionar la página del solicitante.
 *
 * Este componente permite al usuario navegar entre los pasos del wizard y gestionar
 * las acciones relacionadas con el trámite, como avanzar o retroceder entre los pasos.
 */
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos del wizard.
   *
   * Esta propiedad contiene un array de objetos `ListaPasosWizard` que representan
   * los pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso activo en el wizard.
   *
   * Esta propiedad indica el paso actual en el wizard, comenzando desde 1.
   */
  indice: number = 1;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;

  /**
   * Textos utilizados en el componente.
   *
   * Esta propiedad contiene textos como instrucciones o mensajes que se muestran
   * en la interfaz del usuario.
   */
  TEXTOS = TEXTOS;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   *
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   *
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite110216State;

  /**
   * Referencia al componente `WizardComponent`.
   *
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * del wizard dentro de la plantilla.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Configuración de notificación actual para mostrar al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Datos relacionados con los pasos del wizard.
   *
   * Esta propiedad contiene información como el número total de pasos, el índice
   * del paso actual y los textos de los botones "Anterior" y "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Estado actual del trámite 110216.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Tramite110216State}
   * @public
   */
  solicitudState!: Tramite110216State;

  /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;

  /**
   * Texto de peligro para notificaciones.
   */
  public peligroTexto = '';

  /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Indica si se debe mostrar el botón de continuar.
   */
  btnContinuar: boolean = false;

  /**
   * @property wizardService
   * @description
   * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
   * @type {WizardService}
   */
    wizardService = inject(WizardService);

    /**
   * Mensaje de error recibido desde el backend.
   *
   * Esta propiedad almacena el mensaje de error que se muestra al usuario cuando ocurre
   * un fallo en la comunicación o procesamiento con el servidor.
   */
  public backendError!: string;

  /**
   * Indica si se debe mostrar el mensaje de error del backend en la interfaz.
   *
   * Cuando es verdadero, el mensaje de error almacenado en 'backendError' se muestra al usuario.
   */
  public mostrarBackendError: boolean = false;

  /**
   * Constructor del componente.
   *
   * @param {Tramite110216Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite110216Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    public store: Tramite110216Store,
    public tramiteQuery: Tramite110216Query,
    private certificadosOrigenService: CertificadosOrigenService,
    private toastrService: ToastrService,
  ) {
    this.tramiteQuery.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Este método suscribe al estado del trámite y actualiza la propiedad `tramiteState`
   * con los datos obtenidos.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState; 
          this.isContinuarTriggered = this.tramiteState.continuarTriggered ?? false;
        })
      )
      .subscribe();
  }

  /**
   * Valida los formularios del paso actual antes de permitir continuar.
   * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
   */
  validarFormulariosPasoActual(): boolean {
    if (this.indice === 1) {
      return this.pasoUnoComponent?.validarFormularios() ?? true;
    }
    return true;
  }

  /**
   * Muestra una notificación cuando el RFC tiene un formato incorrecto.
   */
  mostrarNotificacionError(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal-md',
      titulo: '',
      mensaje: 'Existen requisitos obligatorios en blanco o con errores.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.btnContinuar = true;
  }

    /**
   * Maneja la confirmación del modal de notificación.
   */
  btnContinuarNotificacion(): void {
    this.btnContinuar = false;
  }

  /**
   * Método para manejar las acciones de los botones del wizard.
   * Este método actualiza el índice del paso activo y avanza o retrocede en el wizard
   * dependiendo de la acción recibida.
   * @param {AccionBoton} e - Objeto que contiene la acción (`cont` o `atras`) y el valor del índice.
   * Método para manejar las acciones de los botones del wizard.
   */
  getValorIndice(e: AccionBoton): void {
    const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
    if (this.indice === 1 && e.accion === 'cont') {
      this.store.setContinuarTriggered(true);
      const ES_VALIDO = this.validarFormulariosPasoActual();
      if (!ES_VALIDO) {
        this.isPeligro = true;
        this.peligroTexto = '<strong>¡Error de registro!</strong> Faltan campos por capturar';
        this.mostrarNotificacionError();
        return;
      }
      this.isPeligro = false;
    }

    if (e.valor > 0 && e.valor <= this.pasos.length) {
      if (e.accion === 'cont') {
        this.shouldNavigate$()
        .subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = NEXT_INDEX;
            this.datosPasos.indice = NEXT_INDEX;
            this.wizardService.cambio_indice(NEXT_INDEX);
            this.wizardComponent.siguiente();
          } else {
            this.indice = e.valor;
            this.datosPasos.indice = e.valor;
          }
        });
      } else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
      this.store.setPasoActivo(this.indice);
    }
  }

    /**
   * Maneja la lógica para actualizar el índice del paso del wizard según el evento del botón de acción proporcionado.
   *
   * Este método obtiene el estado actual desde `nuevoProgramaIndustrialService`, lo guarda,
   * y muestra un mensaje de éxito o error dependiendo del código de respuesta. Si la respuesta es exitosa
   * y el valor del evento está dentro del rango válido (1 a 4), actualiza el índice del wizard y navega
   * hacia adelante o atrás según el tipo de acción.
   *
   * @param e - El evento del botón de acción que contiene el valor y el tipo de acción.
   */
    private shouldNavigate$(): Observable<boolean> {
      return this.certificadosOrigenService.getAllState().pipe(
        take(1),
        switchMap(data => this.guardar(data)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((response: any) => {
          const OK = response.codigo === '00';
          if (OK) {
            this.toastrService.success(response.mensaje);
            this.mostrarBackendError = false;
          } else {
            this.mostrarBackendError = true;
            this.backendError = response.error ?? '';
            this.toastrService.error(response.mensaje);
          }
          return OK;
        })
      );
    }

  /**
     * Obtiene los datos del store y los guarda utilizando el servicio.
     */
    obtenerDatosDelStore(): void {
      this.certificadosOrigenService.getAllState()
        .pipe(take(1))
        .subscribe(data => {
          this.guardar(data);
        });
    }

    /**
     * Guarda los datos proporcionados enviándolos al servidor mediante el servicio `nuevoProgramaIndustrialService`.
     *
     * @param data - Los datos que se desean guardar y enviar al servidor.
     * @returns void
     */
    guardar(data: Tramite110216State): Promise<unknown> {
      const PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS = this.certificadosOrigenService.buildProductoresPorExportador(data.agregarProductoresExportador);
      const PRODUCTORES_POR_EXPORTADOR = this.certificadosOrigenService.buildProductoresPorExportador(data.productoresExportador);
      const MERCANCIAS_PRODUCDOR = this.certificadosOrigenService.buildMercanciasProductor(data.mercanciaProductores);
      const CERTIFICADO = this.certificadosOrigenService.buildCertificado(data);
      const DESTINATARIO = this.certificadosOrigenService.buildDestinatario(data);
      const DATOS_CERTIFICADO = this.certificadosOrigenService.buildDatosCertificado(data);
      const TRANSPORTE_DETALLES = this.certificadosOrigenService.buildDestinatarioTransporteDetalles(data);
      const PAYLOAD = {
        "esDeGuardar": true,
        "tipoDeSolicitud": "guardar",
        "idSolicitud": 202781045,
        "idTipoTramite": 110216,
        "rfc": "AAL0409235E6",
        "cveUnidadAdministrativa": "8101",
        "costoTotal": 10000.5,
        "certificadoSerialNumber": "1234567890ABCDEF",
        // "certificado": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A",
        "numeroFolioTramiteOriginal": "TRM-2023-00001",
        "nombre": "Juan",
        "apPaterno": "Pérez",
        "apMaterno": "López",
        "telefono": "5551234567",
        "discriminator_value": "110216",
        "discriminatorValue": "110216",
        "domicilio": {
        },
        "solicitante": {
          "rfc": "AAL0409235E6",
          "nombre": "ACEROS ALVARADO S.A. DE C.V.",
          "actividad_economica": "Fabricación de productos de hierro y acero",
          "correo_electronico": "contacto@acerosalvarado.com",
          "domicilio": {
            "pais": "México",
            "codigo_postal": "06700",
            "estado": "Ciudad de México",
            "municipio_alcaldia": "Cuauhtémoc",
            "localidad": "Centro",
            "colonia": "Roma Norte",
            "calle": "Av. Insurgentes Sur",
            "numero_exterior": "123",
            "numero_interior": "Piso 5, Oficina A",
            "lada": "",
            "telefono": "123456"
          }
        },
        "historico": {
          "datosConfidencialesProductor": data.formHistorico['datosConfidencialesProductor'],
          "productorMismoExportador": data.formHistorico['productorMismoExportador'],
          "productoresPorExportador": [...PRODUCTORES_POR_EXPORTADOR],
          "mercanciasProductor": [...MERCANCIAS_PRODUCDOR],
          "ProductoresPorExportadorSeleccionados": [...PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS],
        },
        "solicitud": {
          "certificadoOrigen": TRANSPORTE_DETALLES,
        },
        "certificado": CERTIFICADO,
        "destinatario": DESTINATARIO,
        "datos_del_certificado": DATOS_CERTIFICADO,
        
      }
      return new Promise((resolve, reject) => {
        this.certificadosOrigenService.guardarDatosPost(PAYLOAD).subscribe({
          next: (response) => {
            if (esValidObject(response) && esValidObject(response['datos'])) {
              const DATOS = response['datos'] as { id_solicitud?: number };
              if (getValidDatos(DATOS.id_solicitud)) {
                this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              } else {
                this.store.setIdSolicitud(0);
              }
            }
            resolve(response);
          },
          error: (error) => {
            reject(error);
          }
        });
        });
    }

  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
