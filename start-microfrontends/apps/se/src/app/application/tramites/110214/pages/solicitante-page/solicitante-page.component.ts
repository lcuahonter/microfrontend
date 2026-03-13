import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {
  PASOS,
  TEXTO_DE_ALERTA,
  TEXTO_DE_PELIGRO,
} from '../../constants/validar-inicialmente-certificado.enum';
import {
  Tramite110214State,
  Tramite110214Store,
} from '../../../../estados/tramites/tramite110214.store';

import {
  CategoriaMensaje,
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  Notificacion,
  TipoNotificacionEnum,
  WizardService,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { AccionBoton } from '../../models/validar-inicialmente-certificado.model';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { WizardComponent } from '@libs/shared/data-access-user/src';

import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';

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
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso activo en el wizard.
   */
  indice: number = 1;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   */
  public tramiteState!: Tramite110214State;

  /**
   * Referencia al componente `WizardComponent`.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Datos relacionados con los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
   * Configuración de notificación actual para mostrar al usuario.
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Texto de alerta para notificaciones.
   */
  TEXTO_DE_ALERTA = TEXTO_DE_ALERTA;

  /**
   * Texto de peligro para notificaciones.
   */
  TEXTO_DE_PELIGRO = TEXTO_DE_PELIGRO;

  /**
   * Indica si se debe mostrar una alerta.
   */
  isAlerta: boolean = false;

  /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  isPeligro: boolean = false;

  /**
   * Indica si se debe mostrar el botón de continuar.
   */
  btnContinuar: boolean = false;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

  /**
   * Estado actual del trámite 110214.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   */
  public solicitudState!: Tramite110214State;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  public isContinuarTriggered: boolean = false;

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
   */
  constructor(
    public store: Tramite110214Store,
    public tramiteQuery: Tramite110214Query,
    private validarInicialmenteCertificadoService: ValidarInicialmenteCertificadoService,
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
   * Método para manejar las acciones de los botones del wizard.
   */
  getValorIndice(e: AccionBoton): void {
    // Validar formularios antes de continuar desde el paso uno
    const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
    if (this.indice === 1 && e.accion === 'cont') {
      this.store.setContinuarTriggered(true);
      const ES_VALIDO = this.validarFormulariosPasoActual();
      if (!ES_VALIDO) {
        this.isPeligro = true;
        this.TEXTO_DE_PELIGRO = '<strong>¡Error de registro!</strong> Faltan campos por capturar';
        this.mostrarNotificacionError();
        return;
      }
      this.isPeligro = false;
    }

    // Verifica si el valor de la acción está en el rango adecuado
    if (e.valor > 0 && e.valor <= this.pasos.length) {
      // Actualiza el índice del paso basado en el valor de la acción

      // Dependiendo de la acción, avanza o retrocede en el wizard
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

      // Actualiza el paso activo en el store
      this.store.setPasoActivo(this.indice);
    }
  }

  /**
   * Valida los formularios del paso actual antes de permitir continuar.
   *
   * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
   */
  validarFormulariosPasoActual(): boolean {
    if (this.indice === 1) {
      // Validar formularios del paso uno
      return this.pasoUnoComponent?.validarFormularios() ?? true;
    }
    // Agregar validaciones para otros pasos si es necesario
    return true;
  }

  /**
   * Muestra un mensaje de advertencia si la validación falla.
   */
  mostrarMensajePeligro(): void {
    if (this.isPeligro) {
      this.isPeligro = false;
    }
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
     * Guarda los datos proporcionados enviándolos al servidor mediante el servicio `nuevoProgramaIndustrialService`.
     *
     * @param data - Los datos que se desean guardar y enviar al servidor.
     * @returns void
     */
    guardar(data: Tramite110214State): Promise<JSONResponse> {
      const PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS = this.validarInicialmenteCertificadoService.buildProductoresPorExportador(data.agregarProductoresExportador);
      const PRODUCTORES_POR_EXPORTADOR = this.validarInicialmenteCertificadoService.buildProductoresPorExportador(data.productoresExportador);
      const MERCANCIAS_PRODUCDOR = this.validarInicialmenteCertificadoService.buildMercanciasProductor(data.mercanciaProductores ? data.mercanciaProductores : data.mercanciaTabla);
      const CERTIFICADO = this.validarInicialmenteCertificadoService.buildCertificado(data);
      const DESTINATARIO = this.validarInicialmenteCertificadoService.buildDestinatario(data);
      const DATOS_CERTIFICADO = this.validarInicialmenteCertificadoService.buildDatosCertificado(data);
      const PAYLOAD = {
        "esDeGuardar": true,
        "tipoDeSolicitud": "guardar",
        "idSolicitud": 202781045,
        "idTipoTramite": 110214,
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
        "discriminator_value": "110214",
        "discriminatorValue": "110214",
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
        "solicitud": {
          "datosConfidencialesProductor": data.formHistorico['datosConfidencialesProductor'],
          "productorMismoExportador": data.formHistorico['productorMismoExportador'],
          "productoresPorExportador": [...PRODUCTORES_POR_EXPORTADOR],
          "mercanciasProductor": [...MERCANCIAS_PRODUCDOR],
          "ProductoresPorExportadorSeleccionados": [...PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS]
        },
        "certificado": CERTIFICADO,
        "destinatario": DESTINATARIO,
        "datos_del_certificado": DATOS_CERTIFICADO,
      }
      return new Promise((resolve, reject) => {
        this.validarInicialmenteCertificadoService.guardarDatosPost(PAYLOAD).subscribe({
          next: (response) => {
            if (esValidObject(response) && esValidObject(response['datos'])) {
              const DATOS = response['datos'] as { idSolicitud?: number };
              if (getValidDatos(DATOS.idSolicitud)) {
                this.store.setIdSolicitud(DATOS.idSolicitud ?? 0);
              } else {
                this.store.setIdSolicitud(0);
              }
            }
            resolve({
              id: response['id'] ?? 0,
              descripcion: response['descripcion'] ?? '',
              codigo: response['codigo'] ?? '',
              data: response['data'] ?? response['datos'] ?? null,
              ...response
            } as JSONResponse);
          },
          error: (error) => {
            reject(error);
          }
        });
        });
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
      return this.validarInicialmenteCertificadoService.getAllState().pipe(
        take(1),
        switchMap(data => this.guardar(data)),
        map((response) => {
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
    this.validarInicialmenteCertificadoService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}