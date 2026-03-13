/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';

import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    AlertComponent,
    Catalogo,
    CatalogoSelectComponent,
    ConsultaioQuery,
    ConsultaioState,
    InputFecha,
    InputFechaComponent,
    Notificacion,
    NotificacionesComponent,
    Pedimento,
    REGEX_LLAVE_DE_PAGO_DE_DERECHO,
    REGEX_NUMEROS,
    REGEX_REEMPLAZAR,
    REGEX_SOLO_NÚMERO,
    SolicitanteService,
    TablaDinamicaComponent,
    TablaSeleccion,
    TituloComponent,
    ValidacionesFormularioService,
    convertDate
} from '@libs/shared/data-access-user/src';

import {
    Aduanas,
    DatosDelContenedor
} from '@libs/shared/data-access-user/src/core/models/11201/datos-tramite.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, map, takeUntil, tap } from 'rxjs';

import {
    FECHA_INGRESO,
    TEXTOS
} from '../../../../core/enums/11201/tramite11201.enum';

import {
    ENCABEZADO_TABLA_CONTENEDOR,
    ENCABEZADO_TABLA_CONTENEDOR_MANIFIESTO,
    HEADER_MAP_DATOS,
    SearchType
} from '../../enum/solicitante.enum';

import { Solicitud11201State } from '../../estados/tramites/tramite11201.store';
import { Tramite11201Query } from '../../estados/queries/tramite11201.query';
import { Tramite11201Store } from '../../estados/tramites/tramite11201.store';

import { DatosTramiteService } from '../../services/datos-tramite.service';

/**
 * Componente para gestionar la solicitud de contenedores.
 */
@Component({
    selector: 'app-contenedor',
    templateUrl: './contenedor.component.html',
    styleUrl: './contenedor.component.scss',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent,
        AlertComponent,
        TablaDinamicaComponent,
        InputFechaComponent,
        NotificacionesComponent,
    ],
    providers: [BsModalService],
})
export class ContenedorComponent implements OnInit, OnDestroy {
    /**
     * Representa una nueva notificación que será utilizada en el componente.
     * 
     * @type {Notificacion}
     */
    public nuevaNotificacion!: Notificacion | undefined;

    /**
     * Lista de objetos de tipo Pedimento asociados al componente.
     * 
     * Esta propiedad almacena un arreglo de pedimentos que pueden ser utilizados
     * para mostrar, manipular o procesar información relacionada con los trámites
     * dentro del componente contenedor.
     */
    public pedimentos: Array < Pedimento > = [];

    /**
     * Identificador numérico del elemento que se desea eliminar.
     * 
     * Esta propiedad almacena el ID del elemento seleccionado para su eliminación
     * dentro del componente. Se debe asignar antes de realizar la operación de borrado.
     */
    public elementoParaEliminar!: number;

    /**
     * Bandera para indicar si se debe mostrar el contenedor.
     */
    radioContenedor: boolean = false;

    /**
     * Bandera para indicar si se debe mostrar el archivo CSV.
     */
    radioArchivoCsv: boolean = false

    /**
     * Bandera para indicar si se debe mostrar el manifiesto.
     */
    radioManifesto: boolean = false;

    /**
     * Representa la fecha de inicio ingresada por el usuario.
     *
     * @type {InputFecha}
     * @default FECHA_INGRESO
     */
    public fechaInicioInput: InputFecha = FECHA_INGRESO;
    /**
     * Formulario principal de la solicitud.
     */
    solicitudForm!: FormGroup;

    /**
     * Bandera para mostrar la sección de adjuntar archivo.
     */
    mostrarAdjuntarArchivo: boolean = false;

    /**
     * Bandera para mostrar la sección de aduana y fecha.
     */
    mostrarSeccionAduanaaFecha: boolean = false;

    /**
     * Bandera para mostrar la sección de contenedor.
     */
    mostrarSeccionContenedor: boolean = false;

    /**
     * Bandera para mostrar la sección de número de manifiesto.
     */
    mostrarSeccionNoManifiesto: boolean = false;

    /**
     * Bandera para mostrar la tabla de cargar archivo.
     */
    mostrarCargarArchivoTable: boolean = false;

    /**
     * Bandera para mostrar la tabla de archivo seleccionado.
     */
    mostrarArchivoSeleccionadoTable: boolean = false;

    /**
     * Bandera para mostrar la sección de Excel.
     */
    mostrarSeccionExcel: boolean = false;

    /**
     * Bandera para mostrar el mensaje.
     */
    mostrarMensaje: boolean = false;

    mensajeCamposObligatorios: string = '* Campos obligatorios';

    



    /**
     * Lista de aduanas.
     */
    aduanaList: {
        labelNombre: string;
        catalogos: Aduanas[];
        primerOpcion: string;
        required: boolean;
    };

    /**
     * Lista de contenedores.
     */
    contenedores: {
        catalogos: Catalogo[];
        labelNombre: string;
        primerOpcion: string;
    };

    /**
     * Índice actual.
     */
    corrienteIdx: number = 0;

    /**
     * Lista de catálogos.
     */
    @Input() catalogoList: Catalogo[] = [];

    /**
     * Lista de transporte.
     */
    transporteList: {
        catalogos: Catalogo[];
        labelNombre: string;
        primerOpcion: string;
    };

    /**
     * Lista de aduanas.
     */
    aduana: {
        catalogos: Catalogo[];
        labelNombre: string;
        primerOpcion: string;
    };

