import { Subject, catchError, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DocumentosQuery } from '@libs/shared/data-access-user/src/core/queries/documentos.query';
import { DocumentosState } from '@libs/shared/data-access-user/src/core/estados/documentos.store';

import { CategoriaMensaje, DocumentoService, Notificacion, TramiteFolioQueries, TramiteFolioStore, base64ToHex, encodeToISO88591Hex} from '@libs/shared/data-access-user/src';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FirmaResponse } from '../../models/response/firma-response.model';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { GenerarCadenaOrigRequest } from '../../models/request/generar-cadena-original-request.model';
import { Router } from '@angular/router';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';
import { Solicitante110101State } from '../../estados/tramites/solicitante110101.store';
import { SolicitudService } from '../../services/solicitud.service';


/**
 * **Componente para firmar una solicitud**  
 *
 * - Representa la interfaz de usuario para el proceso de firma de una solicitud.  
 * - Utiliza el selector `'app-firmar-solicitud'` para ser invocado en otras partes de la aplicación.  
 * - Su estructura de presentación se define en el archivo `firmar-solicitud.component.html`.  
 */
@Component({
  selector: 'app-firmar-solicitud',
  templateUrl: './firmar-solicitud.component.html',
})

export class FirmarSolicitudComponent implements OnInit, OnDestroy {

  /**
   * **Subject para manejar la destrucción del componente**
   * 
   * Este `Subject` se utiliza para cancelar suscripciones y evitar 
   * fugas de memoria cuando el componente es destruido.
   * Se usa comúnmente en el operador `takeUntil` dentro de los observables.
   */
  private destroy$ = new Subject<void>();

  /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion ;

  /**
   * Estado de los documentos relacionados con el trámite.
   * Este objeto es utilizado para gestionar los documentos necesarios para el trámite.
  */
  private documentosState!: DocumentosState;

  /**
   * Objeto que contiene el estado de la solicitud del trámite.
   * Este objeto es utilizado para gestionar el estado del trámite en la aplicación.
  */
  public solicitudState!: Solicitante110101State;


  /**
   * URL del procedimiento actual utilizada para la navegación entre pasos del trámite.
   * Se usa para:
   * - Construir la ruta de navegación al acuse de recibo después de la firma exitosa
   * - Reemplazar la URL actual con la del siguiente paso en el flujo
   * - Mantener la coherencia en la navegación del proceso de trámite
   * 
   * @example
   * ```html
   * <paso-firma procedureUrl="solicitud-11201"></paso-firma>
   * ```
  */
  @Input() procedureUrl: string = '';

  /**
   * Código numérico que identifica el tipo de procedimiento o trámite.
   * Este valor se utiliza para:
   * - Determinar el endpoint específico en las llamadas al servicio
   * - Configurar el comportamiento del proceso de firma según el tipo de trámite
   * - Validar permisos y reglas de negocio específicas del procedimiento
   * 
   * @example
   * ```html
   * <paso-firma [procedure]="11201"></paso-firma>
   * ```
   */
  @Input() procedure: number = 0;


  /**
  * Cadena original generada a partir de los datos del trámite.
  * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
  */
  cadenaOriginal?: string;

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
   * Folio del trámite que se está procesando.
   * Este folio es único para cada trámite y se utiliza para identificarlo en el sistema.
   */
  folio!: string;
  
  /**
     * Constructor del componente.
     * @param router - El enrutador.
     * @param TramiteFolioServices - Los servicios extraordinarios.
     * @param TramiteAgaceStore - El almacén de trámites.
     */
  constructor(
    private router: Router,
    private TramiteFolioServices: ServiciosPantallaService,
    private solicitudService: SolicitudService,
    private documentosQuery: DocumentosQuery,
    private solicitante110101Query: Solicitante110101Query,
    private tramiteFolioQuery: TramiteFolioQueries,
    private documentoService: DocumentoService,
    private tramiteStore: TramiteFolioStore,
  ) {
    // Constructor
  }

