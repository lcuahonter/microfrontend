import { Catalogo, ConfiguracionColumna, ConsultaioQuery, ConsultaioState, REGEX_NUMEROS, REGEX_SOLO_NÚMERO } from '@ng-mf/data-access-user';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild ,Input} from '@angular/core';
import { Contenedor11202State, Contenedor11202Store } from '../../estados/contenedor11202.store';
import { CSV_DE_TABLA, ELGIR_DE_ARCHIVO, GRID_CONTENEDORES, SOLICITUD_11202_ENUM } from '../../constantes/retorno-contenedores.enum';
import { DatosDelCsvArchivo, GridContenedores } from '../../models/datos-tramite.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil ,tap } from 'rxjs';
import { Contenedor11202Query } from '../../estados/contenedor11202.query';
import { DatosTramiteService } from '../../services/datos-tramite.service';

import { Solicitud11202State,Solicitud11202Store } from '../../estados/solicitud11202.store';
import { Solicitud11202Query } from '../../estados/solicitud11202.query';
import { Modal } from 'bootstrap';
import preOperativo from '@libs/shared/theme/assets/json/11202/preOperativo.json';
import {
    SolicitanteService
} from '@libs/shared/data-access-user/src/core/services/shared/solicitante/solicitante.service';
import { ToastrService } from 'ngx-toastr';


/**
 * @component ContenedorComponent
 * @description
 * This component is responsible for managing the container-related operations in the application.
 * It provides functionality for handling forms, displaying dynamic tables, managing file uploads,
 * and interacting with services to fetch and submit data.
 */
@Component({
  selector: 'app-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrl: './contenedor.component.scss',


})
export class ContenedorComponent implements OnInit, OnDestroy {
  /**
  * @property {Contenedor11202State} contenedorState
  * Stores the state of the container-related data.
  */
  public contenedorState!: Contenedor11202State;

  /**
   * Lista de catálogos de Seleccione una opción.
   */
  options!: Catalogo[];

  /**
  * Define los datos que se mostrarán en la tabla dinámica.
  */
  datosTabla: any[] = [];

  /**
 * @property {any} radioOptions
 * Options for the radio buttons.
 */
  radioOptions = preOperativo;

  /**
   * @property {Subject<void>} destroyNotifier$
   * Emits a signal to clean up subscriptions when the component is destroyed.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {FormGroup} solicitudForm
   * Form group for the container form.
   */
  solicitudForm!: FormGroup;

  /**
   * @property {boolean} seccionAduanaaFechaVisible
   * Indicates whether the customs and date section is visible.
   */
  seccionAduanaaFechaVisible: boolean = false;

  /**
   * @property {boolean} agregarTipoContenedorVisible
   * Indicates whether the add container type section is visible.
   */
  seccionContenedor: boolean = false;

  /**
   * Referencia al elemento del modal para agregar mercancías.
   */
  @ViewChild('modalArchivoCsv') modalArchivo!: ElementRef;

  /**
   * @property {Catalogo[]} catalogAduanas
   * Stores the customs catalog
   * */
  catalogAduanas: Catalogo[] = [];

  /**
   * @property {any[]} contenedores
   * Stores the container data
   * */
  contenedores: GridContenedores[] = [];

  /**
   * @property {string} archivoSeleccionado
   * Stores the selected file
   */
  archivoSeleccionado: string = '';

  /**
   * @property {boolean} showCargarArchivoTable
   * Indicates whether the file upload table is visible.
   */
  actionBean = { requiereGuardadoParcial: false };

  /**
   * @property {number} currentIdx
   * Stores the current index of the tab.
   */
  currentIdx: number = 0;

  /**
   * @property {boolean} showCargarArchivoTable
   * Indicates whether the file upload table is visible.
   */
  showCargarArchivoTable: boolean = false;

  /**
   * @property {boolean} showArchivoSeleccionadoTable
   * Indicates whether the selected file table is visible.
   */
  showArchivoSeleccionadoTable: boolean = false;
  /**
     * @property {ConsultaioState} consultaDatos
     * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
     */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * Evento para continuar.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Configuración de las columnas de la tabla.
   */
  public gridContenedores: ConfiguracionColumna<GridContenedores>[] = GRID_CONTENEDORES;

  /**
   * Configuración de las columnas de la tabla.
   */
  public csvTabla: ConfiguracionColumna<DatosDelCsvArchivo>[] = CSV_DE_TABLA;

