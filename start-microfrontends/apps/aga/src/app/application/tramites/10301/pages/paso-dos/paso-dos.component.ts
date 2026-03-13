import {
  AlertComponent,
  CATALOGOS_ID,
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  CatalogosService,
  TEXTOS,
  TituloComponent,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud10301State,
  Tramite10301Store,
} from '../../estados/tramite10301.store';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImportadorExportadorService } from '../../services/importador-exportador.service';
import { Tramite10301Query } from '../../estados/tramite10301.query';
/**
 * Texto de adjuntar para terceros.
 */
const TERCEROS_TEXTO_DE_ALERTA =
  'Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"';
/**
 * Texto de adjuntar para terceros.
 */
const TERCEROS_TEXTO_DE_ADJUNTAR =
  'Para poder adjuntar tu documento, deberá cumplir las siguientes características:<br> <b>&#8226;</b> Debe ser formato PDF que no contenga formularios, objetos OLE incrustrados, código JavaScript, etc.<br><b>&#8226;</b> No debe contener páginas en blanco.';

/**
 * Componente que representa el paso dos del trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
  standalone: true,
  imports: [
    TituloComponent,
    AlertComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Suscripción para obtener los tipos de documentos.
   */
  getTiposDocumentosSubscription!: Subscription;

  /**
   * Suscripciones a observables.
   */
  private subscriptions: Subscription[] = [];

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud10301State;

  /**
   * Suscripción para obtener el tipo de documento.
   */
  getTipoDocumentoSubscription!: Subscription;

  /**
   * Formulario de trámite.
   */
  tramiteForm!: FormGroup;

  /**
   * Suscripción para obtener los documentos.
   */
  getDocumentosSubscription!: Subscription;

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de fechas seleccionadas.
   */

  fechasSeleccionadas: Catalogo[] = [];
  /**
   * Constantes de texto.
   */
  TEXTOS = TEXTOS;

  /**
   * Clase de alerta informativa.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Tipo de documento.
   */
  tipoDocumento!: CatalogosSelect;
  /**
   * Documentos.
   */
  documentos!: CatalogosSelect;

  /**
   * Texto de alerta para terceros.
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;

  /**
   * Texto de adjuntar para terceros.
   */
  TEXTO_DE_ADJUNTAR: string = TERCEROS_TEXTO_DE_ADJUNTAR;

  /**
   * Indica si se está cargando.
   */
  cargando = false;

  /**
   * Progreso de la carga.
   */
  progreso = 0;

  /**
   * Indica si se debe mostrar la tabla de archivos subidos.
   */
  mostrarTablaArchivosSubidos = false;

  /**
   * Indica si el proceso se ha completado.
   */
  procesoCompletado = false;

  /**
   * Tipos de documentos.
   */
  tiposDeDocumentos: string[] = [
    'Traducción de la carta de donación en caso de que se presente en idioma distinto al español.*:',
    'Cuando el donante sea una persona física, documento que acredite que es extranjero.*:',
    'Otro.*:',
    'Carta de donación emitida por el donante a favor del interesado, en la que conste: La descripción detallada de la mercancía objeto de la donación, cantidad, tipo, y en su caso marca, año-modelo y numero de serie.*:',
    'Documento emitido por el SAT que acredite la autorización de donataria para recibir donatives deducibles del impuesto sobre la renta.*:',
  ];

  /**
   * Nombres de los archivos subidos.
   */
  nombresArchivosSubidos: string[] = new Array(
    this.tiposDeDocumentos.length
  ).fill('');

  /**
   * Documentos disponibles.
   */
  disponiblesDocumentos: string[] = ['Document A', 'Document B', 'Document C'];
  /**
   * Documentos seleccionados.
   */
  documentoSeleccion: string[] = new Array(this.tiposDeDocumentos.length).fill(
    ''
  );

  /**
   * Indica si se debe mostrar la tabla.
   */
  mostrarTabla = false;

  /**
   * Tamaños de los archivos.
   */
  tamanosDeArchivos: (number | null)[] = new Array(
    this.tiposDeDocumentos.length
  ).fill(null);

  /**
   * Resoluciones de los archivos.
   */
  resoluciones: string[] = new Array(this.tiposDeDocumentos.length).fill('');
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * @param catalogosServices Servicio de catálogos.
   * @param importarExportar Servicio de importador/exportador.
   * @param store Store del trámite 10301.
   * @param query Consulta del trámite 10301.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param validacionesService Servicio de validaciones de formularios.
 *  @remarks
 *  Este componente se encarga de manejar el paso dos del trámite 10301, que
 *  incluye la gestión de documentos y la validación de formularios.
   */
  constructor(
    public catalogosServices: CatalogosService,
    public importarExportar: ImportadorExportadorService,
    private store: Tramite10301Store,
    private query: Tramite10301Query,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Este método se utiliza para marcar los controles del formulario como tocados. - 10301
   */
  validarDestinatarioFormulario(): void {
    if (this.tramiteForm.invalid) {
      this.tramiteForm.markAllAsTouched();
    }
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
    this.getTipoDocumento();
    this.getDocumentos();

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();
    this.subscriptions.push(
      this.query.selectTipoDocumento$.subscribe((tipoDocumento) => {
        this.tipoDocumento = {
          labelNombre: 'Tipo de documento',
          required: false,
          primerOpcion: 'Seleccion una valor',
          catalogos: tipoDocumento ?? [],
        };
      })
    );
    this.subscriptions.push(
      this.query.selectDocumento$.subscribe((documentos) => {
        this.documentos = {
          labelNombre: '',
          required: true,
          primerOpcion: '-- Adjunta nuevo document',
          catalogos: documentos ?? [],
        };
      })
    );
  }

  /**
   * Obtiene los tipos de documentos.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
            this.documentosSeleccionados = resp;
          } else {
            this.catalogoDocumentos = [];
            this.documentosSeleccionados = [];
          }
        },
        error: () => {
          this.catalogoDocumentos = [];
          this.documentosSeleccionados = [];
        }
      });
  }
  /**
   * Obtiene el tipo de documento.
   */
  getTipoDocumento(): void {
    this.getTipoDocumentoSubscription = this.importarExportar
      .getTipoDocumento()
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.store.setTipoDocumento(RESPONSE);
        }
      });
  }

  /**
   * Obtiene el documento.
   */
  getDocumentos(): void {
    this.getDocumentosSubscription = this.importarExportar
      .getDocumentos()
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.store.setDocumentos(RESPONSE);
        }
      });
  }

  /**
   * Verifica si todos los documentos están seleccionados.
   * @returns Verdadero si todos los documentos están seleccionados, falso en caso contrario.
   */
  todosDocumentos(): boolean {
    return this.documentoSeleccion.every((doc) => doc !== '');
  }

  /**
   * Método para ver un documento seleccionado.
   * @param index Índice del documento seleccionado.
   */
  verDocument(index: number): void {
    if (this.documentoSeleccion[index]) {
      // Lógica para ver el documento seleccionado
    }
  }

  /**
   * Método para manejar el cambio de archivo.
   * @param event Evento de cambio de archivo.
   * @param index Índice del archivo.
   */
  cambioArchivo(event: Event, index: number): void {
    const INPUT = event.target as HTMLInputElement;
    const FILE = INPUT.files && INPUT.files[0];
    if (FILE) {
      const SIZE_MB = FILE.size / (1024 * 1024);
      if (SIZE_MB > 3) {
        INPUT.value = '';
        this.tamanosDeArchivos[index] = null;
        this.resoluciones[index] = '';
        this.nombresArchivosSubidos[index] = '';
        return;
      }
      this.tamanosDeArchivos[index] = parseFloat(SIZE_MB.toFixed(2));
      this.nombresArchivosSubidos[index] = FILE.name;

      const READER = new FileReader();
      READER.onload = (e: ProgressEvent<FileReader>): void => {
        const IMG = new Image();
        IMG.onload = (): void => {
          this.resoluciones[index] = `${IMG.width}x${IMG.height}`;
        };
        IMG.onerror = (): void => {
          this.resoluciones[index] = 'N/A';
        };
        if (e.target && typeof e.target.result === 'string') {
          IMG.src = e.target.result;
        }
      };
      READER.readAsDataURL(FILE);
    }
  }

  /**
   * Método para adjuntar archivos.
   */
  adjuntarArchivos(): void {
    this.cargando = true;
    this.progreso = 0;

    const INTERVAL = setInterval(() => {
      this.progreso += 10;
      if (this.progreso >= 100) {
        this.progreso = 100;
        clearInterval(INTERVAL);
        this.cargando = false;

        this.mostrarTablaArchivosSubidos = true;
      }
    }, 200);
  }

  /**
   * Método para cerrar el proceso.
   */
  cerrarProceso(): void {
    this.mostrarTabla = false;
    this.mostrarTablaArchivosSubidos = false;

    this.procesoCompletado = true;
  }
  /**
   * Verifica si un campo del formulario es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo.
   * @param {string} field - El nombre del campo a verificar.
   * @returns {boolean} - Retorna true si el campo es válido, de lo contrario false.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite10301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /**
   * Obtiene el grupo de formulario de importador/exportador.
   *
   * @returns {FormGroup} - El grupo de formulario de importador/exportador.
   */
  get importadorExportador(): FormGroup {
    return this.tramiteForm.get('importadorExportador') as FormGroup;
  }

  /**
   * Inicializa el formulario de donante y domicilio con los valores del estado de la solicitud.
   */
  donanteDomicilio(): void {
    this.tramiteForm = this.fb.group({
      importadorExportador: this.fb.group({
        tipoDocumento: [
          this.solicitudState?.tipoDocumento,
          [Validators.required],
        ],
        tableCheck: [this.solicitudState?.tableCheck],
        persona: [this.solicitudState?.persona],
        donacion: [this.solicitudState?.donacion],
        otro: [this.solicitudState?.otro],
        documentos: [this.solicitudState?.documentos, [Validators.required]],
      }),
    });
  }
  /**
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    if (this.getTiposDocumentosSubscription) {
      this.getTiposDocumentosSubscription.unsubscribe();
    }
    if (this.getTipoDocumentoSubscription) {
      this.getTipoDocumentoSubscription.unsubscribe();
    }
  }
}