    /**
     * Define los datos que se mostrarán en la tabla dinámica.
     */
    datosTabla: any[] = [];


    datosTablaManifest: any[] = [];

    /**
     * Obtener el valor de la instrucción e inicializar la variable.
     */
    TEXTOS = TEXTOS;

    /**
     * Estado de la solicitud.
     */
    public solicitud11201State!: Solicitud11201State;

    @Output() cancelEvent = new EventEmitter < void > ();

    @Output() continuarEvento = new EventEmitter < void > ();

    /**
     * Sujeto para notificar la destrucción del componente.
     */
    public destroyNotifier$: Subject < void > = new Subject();

    /**
     * Elemento de entrada de archivo HTML.
     *
     * @type {HTMLInputElement}
     */
    entradaArchivo!: HTMLInputElement;

    /**
     * Archivo de medicamentos seleccionado.
     */
    archivoMedicamentos: File | null = null;

    /**
     * Etiqueta del archivo seleccionado.
     */
    etiquetaDeArchivo: string = '';

    /**
     * Indica si el archivo seleccionado no es de tipo CSV.
     * 
     * Esta variable se utiliza para validar el tipo de archivo cargado por el usuario.
     * Si es `true`, significa que el archivo no cumple con el formato CSV requerido.
     */
    archivoNoEsCSV: boolean = false;

    /**
     * Configuración de las columnas de la tabla.
     */
    public encabezadoDeTabla = ENCABEZADO_TABLA_CONTENEDOR;
    /**
     * @property {any} encabezadoDeTablaManifiesto
     * @description Configuración de las columnas de la tabla para el manifiesto.
     * 
     * Esta propiedad utiliza la constante `ENCABEZADO_TABLA_CONTENEDOR_MANIFIESTO` para definir
     * los encabezados de las columnas que se mostrarán en la tabla del manifiesto.
     */
    public encabezadoDeTablaManifiesto = ENCABEZADO_TABLA_CONTENEDOR_MANIFIESTO;
    /**
     * Referencia a la clase o enumeración `TablaSeleccion`.
     *
     * Esta propiedad se utiliza para acceder a las funcionalidades
     * o valores definidos en `TablaSeleccion` dentro del componente.
     */
    TablaSeleccion = TablaSeleccion;

    /**
     * Datos del contenedor.
     */
    public datosDelContenedor: DatosDelContenedor[] = [];

    /**
     * Datos del modelo abierto.
     */
    abiertoModeloDatos: string = '';

    @Input() RFC: string = 'LEQI8101314S7';


    /**
     * Referencia al modal.
     */
    modalRef ? : BsModalRef | null;

    /**
     * Plantilla del modal.
     */
    @ViewChild('plantillademodelo') plantillaDeModelo!: TemplateRef < Element > ;

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

    rfc_original: string = "LEQI8101314S7";
    /**
     * Constructor del componente ContenedorComponent.
     * 
     * Inicializa todas las dependencias necesarias y configura los objetos
     * de catálogos con sus valores por defecto.
     * 
     * @param {FormBuilder} fb - Constructor de formularios reactivos
     * @param {DatosTramiteService} datosTramiteService - Servicio para datos del trámite
     * @param {ValidacionesFormularioService} validacionesService - Servicio para validaciones
     * @param {Tramite11201Store} tramite11201Store - Store del trámite
     * @param {Tramite11201Query} tramite11201Query - Query del trámite
     * @param {BsModalService} modalService - Servicio para modales
     * @param {ConsultaioQuery} consultaioQuery - Query para consultas
     */
    constructor(
        private fb: FormBuilder,
        private datosTramiteService: DatosTramiteService,
        private validacionesService: ValidacionesFormularioService,
        public tramite11201Store: Tramite11201Store,
        private tramite11201Query: Tramite11201Query,
        public modalService: BsModalService,
        private consultaioQuery: ConsultaioQuery,
        private solicitanteServicio: SolicitanteService

    ) {
        this.transporteList = {
            catalogos: [],
            labelNombre: 'Tipo de transporte',
            primerOpcion: 'Seleccione una opción',
        };
        this.aduana = {
            catalogos: [],
            labelNombre: 'Aduana/sección aduanera',
            primerOpcion: 'Seleccione una opción',
        };
        this.aduanaList = {
            catalogos: [],
            labelNombre: 'Aduana/sección aduanera',
            primerOpcion: 'Seleccione una opción',
            required: true
        };
        this.contenedores = {
            catalogos: [],
            labelNombre: 'Tipo de equipo',
            primerOpcion: 'Seleccione una opción',
        };
    }

    /**
     * Método de inicialización del componente.
     * 
     * Configura las suscripciones al estado del trámite, inicializa el formulario,
     * carga los catálogos necesarios y establece el estado inicial del componente.
     * 
     * @returns {void}
     */
    ngOnInit(): void {
        this.tramite11201Query.selectSolicitud$
            .pipe(
                takeUntil(this.destroyNotifier$),
                map((seccionState) => {
                    this.solicitud11201State = {
                        ...this.solicitud11201State,
                        ...seccionState,
                    };
                })
            )
            .subscribe();
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
        this.datosDelContenedor = this.solicitud11201State.datosDelContenedor || [];
        this.inicializarFormulario();
        this.cargarCatalogos();
        this.tabSeleccionado();
        this.fetchgetTransporteList();
        this.fetchAduanaList();
        this.getDatosGenerales(this.RFC);

    }

