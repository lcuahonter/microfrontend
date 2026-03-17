import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, FirmaElectronicaComponent, Notificacion, NotificacionesComponent, TramiteFolioStore, base64ToHex, encodeToISO88591Hex, } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CadenaOriginalRequest } from '../core/models/confirmar-notificacion/request/generar-cadena-original-request.model';
import { CadenaOriginalService } from '../core/services/confirmar-notificacion/CadenaOriginal.service';
import { CommonModule } from '@angular/common';
import { ConfirmarNotificacionIniciarResponse } from '../core/models/confirmar-notificacion/response/confirmar-notificacion-iniciar-response.model';
import { ConfirmarNotificacionService } from '../core/services/confirmar-notificacion/confirmar-notificacion.service';
import { DetallesFolioComponent } from '../shared/components/detalles-folio/detalles-folio.component';
import { FirmaService } from '../core/services/confirmar-notificacion/firma.service';
import { Location } from '@angular/common';
import { NotificacionActoAdministrativoComponent } from '../shared/components/notificacion-acto-administrativo/notificacion-acto-administrativo.component';
import { Router } from '@angular/router';
import { TituloComponent } from '@ng-mf/data-access-user';

import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { FirmaRequest } from '../core/models/confirmar-notificacion/request/firma-request.model';

import { CodigoRespuesta, PasoNotificacion } from '../core/enum/cofepris-core-enum';
import { AcuseReciboComponent } from '../shared/components/acuse-recibo/acuse-recibo.component';
import { FirmaConfirmarResponse } from '../core/models/confirmar-notificacion/response/confirmar-notificacion-response.model';

import { AcusesRecibidosNotificacion } from '../core/models/autorizar-requerimiento/response/notificacion-acuses-recibidos-response.model';

/**
 * @component ConfirmarNotificacionComponent
 * @description
 * Componente encargado de gestionar el flujo de confirmación de una notificación.
 * Maneja el cambio de pasos entre los componentes internos como Acuse de Recibo, Firma Electrónica, y detalles del acto administrativo.
 *
 * @example
 * <ng-mf-confirmar-notificacion></ng-mf-confirmar-notificacion>
 */
/**
 * @component ConfirmarNotificacionComponent
 * @description
 * Componente encargado de gestionar el flujo de confirmación de una notificación en COFEPRIS.
 * Permite la navegación entre pasos, la firma electrónica, la visualización de acuses y la interacción con servicios relacionados a la notificación.
 * Integra componentes de firma, notificaciones, detalles de folio y acuse de recibo.
 *
 * @example
 * <ng-mf-confirmar-notificacion></ng-mf-confirmar-notificacion>
 *
 * @selector ng-mf-confirmar-notificacion
 * @standalone true
 * @imports
 *  - CommonModule
 *  - TituloComponent
 *  - DetallesFolioComponent
 *  - NotificacionActoAdministrativoComponent
 *  - FirmaElectronicaComponent
 *  - NotificacionesComponent
 *  - AcuseReciboComponent
 * @templateUrl ./confirmar-notificacion.component.html
 * @styleUrl ./confirmar-notificacion.component.scss
 */
