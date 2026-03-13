import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Notificacion, TEXTOS, Usuario } from '@ng-mf/data-access-user';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Componente que representa el paso dos del proceso de solicitud de documentos.
 */
@Component({
  selector: 'paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})

/**
 * Clase que representa el componente PasoDosComponent.
 * Este componente se encarga de gestionar la carga de documentos en el segundo paso del proceso de
 */
export class PasoDosComponent implements OnInit {
  /**
 * Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
 * @type {EventEmitter<void>}
 */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
   * 
   * ID de la solicitud actual.
   */
  @Input() idSolicitud!: string;

  /**
   * Identificador del trámite.
   */
  @Input() idTipoTRamite!: string;
  
    /**
   * Servicio para gestionar los catálogos.
   */
  @Input() datosUsuario!: Usuario;

  /**
   * Escucha el evento para regresar a la sección de cargar documentos que se emite desde <solicitud-page>.
   * @type {EventEmitter<void>}
   */
  @Input() regresarSeccionCargarDocumentoEvento!: EventEmitter<void>;

  /**
   * Propaga al componente <anexar-documentos> el evento para disparar el metodo confirmUpload en <anexar-documentos>.
   */
  @Output() reenviarEvento = new EventEmitter<void>();

  /**
   * Propaga al componente <anexar-documentos> el evento para disparar el metodo mostrarSeccionCargaArchivosAccion() en <anexar-documentos>.
   * Este evento se utiliza para regresar a la sección de carga de documentos.
   */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

  /**
   * Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
   * Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
   */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  /**
   * Evento que se emite para indicar si la carga de documentos se realizó correctamente.
   * Este evento se utiliza para habilitar o deshabilitar el botón de "Continuar"  en <solicitud-page>.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
   * Referencia inyectada para gestionar la destrucción del componente y terminar las suscripciones.
   * @type {DestroyRef}
   */
  private destroyRef = inject(DestroyRef);

  /**
   * Texto de instrucciones para el usuario que se mostraran el alert.
   * @type {string}
   */
  TEXTOS = TEXTOS;

  /**
   * Indica si la carga de documentos se realizó correctamente.
   * @type {boolean}
   */
  cargaRealizada = false;

  /**
   * Inicializa la variable de alertaNotificación con un objeto de tipo Notificacion.
   * @type {Notificacion}
   */
  public alertaNotificacion: Notificacion = {

  tipoNotificacion: 'banner',
  categoria: 'success',
  modo: 'action',
  titulo: '',
  mensaje: TEXTOS.INSTRUCCIONES,
  cerrar: true,
  txtBtnAceptar: '',
  txtBtnCancelar: '',

  };

  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

  /** Emite un boleano sobre la carga del archivo */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Inicializa el componente PasoDosComponent.
   * Se suscribe a los eventos de carga de archivos y regreso a la sección de carga
   */
  ngOnInit(): void {
    this.cargaArchivosEvento
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();

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
 * Maneja el evento de carga en progreso emitido por un componente hijo.
 * Actualiza el estado de cargaEnProgreso según el valor recibido.
 * @param carga Valor booleano que indica si la carga está en progreso.
 */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
  }

  /**
   * Maneja el evento de carga de documentos y emite un evento con el estado.
   * @param existenDocumentosParaCargar - Indica si hay documentos para cargar.
   * @returns void
   */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }
}
