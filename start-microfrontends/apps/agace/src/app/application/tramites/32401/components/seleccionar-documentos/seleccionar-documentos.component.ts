import {
  AlertComponent,
  AnexarDocumentosComponent,
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  CatalogosSelect,
  ConsultaioQuery,
  SELECCIONAR_DOCUMENTOS,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Solicitud32401State,
  Tramite32401Store,
} from '../../estados/tramite32401.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AutoridadService } from '../../services/autoridad.service';
import { CommonModule } from '@angular/common';
import { DocumentoAdicional } from '../../models/datos-tramite.model';
import { TIPO_DE_DOCUMENTO } from '../../constantes/constantes32401';
import { Tramite32401Query } from '../../estados/tramite32401.query';

/**
 * Componente para la selección de documentos.
 * Permite obtener y gestionar los tipos de documentos disponibles.
 */
@Component({
  /**
   * Selector utilizado para identificar el componente en el HTML.
   */
  selector: 'app-seleccionar-documentos',
  /**
   * Define el componente como autónomo (standalone).
   */
  standalone: true,
  /**
   * Importa los módulos y componentes necesarios para el funcionamiento.
   * Incluye componentes de alerta, anexar documentos, y títulos.
   */
  imports: [
    AlertComponent,
    CommonModule,
    AnexarDocumentosComponent,
    CatalogoSelectComponent,
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
  ],
  /**
   * Ruta del archivo HTML que define la estructura del componente.
   */
  templateUrl: './seleccionar-documentos.component.html',
  /**
   * Ruta del archivo SCSS que define los estilos del componente.
   */
  styleUrl: './seleccionar-documentos.component.scss',
})
/**
 * Componente para la selección de documentos.
 * Permite obtener y gestionar los tipos de documentos disponibles.
 */
