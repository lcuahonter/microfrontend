import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  AlertComponent, CargaDocumentoComponent,
  Catalogo,
  CatalogosService,
  TEXTOS, TituloComponent,
  Usuario,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { SolicitudService } from '../../services/220203/registro-solicitud/solicitud.service';

/**
 * Componente para manejar el paso dos en el proceso de importación de acuicultura.
 * Este componente permite seleccionar los tipos de documentos necesarios para el trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
  standalone: true,
  imports: [
    TituloComponent,
    AlertComponent,
    CargaDocumentoComponent,
    TituloComponent,
  ],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Texto utilizado en el componente.
   * @type {typeof TEXTOS}
   */
  TEXTOS = TEXTOS;

  /**
   * Tipo de alerta utilizada.
   * @type {string}
   */
  infoAlert = 'alert-info';

  /**
   * Lista de documentos disponibles para seleccionar.
   * @type {Catalogo[]}
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos seleccionados por el usuario.
   * @type {Catalogo[]}
   */
  documentosSeleccionados: Catalogo[] = [];

  private destroyNotifier$ = new Subject<void>();

  /**
   * Id del tipo de trámite actual.
   */
  @Input() idTipoTRamite!: string;
  /**
   * Id de la solicitud actual.
   */
  @Input() idSolicitud!: string;
  /**
   * Servicio para gestionar los catálogos.
   */
  @Input() datosUsuario!: Usuario;
  /**
   * Evento que se emite para reenviar la solicitud de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
   */
  reenviarEvento = new EventEmitter<void>();
  /**
   * Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
   * @type {EventEmitter<void>}
   */
  @Input() cargaArchivosEvento!: EventEmitter<void>;
  /**
   * Indica si la carga de documentos se realizó correctamente.
   * @type {boolean}
   */
  cargaRealizada = false;
  /**
   * Evento que se emite para indicar si la carga de documentos se ha realizado.
   * Este evento se utiliza para notificar a otros componentes que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
   * Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
   * Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
   */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();
  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;
  /** Emite un boleano sobre la carga del archivo */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Indica si el formulario o los datos han sido prellenados automáticamente.
   *
   * @type {boolean}
   * @default false
   *
   * @remarks
   * Cuando es `true`, indica que los datos se cargaron previamente desde una fuente externa.
   * Cuando es `false`, indica que el usuario debe ingresar los datos manualmente.
   */
  esPrellenado: boolean = false;

  /**
   * Constructor que inyecta el servicio de catalogos.
   * @param {CatalogosService} catalogosServices Servicio para obtener los catalogos.
   */
  constructor(
    private readonly catalogosServices: CatalogosService,
    private solicitudService: SolicitudService
  ) {
    // El constructor está vacío intencionalmente ya que solo se inyectan servicios.
  }

  /**
   * Método de inicialización del componente.
   * Carga los tipos de documentos disponibles para el trámite.
   */
  ngOnInit(): void {
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();

    this.solicitudService.esPrellenado$.subscribe((esPrellenado) => {
      this.esPrellenado = esPrellenado;
    });
    this.solicitudService.idSolicitud$.subscribe((idSolicitud) => {
      this.idSolicitud = idSolicitud;
    })
  }

  /**
   * Actualiza el estado de carga de documentos y emite un evento con el nuevo valor.
   * @param cargaRealizada Indica si la carga de documentos se realizó correctamente.
   * @returns void
   */
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
   * Maneja el evento de carga de documentos y emite un evento con el estado.
   * @param existenDocumentosParaCargar - Indica si hay documentos para cargar.
   * @returns void
   */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }

  /**
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   * Actualiza el estado de cargaEnProgreso según el valor recibido.
   * @param carga Valor booleano que indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia las suscripciones y recursos del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
