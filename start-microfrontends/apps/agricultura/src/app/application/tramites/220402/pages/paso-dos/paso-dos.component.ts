import {AlertComponent,CargaDocumentoComponent, Catalogo, CatalogosService,TituloComponent, Usuario } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { TEXTOS_REQUISITOS } from '../../constantes/certificado-zoosanitario.enum';
/**
 * Componente para mostrar el subtítulo del asistente.
 * @component PasoDosComponent
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrls ./paso-dos.component.scss
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, CargaDocumentoComponent, TituloComponent, AlertComponent],
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
})
export class PasoDosComponent implements OnInit, OnDestroy {

  /**
   * Evento que se recibe desde el componente padre para iniciar la carga de archivos.
   */
  @Input() cargaArchivosEvento!: EventEmitter<void>;
  /**
   * Objeto con los textos de los requisitos.
   * @property {object} TEXTOS_REQUISITOS - Textos para los requisitos del certificado zoosanitario. --220201
   */
  TEXTOS = TEXTOS_REQUISITOS;

  /**
  * Indica si la carga de documentos se realizó correctamente.
  * @type {boolean}
  */
  cargaRealizada = false;
  /**
   * Catálogo de documentos disponibles.
   * 
   * Contiene los documentos obtenidos desde el servicio de catálogos.
   */
  catalogoDocumentos: Catalogo[] = [];
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * 
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  private destroy$: Subject<void> = new Subject<void>();
  /**
   * Propaga al componente <anexar-documentos> el evento para disparar el metodo confirmUpload en <anexar-documentos>.
   */
  @Output() reenviarEvento = new EventEmitter<void>();
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>()
    /** Emite un boleano sobre la carga del archivo */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();
   @Input() idTipoTRamite!: string;
     @Input() datosUsuario!: Usuario;
  @Input() idSolicitud!: string;
      /**
 * Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
 * Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
 */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();
    
  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

     /**
   * Evento que se emite para indicar si la carga de documentos se ha realizado.
   * Este evento se utiliza para notificar a otros componentes que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();
  /**
   * Constructor del componente.
   * 
   * @param {CatalogosService} catalogosServices - Servicio para obtener los catálogos de documentos.
   */
  constructor(public catalogosServices: CatalogosService) {
    // Constructor vacío
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método llama a `getTiposDocumentos` para obtener los tipos de documentos disponibles.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
    if (this.cargaArchivosEvento) {
      this.cargaArchivosEvento
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.reenviarEvento.emit();
        });
    }
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

  /**
   * Obtiene los tipos de documentos desde el servicio de catálogos.
   * 
   * Este método realiza una solicitud al servicio de catálogos para obtener
   * los documentos disponibles y los almacena en `catalogoDocumentos`.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.catalogoDocumentos = resp;
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método completa el `Subject` `destroy$` para cancelar todas las suscripciones activas
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}