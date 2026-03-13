/**
 * @fileoverview Componente para el segundo paso del trámite 230301 de SEMARNAT.
 * Este archivo contiene la lógica para manejar la firma electrónica en el segundo paso
 * del proceso de solicitud, proporcionando la interfaz necesaria para la autenticación
 * y validación digital del usuario.
 * @author Equipo de desarrollo VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 */
import {
  CategoriaMensaje,
  FirmaElectronicaComponent,
  Notificacion,
  SessionQuery,
  base64ToHex,
  encodeToISO88591Hex
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { CadenaOriginal230301Service } from '../../services/cadena-original230301.service';
import { CommonModule } from '@angular/common';
import { DocumentosQuery } from '@libs/shared/data-access-user/src/core/queries/documentos.query';
import { DocumentosState } from '@libs/shared/data-access-user/src/core/estados/documentos.store';
import { FirmaElectronicaService } from '@libs/shared/data-access-user/src/core/services/shared/firma-electronica/firma-electronica.service';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { PerfilUsuario } from '@libs/shared/data-access-user/src/core/models/usuario/perfilUsuario.model';
import { Rol } from '@libs/shared/data-access-user/src/core/models/usuario/rol.model';
import { Router } from '@angular/router';
import { Tramite230301Query } from '../../estados/queries/tramites230301.query';
import { Tramite230301State } from '../../estados/tramites/tramites230301.store';
import { TramiteFolioStore } from '@libs/shared/data-access-user/src';
import { formatFecha as Utils } from '@libs/shared/data-access-user/src/core/utils/utilerias';

@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  @Input() procedureUrl: string = '';
  @Input() procedure: number = 0;

  router = inject(Router);
  documentosQuery = inject(DocumentosQuery);
  tramite230301Query = inject(Tramite230301Query);
  firmaElectronicaService = inject(FirmaElectronicaService);
  cadena = inject(CadenaOriginal230301Service);
  tramiteStore = inject(TramiteFolioStore);
  sessionQuery = inject(SessionQuery);

  /**
   Estado de los documentos asociados al trámite.
   */
  private documentosState!: DocumentosState;
  /**
   Subject para manejar la desuscripción de observables y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();
  /**
   Cadena original que se generará para la firma electrónica.
   */
  cadenaOriginal?: string;
  /**
   * Objeto para gestionar las notificaciones que se muestran al usuario.
   */
  alertaNotificacion!: Notificacion;
  /**
   * URL base para la navegación dentro del trámite.
   */
  url?: string;
  /**
   * Datos de la firma electrónica obtenidos del componente de firma.
   */
  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };
  /**
   * Estado actual de la solicitud del trámite 230301.
   */
  public solicitudState!: Tramite230301State;
  /**
   * Folio asignado al trámite una vez que ha sido firmado y procesado.
   */
  folio!: string;
  /**
   * Perfil del usuario autenticado.
   */
  userProfile: PerfilUsuario | undefined;
  /**
   * Roles asociados al usuario autenticado.
   */
  roles: Rol[] = [];
  /**
   * ID del usuario autenticado.
   */
  userId = '';

  ngOnInit(): void {
    this.documentosQuery.selectDocumentoState$
      .pipe(
        takeUntil(this.destroy$),
        map((documentosState) => {
          this.documentosState = documentosState;
        })
      )
      .subscribe();

    this.tramite230301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((state) => {
          this.solicitudState = state;
        })
      )
      .subscribe();

    this.sessionQuery.selectPerfilUsuario$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userProfile) => {
        this.userProfile = userProfile;
      });

    this.sessionQuery.selectRolesUsuario$
      .pipe(takeUntil(this.destroy$))
      .subscribe((roles) => {
        this.roles = roles;
      });

    this.sessionQuery.selectUsuarioState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.userId = state.idUsuario;
      });

    const URL_SEGMENTS = this.router.url.split('/');
    URL_SEGMENTS.pop();
    URL_SEGMENTS.pop();
    this.url = URL_SEGMENTS.join('/');

    this.obtenerCadenaOriginal();
  }

  /**
   * Obtiene la cadena original necesaria para la firma electrónica.
   */
  obtenerCadenaOriginal(): void {
    /*
    Se debe reemplazar la asignación de la variable certificado_serial number
    con la respuesta del servicio pendiente del SAT.
    Además, se deben reemplazar los valores fijos por los valores en sesión
    */
    const PAYLOAD = {
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
      fecha_firma: Utils(new Date()),
      documento_requerido: [],
    };

    this.cadena
      .obtenerCadenaOriginal(String(this.solicitudState.idSolicitud), PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo !== '00') {
            this.alertaNotificacion = {
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
          this.alertaNotificacion = {
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
   * Maneja los datos de la firma electrónica recibidos del componente de firma.
   * Almacena los datos de la firma y procede a obtener la firma para su procesamiento.
   * @param datos Objeto que contiene la firma, número de serie del certificado, RFC y fecha de fin de vigencia.
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
   * Procesa la firma electrónica recibida.
   * Construye el payload para enviar la firma al servicio y maneja la respuesta.
   * @param firma La firma electrónica en formato base64.
   */
  obtieneFirma(firma: string): void {
    if (!this.cadenaOriginal || !this.datosFirmaReales) {
      console.error('Faltan datos para completar la firma');
      this.alertaNotificacion = {
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

    const FIRMA_REQUEST: FirmarRequest = {
      cadena_original: CADENAHEX,
      cert_serial_number: this.datosFirmaReales.certSerialNumber,
      clave_usuario: this.datosFirmaReales.rfc,
      fecha_firma: Utils(new Date()),
      clave_rol: 'Solicitante',
      sello: FIRMAHEX,
      fecha_fin_vigencia: Utils(this.datosFirmaReales.fechaFin),
      documentos_requeridos: [],
    };

    this.firmaElectronicaService
      .enviarFirma<string>(FIRMA_REQUEST)
      .pipe(
        takeUntil(this.destroy$),
        tap((firmaResponse: BaseResponse<string>) => {
          if (firmaResponse.codigo !== '00' || !firmaResponse.datos) {
            this.alertaNotificacion = {
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
          this.folio = firmaResponse.datos;
        }),
        tap(() => {
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
          if (!this.alertaNotificacion) {
            this.alertaNotificacion = {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
