import {
  CategoriaMensaje,
  ConsultaioQuery,
  ConsultaioState,
  DesplazarseHaciaArribaService,
  FirmaElectronicaComponent,
  Notificacion,
  NotificacionesComponent,
  TituloComponent,
  TramiteFolioStore,
  base64ToHex,
  encodeToISO88591Hex,
  formatFecha,
} from '@ng-mf/data-access-user';
import { CodigoRespuesta, PasoNotificacion } from '../core/enum/agricultura-core-enum';
import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { AcuseReciboComponent } from '../shared/components/acuse-recibo/acuse-recibo.component';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { CadenaOriginalRequest } from '../core/models/confirmar-notificacion/request/generar-cadena-original-request.model';
import { CadenaOriginalService } from '../core/services/confirmar-notificacion/CadenaOriginal.service';
import {
  ConfirmarNotificacionIniciarResponse
} from '../core/models/confirmar-notificacion/response/confirmar-notificacion-iniciar-response.model';
import { ConfirmarNotificacionService } from '../core/services/confirmar-notificacion/confirmar-notificacion.service';
import { DetallesFolioComponent } from '../shared/components/detalles-folio/detalles-folio.component';
import {
  FirmaConfirmarResponse
} from '../core/models/confirmar-notificacion/response/confirmar-notificacion-response.model';
import { FirmaRequest } from '../core/models/confirmar-notificacion/request/firma-request.model';
import { FirmaService } from '../core/services/confirmar-notificacion/firma.service';
import { ModeloConfig } from '../shared/models/service-config.model';
import { NotificacionActoAdministrativoComponent } from '../shared/components/notificacion-acto-administrativo/notificacion-acto-administrativo.component';
import { Router } from '@angular/router';
import { TramiteConfigService } from '../shared/services/tramiteConfig.service';

@Component({
  selector: 'app-confirmar-notificacion',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    DetallesFolioComponent,
    NotificacionActoAdministrativoComponent,
    FirmaElectronicaComponent,
    NotificacionesComponent,
    AcuseReciboComponent
  ],
  templateUrl: './confirmar-notificacion.component.html',
  styleUrl: './confirmar-notificacion.component.scss',
})
export class ConfirmarNotificacionComponent implements OnInit, OnDestroy {
  /**
   * @property indiceDePaso
   * @description
   * Controla el índice del paso actual en el flujo.
   * - 1: Inicio
   * - 2: Acto Administrativo
   * - 3: Acuse de Recibo / Firma Electrónica
   *
   * El valor inicial es 1. Si la navegación actual incluye el estado `isAcuseRecibo`, se establece en 3.
   *
   * @type {number}
   */
  public indiceDePaso = PasoNotificacion.CONFIRMAR_NOTIFICACION;

  /**
   * Enum para pasos de la notificación
   */
  PasoNotificacion = PasoNotificacion;

  /**
   * Folio del trámite que se está procesando.
   * Este folio es único para cada trámite y se utiliza para identificarlo en el sistema.
   */
  folio: string = '';

  /**
   * Datos de la resolución que se mostrarán en la tabla.
   * @type {BodyTablaResolucion[]}
   * Solo se utiliza si hay resoluciones que mostrar y si el trámite lo requiere.
   */
  datosTablaResolucion?: BodyTablaResolucion[] = [];

  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   * Se utiliza para completar el observable cuando el componente se destruye.
   */
  private destroy$ = new Subject<void>();

  /**
   * Datos de la notificación, que se pasan al componente NotificacionActoAdministrativo.
   *
   * @type {ConfirmarNotificacionIniciarResponse | null}
   */
  notificacionData!: ConfirmarNotificacionIniciarResponse;

  /**
   * Datos de la notificacion, que se pasan al componente AcusesRecibidosNotificacion.
   * @type {BodyTablaResolucion[]}
   */
  notificacionAcusesData: BodyTablaResolucion[] = [];

  /**
   * Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * Cadena original generada a partir de los datos del trámite.
   * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
   */
  cadenaOriginal?: string;

  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
   */
  guardarDatos!: ConsultaioState;

