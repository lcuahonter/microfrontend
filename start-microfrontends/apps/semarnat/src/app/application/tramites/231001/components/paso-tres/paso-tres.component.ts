import {
  CategoriaMensaje,
  FirmaElectronicaComponent,
  Notificacion,
  NotificacionesComponent,
  TramiteFolioQueries,
  base64ToHex,
  encodeToISO88591Hex,
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { CadenaOriginal231001Service } from '../../services/cadenaOriginal231001.service';
import { CadenaOriginalRequest } from '../../models/cadena-original-request';
import { CommonModule } from '@angular/common';
import { DocumentosQuery } from '@libs/shared/data-access-user/src/core/queries/documentos.query';
import { DocumentosState } from '@libs/shared/data-access-user/src/core/estados/documentos.store';
import { Firma231001Service } from '../../services/firma231001.service';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { Router } from '@angular/router';
import { Solicitud231001State } from '../../estados/tramites/tramite231001.store';
import { Tramite231001Query } from '../../estados/queries/tramite231001.query';
import { TramiteFolioStore } from '@libs/shared/data-access-user/src';
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
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent, NotificacionesComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent implements OnInit, OnDestroy {
  private documentosState!: DocumentosState;
  private destroy$ = new Subject<void>();
  cadenaOriginal?: string;
  nuevaNotificacion!: Notificacion;
  url?: string;
  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };
  public solicitudState!: Solicitud231001State;
  folio!: string;
  @Input() procedureUrl: string = '';
  @Input() procedure: number = 0;

  /**
   * @constructor
   * @description
   * Constructor que inyecta `Router` para la navegación.
   *
   * @param {Router} router - Servicio de Angular para manejar la navegación.
   * @access public
   */
  constructor(
    private router: Router,
    private documentosQuery: DocumentosQuery,
    private tramite231001Query: Tramite231001Query,
    private firma: Firma231001Service,
    private cadena: CadenaOriginal231001Service,
    private tramiteFolioQuery: TramiteFolioQueries,
    private tramiteStore: TramiteFolioStore
  ) {
    // Constructor
  }

  /**
   * @method ngOnInit
   * @description
   * Método de ciclo de vida que se ejecuta al inicializar el componente.
   * Aquí se debe obtener la cadena original necesaria para la firma electrónica.
   *
   * @access public
   */
  ngOnInit(): void {
    // Suscribirse a los cambios en el estado de los documentos
    this.documentosQuery.selectDocumentoState$
      .pipe(
        takeUntil(this.destroy$),
        map((documentosState) => {
          this.documentosState = documentosState;
        })
      )
      .subscribe();

    this.tramite231001Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((state) => {
          this.solicitudState = state;
        })
      )
      .subscribe();

    // Obtener la URL actual y separar los segmentos
    const URL_ACTUAL = this.router.url;
    const URL_SEPARADA = URL_ACTUAL.split('/');
    this.url = URL_SEPARADA.slice(0, 3).join('/');

    // Obtener la cadena original del trámite
    this.obtenerCadenaOriginal();
  }

  /**
   * @method obtenerCadenaOriginal
   * @description
   * Obtenemos la cadena original (placeholder).
   * En el caso real, esto debería obtenerse desde un servicio como en 130118.
   *
   * @access private
   */
  obtenerCadenaOriginal(): void {
    const PAYLOAD: CadenaOriginalRequest = {
      num_folio_tramite: this.solicitudState.idSolicitud?.toString() || null,
      boolean_extranjero: true,
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: 'string',
      },
      cve_rol_capturista: 'CapturistaGubernamental',
      cve_usuario_capturista: 'Gubernamental',
      fecha_firma: PasoTresComponent.formatFecha(new Date()),
    };
    this.cadena
      .obtenerCadenaOriginal(String(this.solicitudState.idSolicitud), PAYLOAD)
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
          console.error('Error al iniciar trámite:', error);
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
   * @method datosFirma
   * @description
   * Recibe el objeto completo con datos de firma desde el componente firma-electronica
   *
   * @param {Object} datos - Objeto con los datos de la firma.
   * @param {string} datos.firma - La firma electrónica.
   * @param {string} datos.certSerialNumber - Número de serie del certificado.
   * @param {string} datos.rfc - RFC del usuario.
   * @param {string} datos.fechaFin - Fecha de expiración de la firma.
   * @returns {void}
   * @access public
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
   *
   *
   * @method obtieneFirma
   * @description
   * Método que maneja la obtención de la firma electrónica.
   * Si la firma es válida, navega a la página de acuse.
   *
   * @param {string} ev - Evento que contiene la firma electrónica.
   * @returns {void}
   * @access public
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
      fecha_firma: PasoTresComponent.formatFecha(new Date()),
      clave_rol: 'Solicitante',
      sello: FIRMAHEX,
      fecha_fin_vigencia: PasoTresComponent.formatFecha(
        this.datosFirmaReales.fechaFin
      ),
      documentos_requeridos: [],
    };

    this.firma
      .enviarFirma<string>(String(this.solicitudState.idSolicitud), PAYLOAD)
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
            this.solicitudState.idSolicitud ?? 0,
            this.procedure
          );
          this.router.navigate([`${this.url}/acuse`]);
        }),
        catchError((error) => {
          console.error('Error en el proceso de firma:', error);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