@Component({
  selector: 'ng-mf-confirmar-notificacion',
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
  /**
   * @property {number} indiceDePaso
   * @description
   * Controla el índice del paso actual en el flujo de confirmación de notificación.
   * - 1: Inicio
   * - 2: Acto Administrativo
   * - 3: Acuse de Recibo / Firma Electrónica
   * El valor inicial es 1 o 3 según el estado de navegación.
   */
  public indiceDePaso = PasoNotificacion.CONFIRMAR_NOTIFICACION;

  /**
   * Enum para pasos de la notificación
   */
  /**
   * @property {typeof PasoNotificacion} PasoNotificacion
   * @description Enum de pasos del flujo de notificación.
   */
  PasoNotificacion = PasoNotificacion;

  /**
  * Folio del trámite que se está procesando.
  * Este folio es único para cada trámite y se utiliza para identificarlo en el sistema.
  */
  /**
   * @property {string} folio
   * @description Folio del trámite que se está procesando.
   */
  folio: string = '';

  /**
   * Datos de la resolución que se mostrarán en la tabla.
   * @type {BodyTablaResolucion[]}
   * Solo se utiliza si hay resoluciones que mostrar y si el trámite lo requiere.
   */
  /**
   * @property {BodyTablaResolucion[]} datosTablaResolucion
   * @description Datos de la resolución que se mostrarán en la tabla.
   */
  datosTablaResolucion?: BodyTablaResolucion[] = [];

  /**
  * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
  * Se utiliza para completar el observable cuando el componente se destruye.
  */
  /**
   * @property {Subject<void>} destroy$
   * @description Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
   * Datos de la notificación, que se pasan al componente NotificacionActoAdministrativo.
   *
   * @type {ConfirmarNotificacionIniciarResponse | null}
   */
  /**
   * @property {ConfirmarNotificacionIniciarResponse} notificacionData
   * @description Datos de la notificación, que se pasan al componente NotificacionActoAdministrativo.
   */
  notificacionData!: ConfirmarNotificacionIniciarResponse;

  /**
   * Datos de la notificacion, que se pasan al componente AcusesRecibidosNotificacion.
   * @type {BodyTablaResolucion[]}
   */
  /**
   * @property {BodyTablaResolucion[]} notificacionAcusesData
   * @description Datos de la notificación para el componente AcusesRecibidosNotificacion.
   */
  notificacionAcusesData: BodyTablaResolucion[] = [];

  /**
   * Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  /**
   * @property {Notificacion | null} nuevaNotificacion
   * @description Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
  * Cadena original generada a partir de los datos del trámite.
  * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
  */
  /**
   * @property {string | undefined} cadenaOriginal
   * @description Cadena original generada a partir de los datos del trámite para firmar digitalmente.
   */
  cadenaOriginal?: string;

  /**
     * @property {ConsultaioState} guardarDatos
     * @description Estado actual del trámite consultado.
     */
  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
   */
  guardarDatos!: ConsultaioState;

  /**
   * @property {string} banderaVistaAcuse
   * @description Estado para saber estado de la vista.
  */
  /**
   * @property {string} banderaVistaAcuse
   * @description Estado para saber el estado de la vista de acuse.
   */
  banderaVistaAcuse!: string;

  /**
   * Datos de la tabla.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaResolucion[]}
  */
  /**
   * @property {BodyTablaResolucion[]} datosTabla
   * @description Datos de la tabla de documentos generados (resolución o requerimiento).
   */
  datosTabla: BodyTablaResolucion[] = [];

  /**
   * Arreglo que contiene los números de trámite que requieren documentos de resolución.
   * Se deberá añadir un número de trámite a este arreglo si es necesario mostrar documentos de resolución para ese trámite.
   */
  /**
   * @property {string[]} tramitesDocumentosResolucion
   * @description Arreglo que contiene los números de trámite que requieren documentos de resolución.
   */
  tramitesDocumentosResolucion = ['130102'];


  /**
* Objeto que contiene los datos reales de la firma electrónica generada después del proceso de firma.
* Incluye:
* - firma: Cadena de la firma generada (en base64).
* - certSerialNumber: Número de serie del certificado digital.
* - rfc: RFC extraído del certificado.
* - fechaFin: Fecha de vencimiento del certificado.
*/
  /**
   * @property {{firma: string; certSerialNumber: string; rfc: string; fechaFin: string}} datosFirmaReales
   * @description Objeto que contiene los datos reales de la firma electrónica generada después del proceso de firma.
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
    private cadenaOriginalService: CadenaOriginalService) {
    const CURRENT_NAVIGATION = this.router.getCurrentNavigation();
    if (CURRENT_NAVIGATION?.extras.state?.['isAcuseRecibo']) {
      this.indiceDePaso = 3;
    }
  }

  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
        })
      )
      .subscribe()

    this.getConfirmarNotificacion();
    this.obtenerAcusesRecibos();
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
        fecha_firma: ConfirmarNotificacionComponent.formatFecha(new Date()), // fecha actual formateada
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
            this.banderaVistaAcuse = firmaResponse.datos.tipo_acuse;
            this.getAcusesRecibidosNotificacion();
            if(firmaResponse.datos.tipo_acuse === "Resolucion"){
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
          //this.indiceDePaso = this.PasoNotificacion.FIRMAR;
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
          //this.indiceDePaso = this.PasoNotificacion.FIRMAR;
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
              urlPdf: response.datos.llave_archivo ?? ''
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
        if (response.codigo === CodigoRespuesta.EXITO && response.datos) {
           this.datosTabla = [{
              id: 1,
              idDocumento: '1',
              documento: response.datos.nombre_archivo ?? '',
              urlPdf: response.datos.llave_archivo ?? ''
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
            idDocumento: String(data.datos[0].id_documento_oficial),
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
      fecha_firma: ConfirmarNotificacionComponent.formatFecha(new Date()),
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
   * Formatea una fecha a string en formato YYYY-MM-DD HH:MM:SS
   * @param fecha - Fecha a formatear (string o objeto Date)
   * @returns String con la fecha formateada
   */
  static formatFecha(fecha: string | Date): string {
    const DATE_OBJ = new Date(fecha);
    const PAD = (n: number): string => n.toString().padStart(2, '0');

    const YYYY = DATE_OBJ.getFullYear();
    const MM = PAD(DATE_OBJ.getMonth() + 1);
    const DD = PAD(DATE_OBJ.getDate());
    const HH = PAD(DATE_OBJ.getHours());
    const MM_MINUTES = PAD(DATE_OBJ.getMinutes());
    const SS = PAD(DATE_OBJ.getSeconds());

    return `${YYYY}-${MM}-${DD} ${HH}:${MM_MINUTES}:${SS}`;
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
