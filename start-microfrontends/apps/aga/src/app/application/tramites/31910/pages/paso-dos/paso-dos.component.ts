/**
 * @file paso-dos.component.ts
 * @description Documentación adicional para el componente PasoDosComponent (paso 2 del trámite 31910).
 * Se añadieron comentarios y JSDoc explicativos. NO se modificó la lógica existente.
 * - Objetivo: mejorar mantenibilidad y comprensión del componente.
 * - Alcance: documentación a nivel de archivo, propiedades, constructor y métodos principales.
 */
import {
  CategoriaMensaje,
  FirmaElectronicaComponent,
  LoginQuery,
  Notificacion,
  base64ToHex,
  encodeToISO88591Hex,
  formatFecha,
  NotificacionesComponent,
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CadenaOriginal31910Service } from '../../services/cadenaOriginalt31910.service';
import { CadenaOriginalRequest } from '@libs/shared/data-access-user/src/core/models/shared/cadena-original-request.model';
import { Firma31910Service } from '../../services/firma31910.service';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { Router } from '@angular/router';
import { Solicitud31910State, Tramite31910Store } from '../../estados/stores/tramite31910.store';
import { Tramite31910Query } from '../../estados/queries/tramite31910.query';
import { TramiteFolioStore } from '@libs/shared/data-access-user/src';
import { Tramite319Store } from '../../../319/estados/tramite319Store.store';

/**
 * @class PasoTresComponent
 * @description
 * Este componente gestiona el tercer paso de un trámite, donde se obtiene la firma electrónica del usuario.
 *
 * @since 1.0.0
 * @version 1.0.0
 * @license MIT
 *
 * @selector app-paso-tres
 * @standalone true
 * @requires CommonModule
 * @requires FirmaElectronicaComponent
 *
 * @templateUrl ./paso-tres.component.html
 * @styleUrl ./paso-tres.component.scss
 */
