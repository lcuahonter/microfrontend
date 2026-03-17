import { Catalogo, Usuario } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Subject, map, takeUntil } from 'rxjs';

import { CATALOGOS_ID } from '../../constantes/constantes';

import { CatalogosService } from '@ng-mf/data-access-user';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Componente para gestionar el paso dos del trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: false,
})
export class PasoDosComponent implements OnInit {
     /**
   * Servicio para gestionar los catálogos.
   */
  @Input() datosUsuario!: Usuario;
   @Input() idTipoTRamite!: string;
      @Input() cargaArchivosEvento!: EventEmitter<void>;
         /**
  * Indica si la carga de documentos se realizó correctamente.
  * @type {boolean}
  */
  cargaRealizada = false;
    /**
   * Subject para destruir notificador.
   */
  public destroyed$: Subject<void> = new Subject();
  
       /**
   * ID de la solicitud actual.
   */
  @Input() idSolicitud!: string;
  /**
  /**
   * Evento emitido para reenviar el evento de solicitud de documentos.
   * Este evento se utiliza para notificar al componente padre que se debe reenviar la solicitud
   * de documentos requeridos.
   * @type {EventEmitter<void>}
   */
  @Output() reenviarEvento = new EventEmitter<void>();

  /**
   * Evento emitido para regresar a la sección de cargar documento.
   * Este evento se utiliza para notificar al componente padre que se debe regresar a la sección
   * de cargar documento.
   * @type {EventEmitter<void>}
   */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>()

  /**
 * Constantes de texto utilizadas en el componente.
 */
  TEXTOS = TEXTOS;

  /**
   * Lista de tipos de documentos.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos requeridos.
   */
  documentosSeleccionados: Catalogo[] = [
    {
      id: 1,
      descripcion: 'Documentos que ampare el valor de la mercancía'
    },
    {
      id: 2,
      descripcion: 'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)'
    }
  ];

  /**
   * Constructor del componente.
   * @param catalogosServices Servicio para obtener los catálogos.
   */
  constructor(
    private catalogosServices: CatalogosService,
  ) { 
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
        this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyed$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();


  }

  /**
   * Método para obtener los tipos de documentos.
   */
  getTiposDocumentos(): void {
    this.catalogosServices.getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO).subscribe((resp) => {
      if (resp.length > 0) {
        this.tiposDocumentos = resp;
      }
    })
  }

  /**
   * Método para agregar un documento a la lista de documentos requeridos.
   * @param id Identificador del documento a agregar.
   */
  agregarDocumento(id: number): void {
    this.tiposDocumentos.forEach(el => {
      if (el.id === id) {
        this.documentosSeleccionados.push(el);
      }
    })
  }

  /**
 * Método para eliminar un documento de la lista de documentos seleccionados.
 * @param i Índice del documento a eliminar.
 */
  eliminar(i: number): void {
    this.documentosSeleccionados.splice(i, 1)
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
   /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;
   /** Emite un boleano sobre la carga del archivo */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();
     /**
 * Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
 * Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
 */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();
    /** Emite un boleano sobre la carga del archivo */

     /**
   * Evento que se emite para indicar si la carga de documentos se ha realizado.
   * Este evento se utiliza para notificar a otros componentes que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();
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

}