export class SeleccionarDocumentosComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para capturar los requerimientos.
   */
  seleccionaRequerimientoForm!: FormGroup;

  /**
   * Define el tipo de selección que se usará en la tabla.
   * En este caso, se utiliza selección por checkbox.
   *
   * @type {TablaSeleccion}
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Catálogo de tipos de documentos obtenidos desde el backend o un archivo local.
   *
   * Este objeto se llena al llamar al método `getTiposDocumentos()` y se utiliza para poblar listas desplegables u otras interfaces.
   */
  tiposDocumentos: CatalogosSelect = TIPO_DE_DOCUMENTO;

  /**
   * Valor seleccionado desde el input asociado a la selección de documentos.
   *
   * Normalmente representa el ID del tipo de documento seleccionado.
   */
  inputSeleccion: number = 0;

  /** Textos compartidos utilizados en el componente. */
  TEXTOS = SELECCIONAR_DOCUMENTOS;

  /** Clase CSS utilizada para mostrar una alerta informativa. */
  infoAlert = 'alert-info';

  /** Subject utilizado para notificar la destrucción del componente y evitar fugas de memoria. */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Configuración de las columnas para la tabla de documentos adicionales.
   *
   * Define cómo se deben mostrar los encabezados de la tabla y cómo extraer la información de cada fila.
   * En este caso, solo se muestra una columna: "Tipo de documento".
   *
   * @type {ConfiguracionColumna<DocumentoAdicional>[]}
   */
  public encabezadoDeTabla: ConfiguracionColumna<DocumentoAdicional>[] = [
    {
      encabezado: 'Tipo de documento',
      clave: (documento) => documento.tipoDeDocumento,
      orden: 1,
    },
  ];

  /**
   * Lista de documentos adicionales disponibles en el contenedor.
   *
   * Esta propiedad se utiliza para almacenar los documentos que pueden ser seleccionados o manipulados por el usuario.
   *
   * @type {DocumentoAdicional[]}
   */
  datosDelContenedor: DocumentoAdicional[] = [];

  /**
   * Lista de documentos adicionales seleccionados por el usuario.
   *
   * Contiene los documentos que han sido seleccionados para ser agregados, modificados o eliminados.
   *
   * @type {DocumentoAdicional[]}
   */
  selectedDocumentosAdicional: DocumentoAdicional[] = [];

  /** Estado público de la solicitud, sincronizado con el store. */
  solicitudState: Solicitud32401State = {} as Solicitud32401State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * Inicializa los servicios necesarios para gestionar formularios, estado, y catálogos.
   *
   * @param {AutoridadService} autoridadService - Servicio para obtener catálogos y datos relacionados a la autoridad.
   * @param {FormBuilder} fb - Utilidad de Angular para construir formularios reactivos.
   * @param {Tramite32401Store} tramite32401Store - Store encargado de gestionar el estado del trámite 32401.
   * @param {Tramite32401Query} tramite32401Query - Query para consultar el estado del trámite 32401.
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder a datos globales del usuario o solicitud.
   */
  constructor(
    public autoridadService: AutoridadService,
    public fb: FormBuilder,
    public tramite32401Store: Tramite32401Store,
    public tramite32401Query: Tramite32401Query,
    public consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroy$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.getTiposDocumentos();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Obtiene los tipos de documentos disponibles.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.seleccionaRequerimientoForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.seleccionaRequerimientoForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario reactivo con los campos requeridos.
   */
  inicializarFormulario(): void {
    this.seleccionaRequerimientoForm = this.fb.group({
      tipoDeDocumento: [this.solicitudState?.tipoDeDocumento],
    });

    this.tramite32401Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.datosDelContenedor = this.solicitudState.documentoAdicional;
          this.seleccionaRequerimientoForm.patchValue({
            tipoDeDocumento: this.solicitudState.tipoDeDocumento,
          });
        })
      )
      .subscribe();
  }

  /**
   * Obtiene el catálogo de tipos de documentos desde el servicio `AutoridadService`.
   *
   * Suscribe al observable `getTiposDocumentos()` del servicio y asigna el resultado
   * a la propiedad `tiposDocumentos`. La suscripción se gestiona mediante `takeUntil(this.destroy$)`
   * para evitar fugas de memoria.
   *
   * @returns {void}
   *
   * @example
   * this.getTiposDocumentos();
   */
  getTiposDocumentos(): void {
    this.autoridadService
      .getTiposDocumentos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Catalogo[]) => {
        this.tiposDocumentos.catalogos = response;
      });
  }

  /**
   * Establece los valores en el store según los campos del formulario.
   * @param form Formulario del que se obtendrán los valores.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32401Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32401Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

   /**
   * Asigna el tipo de documento seleccionado.
   *
   * - Verifica si el documento ya existe en `datosDelContenedor` comparando la descripción.  
   * - Si no existe, lo agrega con un nuevo identificador incremental y su descripción obtenida desde `tiposDocumentos`.  
   * - Finalmente, actualiza el estado en el store con el `id` del documento seleccionado.
   *
   * @param evento - Objeto de tipo `Catalogo` que contiene la información del documento seleccionado
   *                 (incluye `id` y `descripcion`).
   */
  setTipoDeDocumento(evento: Catalogo): void {
    if (evento.id && !this.datosDelContenedor.some((item) => item.tipoDeDocumento === evento.descripcion)
    ) {
      this.datosDelContenedor.push({
        id: this.datosDelContenedor.length + 1,
        tipoDeDocumento:
          this.tiposDocumentos?.catalogos?.[evento.id]?.descripcion,
      });
    }
    this.tramite32401Store.setTipoDeDocumento(evento.id);
  }

  /**
   * Maneja el evento de selección de documentos en la tabla.
   *
   * Se actualiza la lista de documentos seleccionados por el usuario.
   *
   * @param {DocumentoAdicional[]} evento - Lista de documentos seleccionados.
   *
   * @returns {void}
   */
  valorDeAlternancia(evento: DocumentoAdicional[]): void {
    this.selectedDocumentosAdicional = evento;
  }

  /**
   * Agrega los documentos seleccionados al contenedor principal.
   *
   * Copia el contenido de `selectedDocumentosAdicional` a `datosDelContenedor`.
   *
   * @returns {void}
   */
  agregarNuevoSeleccionados(): void {
    this.datosDelContenedor = this.selectedDocumentosAdicional;
  }

  /**
   * Elimina los documentos seleccionados marcando el índice de selección como inválido.
   *
   * Establece `inputSeleccion` en `-1`, lo que indica que no hay selección activa.
   *
   * @returns {void}
   */
  eliminarSeleccionados(): void {
    this.inputSeleccion = -1;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y completa el Subject para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