  /**
   * Bandera para mostrar los botones de búsqueda.
   */
  mostrarBotonesBuscar: boolean = true;

    /**
   * Objeto que contiene el estado de la solicitud del trámite.
   * Este objeto es utilizado para gestionar el estado del trámite en la aplicación.
   */
  public solicitudState!: Solicitud11202State;


  /**
   * Referencia al elemento del modal.
   */
  @ViewChild('modalAgregarConstanciaTransferencia') modalElement!: ElementRef;

  /**
   * Contenedores.
   */
  contenedore: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Bandera para mostrar el tipo de contenedor.
   */
  mostrarAgregarTipoContenedor: boolean = false;

  /**
   * Bandera para mostrar la sección de adjuntar archivo.
   */
  archivoDescripcion: boolean = false;

  /**
   * Bandera para mostrar la sección de adjuntar archivo.
   */
  mostrarSeccionArchivoCsv: boolean = false;

  /**
   * Datos del contenedor.
   */
 public datosDelCsvArchivo: DatosDelCsvArchivo[] = [];

 /**
   * Etiqueta del archivo seleccionado.
   */
  elgirDeArchivo: string = SOLICITUD_11202_ENUM.ELGIR_DE_ARCHIVO;

  /**
   * Descripción del archivo seleccionado.
   */
  archivo_descripcion: string = ELGIR_DE_ARCHIVO.ARCHIVO_DESCRIPCION;

  /**
   * Elemento de entrada de archivo HTML.
   *
   * @type {HTMLInputElement}
   */
  elgirArchivo!: HTMLInputElement;

  /**
   * Archivo de medicamentos seleccionado.
   */
  archivoMedicamentos: File | null = null;

  /**
   * Bandera para indicar si el archivo adjunto no un CSV.
   */
  archivoNoCsv: boolean = false;

  @Input() RFC: string = 'LEQI8101314S7';

  rfc_original: string = "";



  constructor(
    private fb: FormBuilder,
    private datosTramiteService: DatosTramiteService,
    private contenedorStore: Contenedor11202Store,
    private contenedorQuery: Contenedor11202Query,
    private consultaioQuery: ConsultaioQuery,
    private solicitanteServicio: SolicitanteService,
    private tramite11202Query: Solicitud11202Query,
    public solicitud11202Store: Solicitud11202Store,
    private toastrService: ToastrService,

    

  ) { 
    this.contenedore = {
      catalogos: [],
      labelNombre: 'Tipo de contenedor',
      primerOpcion: 'Seleccione una opción',
    };
  }

