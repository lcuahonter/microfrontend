import {
  CategoriaMensaje,
  FirmaElectronicaComponent,
  Notificacion,
  NotificacionesComponent,
  TramiteFolioStore,
  base64ToHex,
  encodeToISO88591Hex,
  formatFecha,
} from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CadenaOriginal319Service } from '../../services/cadenaOriginal319.service';
import { CadenaOriginalRequest } from '@libs/shared/data-access-user/src/core/models/shared/cadena-original-request.model';
import { FinalDataToSend } from '../../models/tramite319-state.model';
import { Firma319Service } from '../../services/firma319.service';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { Router } from '@angular/router';
import { Tramite319Query } from '../../estados/tramite319Query.query';
import { Tramite319Store } from '../../estados/tramite319Store.store';

/**
 * Componente PasoDocComponent.
 * Este componente maneja la lógica relacionada con el paso de documentos en el flujo de trámites.
 *
 * @example
 * <app-paso-doc></app-paso-doc>
 *
 * @description
 * Este componente incluye funcionalidades para manejar la firma de documentos y la navegación
 * a la página de acuse en caso de que la firma sea válida.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [NotificacionesComponent, FirmaElectronicaComponent],
})
export class PasoDosComponent implements OnInit, OnDestroy {
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
  public estadoSolicitud!: FinalDataToSend;
  folio!: string;
  @Input() procedureUrl: string = '';
  @Input() procedure: number = 0;
  /**
   * Constructor del componente.
   *
   * @param {Router} router - Servicio de enrutamiento para manejar la navegación entre páginas.
   */
  constructor(
    private router: Router,
    private tramiteStore: TramiteFolioStore,
    private tramiteQuery: Tramite319Query,
    private tramite319Store: Tramite319Store,
    private cadenaService: CadenaOriginal319Service,
    private firmaService: Firma319Service
  ) {}

  ngOnInit(): void {
    this.tramiteQuery
      .select()
      .pipe(
        takeUntil(this.destroy$),
        map((state) => {
          this.estadoSolicitud = state;
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
   * Obtiene la firma y navega a la página de acuse si la firma es válida.
   *
   * @param {string} ev - La firma obtenida como cadena de texto.
   *
   * @description
   * Este método verifica si la firma proporcionada es válida y, en caso afirmativo,
   * redirige al usuario a la página de acuse correspondiente.
   *
   * @example
   * this.obtieneFirma('firma123');
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
      .enviarFirma<string>(Number(this.estadoSolicitud.idSolicitud), PAYLOAD)
      .pipe(
        takeUntil(this.destroy$),
        tap((firmaResponse: BaseResponse<string>) => {
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
          this.tramite319Store.reset();
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
   * Obtiene la cadena original para el trámite actual.
   */
  obtenerCadenaOriginal(): void {
    const PAYLOAD: CadenaOriginalRequest = {
      num_folio_tramite: this.estadoSolicitud.idSolicitud?.toString() || null,
      boolean_extranjero: true,
      solicitante: {
        rfc: 'AAL0409235E6',
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
   * Procesa los datos de firma.
   * @param datos Los datos de firma a procesar.
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
   * Limpia los recursos al destruir el componente.
   * @description
   * Este método se encarga de completar el observable `destroy$` para evitar fugas de memoria
   * cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
