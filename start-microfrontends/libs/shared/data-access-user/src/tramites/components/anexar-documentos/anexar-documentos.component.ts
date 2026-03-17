import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {
  ESTATUS_CARGA_DOCUMENTO,
  MENSAJES_DOCUMENTOS,
  MENSAJES_MODAL,
  UNIDADES_DOCUMENTOS,
} from '../../../core/enums/mensajes-documentos.enum';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';

import { CatalogoDocumento } from '../../../core/models/shared/catalogos.model';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { SubirDocumentoService } from '../../../core/services/shared/subir-documento/subir-documento.service';

import {
  DocumentosState,
  DocumentosStore,
} from '../../../core/estados/documentos.store';
import { DocumentosQuery } from '../../../core/queries/documentos.query';

import {
  Notificacion,
  NotificacionesComponent,
} from '../notificaciones/notificaciones.component';
import { DocumentosParaCargar } from '../../../core/models/shared/anexar-documentos.model';

@Component({
  selector: 'anexar-documentos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NotificacionesComponent,
  ],
  templateUrl: './anexar-documentos.component.html',
  styleUrl: './anexar-documentos.component.scss',
})
export class AnexarDocumentosComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * @description Catalogo de documentos obligatorios.
   * @type {CatalogoDocumento[]}
   */
  @Input() catalogoDocumentos: CatalogoDocumento[] = [];

  /**
   * @description Catalogo de documentos opcionales.
   * @type {CatalogoDocumento[]}
   */
  @Input() catalogoDocumentosOpcionales: CatalogoDocumento[] = [];

  /**
   * @description Evento para cargar archivos.
   * @type {EventEmitter<void>}
   */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
   * @description Evento para regresar a la sección de carga de documentos.
   * @type {EventEmitter<void>}
   */
  @Input() regresarSeccionCargarDocumentoEvento!: EventEmitter<void>;

  /**
   * @description Evento para indicar que la carga de documentos se ha realizado.
   * @type {EventEmitter<boolean>}
   */
  @Output() cargaRealizada = new EventEmitter<boolean>();

  /**
   * @description Evento para activar el botón de carga de archivos.
   * @type {EventEmitter<boolean>}
   */
  @Output() activarBotonCargaArchivos = new EventEmitter<boolean>();

  /**
   * @description Lista de referencias a los elementos del DOM con la etiqueta 'fileInput'.
   * Utilizada para gestionar múltiples inputs de archivo en el componente.
   * @type {QueryList<ElementRef>}
   */
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  /**
   * @description Constantes para la unidad del tamaño de los archivos.
   * @type {string}
   */
  readonly MB = UNIDADES_DOCUMENTOS.MB;

  /**
   * @description Constantes para la unidad de DPI.
   * @type {string}
   */
  readonly DPI = UNIDADES_DOCUMENTOS.DPI;

  /**
   * @description Estatus de la carga del documento
   * @type {string}
   */

  readonly ESTATUS_CARGA_DOCUMENTO = ESTATUS_CARGA_DOCUMENTO;

  /**
   * @description Objeto para almacenar el documento seleccionado.
   * @type {CatalogoDocumento}
   */
  documentoSeleccionado!: CatalogoDocumento;

  /**
   * @description VAriable para almacenar el token de autenticación.
   * @type {string}
   */
  token!: string;

  /**
   * @description Arreglo para almacenar los documentos opcionales agregados.
   * @type {number[]}
   */
  listDocOpcionalesAgregar: number[] = [];

  /**
   * @description Arreglo para almacenar los documentos para cargar.
   * @type {DocumentosParaCargar[]}
   */
  listadoArchivos: DocumentosParaCargar[] = [];

  /**
   * @description Arreglo para almacenar los documentos opcionales duplicados.
   */
  documentosOpcionalesSeleccionados: CatalogoDocumento[] = [];

  /**
   * @description Variable para almacenar el estado de la carga de documentos.
   * @type {boolean}
   */
  cargarDocumentos = false;

  /**
   * @description Objeto para almacenar los archivos que se están cargando.
   * @type {any}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  archivosCargando: any = {
    obligatorios: [],
    opcionales: [],
  };

  /**
   * @description Variable para controlar la visibilidad de la sección de carga de archivos.
   * @type {boolean}
   */
  mostrarSeccionCargaArchivos: boolean = true;

  /**
   * @description Notificador utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject<void>();

  /**
   * @description Estado de los documentos.
   * @type {DocumentosState}
   */
  private documentosState!: DocumentosState;

  public nuevaNotificacion!: Notificacion;

  constructor(
    private documentosQuery: DocumentosQuery,
    private documentosStore: DocumentosStore,
    private subirDocumentoService: SubirDocumentoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.cargaArchivosEvento) {
      this.cargaArchivosEvento
        ?.pipe(
          takeUntil(this.destroyNotifier$),
          map(() => this.confirmUpload())
        )
        .subscribe();
    }

    if (this.regresarSeccionCargarDocumentoEvento) {
      this.regresarSeccionCargarDocumentoEvento
        .pipe(
          takeUntil(this.destroyNotifier$),
          map(() => this.mostrarSeccionCargaArchivosAccion())
        )
        .subscribe();
    }
  }

  /**
   * Maneja la carga de un documento.
   * @param {Event} event - El evento de carga del archivo.
   * @param fileInput file proveniente del input
   * @param id del catalog de documentos a cargar
   * @param tipo de documento que se está agregando obligatorio u opcional
   */
  cargarDoc(
    event: Event,
    fileInput: HTMLInputElement,
    id: number,
    tipo: string
  ): void {
    const ARCHIVO = event.target as HTMLInputElement;
    const INFORMACION_ARCHIVO = (ARCHIVO.files as FileList)[0];

    if (INFORMACION_ARCHIVO) {
      const EXTENSION_ARCHIVO = INFORMACION_ARCHIVO.name
        .split('.')
        .pop()
        ?.toLowerCase();
      if (EXTENSION_ARCHIVO !== UNIDADES_DOCUMENTOS.PDF.toLowerCase()) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          modo: '',
          titulo: '',
          mensaje: MENSAJES_DOCUMENTOS.ONL_YPDF,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
        fileInput.value = '';
        return;
      }

      /**  Buscar el documento principal por el ID base */
      let DOCUMENTO = this.catalogoDocumentos.find((DOC) => DOC.id === id);

      if (!DOCUMENTO) {
        /** Si no existe, buscar si es un hijo (adicional) de algún documento principal */
        for (const DOC of this.catalogoDocumentos) {
          if (DOC.adicionales) {
        const ADICIONAL = DOC.adicionales.find((AD) => AD.id === id);
        if (ADICIONAL) {
          DOCUMENTO = ADICIONAL;
          break;
        }
          }
        }
      }

      /** Si aún no existe, agregarlo como hijo del primer documento principal */
      if (!DOCUMENTO) {
        const PRINCIPAL = this.catalogoDocumentos[0];
        if (PRINCIPAL) {
          const NUEVO_ADICIONAL: CatalogoDocumento = {
        id,
        descripcion: '',
        tam: PRINCIPAL.tam,
        dpi: PRINCIPAL.dpi,
        nuevo: true,
        uniqueId: crypto.randomUUID(),
          };
          PRINCIPAL.adicionales = PRINCIPAL.adicionales || [];
          PRINCIPAL.adicionales.push(NUEVO_ADICIONAL);
          DOCUMENTO = NUEVO_ADICIONAL;
        }
      }

      this.documentoSeleccionado = DOCUMENTO as CatalogoDocumento;
      const TAMANIO_REQUERIDO: number =
        AnexarDocumentosComponent.convertirKbaBytes(
          this.documentoSeleccionado.tam
        );
      const TAMANIO_ARCHIVO: number = INFORMACION_ARCHIVO.size;

      if (TAMANIO_ARCHIVO > TAMANIO_REQUERIDO) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          modo: '',
          titulo: '',
          mensaje: MENSAJES_DOCUMENTOS.MAX_SIZE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
        fileInput.value = '';
        return;
      }
      this.listadoArchivos.push({
        name: INFORMACION_ARCHIVO.name,
        id,
        archivo: INFORMACION_ARCHIVO,
        ruta: URL.createObjectURL(INFORMACION_ARCHIVO),
        cargado: false,
        tipo,
        mensaje: '',
        estatus: 'Pendiente',
      });

      const ARCHIVOS_PARA_CARGAR = this.listadoArchivos.some(
        (item) => item.archivo !== undefined && item.archivo !== null
      );

      this.activarBotonCargaArchivos.emit(ARCHIVOS_PARA_CARGAR);

      /** Disparar la detección de cambios para actualizar la visualización del nombre de archivo */
      this.cdr.detectChanges();
    }
  }

  /**
   * Verifica si un archivo ya existe en la lista de archivos cargados.
   * @param {number} id - El ID del archivo a verificar.
   * @returns {boolean} `true` si el archivo ya existe, de lo contrario `false`.
   */
  existePreview(id: number): boolean {
    const ENCONTRADO = this.listadoArchivos.find((f) => f.id === id);
    return ENCONTRADO !== undefined;
  }

  /**
   * Obtiene el nombre del archivo cargado para mostrar en la interfaz.
   * @param {number} id - El ID del archivo.
   * @returns {string} El nombre del archivo o texto por defecto.
   */
  obtenerNombreArchivo(id: number): string {
    const ENCONTRADO = this.listadoArchivos.find((f) => f.id === id);
    return ENCONTRADO ? ENCONTRADO.name : 'No hay archivo seleccionado';
  }

  /**
   * Sube un archivo al servidor.
   * @param {any} informacionArchivo - Información del archivo a subir.
   * @returns {Promise<any>} Promesa que se resuelve cuando la carga se completa.
   */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  uploadFiles(informacionArchivo: any): Promise<any> {
    return new Promise((resolve) => {
      this.subirDocumentoService
        .subirDocumento(this.token, informacionArchivo)
        .pipe(
          takeUntil(this.destroyNotifier$),
          map(() => ({ cargado: true, mensaje: 'Correcto', estatus: 'OK' })),
          catchError(() =>
            of({
              cargado: false,
              mensaje: 'Error al cargar',
              estatus: 'Error al cargar',
            })
          )
        )
        .subscribe(resolve);
    });
  }

  /**
   * Convierte kilobytes a megabytes.
   * @param {number} kilobytes - El tamaño en kilobytes.
   * @returns {number} El tamaño en megabytes.
   */
  // eslint-disable-next-line class-methods-use-this
  convertirKilobytesAMegabytes(kilobytes: number): number {
    return Math.round(kilobytes / 1024);
  }

  /**
   * Abre un archivo PDF en una nueva pestaña del navegador.
   * @returns {void}
   * @param id
   */
  verPdf(id: number): void {
    const RUTA = this.listadoArchivos.find((f) => f.id === id)?.ruta;
    this.limpiarNotificacion();
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'pdf',
      titulo: 'Vista previa documento',
      mensaje: RUTA ? RUTA.toString() : '',
      cerrar: false,
      txtBtnAceptar: 'Cargar archivos',
      txtBtnCancelar: 'Cerrar',
      tamanioModal: 'modal-lg',
    };
  }

  /**
   * Abre el modal para confirmar la carga de documentos
   */
  confirmUpload(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'html',
      titulo: 'Carga de archivos',
      mensaje: MENSAJES_MODAL.INFORMACION_SUBIR_DOCUMENTOS,
      cerrar: false,
      txtBtnAceptar: 'Cargar archivos',
      txtBtnCancelar: 'Cerrar',
      tamanioModal: 'modal-lg',
    };
  }

  confirmarCargaArchivos(acepta: boolean): void {
    if (acepta) {
      this.cargarDocumentos = true;
      this.mostrarSeccionCargaArchivos = false;
      this.archivosCargando.obligatorios = this.listadoArchivos.filter(
        (f) => f.tipo === 'obligatorio'
      );
      this.archivosCargando.opcionales = this.listadoArchivos.filter(
        (f) => f.tipo === 'opcional'
      );
      this.cargarArchivos(this.archivosCargando.obligatorios);
      this.cargarArchivos(this.archivosCargando.opcionales);
      this.cargaRealizada.emit(this.cargarDocumentos);
    }
  }

  /**
   * Limpia el archivo seleccionado y lo elimina de la lista de archivos.
   * @param {CatalogoDocumento} item - El documento a limpiar.
   * @param {string} tipo - El tipo de documento (obligatorio u opcional).
   * @returns {void}
   */
  limpiarFile(item: CatalogoDocumento, tipo: string): void {
    let FILE_INPUT: HTMLInputElement | null = null;
    if (tipo === 'obligatorios') {
      FILE_INPUT = document.getElementById(
        `formFile${item.id}`
      ) as HTMLInputElement;
    } else if (tipo === 'opcionales') {
      FILE_INPUT = document.getElementById(
        `formFileOpcionales${item.id}`
      ) as HTMLInputElement;
    }

    if (FILE_INPUT) {
      FILE_INPUT.value = ''; // Limpia el archivo seleccionado
    }

    const INDEX_ARCHIVO: number = this.listadoArchivos.findIndex(
      (f) => f.id === item.id
    );
    if (INDEX_ARCHIVO !== -1) {
      this.listadoArchivos.splice(INDEX_ARCHIVO, 1);
    }

    const ARCHIVOS_PARA_CARGAR = this.listadoArchivos.some(
      (item) => item.archivo !== undefined && item.archivo !== null
    );

    this.activarBotonCargaArchivos.emit(ARCHIVOS_PARA_CARGAR);
    
    // Trigger change detection to update filename display
    this.cdr.detectChanges();
  }

  /**
   * Agrega una parte adicional a un documento.
   * @param {CatalogoDocumento} item - El documento al que se le agregará la parte.
   * @param {string} origen - El origen del documento (obligatorios u opcionales).
   * @returns {void}
   */
  agregarParte(item: CatalogoDocumento, origen: string): void {
    if (origen === 'obligatorios') {
      const INDICE: number = this.catalogoDocumentos.findIndex(
        (doc) => doc.id === item.id
      );
      if (INDICE !== -1) {
        const NUEVO_ID: number =
          (this.catalogoDocumentos[INDICE]?.adicionales?.length ?? 0) + 1;
        const PARTE_DOCUMENTO: CatalogoDocumento = {
          id: parseInt(`${item.id}0${NUEVO_ID}`, 10),
          descripcion: item.descripcion,
          tam: item.tam,
          dpi: item.dpi,
          nuevo: true,
          uniqueId: crypto.randomUUID(),
        };
        this.catalogoDocumentos[INDICE].adicionales?.push(PARTE_DOCUMENTO);
      }
    } else {
      const INDICE: number = this.documentosOpcionalesSeleccionados.findIndex(
        (doc) => doc.id === item.id
      );
      if (INDICE !== -1) {
        const NUEVO_ID: number =
          (this.documentosOpcionalesSeleccionados[INDICE]?.adicionales
            ?.length ?? 0) + 1;
        const PARTE_DOCUMENTO: CatalogoDocumento = {
          id: parseInt(`${item.id}0${NUEVO_ID}`, 10),
          descripcion: item.descripcion,
          tam: item.tam,
          dpi: item.dpi,
          nuevo: true,
          uniqueId: crypto.randomUUID(),
        };
        this.documentosOpcionalesSeleccionados[INDICE].adicionales?.push(
          PARTE_DOCUMENTO
        );
      }
    }
  }

  /**
   * Convierte un tamaño en kilobytes a megabytes.
   * @param {string | undefined} size - El tamaño en kilobytes como cadena o indefinido.
   * @returns {string} El tamaño convertido a megabytes como cadena.
   */
  // eslint-disable-next-line class-methods-use-this
  convertKbToMb(size: string | undefined): string {
    if (size === undefined) {
      return '0';
    }
    return String((parseInt(size, 10) / 1000).toFixed(2));
  }

  static convertirKbaBytes(size: string | undefined): number {
    if (size === undefined) {
      return 0;
    }
    return parseInt(size, 10) * 1000;
  }

  /**
   * Agrega documentos opcionales a la lista de documentos opcionales.
   * @returns {void}
   * @description Esta función recorre la lista de documentos opcionales a agregar y verifica si ya existen en la lista de documentos opcionales.
   */
  agregarOpcionales(): void {
    this.listDocOpcionalesAgregar.forEach((doc: number) => {
      const INDICE = this.documentosOpcionalesSeleccionados.findIndex(
        (f: CatalogoDocumento) => f.id === doc
      );
      if (INDICE === -1) {
        const OPCIONAL = this.catalogoDocumentosOpcionales.find(
          (f) => f.id === doc
        ) as CatalogoDocumento;

        this.documentosOpcionalesSeleccionados.push(OPCIONAL);
        const INDICE_OPCIONAL = this.catalogoDocumentosOpcionales.findIndex(
          (f) => f.id === doc
        );
        if (INDICE_OPCIONAL !== -1) {
          this.catalogoDocumentosOpcionales[INDICE_OPCIONAL] = {
            ...this.catalogoDocumentosOpcionales[INDICE_OPCIONAL],
          };
        }
      }
    });

    this.listDocOpcionalesAgregar = [];
  }

  /**
   * Carga los archivos seleccionados.
   * @param {any[]} archivosCargando - Lista de archivos a cargar.
   * @returns {Promise<void>} Promesa que se resuelve cuando la carga se completa.
   */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  async cargarArchivos(archivosCargando: any[]): Promise<void> {
    for (const ARCHIVO of archivosCargando) {
      const DATA = await this.uploadFiles(ARCHIVO.archivo);
      ARCHIVO.mensaje = DATA.mensaje;
      ARCHIVO.cargado = false;
      ARCHIVO.estatus = 'cargado';
    }
  }

  /**
   * Elimina un documento opcional de la lista de documentos opcionales.
   * @param {CatalogoDocumento} item - El documento a eliminar.
   * @returns {void}
   */
  eliminarOpcional(item: CatalogoDocumento): void {
    const INDICE: number = this.documentosOpcionalesSeleccionados.findIndex(
      (f) => f.id === item.id
    );
    if (INDICE !== -1) {
      if (
        this.documentosOpcionalesSeleccionados[INDICE] &&
        this.documentosOpcionalesSeleccionados[INDICE].adicionales
      ) {
        this.documentosOpcionalesSeleccionados[INDICE]?.adicionales?.forEach(
          (adicional: CatalogoDocumento) => {
            const INDICE_LISTADO: number = this.listadoArchivos.findIndex(
              (f) => f.id === adicional.id
            );
            this.listadoArchivos.splice(INDICE_LISTADO, 1);
          }
        );
      }

      const INDICE_LISTADO: number = this.listadoArchivos.findIndex(
        (f) => f.id === item.id
      );
      this.listadoArchivos.splice(INDICE_LISTADO, 1);

      this.documentosOpcionalesSeleccionados.splice(INDICE, 1);
    }
    const INDICE_AGREGAR: number = this.listDocOpcionalesAgregar.findIndex(
      (id) => id === item.id
    );
    if (INDICE_AGREGAR !== -1) {
      this.listDocOpcionalesAgregar.splice(INDICE_AGREGAR, 1);
      this.listDocOpcionalesAgregar = [...this.listDocOpcionalesAgregar];
    }
    this.cdr.detectChanges();

    const ARCHIVOS_PARA_CARGAR = this.listadoArchivos.some(
      (item) => item.archivo !== undefined && item.archivo !== null
    );

    this.activarBotonCargaArchivos.emit(ARCHIVOS_PARA_CARGAR);
  }

  /**
   * Elimina un nuevo documento de la lista de documentos.
   * @param {any} item - El documento a eliminar.
   * @param {boolean} adicional - Indica si el documento es adicional.
   * @returns {void}
   */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  eliminarNuevo(item: any, adicional = false): void {
    if (adicional) {
      const INDICE_ADICIONAL = item.item.adicionales.findIndex(
        (adicional: CatalogoDocumento) => adicional.id === item.adicional.id
      );
      item.item.adicionales.splice(INDICE_ADICIONAL, 1);
      const INDICE: number = this.listadoArchivos.findIndex(
        (f) => f.id === item.id
      );
      this.listadoArchivos.splice(INDICE, 1);

      const ARCHIVOS_PARA_CARGAR = this.listadoArchivos.some(
        (item) => item.archivo !== undefined && item.archivo !== null
      );

      this.activarBotonCargaArchivos.emit(ARCHIVOS_PARA_CARGAR);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['catalogoDocumentos']) {
      this.catalogoDocumentos = this.catalogoDocumentos.map((item) => ({
        ...item,
        adicionales: [],
      }));
    }

    if (changes['catalogoDocumentosOpcionales']) {
      this.catalogoDocumentosOpcionales = this.catalogoDocumentosOpcionales.map(
        (item) => ({
          ...item,
          adicionales: [],
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Muestra la sección de carga de archivos y emite un evento para activar el botón de carga de archivos.
   * @returns {void}
   */
  mostrarSeccionCargaArchivosAccion(): void {
    this.mostrarSeccionCargaArchivos = true;
    const ARCHIVOS_PARA_CARGAR = this.listadoArchivos.some(
      (item) => item.cargado === true
    );

    this.activarBotonCargaArchivos.emit(ARCHIVOS_PARA_CARGAR);
    this.cargaRealizada.emit(false);
  }

  limpiarNotificacion(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: '',
      categoria: '',
      modo: '',
      titulo: '',
      mensaje: '',
      cerrar: false,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
      tamanioModal: '',
    };
  }
}