  ngOnInit(): void {
    this.solicitante110101Query.selectSolicitante$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.solicitudState = state;
    });

 
    this.generarCadenaOriginal();
    
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
   * @method generarCadenaOriginal
   * @description
   * Genera la cadena original para la solicitud actual, contruyendo un payload con la información necesaria
   * y realizando una petición al servicio correspondiente.
   * Maneja la respuesta mostrando notificaciones al usuario en caso de error.
   * 
   */
  generarCadenaOriginal(): void {
  const PAYLOAD: GenerarCadenaOrigRequest = {
  num_folio_tramite: this.tramiteFolioQuery.getTramite() || null,
  boolean_extranjero: true,
  /** Datos del solicitante */
  solicitante: {
    id_domicilio: 42,
    nombre: "Maria",
    apellido_paterno: "Chávez",
    apellido_materno: "Martínez",
    razon_social: "INTEGRADORA DE URBANIZACIONES SIGNUM, S DE RL DE CV",
    rfc: "SAAA980822LP1",
    curp: "SAAA980822LP112",
    cve_usuario: "42",
    descripcion_giro: "Descripción del giro",
    numero_identificacion_fiscal: "2",
    nss: "123029102",
    correo_electronico: "luz.arellano@sat.gob.mx"
  },

  cve_rol_capturista: "CapturistaGubernamental",
  cve_usuario_capturista: "Gubernamental",
  fecha_firma: FirmarSolicitudComponent.formatFecha(new Date()),
  clave_unidad_admin: this.solicitudState.representacion,
  //ultimo tab
  clave_entidad: null,

  tratados_agregados: this.solicitudState.tratados_servicio_evaluar.map(item =>
    ({
      /** ID del tratado o acuerdo */
      id_tratado_acuerdo: item.id_tratado_acuerdo,

      /** Nombre del país */
      clave_pais: item.cve_pais,

      /** Nombre del bloque */
      id_bloque: item.id_bloque?.toString() || null,

      /** Nombre del grupo de criterio */
      clave_grupo_criterio: item.cve_grupo_criterio,

      /** Indica si cumple con el juego  */
      cumple_juego: item.cumple_juego,

      /** Identificador del tipo de proceso de mercancía */
      ide_tipo_proceso_mercancia: item.ide_tipo_proceso_mercancia
    })
  ),

  registro_cuestionario:{
    /** Indica si la descripción es similar a ALADI */
    cal_descripcion_similar_aladi: null,

    /** Indica si existe separación contable */
    separacion_contable: this.solicitudState.metodoSeparacion,

    /** Indica si se solicita exportador autorizado */
    solicita_exportador_autorizado: this.solicitudState.exportadorAutorizado,

    /** Condición del exportador autorizado */
    ide_condicion_exportador_autorizado: this.solicitudState.informacionRadios,

    /** Información de la mercancía */
    mercancia: {
      /** Nombre comercial de la mercancía */
      nombre_comercial: this.solicitudState.nombreComercial,
  
      /** Nombre en inglés de la mercancía */
      nombre_ingles: this.solicitudState.nombreIngles,
  
      /** Fracción arancelaria */
      fraccion_arancelaria: this.solicitudState.fraccionArancelaria,
  
      /** Precio franco fábrica */
      precio_franco_fabrica: this.solicitudState.francofabrica,
  
      /** Valor transaccional */
      valor_transaccional: this.solicitudState.valorTransaccion,
  
      /** Costo neto */
      costo_neto: this.solicitudState.costoNetoDolares,
  
      /** Clave de fracción NALADI */
      cve_fraccion_naladi: this.solicitudState.clasificacionNaladi,
  
      /** Clave de fracción NALADISA 93 */
      cve_fraccion_naladisa93: this.solicitudState.clasificacionNaladi1993,
  
      /** Clave de fracción NALADISA 96 */
      cve_fraccion_naladisa96: this.solicitudState.clasificacionNaladi1996,
  
      /** Clave de fracción NALADISA 02 */
      cve_fraccion_naladisa02: this.solicitudState.clasificacionNaladi2002,
  
      /** Tipo de método aplicado */
      tipo_metodo: this.solicitudState.valorMetodoRadioUruguayPanama,
  
      /** Procesos solicitados para la mercancía */
      procesos_solicitados:this.solicitudState.validacionFraccionArancelaria?.mercancia?.procesos_solicitados?.map(item => 
        ({
        id_proceso_ceror: item.id_proceso_ceror,
        cumple_proceso: item.cumple_proceso
        })) || [],
    }
  }
};
this.solicitudService.postGenerarCadenaOriginal(this.solicitudState.id_solcitud ?? 0,PAYLOAD)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (response) => {
      if (response.codigo === CodigoRespuesta.EXITO) {
          this.cadenaOriginal = typeof response.datos === 'string' ? response.datos : undefined;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: CategoriaMensaje.ERROR,
          modo: 'action',
          titulo: response.error || 'Error para generar la cadena original.',
          mensaje: response.causa || response.mensaje || 'Error para generar la cadena original.',
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
      }
    },
    error: (error) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const MENSAJE = error?.error?.error || 'Error para generar la cadena original.';
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: '',
        mensaje: MENSAJE,
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
    }
  });
}

  /**
    * Maneja el evento para obtener la firma y realiza acciones adicionales.
    * @param ev - La cadena de texto que representa la firma obtenida.
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
  const PAYLOAD: FirmarRequest = {
    cadena_original: CADENAHEX,
    cert_serial_number: this.datosFirmaReales.certSerialNumber,
    clave_usuario: this.datosFirmaReales.rfc,
    fecha_firma: FirmarSolicitudComponent.formatFecha(new Date()),
    clave_rol: 'Solicitante',
    sello: FIRMAHEX,
    fecha_fin_vigencia: FirmarSolicitudComponent.formatFecha(this.datosFirmaReales.fechaFin),
    documentos_requeridos: [],
  };

  this.solicitudService
    .enviarFirma<FirmaResponse>(String(this.solicitudState.id_solcitud), PAYLOAD)
    .pipe(
      takeUntil(this.destroy$),
      tap((firmaResponse: BaseResponse<FirmaResponse>) => {
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
        }

        this.folio = firmaResponse.datos.num_folio_tramite;
      }),
      tap(() => {
        this.tramiteStore.establecerTramite(
          this.folio,
          firma,
          this.solicitudState.id_solcitud ?? 0,
          this.procedure
        );
        this.router.navigate([this.router.url.replace(this.procedureUrl, 'acuse')]);
      }),
      catchError((error) => {
        console.error('Error en el proceso de firma:', error);
        if (!this.nuevaNotificacion) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error inesperado',
            mensaje: error?.error?.error || 'Ocurrió un error al procesar la firma.',
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
   * Formatea una fecha a un string en el formato 'YYYY-MM-DD HH:mm:ss'.
   * @param fecha - Fecha a formatear, puede ser un string o un objeto Date.
   * @returns String formateado de la fecha.
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
   * Método para obtener la cadena original del trámite.
   * Este método se encarga de llamar al servicio correspondiente para obtener la cadena original.
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