  /**
   * Método de ciclo de vida de Angular que se llama cuando el componente se inicializa.
   */
  ngOnInit(): void {
    this.contenedorQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.contenedorState = {
            ...this.contenedorState,
            ...seccionState,
          }
        })
      )
      .subscribe()
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

         // Suscribirse a los cambios en el estado del trámite 11202
    this.tramite11202Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();

    this.contenedores = this.contenedorState.contenedores;
    this.datosDelCsvArchivo = this.contenedorState.datosDelCsvArchivo;
    this.cargarCatalogAduanas();
    this.crearFormSolicitud();
    this.cargarCatalogContenedores();
    this.loadDatosTablaData();
    this.getDatosGenerales(this.RFC);
  }

  /**
   * Carga el catálogo de aduanas.
   */
  cargarCatalogAduanas(): void {
    this.datosTramiteService
      .getAduanas()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response): void => {
        this.options = response.datos;

      });
  }

  /**
   * Carga el catálogo de contenedores.
   */
  cargarCatalogContenedores(): void {
    this.datosTramiteService
      .getContenedores()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.contenedore.catalogos = response.datos;
      });
  }

  /**
   * Muestra los campos según el tipo de búsqueda seleccionado.
   */
  mostrarCampos(): void {
    const TIPO_BUSQUEDA = this.solicitudForm.get('tipoBusqueda')?.value;
    if (TIPO_BUSQUEDA === 'Contenedor') {
      this.seccionContenedor = true;
      this.seccionAduanaaFechaVisible = true;
      this.mostrarBotonesBuscar = true;
      this.mostrarSeccionArchivoCsv = false;
    } else if (TIPO_BUSQUEDA === 'Archivo CSV') {
      this.seccionAduanaaFechaVisible = true;
      this.seccionContenedor = false;
      this.mostrarSeccionArchivoCsv = true;
    } else {
      this.seccionAduanaaFechaVisible = false;
      this.mostrarSeccionArchivoCsv = false;
    }
  }

  /**
   * Limpia los campos del formulario.
   */
  limpiarCampos(): void {
    const TIPOBUSQUEDA = this.solicitudForm.get('tipoBusqueda')?.value;
    (this.solicitudForm.get('datosContenedor') as FormGroup)?.reset();
    this.solicitudForm.get('tipoBusqueda')?.setValue(TIPOBUSQUEDA);
    this.mostrarCampos();
    this.contenedores = [];
    this.archivoSeleccionado = '';
  }

  /**
   * Inicializa el modal.
   */
  encontradaModal(): void {
      if (this.modalElement) {
        const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
        MODAL_INSTANCE.show();
      }
  }

  /**
   * Captura los datos del formulario y los envía.
   */
  datosCaptura(): void {
    this.mostrarAgregarTipoContenedor = true;
    this.mostrarBotonesBuscar = false;
  }

  getDatosGenerales(RFC: string): void {
        this.solicitanteServicio
            .getDatosGeneralesAPI(RFC)
            .pipe(
                tap((response: any) => {
                    if (response) {
                        this.rfc_original = response.datos.rfc_original
                    }
                })
            )
            .subscribe();
    }

  /**
   * Agrega un nuevo contenedor al grid.
   */
 agregarGrid(): void {
    const INICIALESCONTENEDOR = this.solicitudForm.value.datosContenedor.inicialesContenedor;
    const NUMEROCONTENEDOR = this.solicitudForm.value.datosContenedor.numeroContenedor;
    const ADUANA = this.solicitudForm.value.datosGenerales.aduana;
    const TIPOCONTENEDOR = this.solicitudForm.value.datosContenedor.tipoContenedor;
    const TIPOBUSQUEDA = this.solicitudForm.get('tipoBusqueda')?.value;
    const CONTENEDOR_DATA = {
      rfc: this.rfc_original,
      aduana: ADUANA,
      iniciales_contenedor: INICIALESCONTENEDOR,
      numero_contenedor: NUMEROCONTENEDOR,
      digito_verificador: this.solicitudForm.value.datosContenedor.digitoDeControl || '',
      tipo_contenedor: TIPOCONTENEDOR,
    };
    if ( INICIALESCONTENEDOR && NUMEROCONTENEDOR && ADUANA ) {
      this.datosTramiteService.agregarSolicitud(CONTENEDOR_DATA).pipe(takeUntil(this.destroyNotifier$)).subscribe(
        (respuesta) => {
          if (respuesta?.codigo === '00') {
            respuesta.datos.id = this.contenedores.length + 1;
            respuesta.datos.existe_en_vucem = respuesta.datos.existe_en_vucem ? 'Sí' : 'No';
            this.contenedores = [...this.contenedores, respuesta.datos];
            (this.contenedorStore.setContenedores as (valor: GridContenedores[]) => void)(this.contenedores);
            this.solicitudForm.reset();
            this.solicitudForm.markAsUntouched();
            this.solicitudForm.markAsPristine();
            this.solicitudForm.get('tipoBusqueda')?.setValue(TIPOBUSQUEDA);
            this.solicitudForm.get('aduana')?.setValue(ADUANA);
            this.mostrarCampos();
            this.archivoSeleccionado = '';
            this.mostrarAgregarTipoContenedor = false;
          }
          else if(respuesta?.codigo === 'SAT11202-CR02'){
            this.encontradaModal()
          }
          else{
            this.toastrService.error(respuesta.error);
          }
        }
      );
    }
  }

  /**
   * Adjuntar archivo CSV y parsear su contenido.
   */
  adjuntarArchivo(): void {
    const FILE_INPUT = document.getElementById(
      'archivoMedicamentos'
    ) as HTMLInputElement;
    const FILE = FILE_INPUT.files?.[0];
    if (!FILE) return;

    const isCsv = FILE.type === 'text/csv' || FILE.name.toLowerCase().endsWith('.csv');
    if (isCsv) {
      const formData = new FormData();
            formData.append('archivo', FILE);
            formData.append('rfc', this.rfc_original);
            formData.append('aduana', this.solicitudForm.value.datosGenerales.aduana);
            this.datosTramiteService
                .validarArchivoCsv(formData)
                .pipe(takeUntil(this.destroyNotifier$))
                .subscribe((respuesta) => {
                    if (respuesta?.codigo === '00') {
                       this.datosDelCsvArchivo =  respuesta?.datos.contenedores.map((item: any) => ({
                            ...item,
                            existe_en_vucem: item.existe_en_vucem ? 'Sí' : 'No'
                        }));
                    (this.contenedorStore.setDelCsv as (valor: GridContenedores[]) => void)(this.datosDelCsvArchivo);

                    }
                });
    } else {
      this.archivoDescripcion = true;
    }
  }

  /**
   * Cargar archivo CSV y parsear su contenido.
   */
  parseCSV(csv: string): void {
    const LINES = csv.split('\n').filter((line) => line.trim() !== '');
    const HEADERS = LINES[0].split(',');
    const HEADER_MAP: { [key: string]: string } = {
      'Aduana': 'aduana',
      'Iniciales del equipo': 'inicialesEquipo',
      'Tipo de equipo': 'tipoEquipo',
      'Número de equipo': 'numeroEquipo',
      'Dígito Verificador': 'digitoVerificador',
      'Fecha Ingreso': 'fechaIngreso',
      'Vigencia': 'vigencia',
      'Estado de constancia': 'estadoConstancia',
      'Existe en VUCEM': 'existeEnVUCEM'
    };
    const DATA = LINES.slice(1)
      .map((line) => {
        const VALUES = line.split(',');
        const OBJ: Record<string, string | undefined> = {};
        HEADERS.forEach((header, index) => {
          const KEY = HEADER_MAP[header.trim()] || header.trim();
          OBJ[KEY] = VALUES[index]?.trim();
        });
        return OBJ;
      })
      .filter((artículo) => Object.values(artículo).some((value) => value));
    this.datosTabla = DATA;
  }

  /**
   * Activa la selección del archivo de medicamentos.
   * @returns {void}
   */
  activarSeleccionArchivo(): void {
    this.elgirArchivo = document.getElementById(
      'archivoMedicamentos'
    ) as HTMLInputElement;
    if (this.elgirArchivo) {
      this.elgirArchivo.click();
    }
  }

  /**
   * Maneja el cambio de archivo en el input de archivo.
   *
   * @param event Evento de cambio de archivo.
   *
   * @returns {void}
   */
  onCambioDeArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;

    if (TARGET.files && TARGET.files.length > 0) {
      this.archivoMedicamentos = TARGET.files[0];
      this.elgirDeArchivo = this.archivoMedicamentos.name;
    } else {
      this.elgirDeArchivo = this.elgirArchivo?.value;
    }
  }

  /**
   * Crea el formulario de solicitud.
   */
  crearFormSolicitud(): void {
    this.solicitudForm = this.fb.group({
      idSolicitud: [this.contenedorState?.idSolicitud],
      tipoBusqueda: [this.contenedorState?.tipoBusqueda, Validators.required],
      datosGenerales: this.fb.group({
        aduana: [this.contenedorState?.aduana],
      }),
      datosContenedor: this.fb.group({
        inicialesContenedor: [ this.contenedorState?.inicialesContenedor, [Validators.required, Validators.maxLength(10)]],
        numeroContenedor: [ this.contenedorState?.numeroContenedor, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
        tipoContenedor: [this.contenedorState?.tipoContenedor],
        digitoDeControl: [this.contenedorState?.digitoDeControl, [Validators.maxLength(1), Validators.pattern(REGEX_SOLO_NÚMERO)]],
      }),
    });
    this.mostrarCampos();
    this.solicitudForm
      .get('datosContenedor.digitoDeControl')
      ?.valueChanges.pipe(takeUntil(this.destroyNotifier$))
      .subscribe((valor) => {
        if (valor) {
          const SANITIZED = valor.replace(REGEX_NUMEROS, '');
          this.solicitudForm
            .get('datosContenedor.digitoDeControl')
            ?.setValue(SANITIZED, { emitEvent: false });
          this.setValoresStore(
            this.solicitudForm,
            'digitoDeControl',
            'setDigitoDeControl'
          );
        }
      });
    this.solicitudForm.get('tipoBusqueda')?.valueChanges.pipe(takeUntil(this.destroyNotifier$)).subscribe(value => {
      this.setValoresStore(this.solicitudForm, 'tipoBusqueda', 'setTipoBusqueda');
      this.mostrarCampos();
      if (value) {
        this.solicitudForm.get('tipoBusqueda')?.disable();
      }
    });
    this.inicializarEstadoFormulario();
  }
  /**
  * @method inicializarEstadoFormulario
  * @description Inicializa el estado del formulario según el modo de solo lectura.
  * 
  * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
  * En caso contrario, habilita los controles del formulario.
  * 
  * @returns {void}
  */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.solicitudForm?.disable();
    } else {
      this.solicitudForm?.enable();
    }
  }

  /**
   * Carga los datos de la tabla dinámica.
   */
  loadDatosTablaData(): void {
    this.datosTramiteService.getDatosTableData()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
        this.datosTabla = data;
      });
  }

  /**
   * Establece los valores en el store.
   * @param form El formulario del cual se obtienen los valores.
   * @param campo El campo del formulario.
   * @param metodoNombre El nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Contenedor11202Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.contenedorStore[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Emitir evento de continuar.
   * Este método emite un evento para continuar con el proceso.
   */
  continuar(): void {
    this.solicitudGuardar();
  }

  /**
   * Guarda la solicitud actual enviando un payload al servicio de trámite.
   *
   * Comportamiento:
   * - Lee el tipo de búsqueda desde el formulario (this.solicitudForm.get('tipoBusqueda')).
   * - Selecciona la fuente de contenedores según el tipo:
   *   - 'Contenedor'  -> this.contenedores
   *   - 'Archivo CSV' -> this.datosDelCsvArchivo
   * - Normaliza cada elemento de contenedores convirtiendo la propiedad
   *   `existe_en_vucem` desde la cadena 'Sí' a boolean true (cualquier otro valor se interpreta como false),
   *   y preservando el resto de propiedades mediante spread.
   * - Construye el payload con:
   *   - id_solcitud: this.solicitudState.idSolicitud || null
   *   - solicitante: objeto que incluye this.rfc_original y valores estáticos para otros campos
   *   - contenedores: array normalizado
   * - Llama a this.datosTramiteService.solicitudGuardar(PAYLOAD), aplica takeUntil(this.destroyNotifier$)
   *   para gestionar la desuscripción y se subscribe al resultado.
   * - Al recibir una respuesta con respuesta?.codigo === '00':
   *   - actualiza el id de solicitud en this.solicitud11202Store.setIdSolicitud(...)
   *   - emite el evento this.continuarEvento.emit('')
   *
   *
   * @returns void
   */
  solicitudGuardar(): void {
      const TIPO_BUSQUEDA = this.solicitudForm.get('tipoBusqueda')?.value;
      let contenedores: any[] = [];
        const normalize = (item: any) => ({
            ...item,
            existe_en_vucem: item.existe_en_vucem == 'Sí' ? true : false,

        });

    if (TIPO_BUSQUEDA === 'Contenedor') {
      contenedores = this.contenedores.map(normalize);
    } else if (TIPO_BUSQUEDA === 'Archivo CSV') {
      contenedores = this.datosDelCsvArchivo.map(normalize);
    } 

        const PAYLOAD = {
            "id_solcitud": this.solicitudState.idSolicitud || null,
            "solicitante": {
                "rfc": this.rfc_original,
                "nombre": "Juan Pérez",
                "es_persona_moral": true,
                "certificado_serial_number": "string"
            },
            "contenedores": contenedores,
        }
        this.datosTramiteService
            .solicitudGuardar(PAYLOAD)
            .pipe(takeUntil(this.destroyNotifier$)

            )
            .subscribe(
                (respuesta) => {
                    // Manejar éxito, posiblemente refrescar la grilla o mostrar mensaje
                    if (respuesta?.codigo === '00') {
                      this.solicitud11202Store.setIdSolicitud(respuesta.datos.id_solicitud);
                        this.continuarEvento.emit('');
                    }
                }
            );
    }


  /**
   * cancelar del formulario.
   */
  cancelar(): void {
    this.solicitudForm.reset();
    this.seccionAduanaaFechaVisible = false;
    this.seccionContenedor = false;
    this.mostrarAgregarTipoContenedor = false;
    this.solicitudForm.get('tipoBusqueda')?.enable();
    this.contenedores = []
    this.datosDelCsvArchivo = []
  }


  /**
   * Obtiene el formulario de datos generales.
   */
  get datosGenerales(): FormGroup {
    return this.solicitudForm.get('datosGenerales') as FormGroup;
  }

  /**
   * Obtiene el formulario de datos del contenedor.
   */
  get datosContenedor(): FormGroup {
    return this.solicitudForm.get('datosContenedor') as FormGroup;
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @param {string} id El nombre del control del formulario.
   * @returns {boolean} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(id: string): boolean {
    const CONTROL = this.solicitudForm.get(id);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Método de destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