  /**
   * @property {string} banderaVistaAcuse
   * @description Estado para saber estado de la vista.
   */
  banderaVistaAcuse!: string;

  /**
   * @property {ModeloConfig} serviceConfigModelo
   * @description Configuración de modelo específicos del trámite, obtenida del servicio TramiteConfigService.
   */
  serviceConfigModelo!: ModeloConfig;

  /**
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  tramite: number = 0;

  /**
   * Datos de la tabla.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaResolucion[]}
   */
  datosTabla: BodyTablaResolucion[] = [];

  /**
   * Arreglo que contiene los números de trámite que requieren documentos de resolución.
   * Se deberá añadir un número de trámite a este arreglo si es necesario mostrar documentos de resolución para ese trámite.
   */
  tramitesDocumentosResolucion = ['220202', '220203'];


  /**
   * Objeto que contiene los datos reales de la firma electrónica generada después del proceso de firma.
   * Incluye:
   * - firma: Cadena de la firma generada (en base64).
   * - certSerialNumber: Número de serie del certificado digital.
   * - rfc: RFC extraído del certificado.
   * - fechaFin: Fecha de vencimiento del certificado.
   */
  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };


  /**
   * @constructor
   * @param {Router} router - Servicio de Angular Router para la navegación entre rutas.
   */
  constructor(
    private router: Router,
    private confirmarNotificacionService: ConfirmarNotificacionService,
    private location: Location,
    private consultaioQuery: ConsultaioQuery,
    private firmaService: FirmaService,
    private tramiteStore: TramiteFolioStore,
    private cadenaOriginalService: CadenaOriginalService,
    private desplazarseHaciaArribaService: DesplazarseHaciaArribaService,
    private tramiteConfigService: TramiteConfigService) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
        })
      )
      .subscribe()
    const CURRENT_NAVIGATION = this.router.getCurrentNavigation();
    if (CURRENT_NAVIGATION?.extras.state?.['isAcuseRecibo']) {
      this.indiceDePaso = 3;
    }
    this.tramite = Number(this.guardarDatos?.procedureId);
    this.serviceConfigModelo = this.tramiteConfigService.getModeloConfig(this.tramite);
  }

  ngOnInit(): void {
    this.getConfirmarNotificacion();
    this.obtenerAcusesRecibos();
    this.desplazarseHaciaArribaService.desplazarArriba();
  }

  /**
   * @method alContinuar
   * @description
   * Incrementa el `indiceDePaso` para avanzar al siguiente paso en el flujo.
   *
   * @returns {void}
   */
  alContinuar(): void {
    this.indiceDePaso = this.indiceDePaso + 1;
    if (this.indiceDePaso === this.PasoNotificacion.FIRMAR) {
      this.obtenerCadenaOriginal();
    }
  }

  /**
   * @method obtieneFirma
   * @description
   * Método invocado cuando se obtiene la firma electrónica.
   * Ajusta el `indiceDePaso` directamente al paso 3.
   *
   * @param {string} ev - Evento recibido (firmado).
   * @returns {void}
   */
  obtieneFirma(firma: string): void {
    if (!this.cadenaOriginal || !this.datosFirmaReales) {
      console.error('Faltan datos para completar la firma');
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: 'Error',
        mensaje: 'Faltan datos para completar la firma.',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
      return;
    }

    const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginal);
    const FIRMAHEX = base64ToHex(firma);
    const NUMFOLIO = this.guardarDatos.folioTramite;

    const PAYLOAD: FirmaRequest = {
      id_accion: this.guardarDatos.action_id, // o el ID que corresponda
      firma: {
        cadena_original: CADENAHEX,
        cert_serial_number: this.datosFirmaReales.certSerialNumber,
        clave_usuario: this.datosFirmaReales.rfc,
        fecha_firma: formatFecha(new Date()), // fecha actual formateada
        clave_rol: 'Solicitante',
        sello: FIRMAHEX,
      }
    };

    this.firmaService.postFirma(this.guardarDatos.procedureId,NUMFOLIO, PAYLOAD)
      .pipe(
        takeUntil(this.destroy$),
        tap((firmaResponse: BaseResponse<FirmaConfirmarResponse>) => {
          if (firmaResponse.codigo !== CodigoRespuesta.EXITO || !firmaResponse.datos) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al firmar la solicitud',
              mensaje: firmaResponse.mensaje || firmaResponse.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            throw new Error('Firma no exitosa');
          }else if (firmaResponse.codigo === CodigoRespuesta.EXITO){
            this.getAcusesRecibidosNotificacion();
            if(firmaResponse.datos.tipo_acuse === "Resolucion"){
              this.banderaVistaAcuse = firmaResponse.datos.tipo_acuse;
              this.postResolucion(firmaResponse.datos.id_acuse);
            }else{
              this.postRequerimiento(firmaResponse.datos.id_acuse);
            }
          }

        }),
        tap(() => {
          this.tramiteStore.establecerTramite(
            this.folio,
            firma
          );
          this.indiceDePaso = this.PasoNotificacion.ACUSES;
        }),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje: error?.error.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * @method getAcusesRecibidosNotificacion
   * @description
   * Obtiene los documentos recibidos de notificación utilizando el servicio ConfirmarNotificacionService.
   */
  getAcusesRecibidosNotificacion(): void {
    this.confirmarNotificacionService.getAcusesRecibidosNotificación(Number(this.guardarDatos.procedureId), this.guardarDatos.folioTramite).subscribe({
      next: (response) => {
        if (response.codigo === CodigoRespuesta.EXITO && response.datos) {
          const DOCS = response.datos.documentos_oficiales ?? [];
          if(DOCS.length > 0 ){
            this.notificacionAcusesData = DOCS.map((doc, index) => ({
              id: index + 1,
              idDocumento: doc.id_documento_oficial,
              documento: doc.desc_documento,
              urlPdf: doc.documento_minio
            }));
          }
        } else {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response.error || 'Error al obtener los documentos',
            mensaje:
              response.causa ||
              response.mensaje ||
              response.error || 'Ocurrió un error al obtener los documentos.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (error) => {
        if (!this.nuevaNotificacion) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error inesperado',
            mensaje: error?.error.error || 'Ocurrió un error al obtener los documentos.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      }
    });
  }
  /**
   * @method postResolucion
   * @description Guarda la resolución del proceso actual
   *
   * Realiza una petición al servicio para guardar la resolución
   * del trámite. Si la respuesta es exitosa (código '00'), prepara
   * los datos para el envío del acuse correspondiente.
   *
   * @returns {void}
   */
  postResolucion(id_acuse: number): void {
    this.confirmarNotificacionService.postResolucionGuardar(Number(this.guardarDatos.procedureId), id_acuse).subscribe({
      next: (response) => {
        if (response.codigo === CodigoRespuesta.EXITO && response.datos) {
          this.datosTabla = [{
            id: 1,
            idDocumento: '1',
            documento: response.datos.nombre_archivo ?? '',
            urlPdf: response.datos.llave_archivo ?? '',
            fullBase64: response.datos?.contenido ?? '',
          }];
        } else {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response.error || 'Error al obtener resolución',
            mensaje:
              response.causa ||
              response.mensaje ||
              response.error || 'Ocurrió un error al obtener resolución.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          this.indiceDePaso = this.PasoNotificacion.FIRMAR;
        }
      },
      error: (error) => {
        if (!this.nuevaNotificacion) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error inesperado',
            mensaje: error?.error.error || 'Ocurrió un error al obtener resolución.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
        this.indiceDePaso = this.PasoNotificacion.FIRMAR;
      }
    });
  }

  /**
   * @method postRequerimiento
   * @description Guarda el requerimiento del proceso actual
   *
   * Realiza una petición al servicio para guardar el requerimiento
   * del trámite. Si la respuesta es exitosa (código '00'), prepara
   * los datos para el envío del acuse correspondiente.
   *
   * @returns {void}
   */
  postRequerimiento(id_acuse: number): void {
    this.confirmarNotificacionService.postRequerimientoGuardar(Number(this.guardarDatos.procedureId), id_acuse).subscribe({
      next: (response) => {
        console.log("que traemos al guardar", response);
        if (response.codigo === CodigoRespuesta.EXITO && response.datos) {
          this.datosTabla = [{
            id: 1,
            idDocumento: '1',
            documento: response.datos.nombre_archivo ?? '',
            urlPdf: response.datos.llave_archivo ?? '',
            fullBase64: response.datos?.contenido ?? '',

          }];
        } else {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response.error || 'Error al obtener requerimiento',
            mensaje:
              response.causa ||
              response.mensaje ||
              response.error || 'Ocurrió un error al obtener requerimiento.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          this.indiceDePaso = this.PasoNotificacion.FIRMAR;
        }
      },
      error: (error) => {
        if (!this.nuevaNotificacion) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error inesperado',
            mensaje: error?.error.error || 'Ocurrió un error al obtener requerimiento.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
        this.indiceDePaso = this.PasoNotificacion.FIRMAR;
      }
    });
  }


  /**
   * Obtiene los acuses y recibos relacionados con la resolución.
   */
  obtenerAcusesRecibos(): void {
    if (this.tramitesDocumentosResolucion.includes(this.guardarDatos.procedureId)){
      this.confirmarNotificacionService.getAcusesRecibos(this.guardarDatos.procedureId, this.guardarDatos.folioTramite).subscribe({
        next: (data) => {
          if (data?.codigo === "00" && data?.datos) {
            this.datosTablaResolucion = [{
              id: 1,
              idDocumento: data.datos[0].id_documento_oficial + "",
              documento: data.datos[0].desc_documento,
              urlPdf: data.datos[0].documento_minio
            }]
          }
        },
      });
    }

  }



  /**
   * @method cerrar
   * @description
   * Finaliza el flujo y redirige al usuario a la bandeja de tareas pendientes.
   *
   * @returns {void}
   */
  cerrar(): void {
    this.router.navigate(['/bandeja-de-tareas-pendientes']);
  }

  /**
   * @method getConfirmarNotificacion
   * @description
   * Obtiene los datos de la notificación utilizando el servicio ConfirmarNotificacionService.
   * Actualiza la propiedad `notificacionData` con la respuesta recibida.
   *
   * @returns {void}
   */
  getConfirmarNotificacion(): void {
    const NUMFOLIO = this.guardarDatos.folioTramite;
    this.confirmarNotificacionService.getIniciarNotificacion(this.guardarDatos.procedureId, NUMFOLIO).subscribe({
      next: (response) => {
        if (response.codigo === '00') {
          this.notificacionData = response.datos ?? {} as ConfirmarNotificacionIniciarResponse;
        } else {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: response.error || 'Error al consultar la notificacion',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          this.location.back();
        }
      },
      error: (error) => {
        const MENSAJE = error?.error?.error || 'Error inesperado al consultar notificacion.';
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

  /**
   * Método para obtener la cadena original del trámite.
   * Este método se encarga de llamar al servicio correspondiente para generar la cadena original.
   */
  obtenerCadenaOriginal(): void {
    const NUMFOLIO = this.guardarDatos.folioTramite;
    const PAYLOAD: CadenaOriginalRequest = {
      fecha_firma: formatFecha(new Date()),
      ...(this.tramiteConfigService.getModeloConfig(this.tramite)?.actualizarModelo && {
        id_notificacion: this.notificacionData.id_notificacion,
        fecha_envio_notificacion: this.notificacionData.fecha_envio_notificacion,
        tipo_notificacion:this.notificacionData.tipo_notificacion,
      }),
      usuario: {
        apellido_materno: 'Pérez',
        rfc: 'MAVL621207C95',
        nombre: 'José',
        apellido_paterno: 'Hernández'
      }
    };
    this.cadenaOriginalService.postCadenaOriginal(this.guardarDatos.procedureId, NUMFOLIO, PAYLOAD).subscribe({
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

  /**
   * Maneja el evento de firma y obtiene los datos de la firma.
   * @param datos - Objeto que contiene la firma, número de serie del certificado y RFC.
   */
  datosFirma(datos: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  }): void {
    this.datosFirmaReales = datos;
    this.obtieneFirma(datos.firma);
  }

  /**
   * Método para obtener la cadena original del trámite.
   * Este método se encarga de llamar al servicio correspondiente para obtener la cadena original.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
