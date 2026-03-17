import { Aduanas, DatosDelContenedor, DatosDelCsvArchivo, RespuestaCatalog } from '../../models/datos-tramite.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputFecha, InputFechaComponent, REGEX_NUMEROS, REGEX_REEMPLAZAR, TEXTOS, TablaDinamicaComponent, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, convertDate } from '@ng-mf/data-access-user';
import { FECHA_INGRESO, VIGENCIA, SearchType } from '../../enums/datos-tramite.enum';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { Modal } from 'bootstrap';
import { Solicitud11204State } from '../../estados/tramite11204.store';
import { Tramite11204Query } from '../../estados/tramite11204.query';
import { Tramite11204Store } from '../../estados/tramite11204.store';
import moment from 'moment';
import {
  SolicitanteService
} from '@libs/shared/data-access-user/src/core/services/shared/solicitante/solicitante.service';
import { ToastrService } from 'ngx-toastr';


/**
 * Componente para gestionar la solicitud de contenedores.
 */
@Component({
  selector: 'app-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrls: ['./contenedor.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    InputFechaComponent
  ],
  providers: [BsModalService]
})
export class ContenedorComponent implements OnInit, OnDestroy {

  @Input() RFC: string = 'LEQI8101314S7';

  rfc_original: string = "LEQI8101314S7";

  /**
   * Formulario principal de la solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Bandera para mostrar la sección de adjuntar archivo.
   */
  mostrarSeccionArchivoCsv: boolean = false;

  /**
   * Bandera para mostrar la sección de aduana y fecha.
   */
  mostrarSeccionAduanaaFecha: boolean = false;

  /**
   * Bandera para mostrar la sección de contenedor.
   */
  mostrarSeccionContenedor: boolean = false;

  /**
   * Bandera para mostrar la tabla de archivo seleccionado.
   */
  mostrarArchivoSeleccionadoTable: boolean = false;

  /**
   * Bandera para mostrar la sección de Excel.
   */
  mostrarSeccionExcel: boolean = false;

  /**
   * Lista de aduanas.
   */
  aduanaList: Aduanas[] = [];

  /**
   * Contenedores.
   */
  contenedores: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * indice actual.
   */
  idxActual: number = 0;

  /**
   * Bandera para mostrar el tipo de contenedor.
   */
  mostrarAgregarTipoContenedor: boolean = false;

  /**
   * Bandera para mostrar los botones.
   */
  mostrarButtons: boolean = true;

  /**
   * Lista de catálogos.
   */
  @Input() catalogoList: Catalogo[] = [];

  /**
   * Aduana.
   */
  aduana: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Datos que se mostrarán en la tabla dinámica.
   */
  datosTabla: Record<string, string>[] = [];

  /**
   * Textos.
   */
  TEXTOS = TEXTOS;

  /**
   * Estado de la solicitud.
   */
  public solicitud11204State!: Solicitud11204State;

  /**
   * Sujeto para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa la fecha de inicio ingresada por el usuario.
   * 
   * @type {InputFecha}
   * @default FECHA_INGRESO
   */
  public fechaIngreso: InputFecha = FECHA_INGRESO;

  /**
   * Representa la Vigencia ingresada por el usuario.
   * 
   * @type {InputFecha}
   * @default VIGENCIA
   */
  public vigencia: InputFecha = VIGENCIA;

  /** 
   * Desactiva el radio de "Contenedor" cuando se selecciona "Archivo CSV"
   */
  radioContenedor: boolean = false;

  /**
   * Desactiva el radio de "Archivo CSV" cuando se selecciona "Contenedor"
   */
  radioArchivoCsv: boolean = false;

