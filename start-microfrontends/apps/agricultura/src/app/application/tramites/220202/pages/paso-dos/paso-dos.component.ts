import {
  AlertComponent,
  CargaDocumentoComponent,
  TituloComponent,
  Usuario,
} from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { RegistroSolicitudService } from '../../services/220202/registro-solicitud/registro-solicitud.service';
import { SolicitudService } from '../../services/220202/registro-solicitud/solicitud.service';
import { TEXTOS_REQUISITOS } from '../../constantes/220202/fitosanitario.enums';

/**
 * Componente para mostrar el subtítulo del asistente.
 * @component PasoDosComponent
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrls ./paso-dos.component.scss
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
  standalone: true,
  imports: [CargaDocumentoComponent, AlertComponent, TituloComponent],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Objeto con los textos de los requisitos.
   * @property {object} TEXTOS_REQUISITOS - Textos para los requisitos del certificado zoosanitario. --220201
   */
  TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @description Subject utilizado para destruir las suscripciones y evitar fugas de memoria cuando el componente se destruye.
   * @type {Subject<void>}
   */
  public destroyNotifier$ = new Subject<void>();

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

  constructor(
    private registroSolicitudService: RegistroSolicitudService,
    private solicitudService: SolicitudService
  ) {}

  /**
   * @description Inicializa el componente.
   * Este método se llama automáticamente después de que se crea el componente.
   * Llama a otros métodos para obtener los datos iniciales que se mostrarán en el formulario y la tabla.
   * @method ngOnInit
   * @returns {void}
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
   * @description Destruye la suscripción cuando el componente es destruido.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