@Component({
  standalone: true,
  imports: [FirmaElectronicaComponent, NotificacionesComponent],
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   * Se emite un valor y se completa en ngOnDestroy para cancelar observables con takeUntil.
   */
  private destroy$ = new Subject<void>();

  /**
   * Cadena original obtenida para el trámite actual.
   * Esta cadena es la que se transforma y envía para la firma electrónica.
   */
  cadenaOriginal?: string;

  /**
   * Notificación que se muestra al usuario en caso de éxito/error.
   * Estructura definida por el tipo Notificacion importado.
   */
  nuevaNotificacion!: Notificacion;

  /**
   * URL base calculada a partir de la ruta actual (primeros 3 segmentos).
   * Se utiliza para navegación relativa dentro del flujo del trámite.
   */
  url?: string;

  /**
   * Datos recolectados desde el componente de firma electrónica con la firma real,
   * número de serie del certificado, RFC y fecha de fin de vigencia.
   */
  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };

  /**
   * Estado local de la solicitud obtenido desde el store/consulta correspondiente.
   * Contiene información del trámite en curso (idSolicitud, datos del usuario, etc.).
   */
  public estadoSolicitud!: Solicitud31910State;

  /**
   * Folio devuelto por el servicio tras una firma exitosa.
   * Se usa posteriormente para almacenar/mostrar el acuse.
   */
  folio!: string;

  /**
   * URL del procedimiento recibida como input.
   * Ejemplo: ruta o endpoint asociado al procedimiento actual.
   */
  @Input() procedureUrl: string = '';

  /**
   * Identificador numérico del procedimiento recibido como input.
   */
  @Input() procedure: number = 0;

  /**
   * RFC del usuario logueado en el sistema.
   * Se obtiene desde el LoginQuery.
   */
  rfcLogueado: string = '';

  /**
   * Constructor con dependencias inyectadas.
   *
   * @param router Servicio de Angular Router para navegación.
   * @param tramiteStore Store para establecer datos del trámite (folio, firma, ids).
   * @param tramiteQuery Query para obtener el estado actual de la solicitud.
   * @param cadenaService Servicio encargado de generar/obtener la cadena original.
   * @param firmaService Servicio encargado de enviar la firma electrónica al backend.
   */
  constructor(
    private router: Router,
    private tramiteStore: TramiteFolioStore,
    private tramiteQuery: Tramite31910Query,
    private store: Tramite31910Store,
    private cadenaService: CadenaOriginal31910Service,
    private firmaService: Firma31910Service,
    private loginQuery: LoginQuery
  ) {
    // Constructor
  }

  /**
   * Método de inicialización del componente.
   *
   * Este método se ejecuta una vez que el componente ha sido inicializado.
   * Aquí se suscribe al estado del formulario de solicitud para mantener
   * actualizado el estado local del componente.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((state) => {
          this.estadoSolicitud = state;
        })
      )
      .subscribe();

    // Obtener la URL actual y separar los segmentos
    this.url = this.router.url;

    // Obtener la cadena original del trámite
    this.obtenerCadenaOriginal();
  }

  obtenerRfcLogueado(): void {
    this.loginQuery
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.rfcLogueado = res.rfc));
  }

  /**
   * Obtiene la firma electrónica del documento y la envía al servicio correspondiente.
   *
   * Requisitos previos:
   * - `cadenaOriginal` debe estar disponible.
   * - `datosFirmaReales` debe contener la firma y metadatos del certificado.
   *
   * @param firma La firma electrónica en formato base64 proporcionada por el componente de firma.
   * @returns void
   */
  obtieneFirma(firma: string): void {
    if (!this.cadenaOriginal || !this.datosFirmaReales) {
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
      fecha_firma: formatFecha(new Date()),
      clave_rol: 'Solicitante',
      sello: FIRMAHEX,
      fecha_fin_vigencia: formatFecha(this.datosFirmaReales.fechaFin),
      documentos_requeridos: [],
    };

    this.firmaService
      .enviarFirma<string>(String(this.estadoSolicitud.idSolicitud), PAYLOAD)
      .pipe(
        takeUntil(this.destroy$),
        tap((firmaResponse: BaseResponse<string>) => {
          // Validar si la firma fue exitosa
          if (firmaResponse.codigo !== '00' || !firmaResponse.datos) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al firmar la solicitud',
              mensaje:
                firmaResponse.mensaje ||
                firmaResponse.error ||
                'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            throw new Error('Firma no exitosa');
          }

          // Éxito: guardar folio
          this.folio = firmaResponse.datos;
        }),
        tap(() => {
          // Solo se ejecuta si todo fue exitoso
          this.tramiteStore.establecerTramite(
            this.folio,
            firma,
            this.estadoSolicitud.idSolicitud ?? 0,
            this.procedure
          );
          this.store.reset();
          this.router.navigate([`${this.url}/acuse`]);
        }),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje:
                error?.error?.error || 'Ocurrió un error al procesar la firma.',
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
   * Obtiene la cadena original para el trámite actual desde el servicio.
   *
   * Construye el payload necesario y maneja la respuesta asignando `cadenaOriginal`
   * o generando la notificación de error correspondiente.
   *
   * @returns void
   */
  obtenerCadenaOriginal(): void {
    const PAYLOAD: CadenaOriginalRequest = {
      num_folio_tramite: this.estadoSolicitud.idSolicitud?.toString() || null,
      boolean_extranjero: true,
      solicitante: {
        rfc: this.rfcLogueado,
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: 'string',
      },
      cve_rol_capturista: 'CapturistaGubernamental',
      cve_usuario_capturista: 'Gubernamental',
      fecha_firma: formatFecha(new Date()),
    };
    this.cadenaService
      .obtenerCadenaOriginal(String(this.estadoSolicitud.idSolicitud), PAYLOAD)
      .subscribe({
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
          this.cadenaOriginal =
            typeof resp.datos === 'string' ? resp.datos : 'cadenajemeplo';
        },
        error: (error) => {
          const MENSAJE =
            error?.error?.error || 'Error inesperado al iniciar trámite.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
      });
  }

  /**
   * Procesa los datos de firma recibidos desde el componente de firma electrónica.
   * Asigna los datos y dispara el flujo de envío de la firma.
   *
   * @param datos Objeto con las propiedades:
   *  - firma: string (firma en base64)
   *  - certSerialNumber: string (número de serie del certificado)
   *  - rfc: string (RFC del firmante)
   *  - fechaFin: string (fecha de fin de vigencia del certificado)
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
   * Método de destrucción del componente.
   * Este método se ejecuta cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