  /**
   * Configuración de las columnas de la tabla.
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosDelContenedor>[] = [
    { encabezado: '', clave: (articulo) => articulo.id, orden: 1 },
    { encabezado: 'Iniciales del equipo', clave: (articulo) => articulo.iniciales_contenedor, orden: 1 },
    { encabezado: 'Número de equipo', clave: (articulo) => articulo.numero_contenedor, orden: 2 },
    { encabezado: 'Dígito verificador', clave: (articulo) => articulo.digito_verificador, orden: 3 },
    { encabezado: 'Tipo de equipo', clave: (articulo) => articulo.tipo_contenedor, orden: 4 },
    { encabezado: 'Fecha Ingreso', clave: (articulo) => articulo.fecha_ingreso, orden: 5 },
    { encabezado: 'Vigencia', clave: (articulo) => articulo.vigencia, orden: 6 },
    { encabezado: 'Aduana', clave: (articulo) => articulo.aduana, orden: 7 },
    { encabezado: 'Estado de constancia', clave: (articulo) => articulo.puede_registrar, orden: 8 },
    { encabezado: 'Existe en VUCEM', clave: (articulo) => articulo.existe_en_vucem, orden: 9 }
  ];

  /**
   * Configuración de las columnas de la tabla.
   */
  public csvTabla: ConfiguracionColumna<DatosDelCsvArchivo>[] = [
    { encabezado: '', clave: (articulo) => articulo.id, orden: 1 },
    { encabezado: 'Iniciales del equipo', clave: (articulo) => articulo.iniciales_contenedor, orden: 1 },
    { encabezado: 'Número de equipo', clave: (articulo) => articulo.numero_contenedor, orden: 2 },
    { encabezado: 'Dígito verificador', clave: (articulo) => articulo.digito_verificador, orden: 3 },
    { encabezado: 'Tipo de equipo', clave: (articulo) => articulo.tipo_contenedor, orden: 4 },
    { encabezado: 'Fecha Ingreso', clave: (articulo) => articulo.fecha_ingreso, orden: 5 },
    { encabezado: 'Vigencia', clave: (articulo) => articulo.vigencia, orden: 6 },
    { encabezado: 'Aduana', clave: (articulo) => articulo.aduana, orden: 7 },
    { encabezado: 'Estado de constancia', clave: (articulo) => articulo.puede_registrar, orden: 8 },
    { encabezado: 'Existe en VUCEM', clave: (articulo) => articulo.existe_en_vucem, orden: 9 }
  ];

  /**
   * Datos del contenedor.
   */
  public datosDelContenedor: DatosDelContenedor[] = [];

  /**
    * Datos del contenedor.
    */
  public datosDelCsvArchivo: DatosDelCsvArchivo[] = [];

  /**
   * Referencia al modal.
   */
  modalRef?: BsModalRef | null;

  /**
   * Referencia al elemento del modal.
   */
  @ViewChild('modalAgregarConstanciaTransferencia') modalElement!: ElementRef;

