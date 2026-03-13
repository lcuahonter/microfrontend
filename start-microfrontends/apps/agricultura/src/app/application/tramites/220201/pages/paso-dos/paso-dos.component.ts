import {
  EventEmitter,
  Input,
} from '@angular/core';

import { AlertComponent, CargaDocumentoComponent, Catalogo, TableData, TipoDocumentos, TituloComponent, Usuario } from '@libs/shared/data-access-user/src';
import { Component, DestroyRef, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constantes/certificado-zoosanitario.enum';

import { SharedFormService } from '../../services/220201/SharedForm.service';
import { SolicitudService } from '../../services/220201/registro-solicitud/solicitud.service';

/**
 * @fileoverview Componente para mostrar el subtítulo y los requisitos del asistente en el paso dos del trámite.
 * Incluye la visualización de textos de ayuda y el componente para anexar documentos.
 * @module PasoDosComponent
 */

/**
 * Componente para mostrar el subtítulo del asistente y los requisitos en el paso dos.
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
  imports: [TituloComponent, AlertComponent, CargaDocumentoComponent]
})
export class PasoDosComponent implements OnInit, OnDestroy {

  /**
   * Objeto con los textos de los requisitos.
   * @property {object} TEXTOS
   * @description Textos para los requisitos del certificado zoosanitario, incluyendo instrucciones y mensajes de ayuda.
   */
  TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Datos de la tabla que contiene los encabezados y el cuerpo de la tabla.
   * @property {Array<any>} tableHeader - Encabezados de la tabla.
   * @property {Array<any>} tableBody - Cuerpo de la tabla.
   */
  tableData: TableData = {
    /**
     * Encabezados de la tabla.
     */
    tableHeader: [],
    /**
     * Cuerpo de la tabla.
     */
    tableBody: [],
  };
  private destroyNotifier$ = new Subject<void>();
  /**
   * Array para almacenar los documentos del catálogo.
   * Cada documento es de tipo `Catalogo`, representando un ítem en el catálogo.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Array para almacenar los documentos opcionales del catálogo.
   * Cada documento es de tipo `TipoDocumentos`, representando un documento opcional en el catálogo.
   */
  catalogoDocumentosOpcionales: TipoDocumentos[] = [];

  /**
   * Referencia inyectada para manejar la destrucción del componente.
   * Utiliza el servicio `DestroyRef` para ejecutar lógica de limpieza cuando el componente se destruye.
   * 
   * @private
   */
  private destroyRef$ = inject(DestroyRef);

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

  /**
   * Indica si la carga de documentos está en progreso.
   * Se utiliza para mostrar el estado de carga en la interfaz.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Evento que se emite cuando el estado de carga en progreso cambia.
   * 
   * @remarks
   * Utilice este evento para notificar a componentes padres sobre el inicio o fin de una operación de carga.
   * 
   * @param {boolean} cargaEnProgreso - Indica si la carga está en progreso (`true`) o ha finalizado (`false`).
   */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Evento que se emite cuando se requiere reenviar o regresar a la sección correspondiente.
   * No emite ningún valor, solo indica la acción.
   */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

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
     * Constructor de la clase PasoDosComponent.
     * 
     * @param catalogosServices - Servicio para manejar los catálogos.
     */
  constructor(
    private sharedService: SharedFormService,
    private solicitudService: SolicitudService
  ) {
    // Si es necesario, se puede agregar aquí la lógica de inicialización
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta una vez que el componente ha sido inicializado.
   * Aquí se llama al método `getTiposDocumentos` para cargar los datos necesarios al iniciar el componente.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.getListaDocumentoOpcionales();

    // Suscripción para detectar si los datos han sido prellenados
    this.sharedService.dataDocumentos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        if (data !== null) {
          this.esPrellenado = data;
          this.solicitudService.idSolicitud$.subscribe(id => {
            this.idSolicitud = id;
          }) as unknown as string;
        }
      });
  }


  // eslint-disable-next-line class-methods-use-this, no-empty-function
  /**
   * Obtiene la lista de documentos opcionales.
   *
   * Suscribe al observable `cargaArchivosEvento` hasta que se emite `destroyNotifier$`.
   * Cuando se dispara el evento, emite el evento `reenviarEvento`.
   *
   * @remarks
   * Este método se utiliza para manejar la lógica relacionada con la carga de archivos opcionales
   * y reenviar el evento correspondiente en el flujo del componente.
   */
  getListaDocumentoOpcionales(): void {
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();
  }

  /**
   * Maneja el evento cuando los documentos han sido cargados.
   * Actualiza el estado de cargaRealizada y emite el evento correspondiente para notificar a otros componentes.
   * @param cargaRealizada Indica si la carga de documentos se realizó correctamente.
   */
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
   * Maneja el evento de carga de documentos.
   * 
   * Emite el evento `reenviarEventoCarga` indicando si existen documentos para cargar.
   *
   * @param existenDocumentosParaCargar - Indica si hay documentos disponibles para cargar.
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
    * 
    * @memberof PasoDosComponent
    */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}