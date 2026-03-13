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
import { CadenaOriginal31908Service } from '../../services/cadenaOriginal.service';
import { CadenaOriginalRequest } from '../../models/cadena-original-request';
import { EstadoSolicitud31908 } from '../../models/estado-solicitud-31908';
import { Firma31908Service } from '../../services/firma.service';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { Router } from '@angular/router';
import { Tramite31908Query } from '../../estados/query/tramite31908.query';
/**
 * Componente que representa el segundo paso del formulario o asistente (wizard).
 * - selector: Etiqueta personalizada que se usará para incluir este componente en el HTML.
 * - templateUrl: Ruta al archivo de plantilla HTML correspondiente a este paso.
 */
@Component({
  standalone: true,
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  imports: [FirmaElectronicaComponent, NotificacionesComponent],
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
  public estadoSolicitud!: EstadoSolicitud31908;
  folio!: string;
  @Input() procedureUrl: string = '';
  @Input() procedure: number = 0;
  /**
   * Constructor del componente.
   * @param router Router para la navegación.
   */
  constructor(
    private router: Router,
    private tramiteStore: TramiteFolioStore,
    private tramiteQuery: Tramite31908Query,
    private cadenaService: CadenaOriginal31908Service,
    private firmaService: Firma31908Service
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método de inicialización del componente.
   *
   * Este método se ejecuta una vez que el componente ha sido inicializado.
   * Aquí se suscribe al estado del formulario de solicitud para mantener
   * actualizado el estado local del componente.
   */
  ngOnInit(): void {
    this.tramiteQuery.estadoSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((state) => {
          this.estadoSolicitud = state;
        })
      )
      .subscribe();

    const URL_ACTUAL = this.router.url;
    this.url = URL_ACTUAL.replace(this.procedureUrl, '');
    // Obtener la cadena original del trámite
    this.obtenerCadenaOriginal();
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
   * Obtiene la firma electrónica del documento.
   * @param firma La firma electrónica en formato base64.
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
   * Destruye el componente y libera los recursos asociados.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