  /**
   * Evento para continuar.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

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
   * Constructor del componente.
   * @param fb Constructor de formularios.
   * @param datosTramiteService Servicio de datos del trámite.
   * @param validacionesService Servicio de validaciones de formulario.
   * @param Tramite11204Store Store del trámite 11204.
   * @param Tramite11204Query Query del trámite 11204.
   * @param modalService Servicio de modal.
   */
  constructor(
    private fb: FormBuilder,
    private datosTramiteService: DatosTramiteService,
    private validacionesService: ValidacionesFormularioService,
    public Tramite11204Store: Tramite11204Store,
    private Tramite11204Query: Tramite11204Query,
    private modalService: BsModalService,
    private consultaioQuery: ConsultaioQuery,
    private solicitanteServicio: SolicitanteService,
    private toastrService: ToastrService,


  ) {
    this.aduana = {
      catalogos: [],
      labelNombre: 'Aduana/sección aduanera',
      primerOpcion: 'Seleccione un valor',
    };
    this.contenedores = {
      catalogos: [],
      labelNombre: 'Tipo de equipos',
      primerOpcion: 'Seleccione un valor',
    };
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.Tramite11204Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if (typeof seccionState === 'object' && seccionState !== null) {
            this.solicitud11204State = {
              ...this.solicitud11204State,
              ...seccionState,
            };
          }
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
        })
      )
      .subscribe();
    this.inicializarFormulario();
    this.tabSeleccionado();
    this.solicitudForm.get('fechaIngreso')?.valueChanges.subscribe(() => {
      this.validateFechas();
    });
    this.solicitudForm.get('vigencia')?.valueChanges.subscribe(() => {
      this.validateFechas();
    });
    this.cargarCatalogos();
    this.fetchgetaduanaLista();
    this.getDatosGenerales(this.RFC);
    this.solicitudForm.get('archivoSeleccionadoName')?.disable();
    this.datosDelContenedor = this.solicitud11204State.datosDelContenedor || [];
    this.datosDelCsvArchivo = this.solicitud11204State.datosDelCsvArchivo || [];
  }

  /**
   * Método de destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
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
   * Inicializa el formulario reactivo.
   */
  inicializarFormulario(): void {
    this.solicitudForm = this.fb.group({
      tipoBusqueda: [this.solicitud11204State?.tipoBusqueda, Validators.required],
      aduana: [this.solicitud11204State?.aduana, Validators.required],
      fechaIngreso: [this.solicitud11204State?.fechaIngreso, Validators.required],
      vigencia: [this.solicitud11204State?.vigencia, Validators.required],
      inicialesContenedor: [this.solicitud11204State?.inicialesContenedor, [Validators.required, Validators.maxLength(10), Validators.pattern(REGEX_REEMPLAZAR)]],
      numeroContenedor: [this.solicitud11204State?.numeroContenedor, [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(REGEX_REEMPLAZAR)]],
      digitoDeControl: [this.solicitud11204State?.digitoDeControl, [Validators.maxLength(1), Validators.pattern(REGEX_NUMEROS)]],
      contenedores: [this.solicitud11204State?.contenedores, Validators.required],
      aduanaMenuDesplegable: [
        this.solicitud11204State.aduanaMenuDesplegable,
        Validators.required,
      ],
      archivoSeleccionado: [this.solicitud11204State?.archivoSeleccionado, Validators.required],
      archivoSeleccionadoName: [{ value: '', disabled: true }],
    });
    this.mostrarCampos();
    if (this.soloLectura) {
      this.solicitudForm?.disable();
    } else {
      this.solicitudForm?.enable();
    }
  }

  validateFechas(): void {
    const FECHA_INGRESO = this.solicitudForm.get('fechaIngreso')?.value;
    const VIGENCIA = this.solicitudForm.get('vigencia')?.value;

    if (!FECHA_INGRESO || !VIGENCIA) {
      this.solicitudForm.get('vigencia')?.setErrors(null);
      return;
    }
    const PARSEDINGRESO = ContenedorComponent.parseDDMMYYYY(FECHA_INGRESO);
    const PARSEDVIGENCIA = ContenedorComponent.parseDDMMYYYY(VIGENCIA);

    if (PARSEDINGRESO && PARSEDVIGENCIA && PARSEDVIGENCIA < PARSEDINGRESO) {
      this.solicitudForm.get('vigencia')?.setErrors({ fechaInvalida: true });
    } else {
      this.solicitudForm.get('vigencia')?.setErrors(null);
    }
  }

  static parseDDMMYYYY(dateStr: string): Date | null {
    if (!dateStr) { return null; }

    const [DAY, MONTH, YEAR] = dateStr.split('/');
    if (!DAY || !MONTH || !YEAR) { return null; }

    return new Date(Number(YEAR), Number(MONTH) - 1, Number(DAY));
  }

  onChange(controlName: string, event: Event): void {
    const TARGET = event.target as HTMLInputElement | null;
    if (!TARGET) {
      return;
    }
    const VALUE = TARGET.value;
    if (controlName === 'inicialesContenedor') {
      const SANITIZED = VALUE.replace(REGEX_REEMPLAZAR, '').toUpperCase();
      this.solicitudForm.get(controlName)?.setValue(SANITIZED);
      this.setValoresStore(this.solicitudForm, controlName, 'setInicialesContenedor');
    } else if (controlName === 'numeroContenedor') {
      const SANITIZED = VALUE.replace(REGEX_REEMPLAZAR, '');
      this.solicitudForm.get(controlName)?.setValue(SANITIZED);
      this.setValoresStore(this.solicitudForm, controlName, 'setNumeroContenedor');
    } else if (controlName === 'digitoDeControl') {
      const SANITIZED = VALUE.replace(REGEX_NUMEROS, '');
      this.solicitudForm.get(controlName)?.setValue(SANITIZED);
      this.setValoresStore(this.solicitudForm, controlName, 'setDigitoDeControl');
    } else if (controlName === 'tipoBusqueda') {
      this.setValoresStore(this.solicitudForm, controlName, 'setTipoBusqueda');
      this.mostrarCampos();
    } else if (controlName === 'aduana') {
      this.setValoresStore(this.solicitudForm, controlName, 'setAduana');
      const CURRENT_DATE = moment().format('YYYY-MM-DD');
      this.solicitudForm.get('fechaIngreso')?.setValue(CURRENT_DATE);
      this.setValoresStore(this.solicitudForm, 'fechaIngreso', 'setFechaIngreso');
      this.solicitudForm.get('vigencia')?.setValue(CURRENT_DATE);
      this.setValoresStore(this.solicitudForm, 'vigencia', 'setVigencia');
    }


  }

  /**
   * Cargar datos de la tabla.
   */
  loadDatosTablaData(): void {
    this.datosTramiteService
      .getDatosTableData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: RespuestaCatalog[]) => {
        this.datosDelContenedor = data as unknown as DatosDelContenedor[];
      });
  }

  /**
   * Establecer valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite11204Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.Tramite11204Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Mostrar campos segun el tipo de busqueda seleccionado.
   */
  mostrarCampos(): void {
    const TIPO_BUSQUEDA = this.solicitudForm.get('tipoBusqueda')?.value;
    this.mostrarSeccionArchivoCsv = false;
    this.mostrarSeccionAduanaaFecha = false;
    this.mostrarSeccionContenedor = false;
    this.mostrarSeccionExcel = false;

    switch (TIPO_BUSQUEDA) {
      case 'Contenedor':
        this.mostrarSeccionContenedor = true;
        this.mostrarSeccionAduanaaFecha = true;
        this.radioContenedor = false;
        this.radioArchivoCsv = true;
        break;
      case 'Archivo CSV':
        this.mostrarSeccionArchivoCsv = true;
        this.radioArchivoCsv = false;
        this.radioContenedor = true;
        this.mostrarArchivoSeleccionadoTable = true;
        break;
      default:
        break;
    }
  }

  /**
   * Limpiar campos del formulario.
   */
  limpiarCampos(): void {
    this.solicitudForm.reset();
  }

  /**
   * cancelar del formulario.
   */
  cancelar(): void {
    this.solicitudForm.reset();
    this.radioContenedor = false;
    this.radioArchivoCsv = false;
    this.mostrarSeccionArchivoCsv = false;
    this.mostrarSeccionAduanaaFecha = false;
    this.mostrarSeccionContenedor = false;
    this.mostrarSeccionExcel = false;
    this.mostrarAgregarTipoContenedor = false;
    this.solicitudForm.get('archivoSeleccionado')?.disable();
    this.datosDelContenedor = [];
    this.datosDelCsvArchivo = [];
  }

  /**
   * Mostrar tipo de contenedor.
   */
  mostrarTipoContenedor(): void {
    this.mostrarButtons = false;
    this.mostrarAgregarTipoContenedor = true;
  }

  /**
   * Mostrar modal de captura de datos.
   */
  datosCapturaModal(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }

  }

  /**
   * Validar si un campo es válido.
   * @param field Nombre del campo.
   * @returns Verdadero si el campo es válido, falso en caso contrario.
   */
  isValid(field: string): boolean {
    const VALIDATIONRESULT = this.validacionesService.isValid(
      this.solicitudForm,
      field
    );
    return VALIDATIONRESULT === null ? false : VALIDATIONRESULT;
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
   * Validar el Dígito verificador y agregar la solicitud.
   */
  datosCaptura(): void {
    this.solicitudForm.markAllAsTouched();
    const ADUANA = this.solicitudForm.value.aduana;
    const FECHAINGRESO = this.solicitudForm.value.fechaIngreso;
    const VIGENCIA = this.solicitudForm.value.vigencia;
    const INICIALESCONTENEDOR = this.solicitudForm.value.inicialesContenedor;
    const NUMEROCONTENEDOR = this.solicitudForm.value.numeroContenedor;
    const CONTENEDORES = this.solicitudForm.value.contenedores;
    const DIGITOCONTROL = this.solicitudForm.value.digitoDeControl || '';
    if (INICIALESCONTENEDOR && NUMEROCONTENEDOR && ADUANA) {
      const API_PAYLOAD = {
        "rfc": this.rfc_original,
        "aduana": ADUANA,
        "iniciales_contenedor": INICIALESCONTENEDOR,
        "numero_contenedor": NUMEROCONTENEDOR,
        "digito_verificador": DIGITOCONTROL,
        "fecha_ingreso": convertDate(FECHAINGRESO),
        "vigencia": convertDate(VIGENCIA),
        "tipo_contenedor": CONTENEDORES,
        "numero_constancia": ""
      }

      this.agregarSolicitud(API_PAYLOAD);
    }
  }

  /**
   * Adjuntar archivo CSV y parsear su contenido.
   */
  adjuntarArchivo(): void {
    const FILE_INPUT = document.getElementById(
      'archivoSeleccionado'
    ) as HTMLInputElement;
    const FILE = FILE_INPUT.files?.[0];
    if (FILE) {
      const formData = new FormData();
      formData.append('archivo', FILE);
      formData.append('rfc', this.rfc_original);
      formData.append('aduana', this.solicitudForm.get('aduanaMenuDesplegable')?.value);
      formData.append('fingreso', convertDate(this.solicitudForm.get('fechaDeIngreso')?.value));

      this.datosTramiteService.fileUpload(formData).pipe(takeUntil(this.destroyNotifier$)).subscribe(
        (respuesta) => {
          if (respuesta?.codigo === '00') {
            respuesta.datos.id = this.datosDelCsvArchivo.length + 1;
            this.solicitudForm.get('archivoSeleccionadoName')?.setValue(FILE.name);//it not working
            this.datosDelCsvArchivo = respuesta?.datos.contenedores.map((item: any) => ({
              ...item,
              vigencia: item.vigencia ? item.vigencia.split(' ')[0] : '',
              fecha_inicio: item.fecha_inicio ? item.fecha_inicio.split(' ')[0] : '',
              fecha_ingreso: item.fecha_ingreso ? item.fecha_ingreso.split(' ')[0] : '',
              existe_en_vucem: item.existe_en_vucem ? 'Sí' : 'No'
            }));
            (this.Tramite11204Store.setDelCsv as (valor: DatosDelCsvArchivo[]) => void)(this.datosDelCsvArchivo);


          }
        }
      );
    }

  }

  /**
   * Parsear contenido CSV.
   * @param csv Contenido CSV.
   */
  parseCSV(csv: string): void {
    const LINES = csv.split('\n').filter(line => line.trim() !== '');
    const HEADERS = LINES[0].split(',');
    const HEADER_MAP: { [key: string]: string } = {
      'Aduana': 'aduana',
      'Iniciales del equipo': 'inicialesEquipo',
      'Tipo de documento': 'tipoEquipo',
      'Número de equipo': 'numeroEquipo',
      'Dígito verificador': 'digitoVerificador',
      'Fecha Ingreso': 'fechaIngreso',
      'Vigencia': 'vigencia'
    };
    const DATA = LINES.slice(1).map((line) => {
      const VALUES = line.split(',');
      const OBJ: Record<string, string> = {};
      HEADERS.forEach((header, index) => {
        const KEY = HEADER_MAP[header.trim()] || header.trim();
        OBJ[KEY] = VALUES[index]?.trim();
      });
      return OBJ;
    }).filter(articulo => Object.values(articulo).some(valor => valor));
    this.datosTabla = DATA;
  }

  /**
   * Seleccionar pestaña actual.
   */
  tabSeleccionado(): void {
    const CURRENT_IDX = localStorage.getItem('idxActual');
    if (CURRENT_IDX !== null) {
      this.idxActual = Number(CURRENT_IDX);
    }
  }

  /**
   * Agregar solicitud.
   */
  agregarSolicitud(payload: any): void {
    const tipoBusqueda = this.solicitudForm.value.tipoBusqueda;
    this.datosTramiteService.agregarSolicitud(payload).pipe(takeUntil(this.destroyNotifier$)).subscribe(
      (respuesta) => {
        if (respuesta?.codigo === '00') {
          respuesta.datos.existe_en_vucem = respuesta.datos.existe_en_vucem ? 'Sí' : 'No';
          respuesta.datos.fecha_ingreso = respuesta.datos.fecha_ingreso ? respuesta.datos.fecha_ingreso.split(' ')[0] : '';
          respuesta.datos.fecha_inicio = respuesta.datos.fecha_inicio ? respuesta.datos.fecha_inicio.split(' ')[0] : '';
          respuesta.datos.vigencia = respuesta.datos.vigencia ? respuesta.datos.vigencia.split(' ')[0] : '';
          respuesta.datos.id = this.datosDelContenedor.length + 1;
          this.datosDelContenedor = [...this.datosDelContenedor, respuesta.datos];
          (this.Tramite11204Store.setDelContenedor as (valor: DatosDelContenedor[]) => void)(this.datosDelContenedor);
          this.mostrarButtons = true;
          this.mostrarAgregarTipoContenedor = false;
          this.solicitudForm.reset();
          this.solicitudForm.markAsUntouched();
          this.solicitudForm.markAsPristine();
          this.solicitudForm.value.inicialesContenedor = '';
          this.solicitudForm.value.numeroContenedor = '';
          this.solicitudForm.value.digitoDeControl = '';
          this.mostrarAgregarTipoContenedor = false;
          this.solicitudForm.get('tipoBusqueda')?.setValue(tipoBusqueda);
        }
        else if (respuesta?.codigo === 'SAT11204-CT02') {
          this.datosCapturaModal()
        }
        else {
          this.toastrService.error(respuesta.error);
        }
      }
    );
  }

  /**
   * Cargar catálogos de datos.
   */
  cargarCatalogos(): void {
    this.datosTramiteService.getContenedores().pipe(takeUntil(this.destroyNotifier$)).subscribe(
      (data) => {
        this.contenedores.catalogos = data.datos;
      },
    );
  }

  /**
   * Obtener la lista de aduanas.
   */
  public fetchgetaduanaLista(): void {
    this.datosTramiteService
      .getAduanaLista()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((respuesta) => {
        this.catalogoList = respuesta.datos;
      });
  }

  /**
   * Cambia la fecha de ingreso en el formulario de solicitud.
   *
   * @param nuevo_valor - El nuevo valor de la fecha de ingreso en formato de cadena.
   */
  public cambioFechaIngreso(nuevo_valor: string): void {
    this.solicitudForm.get('fechaIngreso')?.setValue(nuevo_valor);
    this.solicitudForm.get('fechaIngreso')?.markAsUntouched();
  }

  /**
   * Cambia la vigencia en el formulario de solicitud.
   *
   * @param nuevo_valor - El nuevo valor de la vigencia en formato de cadena.
   */
  public cambioVigencia(nuevo_valor: string): void {
    this.solicitudForm.get('vigencia')?.setValue(nuevo_valor);
    this.solicitudForm.get('vigencia')?.markAsUntouched();
  }

  /**
   * Emitir evento de continuar.
   * Este método emite un evento para continuar con el proceso.
   */
  continuar(): void {
    this.continuarEvento.emit('');
  }



  /**
   * Guarda la solicitud actual construyendo y enviando un payload al servicio de trámite.
   *
   * La función:
   * - Lee el tipo de búsqueda seleccionado desde this.solicitudForm ('tipoBusqueda') y, según
   *   SearchType, selecciona la fuente de datos adecuada (this.datosDelContenedor o this.datosDelCsvArchivo).
   * - Normaliza cada elemento de la lista de "contenedores":
   *   - Convierte el campo existe_en_vucem de la cadena 'Sí' a true (cualquier otro valor se deja como false).
   *   - Si las propiedades de fecha (fecha_ingreso, fecha_inicio, vigencia) están presentes,
   *     les concatena " 00:00:00".
   * - Construye el payload con:
   *   - id_solcitud: tomado de this.solicitud11204State.idSolicitud o null si no existe.
   *   - solicitante: objeto con datos del solicitante (en el código actual contiene valores estáticos,
   *     incluyendo this.rfc_original para el RFC).
   *   - contenedores: el arreglo ya normalizado.
   * - Llama a this.datosTramiteService.solicitudGuardar(PAYLOAD) y se subscribe al resultado.
   *   - La suscripción está gestionada con takeUntil(this.destroyNotifier$) para evitar fugas de memoria.
   *   - En caso de respuesta exitosa (respuesta?.codigo === '00'), actualiza el store
   *     this.Tramite11204Store.setIdSolicitud(...) con el id recibido y llama a this.continuar().
   *
   * Notas:
   * - No devuelve valor (void).
   * - No lanza excepciones explícitas; cualquier manejo de errores dependiente del servicio
   *   debería implementarse en la suscripción (p.ej. manejador error).
   * - El campo "solicitante" en el payload contiene valores hardcodeados en la implementación actual;
   *   considere reemplazarlos por datos dinámicos según corresponda.
   *
   * @returns {void} No retorna valor.
   * @remarks Dependencias internas:
   * - this.solicitudForm (para obtener tipoBusqueda)
   * - SearchType enum (para determinar la fuente de datos)
   * - this.datosDelContenedor | this.datosDelCsvArchivo (orígenes de contenedores)
   * - this.solicitud11204State.idSolicitud (para id_solcitud)
   * - this.rfc_original (para solicitante.rfc)
   * - this.datosTramiteService.solicitudGuardar (llamada al backend)
   * - this.Tramite11204Store (para persistir id de solicitud)
   * - this.continuar() (flujo posterior a guardado exitoso)
   */
  solicitudGuardar(): void {
    const TIPO_BUSQUEDA = this.solicitudForm.get('tipoBusqueda')?.value as SearchType;
    const normalize = (item: any) => ({
      ...item,
      existe_en_vucem: item.existe_en_vucem == 'Sí' ? true : false,
      fecha_ingreso: item.fecha_ingreso ? `${item.fecha_ingreso} 00:00:00` : item.fecha_ingreso,
      fecha_inicio: item.fecha_inicio ? `${item.fecha_inicio} 00:00:00` : item.fecha_inicio,
      vigencia: item.vigencia ? `${item.vigencia} 00:00:00` : item.vigencia
    });

    let contenedores: any[] = [];
    switch (TIPO_BUSQUEDA) {
      case SearchType.Contenedor:
        contenedores = this.datosDelContenedor.map(normalize);
        break;
      case SearchType.ArchivoCsv:
        contenedores = this.datosDelCsvArchivo.map(normalize);
        break;
      default:
        contenedores = [];
    }

    const PAYLOAD = {
      "id_solcitud": this.solicitud11204State.idSolicitud || null,
      "solicitante": {
        "rfc": this.rfc_original,
        "nombre": "Juan Pérez",
        "es_persona_moral": true,
        "certificado_serial_number": "string"
      },
      "contenedores": contenedores
    }
    this.datosTramiteService
      .solicitudGuardar(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$)

      )
      .subscribe(
        (respuesta) => {
          // Manejar éxito, posiblemente refrescar la grilla o mostrar mensaje
          if (respuesta?.codigo === '00') {
            this.Tramite11204Store.setIdSolicitud(respuesta.datos.id_solicitud);
            this.continuar();
          }
        }
      );
  }


}