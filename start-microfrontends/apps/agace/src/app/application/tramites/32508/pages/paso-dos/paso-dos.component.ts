import {
  CargaDocumentoComponent,
  Notificacion,
  TituloComponent,
  Usuario,
  AlertComponent,
  TEXTOS,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Tramite32508Query } from '../../state/Tramite32508.query';
import { Solicitud32508State, Tramite32508Store } from '../../state/Tramite32508.store';
import { DocumentosFirmaQuery } from '@libs/shared/data-access-user/src/core/queries/documentos-firma.query';
import { TIPO_MORAL } from '../../constantes/adace32508.enum';

/**
 * Componente que representa el paso dos del formulario del trámite 32508.
 * Se encarga de mostrar y gestionar la carga de documentos requeridos.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /** Constante de textos reutilizables */
  TEXTOS = TEXTOS;

  /** Clase CSS para mostrar información en un alert */
  claseAlertaInformativa = 'alert-info';

  /** Observable para manejar la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /** ID del tipo de trámite */
  idTipoTramite: string = '32508';

  /** ID de la solicitud obtenido del store */
  idSolicitud: string = '';

  /** Datos del usuario para la carga de documentos */
  datosUsuario!: Usuario;

  /** Evento para disparar la carga de archivos */
  cargaArchivosEvento = new EventEmitter<void>();

  /** Evento para regresar a la sección de carga */
  regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /** Indica si la carga de documentos está en progreso */
  cargaEnProgreso: boolean = false;

  /** Evento que se emite cuando la carga de documentos se ha realizado */
  @Output() cargaRealizada = new EventEmitter<boolean>();

  /** Evento que se emite para activar/desactivar el botón de carga */
  @Output() activarBotonCargaArchivos = new EventEmitter<boolean>();

  /** Evento que se emite cuando la carga está en progreso */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Constructor del componente.
   * @param tramite32508Query Query para obtener el estado del trámite
   * @param tramite32508Store Store para actualizar el estado del trámite
   * @param documentosFirmaQuery Query para obtener documentos cargados
   */
  constructor(
    private tramite32508Query: Tramite32508Query,
    private tramite32508Store: Tramite32508Store,
    private documentosFirmaQuery: DocumentosFirmaQuery,
  ) {
    // Constructor para inyección de dependencias
  }

  /**
   * Método de inicialización del componente.
   * Se llama automáticamente cuando el componente es cargado.
   * @returns void
   */
  ngOnInit(): void {
    this.obtenerDatosDelStore();
    this.suscribirseADocumentosCargados();
  }

  /**
   * Se suscribe a los documentos cargados para guardarlos en el store del trámite.
   * Los documentos se cargan a través del componente carga-documento y se almacenan
   * temporalmente en DocumentosFirmaStore. Aquí los copiamos al store del trámite 32508
   * para que estén disponibles en el paso 3 (firma).
   * @returns void
   */
  private suscribirseADocumentosCargados(): void {
    this.documentosFirmaQuery.documentosEspecificos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((documentos) => {
        if (documentos && documentos.length > 0) {
          this.tramite32508Store.setListadoDocsAlmacenados(documentos);
        }
      });
  }

  /**
   * Método que se llama cuando el componente es destruido.
   * Libera las suscripciones activas para evitar fugas de memoria.
   * @returns void
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Obtiene los datos necesarios del store del trámite.
   * Incluye el idSolicitud y construye los datos del usuario.
   * @returns void
   */
  obtenerDatosDelStore(): void {
    this.tramite32508Query.selectSolicitud$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tramiteState: Solicitud32508State) => {
        this.idSolicitud = tramiteState.idSolicitud || '';
        this.datosUsuario = this.construirDatosUsuario(tramiteState);
      });
  }

  /**
   * Construye el objeto Usuario requerido para la carga de documentos.
   * Adaptado a la estructura flat del store del trámite 32508.
   * @param tramiteState Estado actual del trámite
   * @returns Usuario con los datos necesarios
   */
  private construirDatosUsuario(tramiteState: Solicitud32508State): Usuario {
    return {
      persona: {
        claveUsuario: tramiteState.rfc,
        rfc: tramiteState.rfc,
        nombre: tramiteState.nombre,
        apellidoPaterno: '',
        apellidoMaterno: '',
      },
      firmaElectronica: {
        cadenaOriginal: '',
        certificado: '',
        firma: '',
      },
      rolActual: tramiteState.tipoPersona === TIPO_MORAL ? 'PersonaMoral' : 'PersonaFisica',
      rfcSolicitante: tramiteState.rfc,
      idSolicitud: Number(tramiteState.idSolicitud) || 0,
      referenciaSolicitud: '',
    };
  }

  /**
   * Maneja el evento cuando los documentos han sido cargados.
   * @param cargaRealizada Indica si la carga se realizó correctamente
   */
  onCargaRealizada(cargaRealizada: boolean): void {
    this.cargaRealizada.emit(cargaRealizada);
  }

  /**
   * Maneja el evento para activar/desactivar el botón de carga.
   * @param activar Indica si se debe activar el botón
   */
  onActivarBotonCarga(activar: boolean): void {
    this.activarBotonCargaArchivos.emit(activar);
  }

  /**
   * Maneja el evento de carga en progreso.
   * @param enProgreso Indica si la carga está en progreso
   */
  onCargaEnProgreso(enProgreso: boolean): void {
    this.cargaEnProgreso = enProgreso;
    this.cargaEnProgresoChange.emit(enProgreso);
  }

  /**
   * Método público que dispara el evento de carga de archivos.
   * Permite que el componente padre active la carga de documentos.
   * @public
   */
  public dispararCargaArchivos(): void {
    this.cargaArchivosEvento.emit();
  }
}