    /**
     * Método del ciclo de vida que se ejecuta al destruir el componente.
     * 
     * Completa el Subject destroyNotifier$ para notificar a todas las suscripciones
     * que deben completarse, evitando fugas de memoria.
     * 
     * @returns {void}
     */
    ngOnDestroy(): void {
        this.destroyNotifier$.next();
        this.destroyNotifier$.complete();
    }

    /**
     * Inicializa el formulario reactivo con todos los campos necesarios.
     * 
     * Crea un FormGroup con campos para tipo de búsqueda, contenedor, fecha,
     * aduana, transporte y otros datos relacionados con el trámite.
     * 
     * @returns {void}
     */
    public inicializarFormulario(): void {
        this.solicitudForm = this.fb.group({
            tipoBusqueda: [
                this.solicitud11201State?.tipoBusqueda,
                Validators.required,
            ],
            aduana: [this.solicitud11201State?.aduana, Validators.required],
            fechaIngreso: [
                this.solicitud11201State?.fechaIngreso,
                Validators.required,
            ],
            inicialesContenedor: [
                this.solicitud11201State?.inicialesContenedor,
                [
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO),
                ],
            ],
            numeroContenedor: [
                this.solicitud11201State?.numeroContenedor,
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(15),
                    Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO),
                ],
            ],
            digitoDeControl: [
                this.solicitud11201State?.digitoDeControl,
                [Validators.maxLength(1), Validators.pattern(REGEX_SOLO_NÚMERO)],
            ],
            contenedores: [
                this.solicitud11201State?.contenedores,
                Validators.required,
            ],
            tipoTransporte: ['', Validators.required],
            menuDesplegable: [
                this.solicitud11201State.menuDesplegable,
                Validators.required,
            ],
            numeroManifiesta: [
                this.solicitud11201State.numeroManifiesta,
                [Validators.required, Validators.maxLength(50)],
            ],
            aduanaMenuDesplegable: [
                this.solicitud11201State.aduanaMenuDesplegable,
                Validators.required,
            ],
            archivoSeleccionado: [
                this.solicitud11201State?.archivoSeleccionado,
                Validators.required,
            ],
            fechaDeIngreso: [
                this.solicitud11201State?.fechaDeIngreso,
                Validators.required,
            ],
        });
        this.mostrarCampos();
        this.solicitudForm
            .get('inicialesContenedor')
            ?.valueChanges.pipe(takeUntil(this.destroyNotifier$))
            .subscribe((valor) => {
                if (valor) {
                    const SANITIZED = valor.replace(REGEX_REEMPLAZAR, '').toUpperCase();
                    this.solicitudForm
                        .get('inicialesContenedor')
                        ?.setValue(SANITIZED, {
                            emitEvent: false
                        });
                    this.setValoresStore(
                        this.solicitudForm,
                        'inicialesContenedor',
                        'setInicialesContenedor'
                    );
                }
            });

        this.solicitudForm
            .get('numeroContenedor')
            ?.valueChanges.pipe(takeUntil(this.destroyNotifier$))
            .subscribe((valor) => {
                if (valor) {
                    const SANITIZED = valor.replace(REGEX_REEMPLAZAR, '');
                    this.solicitudForm
                        .get('numeroContenedor')
                        ?.setValue(SANITIZED, {
                            emitEvent: false
                        });
                    this.setValoresStore(
                        this.solicitudForm,
                        'numeroContenedor',
                        'setNumeroContenedor'
                    );
                }
            });
        this.solicitudForm
            .get('digitoDeControl')
            ?.valueChanges.pipe(takeUntil(this.destroyNotifier$))
            .subscribe((valor) => {
                if (valor) {
                    const SANITIZED = valor.replace(REGEX_NUMEROS, '');
                    this.solicitudForm
                        .get('digitoDeControl')
                        ?.setValue(SANITIZED, {
                            emitEvent: false
                        });
                    this.setValoresStore(
                        this.solicitudForm,
                        'digitoDeControl',
                        'setDigitoDeControl'
                    );
                }
            });
        // Escuchar cambios en tipoBusqueda para mostrar secciones
        this.solicitudForm
            .get('tipoBusqueda')
            ?.valueChanges.pipe(takeUntil(this.destroyNotifier$))
            .subscribe(() => {
                this.setValoresStore(
                    this.solicitudForm,
                    'tipoBusqueda',
                    'setTipoBusqueda'
                );
                this.mostrarCampos();
            });

        // Escuchar cambios en aduana
        this.solicitudForm
            .get('aduana')
            ?.valueChanges.pipe(takeUntil(this.destroyNotifier$))
            .subscribe((_ : string) => {
                this.setValoresStore(this.solicitudForm, 'aduana', 'setAduana');
            });

        // Escuchar cambios en aduanaMenuDesplegable
        this.solicitudForm
            .get('aduanaMenuDesplegable')
            ?.valueChanges.pipe(takeUntil(this.destroyNotifier$))
            .subscribe((_ : string) => {
                this.setValoresStore(this.solicitudForm, 'aduanaMenuDesplegable', 'setAduanaMenuDesplegable');
            });
        this.inicializarEstadoFormulario();
    }

    /**
     * Cargar datos de la tabla.
     *
     * Este método obtiene los datos de la tabla desde el servicio `datosTramiteService`
     * y los almacena en la propiedad `datosTabla`. Utiliza `takeUntil` para cancelar la suscripción
     * cuando el componente se destruye, evitando fugas de memoria.
     *
     */
    loadDatosTablaData(): void {
        this.datosTramiteService
            .getDatosTableData()
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((data) => {
                this.datosTabla = data;
            });
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
     * Establecer valores en el store del trámite.
     * @param form Formulario reactivo.
     * @param campo Nombre del campo.
     * @param metodoNombre Nombre del método en el store.
     */
    setValoresStore(
        form: FormGroup,
        campo: string,
        metodoNombre: keyof Tramite11201Store
    ): void {
        const VALOR = form.get(campo)?.value;
        (this.tramite11201Store[metodoNombre] as(valor: unknown) => void)(VALOR);
    }

    /**
     * Cargar catálogos de datos desde el servicio.
     * 
     * Este método obtiene los catálogos de contenedores desde el servicio
     * y actualiza la lista de contenedores disponibles para el formulario.
     * 
     * @returns {void}
     */
    cargarCatalogos(): void {
        // Cargar catálogo de contenedores
        this.datosTramiteService
            .getContenedoresList()
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((data) => {
                this.contenedores.catalogos = data.datos;
            });
    }

    /**
     * Mostrar campos según el tipo de búsqueda seleccionado.
     */
    mostrarCampos(): void {
        const TIPO_BUSQUEDA = this.solicitudForm.get('tipoBusqueda')?.value;
        this.mostrarAdjuntarArchivo = false;
        this.mostrarSeccionAduanaaFecha = false;
        this.mostrarSeccionContenedor = false;
        this.mostrarSeccionNoManifiesto = false;
        this.mostrarSeccionExcel = false;

        switch (TIPO_BUSQUEDA) {
            case 'Contenedor':
                this.mostrarSeccionContenedor = true;
                this.mostrarSeccionAduanaaFecha = true;
                this.radioContenedor = false;
                this.radioArchivoCsv = true;
                this.radioManifesto = true;
                break;
            case 'No. de Manifiesto':
                this.mostrarSeccionNoManifiesto = true;
                this.radioContenedor = true;
                this.radioArchivoCsv = true;
                this.radioManifesto = false;
                break;
            case 'Archivo CSV':
                this.mostrarAdjuntarArchivo = true;
                this.radioContenedor = true;
                this.radioArchivoCsv = false;
                this.radioManifesto = true;
                break;
            default:
                break;
        }
    }

    /**
     * Limpiar campos del formulario en la sección de contenedor únicamente.
     */
    limpiarCampos(): void {
        this.radioContenedor = false;
        this.radioArchivoCsv = false;
        this.radioManifesto = false;
        // Solo limpiar los campos específicos de la sección contenedor
        const CAMPOS_CONTENEDOR = [{
                campo: 'inicialesContenedor',
                metodo: 'setInicialesContenedor'
            },
            {
                campo: 'numeroContenedor',
                metodo: 'setNumeroContenedor'
            },
            {
                campo: 'digitoDeControl',
                metodo: 'setDigitoDeControl'
            },
            {
                campo: 'contenedores',
                metodo: 'setContenedores'
            }
        ];

        CAMPOS_CONTENEDOR.forEach(({
            campo,
            metodo
        }) => {
            const CONTROL = this.solicitudForm.get(campo);
            if (CONTROL) {
                CONTROL.reset();
                CONTROL.markAsUntouched();
                CONTROL.markAsPristine();
                // Actualizar el store con valores vacíos usando el método existente
                (this.tramite11201Store[metodo as keyof typeof this.tramite11201Store] as(valor: unknown) => void)(null);
            }
        });
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
     * Validar el dígito verificador y agregar la solicitud.
     */
    validarDigitoVerificador(): void {
        this.solicitudForm.markAllAsTouched();
        this.solicitudForm.get('fechaIngreso')?.markAsTouched();
        const ADUANA = this.solicitudForm.value.aduana;
        const FECHAINGRESO = this.solicitudForm.value.fechaIngreso;
        const INICIALESCONTENEDOR = this.solicitudForm.value.inicialesContenedor;
        const NUMEROCONTENEDOR = this.solicitudForm.value.numeroContenedor;
        const CONTENEDORES = this.solicitudForm.value.contenedores;
        if (INICIALESCONTENEDOR && NUMEROCONTENEDOR && ADUANA && CONTENEDORES && FECHAINGRESO) {
            this.agregarSolicitud();
        }
    }

    /**
     * Adjuntar archivo CSV y parsear su contenido.
     * Valida los campos obligatorios antes de abrir el modal.
     */
    adjuntarArchivo(): void {
        // Validar los campos obligatorios antes de abrir el modal
        const ADUANA_VALIDA = this.solicitudForm.get('aduanaMenuDesplegable')?.valid;
        const FECHA_VALIDA = this.solicitudForm.get('fechaDeIngreso')?.valid;

        // Marcar los campos como tocados para mostrar los errores de validación
        this.solicitudForm.get('aduanaMenuDesplegable')?.markAsTouched();
        this.solicitudForm.get('fechaDeIngreso')?.markAsTouched();

        // Solo abrir el modal si ambos campos son válidos
        if (ADUANA_VALIDA && FECHA_VALIDA) {
            this.abrirModalArchivo();
        }
    }

    /**
     * Abre el modal de carga de archivo utilizando Bootstrap.
     * Este método se llama solo después de validar los campos obligatorios.
     */
    abrirModalArchivo(): void {
        this.mostrarArchivoSeleccionadoTable = true;
        const MODAL_ELEMENT = document.getElementById('modalArchivoCsv');
        if (MODAL_ELEMENT) {
            const BOOTSTRAP_MODAL = new(window as any).bootstrap.Modal(MODAL_ELEMENT);
            BOOTSTRAP_MODAL.show();
        }
    }


    /**
     * Handles the file upload process for the application form.
     * 
     * - Retrieves the selected file from the input element with ID 'cargarArchivo'.
     * - Constructs a FormData object with the file and additional form fields: RFC, aduana, and fecha de ingreso.
     * - Calls the `fileUpload` method of `datosTramiteService` to upload the file, passing the form data and solicitud ID.
     * - Subscribes to the upload response and updates `datosTabla` with the returned container data if the response code is '00'.
     * 
     * @remarks
     * This method is intended to be triggered by a user action, such as clicking an upload button.
     */
    archivo(): void {
        const FILE_INPUT = document.getElementById(
            'cargarArchivo'
        ) as HTMLInputElement;
        const FILE = FILE_INPUT.files?.[0];
        if (FILE) {

            const DATOS_FORMULARIO = new FormData();
            DATOS_FORMULARIO.append('archivo', FILE);
            DATOS_FORMULARIO.append('rfc', this.rfc_original);
            DATOS_FORMULARIO.append('aduana', this.solicitudForm.get('aduanaMenuDesplegable')?.value);
            DATOS_FORMULARIO.append('fingreso', convertDate(this.solicitudForm.get('fechaDeIngreso')?.value));

            this.datosTramiteService
                .fileUpload(DATOS_FORMULARIO)
                .pipe(takeUntil(this.destroyNotifier$))
                .subscribe((respuesta) => {
                    if (respuesta?.codigo === '00') {

                        this.datosTabla = respuesta?.datos.contenedores.map((item: any) => ({
                            ...item,
                            vigencia : item.vigencia.split(' ')[0],
                            fecha_inicio : item.fecha_inicio.split(' ')[0],
                            existe_en_vucem: item.existe_en_vucem ? 'Sí' : 'No'
                        }));
                    }
                });
        }
    }

    /**
     * Restablece el estado del componente al regresar de la carga de archivos.
     * 
     * - Oculta la tabla de carga de archivos.
     * - Limpia el valor del input de archivo.
     * - Restablece la etiqueta del archivo a "Sin archivo seleccionados".
     * 
     * @returns {void} No retorna ningún valor.
     */
    regresar(): void {
        const FILE_INPUT = document.getElementById(
            'cargarArchivo'
        ) as HTMLInputElement;
        this.mostrarCargarArchivoTable = false;
        FILE_INPUT.value = '';
        this.etiquetaDeArchivo = '';
    }

    /**
     * Método para analizar una cadena CSV y convertirla en una lista de objetos.
     *
     * Este método toma una cadena CSV, la divide en líneas y luego en columnas, mapea los encabezados
     * a los nombres de las propiedades del objeto y finalmente asigna los valores correspondientes
     * a cada objeto. Los objetos resultantes se almacenan en `datosTabla`.
     *
     * @param {string} csv - La cadena CSV a analizar.
     *
     * @example
     * // Llamar al método para analizar una cadena CSV
     * this.analizarGramaticalmenteCSV('Aduana,Iniciales del equipo,Tipo de equipo,...\nValor1,Valor2,Valor3,...');
     */
    analizarGramaticalmenteCSV(csv: string): void {
        const LINES = csv.split('\n').filter((line) => line.trim() !== '');
        const HEADERS = LINES[0].split(',');
        const HEADER_MAP = HEADER_MAP_DATOS;
        const DATA = LINES.slice(1)
            .map((line) => {
                const VALUES = line.split(',');
                const OBJ: {
                    [key: string]: string
                } = {};
                HEADERS.forEach((header, index) => {
                    const KEY = HEADER_MAP[header.trim()] || header.trim();
                    OBJ[KEY] = VALUES[index]?.trim();
                });
                return OBJ;
            })
            .filter((articulo) => Object.values(articulo).some((valor) => valor));
        this.datosTabla = DATA;
    }

    /**
     * Envía el manifiesto después de validar el formulario de solicitud.
     *
     * Este método marca todos los campos del formulario como tocados y verifica
     * si los campos 'numeroManifiesta' y 'menuDesplegable' son válidos. Si ambos
     * campos son válidos, se muestra un mensaje.
     *
     * @returns {void}
     */
    enviarManifiesto(): void {
        this.solicitudForm.markAllAsTouched();
        if (
            this.solicitudForm.get('numeroManifiesta')?.valid &&
            this.solicitudForm.get('menuDesplegable')?.valid
        ) {
            this.mostrarMensaje = true;
            const TIPO_DE_VALOR_DE_TRANSPORTE = this.solicitudForm.get('menuDesplegable')?.value;
            const NUMERO_DE_MANIFIESTO = this.solicitudForm.get('numeroManifiesta')?.value;
            const PUNTO_FINAL_URL = TIPO_DE_VALOR_DE_TRANSPORTE === '1' ? 'ferroviario' : 'maritimo';
            this.datosTramiteService
                .getByManifestNumber(this.rfc_original, PUNTO_FINAL_URL, NUMERO_DE_MANIFIESTO)
                .pipe(takeUntil(this.destroyNotifier$))
                .subscribe((respuesta) => {
                    if (respuesta?.codigo === '00') {
                        this.datosTablaManifest = respuesta?.datos.contenedores.map((item: any) => ({
                            ...item,
                            vigencia : item.vigencia.split(' ')[0],
                            fecha_inicio: item.fecha_inicio.split(' ')[0],
                            existe_en_vucem: item.existe_en_vucem ? 'Sí' : 'No'
                        }));
                    }
                });
        }
    }

    /**
     * Verifica si el formulario de solicitud es válido y, si es así,
     * implementa la lógica de pago y envía el formulario.
     * Si el formulario no es válido, muestra un mensaje de error.
     *
     * @returns {void}
     */
    esPago(): void {
        if (this.solicitudForm.valid) {
            this.datosTramiteService
                .submitSolicitud()
                .pipe(takeUntil(this.destroyNotifier$))
                .subscribe();
        } else {
            this.mostrarMensaje = true;
        }
    }

    /**
     * Método que selecciona la pestaña actual basada en el índice almacenado en el localStorage.
     * Si el índice existe en el localStorage, lo convierte a número y lo asigna a la propiedad `corrienteIdx`.
     */
    tabSeleccionado(): void {
        const CURRENT_IDX = localStorage.getItem('corrienteIdx');
        if (CURRENT_IDX !== null) {
            this.corrienteIdx = Number(CURRENT_IDX);
        }
    }

    /**
     * Restablece los botones de radio y los campos relacionados en el formulario de solicitud.
     *
     * Este método se utiliza para limpiar el valor del campo 'tipoBusqueda' y
     * llamar a la función `limpiarCampos` para restablecer otros campos relacionados.
     *
     * @returns {void} No retorna ningún valor.
     */
    cancelarRadioButton(): void {
        // Resetear botones de radio y campos relacionados
        this.solicitudForm.get('tipoBusqueda')?.setValue('');
        this.limpiarCampos();
    }

    getDatosGenerales(RFC: string): void {
        this.solicitanteServicio
            .getDatosGeneralesAPI(RFC)
            .pipe(
                tap((response: any) => {
                    if (response) {
                        this.rfc_original = response.datos.rfc_original
                    }
                }),
                takeUntil(this.destroyNotifier$)
            )
            .subscribe();
    }

    /**
     * Agrega una nueva solicitud utilizando el servicio `datosTramiteService`.
     * La solicitud se agrega a la lista `datosDelContenedor` y se actualiza el estado en `tramite11201Store`.
     *
     * @remarks
     * Este método se suscribe al observable devuelto por `agregarSolicitud` y maneja la respuesta.
     * Si la solicitud es exitosa, se actualiza el formulario `solicitudForm` para limpiar los campos y marcarlo como no modificado.
     *
     * @returns {void}
     */
    agregarSolicitud(): void {
        const API_PAYLOAD = {
            "rfc": this.rfc_original,
            "aduana": this.solicitudForm.get('aduana')?.value,
            "fecha_ingreso": convertDate(this.solicitudForm.get('fechaIngreso')?.value),
            "iniciales_contenedor": this.solicitudForm.get('inicialesContenedor')?.value,
            "numero_contenedor": this.solicitudForm.get('numeroContenedor')?.value,
            "digito_verificador": this.solicitudForm.get('digitoDeControl')?.value,
            "tipo_contenedor": this.solicitudForm.get('contenedores')?.value
        }
        this.datosTramiteService
            .agregarSolicitud(API_PAYLOAD)
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((respuesta) => {
                // Manejar éxito, posiblemente refrescar la grilla o mostrar mensaje
                if (respuesta?.codigo === '00') {
                    respuesta.datos.existe_en_vucem = respuesta.datos.existe_en_vucem ? 'Sí' : 'No';
                    respuesta.datos.vigencia = respuesta.datos.vigencia.split(' ')[0];
                    respuesta.datos.fecha_inicio = respuesta.datos.fecha_inicio.split(' ')[0];
                    respuesta.datos.id = this.datosDelContenedor.length + 1;
                    this.datosDelContenedor = [...this.datosDelContenedor, respuesta.datos];
                    (
                        this.tramite11201Store.setDelContenedor as(
                            valor: DatosDelContenedor[]
                        ) => void
                    )(this.datosDelContenedor);

                    // Restablecer los valores del formulario para los campos de la sección de contenedor
                    this.solicitudForm.patchValue({
                        digitoDeControl: '',
                        inicialesContenedor: '',
                        numeroContenedor: '',
                        contenedores: this.contenedores.primerOpcion,
                    });

                    // Limpiar el estado de validación de todos los controles del formulario
                    this.clearFormValidationState();

                    // Específicamente limpiar estado de validación de los dropdowns
                    const ADUANA_CONTROL = this.solicitudForm.get('aduana');
                    const CONTENEDORES_CONTROL = this.solicitudForm.get('contenedores');
                    if (ADUANA_CONTROL) {
                        ADUANA_CONTROL.markAsUntouched();
                        ADUANA_CONTROL.markAsPristine();
                        ADUANA_CONTROL.setErrors(null);
                    }
                    if (CONTENEDORES_CONTROL) {
                        CONTENEDORES_CONTROL.markAsUntouched();
                        CONTENEDORES_CONTROL.markAsPristine();
                        CONTENEDORES_CONTROL.setErrors(null);
                    }
                }
            });
    }

   

    /**
     * Clears the validation state of all form controls to remove inline validation errors.
     * This method marks all controls as untouched and pristine.
     */
    private clearFormValidationState(): void {
        this.solicitudForm.markAsUntouched();
        this.solicitudForm.markAsPristine();
        Object.keys(this.solicitudForm.controls).forEach(key => {
            const CONTROL = this.solicitudForm.get(key);
            if (CONTROL) {
                CONTROL.markAsUntouched();
                CONTROL.markAsPristine();
                CONTROL.setErrors(null);
            }
        });
    }

    /**
     * Método para obtener la lista de transporte.
     *
     * Este método llama al servicio `datosTramiteService` para obtener la lista de transporte
     * y suscribe a los resultados hasta que el componente sea destruido. Los datos obtenidos
     * se asignan a la propiedad `catalogoList`.
     *
     * @returns {void} No retorna ningún valor.
     */
    public fetchgetTransporteList(): void {
        this.datosTramiteService
            .getTransporteList('transporteList')
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((respuesta) => {
                this.catalogoList = respuesta.data;
            });
    }

    /**
     * Método para obtener la lista de aduanas.
     *
     * Este método realiza una solicitud al servicio `datosTramiteService` para obtener la lista de aduanas.
     * La respuesta se almacena en la propiedad `aduanaList.catalogos`.
     *
     * @returns {void} No retorna ningún valor.
     */
    public fetchAduanaList(): void {
        this.datosTramiteService
            .getAduanaCatalogList()
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((respuesta) => {
                this.aduanaList.catalogos = respuesta.datos;
            });
    }

    /**
     * Abre un modelo modal con los datos proporcionados.
     *
     * @param datos - Los datos que se pasarán al modelo modal.
     * @returns void
     */
    abiertoModelo(datos: string): void {
        this.abiertoModeloDatos = datos;
        this.modalRef = this.modalService.show(this.plantillaDeModelo, {
            id: 1,
            class: 'modal-sm',
        });
    }

    /**
     * Actualiza la fecha de ingreso en el formulario de solicitud.
     *
     * @param nuevo_valor - El nuevo valor de la fecha de ingreso en formato de cadena.
     */
    public cambioFechaDeIngreso(nuevo_valor: string): void {
        this.solicitudForm.get('fechaDeIngreso')?.setValue(nuevo_valor);
        this.solicitudForm.get('fechaDeIngreso')?.markAsTouched();
        this.solicitudForm.get('fechaDeIngreso')?.markAsDirty();
        this.setValoresStore(this.solicitudForm, 'fechaDeIngreso', 'setFechaDeIngreso');
    }

    /**
     * Cambia la fecha de ingreso en el formulario de solicitud.
     *
     * @param nuevo_valor - El nuevo valor de la fecha de ingreso en formato de cadena.
     */
    public cambioFechaIngreso(nuevo_valor: string): void {
        this.solicitudForm.get('fechaIngreso')?.setValue(nuevo_valor);
        this.solicitudForm.get('fechaIngreso')?.markAsTouched();
        this.solicitudForm.get('fechaIngreso')?.markAsDirty();
        this.setValoresStore(this.solicitudForm, 'fechaIngreso', 'setFechaIngreso');
    }

    /**
     * Activa la selección del archivo de medicamentos.
     * @returns {void}
     */
    activarSeleccionArchivo(): void {
        this.entradaArchivo = document.getElementById(
            'cargarArchivo'
        ) as HTMLInputElement;
        if (this.entradaArchivo) {
            this.entradaArchivo.click();
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
        const FILE_INPUT = document.getElementById(
            'cargarArchivo'
        ) as HTMLInputElement;
        const FILE = FILE_INPUT.files?.[0];
        if (FILE) {
            if (FILE.type !== 'text/csv' && !FILE.name.endsWith('.csv')) {
                this.abrirModal();
                FILE_INPUT.value = '';
                return;
            }

            if (TARGET.files && TARGET.files.length > 0) {
                this.archivoMedicamentos = TARGET.files[0];
                this.etiquetaDeArchivo = this.archivoMedicamentos.name;
            } else {
                this.etiquetaDeArchivo = '';
            }
        }
    }

    /**
     * Elimina un pedimento de la lista si el parámetro `borrar` es verdadero.
     *
     * @param borrar - Indica si se debe eliminar el pedimento seleccionado.
     * 
     * Si `borrar` es `true`, elimina el elemento en la posición `elementoParaEliminar` del arreglo `pedimentos`.
     */
    eliminarPedimento(borrar: boolean): void {
        if (borrar) {
            this.pedimentos.splice(this.elementoParaEliminar, 1);
        }
        this.nuevaNotificacion = undefined;
    }

    /**
     * Abre un modal de notificación para alertar al usuario que debe seleccionar un archivo CSV.
     * 
     * @param i - (Opcional) Índice del elemento a eliminar. Por defecto es 0.
     * 
     * Este método inicializa la notificación con un mensaje de alerta y configura el elemento a eliminar.
     */
    abrirModal(i: number = 0): void {
        this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
            mensaje: 'El archivo no tiene la extensión definida CSV, deberá de adjuntar el archivo correcto.',
            cerrar: false,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'OK',
            txtBtnCancelar: '',
        };
        this.elementoParaEliminar = i;
    }
    /**
     * Maneja el evento blur (pérdida de foco) en los campos del formulario
     * para activar la validación visual.
     *
     * @param fieldName - Nombre del campo que perdió el foco.
     */
    public onFieldBlur(fieldName: string): void {
        const CONTROL = this.solicitudForm.get(fieldName);
        if (CONTROL) {
            CONTROL.markAsTouched();
            CONTROL.markAsDirty();
        }
    }

    /**
     * Maneja la validación específica para campos de fecha cuando se interactúa con ellos.
     *
     * @param fieldName - Nombre del campo de fecha.
     */
    public onDateFieldInteraction(fieldName: string): void {
        const CONTROL = this.solicitudForm.get(fieldName);
        if (CONTROL) {
            CONTROL.markAsTouched();
            CONTROL.markAsDirty();
        }
    }

    /**
     * Verifica si un control del formulario es inválido, tocado o modificado.
     * @param nombreControl - Nombre del control a verificar.
     * @returns True si el control es inválido, de lo contrario false.
     */
    public esInvalido(nombreControl: string): boolean {
        const CONTROL = this.solicitudForm.get(nombreControl);
        return CONTROL ?
            CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) :
            false;
    }
    /**
     * Guarda la solicitud actual de trámite 11201.
     *
     * Selecciona la fuente de datos de contenedores según el valor del campo
     * "tipoBusqueda" del formulario (puede ser 'Contenedor', 'Archivo CSV' o
     * 'No. de Manifiesto') y normaliza cada entrada:
     *  - convierte `existe_en_vucem` de 'Sí'/'No' a booleano,
     *  - concatena " 00:00:00" a los campos `vigencia` y `fecha_inicio`.
     *
     * Construye un payload con:
     *  - id_solcitud: tomado de `this.solicitud11201State.idSolicitud` o `null`,
     *  - solicitante: objeto con `rfc` tomado de `this.rfc_original` y demás campos
     *    de metadatos del solicitante,
     *  - contenedores: arreglo normalizado según la búsqueda seleccionada.
     *
     * Envía el payload a `datosTramiteService.solicitudGuardar(...)` y se suscribe
     * al observable usando `takeUntil(this.destroyNotifier$)` para manejar el
     * ciclo de vida del componente. Si la respuesta tiene `codigo === '00'`:
     *  - actualiza el estado del store con el id de solicitud recibido
     *    (`this.tramite11201Store.setIdSolicitud(...)`) y
     *  - invoca `this.continuar()` para avanzar el flujo del trámite.
     *
     * Observaciones y efectos secundarios:
     *  - Modifica el estado del store y puede provocar navegación o cambios en UI
     *    mediante `continuar()`.
     *  - No devuelve valor (void). Los errores de la petición deben manejarse
     *    externamente o ampliando la suscripción para capturar errores.
     *
     * @remarks
     * Este método depende de:
     *  - `this.solicitudForm` (campo 'tipoBusqueda'),
     *  - las fuentes de datos `this.datosDelContenedor`, `this.datosTabla`,
     *    `this.datosTablaManifest`,
     *  - `this.rfc_original`, `this.solicitud11201State`,
     *  - `this.datosTramiteService`, `this.tramite11201Store` y `this.continuar()`.
     *
     * @returns void
     */

    solicitudGuardar(): void {
        const TIPO_BUSQUEDA = this.solicitudForm.get('tipoBusqueda')?.value as SearchType;
        const TIPO_NORMALIAR = (item: any): any => ({
            ...item,
            existe_en_vucem: item.existe_en_vucem === 'Sí' ? true : false,
            vigencia: item.vigencia ? `${item.vigencia} 00:00:00` : item.vigencia,
            fecha_inicio: item.fecha_inicio ? `${item.fecha_inicio} 00:00:00` : item.fecha_inicio
        });

        let contenedores: any[] = [];

        switch (TIPO_BUSQUEDA) {
            case SearchType.Contenedor:
                contenedores = this.datosDelContenedor.map(TIPO_NORMALIAR);
                break;
            case SearchType.ArchivoCsv:
                contenedores = this.datosTabla.map(TIPO_NORMALIAR);
                break;
            case SearchType.NoManifiesto:
                contenedores = this.datosTablaManifest.map(TIPO_NORMALIAR);
                break;
            default:
                contenedores = [];
        }

        const PAYLOAD = {
            "id_solcitud": this.solicitud11201State.idSolicitud || null,
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
                        this.tramite11201Store.setIdSolicitud(respuesta.datos.id_solicitud);
                        this.continuar();
                    }
                }
            );
    }


    /**
     * Emit a cancellation notification to parent components or other listeners.
     *
     * This method signals that the current operation should be cancelled by
     * emitting the `cancelEvent`. The emitted event carries no payload.
     *
     * @remarks
     * Use this to trigger UI cleanup (e.g., close dialogs) or to abort in-progress workflows.
     *
     * @returns void
     */
    cancelar(): void {
        this.cancelEvent.emit();
    }

    /**
     * Emit the continuarEvento to notify subscribers that the user intends to continue.
     *
     * This method triggers any handlers listening to the continuarEvento EventEmitter.
     * It performs no additional logic and returns immediately.
     *
     * @remarks
     * Typically used to delegate continuation behavior to a parent component or service
     * that subscribes to the continuarEvento.
     *
     * @returns void
     *
     * @fires continuarEvento
     */
    continuar(): void {
        this.continuarEvento.emit();
    }


}