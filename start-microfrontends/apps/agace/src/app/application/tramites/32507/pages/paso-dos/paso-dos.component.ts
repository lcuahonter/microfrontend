import {
  AlertComponent,
  CargaDocumentoComponent,
  Notificacion,
  TituloComponent,
  Usuario,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { CommonModule } from "@angular/common";
import { TEXTOS, DocumentosQuery } from '@ng-mf/data-access-user';
import { Tramite32507Query } from '../../../../estados/queries/tramite32507.query';
import { Tramite32507State } from '../../../../estados/tramites/tramite32507.store';
import { INSTRUCCIONES_CARGA_ADJUNTAR } from '../../constants/avios-procesos.enum';

/**
 * Componente que representa el paso dos del formulario o proceso.
 * Se encarga de mostrar y gestionar los tipos de documentos requeridos.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [CommonModule, TituloComponent, AlertComponent, CargaDocumentoComponent],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /** Constante de textos reutilizables */
  TEXTOS = TEXTOS;

  /** Clase CSS para mostrar información en un alert */
  infoAlert = 'alert-info';

  /** Observable para manejar la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /** ID del tipo de trámite */
  idTipoTramite: string = '32507';

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

  /** Evento que se emite cuando cambia el estado de documentos opcionales seleccionados */
  @Output() hayDocumentosOpcionalesChange = new EventEmitter<boolean>();

  /** Referencia al componente de carga de documentos */
  @ViewChild(CargaDocumentoComponent) cargaDocumentoComponent!: CargaDocumentoComponent;

  /** Estado del botón según la validación del componente hijo */
  private estadoBotonComponenteHijo: boolean = false;

  /** Indica si hay documentos opcionales seleccionados actualmente */
  private hayDocumentosOpcionalesSeleccionados: boolean = false;

  /** Texto de instrucciones para la carga de documentos. */
  protected readonly INSTRUCCIONES_CARGA_ADJUNTAR = INSTRUCCIONES_CARGA_ADJUNTAR;

  /**
   * Constructor del componente.
   * @param tramiteQuery Query para obtener el estado del trámite
   * @param documentosQuery Query para monitorear documentos opcionales seleccionados
   */
  constructor(private tramiteQuery: Tramite32507Query, private documentosQuery: DocumentosQuery) {
    // Constructor vacío
  }

  /**
   * Método de inicialización del componente.
   * Se llama automáticamente cuando el componente es cargado.
   * @returns void
   */
  ngOnInit(): void {
    this.obtenerDatosDelStore();
    this.monitorearDocumentosOpcionales();
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
    this.tramiteQuery.selectSolicitud$.pipe(takeUntil(this.destroy$)).subscribe((tramiteState: Tramite32507State) => {
      this.idSolicitud = tramiteState.avisoFormulario.idSolicitud || '';
      this.datosUsuario = this.construirDatosUsuario(tramiteState);
    });
  }

  /**
   * Construye el objeto Usuario requerido para la carga de documentos
   * @param tramiteState Estado actual del trámite
   * @returns Usuario con los datos necesarios
   */
  private construirDatosUsuario(tramiteState: Tramite32507State): Usuario {
    return {
      persona: {
        claveUsuario: tramiteState.datosSolicitante.rfc,
        rfc: tramiteState.datosSolicitante.rfc,
        nombre: tramiteState.datosSolicitante.denominacion,
        apellidoPaterno: '',
        apellidoMaterno: '',
      },
      firmaElectronica: {
        cadenaOriginal: '',
        certificado: '',
        firma: '',
      },
      rolActual: 'PersonaMoral',
      rfcSolicitante: tramiteState.datosSolicitante.rfc,
      idSolicitud: Number(tramiteState.avisoFormulario.idSolicitud) || 0,
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
   * Aplica lógica personalizada para documentos opcionales.
   * @param activar Indica si se debe activar el botón según el componente hijo
   */
  onActivarBotonCarga(activar: boolean): void {
    // Guardar el estado del componente hijo
    this.estadoBotonComponenteHijo = activar;

    // Aplicar lógica personalizada
    this.evaluarEstadoBoton();
  }

  /**
   * Monitorea cambios en documentos opcionales seleccionados
   * y re-evalúa el estado del botón
   */
  private monitorearDocumentosOpcionales(): void {
    this.documentosQuery.selectDocumentoState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      // Actualizar el estado de si hay documentos opcionales seleccionados
      this.hayDocumentosOpcionalesSeleccionados =
        state.catalogoDocumentosRequeridos && state.catalogoDocumentosRequeridos.length > 0;

      // Notificar al padre sobre el cambio en documentos opcionales
      this.hayDocumentosOpcionalesChange.emit(this.hayDocumentosOpcionalesSeleccionados);

      // Re-evaluar el estado del botón cuando cambian los documentos opcionales
      this.evaluarEstadoBoton();
    });
  }

  /**
   * Evalúa si el botón "Cargar archivos" debe estar habilitado.
   * Delega la validación completamente al componente hijo (CargaDocumentoComponent).
   */
  private evaluarEstadoBoton(): void {
    // Siempre emitir el estado del componente hijo
    // El componente hijo (CargaDocumentoComponent) maneja la validación correctamente
    this.activarBotonCargaArchivos.emit(this.estadoBotonComponenteHijo);
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
