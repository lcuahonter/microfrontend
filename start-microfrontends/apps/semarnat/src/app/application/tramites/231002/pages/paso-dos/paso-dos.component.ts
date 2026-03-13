import {
  CategoriaMensaje,
  FirmaElectronicaComponent,
  Notificacion,
  NotificacionesComponent,
  base64ToHex,
  encodeToISO88591Hex,
  formatFecha,
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CadenaOriginal231002Service } from '../../services/cadenaOriginal231002.service';
import { CadenaOriginalRequest } from '../../models/cadena-original-request';
import { CommonModule } from '@angular/common';
import { DatoSolicitudQuery } from '../../estados/queries/dato-solicitud.query';
import { EstadoDatoSolicitud } from '../../models/datos-solicitud.model';
import { Firma231002Service } from '../../services/firma231002.service';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { Router } from '@angular/router';
import { TramiteFolioStore } from '@libs/shared/data-access-user/src';

/**
 * Componente que representa el segundo paso del formulario o asistente (wizard).
 *
 * Este componente es el encargado de gestionar la segunda etapa del asistente de formulario.
 * Permite a los usuarios completar un paso en el proceso y navegar a la siguiente etapa.
 *
 * - selector: Etiqueta personalizada que se usará para incluir este componente en el HTML.
 * - templateUrl: Ruta al archivo de plantilla HTML correspondiente a este paso.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent, NotificacionesComponent],
  templateUrl: './paso-dos.component.html',
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
  public estadoSolicitud!: EstadoDatoSolicitud;
  folio!: string;
  @Input() procedureUrl: string = '';
  @Input() procedure: number = 0;
  /**
   * Constructor del componente.
   *
   * Este constructor se utiliza para la inyección de dependencias, en este caso el router
   * que permitirá la navegación a otras páginas de la aplicación.
   *
   * @param router Router para la navegación.
   */
  constructor(
    private router: Router,
    private tramiteStore: TramiteFolioStore,
    private tramiteQuery: DatoSolicitudQuery,
    private cadenaService: CadenaOriginal231002Service,
    private firmaService: Firma231002Service
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
    this.tramiteQuery.estadoFormulario$
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
