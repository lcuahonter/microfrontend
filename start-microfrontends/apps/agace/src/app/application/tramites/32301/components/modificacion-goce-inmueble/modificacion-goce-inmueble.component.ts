import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  AlertComponent,
  Catalogo,
  ConfiguracionColumna,
  ConsultaioQuery,
  NotificacionesComponent,
  TablaSeleccion,
  TableComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  CONFIGURATION_TABLA_MOSTRAR_GRID_NUEVO_HEADER,
  CVE_TIPO_DOC_DATA,
  FRACCION_ARANCELARIA_DATA,
  MESSAGE_NAC,
  MODIFICACION_PARTES_HEADER,
  MostrarGridNuevoHeader,
  RADIO_OPTIONS,
} from '../../enums/modificacion-goceInmueble.enum';
import { CatalogoSelectComponent, InputRadioComponent, Notificacion, TablaDinamicaComponent, TablePaginationComponent } from '@libs/shared/data-access-user/src';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  REGEX_POSTAL,
  REGEX_RFC,
} from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import {
  ModificacionGoceInmueble,
} from '../../models/avisomodify.model';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { Tramite32301Store } from '../../estados/tramite32301.store';

@Component({
  selector: 'app-modificacion-goce-inmueble',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    AlertComponent,
    TableComponent,
    CatalogoSelectComponent,
    NotificacionesComponent,
    TablaDinamicaComponent,
    TablePaginationComponent
  ],
  templateUrl: './modificacion-goce-inmueble.component.html',
})
export class ModificacionGoceInmuebleComponent
  implements OnInit, AfterViewInit, OnDestroy {

  /**
 * Configuración de las columnas de la tabla de bitácora.
 * @type {ConfiguracionColumna<MostrarGridNuevoHeader>[]}
 */
  configuracionTablas: ConfiguracionColumna<MostrarGridNuevoHeader>[] = CONFIGURATION_TABLA_MOSTRAR_GRID_NUEVO_HEADER;


  /** Formulario reactivo para la modificación del goce de inmueble */
  modificacionGoceForm!: FormGroup;

  /** Opciones para los radios de selección: "Domicilio nuevo" o "Modificar domicilio" */
  radioOptions = RADIO_OPTIONS;

  /** Mensaje de información para la modificación de partes contratantes */
  messageNac = MESSAGE_NAC;

  /** Bandera para mostrar el grid de domicilios nuevos */
  mostrarGridNuevo: boolean = false;

  /** Bandera para mostrar el grid de domicilios modificados */
  mostrarGridModificado: boolean = false;

  /** Instancia del modal para el domicilio nuevo */
  modalDomiciliosInmuebleNuevoInstance!: Modal;


  /** Encabezados y cuerpo de la tabla a mostrar en el grid modificado */
  public gridMostrarGridModificado:
    | { tableHeader: string[]; tableBody: string[] }
    | undefined;


  /** Cuerpo de la tabla */

  /** Encabezado para los domicilios modificados */
  gridDomiciliosModificadosHeader: string[] = [];

  /** Encabezado de la tabla de domicilios nuevos */
  mostrarGridNuevoHeader = CONFIGURATION_TABLA_MOSTRAR_GRID_NUEVO_HEADER;

  /** Encabezado de la tabla de partes modificadas */
  modificacionPartesHeader = MODIFICACION_PARTES_HEADER;

  /** Datos de las partes modificadas */
  modificacionPartesData: { tbodyData: string[] }[] = []

  /** Datos de la tabla de domicilios modificados */
  gridDomiciliosModificadosData: MostrarGridNuevoHeader[] = [];

  /**
 * Configuración de las columnas de la tabla de exportadores.
 * Define el encabezado, clave y el orden de las columnas para la tabla de exportadores.
 */
  public checkbox = TablaSeleccion.CHECKBOX;

  /** Datos para mostrar en la tabla de domicilios nuevos */
  mostrarGridNuevoHeaderData: MostrarGridNuevoHeader[] = [];

  /** Catálogo de entidades federativas */
  entidadFederativa!: Catalogo[];

  /** Datos de las fracciones arancelarias */
  fraccionArancelaria: Catalogo[] = [];

  /** Datos de los tipos de documento */
  cveTipoDoc: Catalogo[] = [];

  mensajeCamposObligatorios: string =  '* Campos obligatorios';

  @Output() onContinue = new EventEmitter<void>();



  /** Referencia al modal de domicilio nuevo */
  @ViewChild('modalDomiciliosInmuebleNuevo', { static: false })
  modalDomiciliosInmuebleNuevo!: ElementRef;

  /** Formulario para manejar la dirección del inmueble */
  direccionGrid!: FormGroup;

  /** Lista de partes contratantes modificadas */
  modificacionPartes: Array<{ rfc: string; nombre: string; caracter_de: string }> =
    [];

  /** Sujeto para manejar la destrucción del componente */
  public destroy$: Subject<void> = new Subject<void>();

  /** Objeto que maneja el modelo de modificación del goce del inmueble */
  modificacionGoceInmueble!: ModificacionGoceInmueble;

  /**
   * Declaración de la variable modificarRecordNotificacion de tipo Notificacion.
   * Se utiliza para gestionar notificaciones relacionadas con la modificación de registros.
   */
  public modificarRecordNotificacion!: Notificacion;

  /**
   * Declaración de la variable modificarNotificacion de tipo Notificacion.
   * Se usa para manejar notificaciones generales sobre modificaciones dentro del sistema.
   */
  public modificarNotificacion!: Notificacion;
  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;
  /**
 * Fila seleccionada en la tabla de mercancías seleccionadas.
 * 
 * Representa la mercancía seleccionada actualmente en la tabla de mercancías seleccionadas.
 */
  seleccionadasFila!: MostrarGridNuevoHeader | null;

  modificacionPartesSeleccionadas: any;
  /**
 * Estado de la selección de la tabla.
 * @type {TablaSeleccion}
 */
  seleccionTabla = TablaSeleccion.CHECKBOX;

  modification: boolean =false;

  /**
   * Constructor del componente ModificacionGoceInmuebleComponent.
   * 
   * Inicializa los servicios necesarios y configura la suscripción al estado de Consultaio.
   * 
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {AvisoModifyService} AvisoModifyService - Servicio para manejar la modificación de avisos.
   * @param {Tramite32301Store} store - Store para manejar el estado del trámite 32301.
   * @param {Tramite32301Query} Tramite32301Query - Query para consultar el estado del trámite 32301.
   * @param {ConsultaioQuery} consultaioQuery - Query para consultar el estado de Consultaio.
   */
  constructor(
    private fb: FormBuilder,
    private AvisoModifyService: AvisoModifyService,
    private store: Tramite32301Store,
    private Tramite32301Query: Tramite32301Query,
    private consultaioQuery: ConsultaioQuery,
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
      .subscribe()
    // Inicializa el formulario si es necesario
  }

  /**
  * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
  * 
  * Llama al método `inicializarEstadoFormulario()` para configurar el estado inicial
  * del formulario al momento de cargar el componente.
  */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.Tramite32301Query
      .selectState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((formState) => {
        this.mostrarGridNuevoHeaderData = formState.mostrarGridNuevoHeaderData || [];

        if (formState?.modificacionGoceForm) {
          this.modificacionGoceForm.patchValue(formState.modificacionGoceForm);

        }
      });

  }


  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
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
      this.direccionGrid.disable();
      this.modificacionGoceForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.direccionGrid.enable();
      this.modificacionGoceForm.enable();
    }
  }
  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    // Inicializa el formulario reactivo
    this.modificacionGoceForm = this.fb.group({
      ideGenerica2: ['', Validators.required], // Campo obligatorio para la selección de tipo de modificación
    });

    this.initializeForm(); // Inicializa el formulario para la dirección
    this.getEntidadFederativa(); // Obtiene el catálogo de entidades federativas
    this.getCveTipoDoc(); // Obtiene el catálogo de tipos de documento
  }



  /** Método para obtener las entidades federativas del servicio */
  getEntidadFederativa(): void {
    this.AvisoModifyService.getEntidadFederativa()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.entidadFederativa = Object.assign([], resp.datos); // Asigna los datos al catálogo de entidades federativas
      });
  }
/**
 * Retrieves the list of *fracción arancelaria* (tariff fractions)
 * based on the selected entity (`cveEntidad`) from the form.
 *
 * Calls the `getMunicipiosDelegaciones` service method using the
 * value from `direccionGrid`, subscribes to the response, and
 * assigns the returned data to `fraccionArancelaria`.
 *
 * Uses `takeUntil(this.destroy$)` to prevent memory leaks.
 *
 * @returns {void}
 */
  getFraccionArancelaria(): void {
    this.AvisoModifyService.getMunicipiosDelegaciones(this.direccionGrid.get('cveEntidad')?.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        console.log(this.fraccionArancelaria);
        this.fraccionArancelaria = Object.assign([], resp.datos); // Asigna los datos al catálogo de fracción arancelaria
      });
  }


    getFraccionArancelariaForModifi(param:string): void {
    this.AvisoModifyService.getMunicipiosDelegaciones(param)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.fraccionArancelaria = Object.assign([], resp.datos); // Asigna los datos al catálogo de fracción arancelaria
      });
  }
  /**
 * Emits the continue event to notify parent components
 * that the user wants to proceed to the next step.
 */
  continuar(): void {
    this.onContinue.emit();
  }

  /**
 * Fetches the catalog of document types from the service (cveTipoDoc)
 * and assigns the returned data to the local variable.
 *
 * @returns {void}
 */
  getCveTipoDoc(): void {
    this.AvisoModifyService.getCveTipoDoc()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.cveTipoDoc = Object.assign([], resp.datos); // Asigna los datos al catálogo de tipo de documento
      });
  }

  /** Inicializa las instancias de los modales después de que la vista está completamente cargada */
  ngAfterViewInit(): void {
    if (this.modalDomiciliosInmuebleNuevo?.nativeElement) {
      this.modalDomiciliosInmuebleNuevoInstance = new Modal(
        this.modalDomiciliosInmuebleNuevo.nativeElement
      );
    }
  }

  /** Método para inicializar el formulario de dirección */
  private initializeForm(): void {
    this.direccionGrid = this.fb.group({
      idInmueble: [''],
      domicilio: ['', [Validators.required, Validators.maxLength(250)]],
      codigoPostal: [
        '',
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(REGEX_POSTAL),
        ],
      ],
      entidadFederativa: [''],
      cveEntidad: ['', Validators.required],
      alcaldiaOMunicipio: [''],
      cveMunicipio: ['', Validators.required],
      tipoDeDocumentoConElQueSeAcreditaElUsoYGoce: [''],
      cveTipoDoc: ['', Validators.required],
      fechaInicioDeVigencia: ['', Validators.required],
      fechaFinVigencia: ['', Validators.required],
      rfcPartesC: [
        '',
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.pattern(REGEX_RFC),
        ],
      ],
      rfcPartesCons: [{ value: '', disabled: true }],
      nombrePartesCons: [{ value: '', disabled: true }],
      caracterDeCons: ['', [Validators.required, Validators.maxLength(30)]],
      observaciones: ['', [Validators.maxLength(500)]],
    });

  }

  /** Verifica el tipo de modificación seleccionada en el radio y muestra el modal correspondiente */
  verificaRadioTipoSem(ev: string | number): void {
    const VALOR = Number(ev);
    if (VALOR === 0) {
      this.openModificarModel();
      this.mostrarGridNuevo = false;
      this.mostrarGridModificado = true;
      this.getInmueblesModificar();

    } else if (VALOR === 1) {
      this.mostrarGridNuevo = true;
      this.mostrarGridModificado = false;
      this.getGridInmueblesNuevo();

    } else {
      this.mostrarGridNuevo = false;
      this.mostrarGridModificado = false;
    }
  }

  getInmueblesModificar(): void {
    const REQUEST_PARAM='202768213';
    this.AvisoModifyService.getInmueblesModificar(REQUEST_PARAM).subscribe((resp) => {
      if(resp.codigo === "00"){
        this.mostrarGridNuevoHeaderData = resp.datos.map((item: any, index: number) => ({ ...item, id: index + 1 }));

      }
    });
  }
  getGridInmueblesNuevo() {
    const REQUEST_PARAM='202768213';
    this.AvisoModifyService.getGridInmueblesNuevo(REQUEST_PARAM).subscribe((resp) => {
      if(resp.codigo === "00"){
        this.mostrarGridNuevoHeaderData = resp.datos.map((item: any, index: number) => ({ ...item, id: index + 1 }));
      }
    });
  }

  /** Abre el modal para agregar un domicilio nuevo */
  abrirModalDomiciliosNvo(): void {
    this.openModalDomiciliosInmuebleNuevoModel();
  }

  /** Carga los datos del RFC de las partes contratantes */
  cargarDatosRfcPartesC(): void {
    const RFC_PARTES_C = this.direccionGrid.get('rfcPartesC')?.value;
    this.AvisoModifyService.getRFCDetails(RFC_PARTES_C).subscribe((resp) => {
      if(resp.codigo === '00'){
        this.direccionGrid.patchValue({
          rfcPartesCons: resp.datos?.rfc || '',
          nombrePartesCons: resp.datos?.nacionalidad.nombre || '',
        });
      }
    });

  }

  /** Limpia los campos relacionados con las partes contratantes */
  limpiaCamposParteC(): void {
    this.direccionGrid.patchValue({
      rfcPartesC: '',
      rfcPartesCons: '',
      nombrePartesCons: '',
      caracterDeCons: '',
    });
  }

  /** Agrega una nueva parte contratante a la lista */
  agregarParteC(): void {
    const NUEVO_PARTE = {
      rfc: this.direccionGrid.get('rfcPartesCons')?.value,
      nombre: this.direccionGrid.get('nombrePartesCons')?.value,
      caracter: this.direccionGrid.get('caracterDeCons')?.value,
    };

    if (NUEVO_PARTE.rfc && NUEVO_PARTE.nombre && NUEVO_PARTE.caracter) {
        // Manejar la respuesta de la validación si es necesario
        const nuevaFila = {
            tbodyData: [
              String(NUEVO_PARTE.rfc ?? ''),
              String(NUEVO_PARTE.nombre ?? ''),
              String(NUEVO_PARTE.caracter ?? '')
            ]
          };
          this.modificacionPartesData = [
            ...this.modificacionPartesData,
            nuevaFila
          ];
        this.limpiaCamposParteC();
    } else {
      // Manejar posibles errores de validación, tal vez mostrar un mensaje de error
    }


  }

  /** Elimina la última parte contratante de la lista */
  eliminarParteC(): void {
    const selectedRecord =  this.modificacionPartesSeleccionadas.tbodyData;
    if (!selectedRecord) {
      return;
    }
    this.modificacionPartesData = this.modificacionPartesData.filter(
      (row) => JSON.stringify(row.tbodyData) !== JSON.stringify(selectedRecord)
    );
  }
  onSelected(event: any): void {
    this.modificacionPartesSeleccionadas = event;
  }

  /** Método para establecer los valores en el store */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR); // Llama al método correspondiente en el store
  }

  /** Método para obtener los valores del store y actualizar la vista */
  /**
   * Retrieves the modification of property enjoyment data from the store.
   * Subscribes to the ModificacionGoceInmueble$ observable and updates the component's
   * modificacionGoceInmueble property with the latest state value.
   * The subscription automatically unsubscribes when the component is destroyed.
   */
  getValorStore(): void {
    this.Tramite32301Query.selectModificacionGoceInmueble$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.modificacionGoceInmueble =
          state as unknown as ModificacionGoceInmueble;
      });
  }

  /** Guarda el domicilio del inmueble nuevo */
  
  /**
   * Saves a new property address (domicilio) by validating and storing the data.
   * 
   * @param direccionGrid - FormGroup containing the address form data to be saved
   * 
   * @description
   * This method constructs a data object from the provided FormGroup, sends it to the validation service,
   * and upon successful response (codigo === '00'), either updates an existing grid item or adds a new one
   * to the mostrarGridNuevoHeaderData array. It then updates the store, closes the modal, and resets the form.
   * 
   * @remarks
   * - If a row is already selected (seleccionadasFila), it updates that row; otherwise, it creates a new entry
   * - The grid data is persisted to the store via setMostrarGridNuevoHeaderData
   * - The modal is automatically closed upon successful save
   * - The form is reset after processing
   * 
   * @returns void
   */
  guardarDomInmuebleNvo(direccionGrid: FormGroup): void {
      const dataToSend = {
          "direccion": this.direccionGrid.get('domicilio')?.value, 
          "codigo_postal": this.direccionGrid.get('codigoPostal')?.value,
          "cve_entidad": this.direccionGrid.get('cveEntidad')?.value,
          "cve_municipio": this.direccionGrid.get('cveMunicipio')?.value,
          "cve_tipo_doc": this.direccionGrid.get('cveTipoDoc')?.value,
          "fecha_inicio_actual": null,
          "fecha_fin_actual": null,
          "fecha_inicio_anterior": this.direccionGrid.get('fechaInicioDeVigencia')?.value,
          "fecha_fin_anterior": this.direccionGrid.get('fechaFinVigencia')?.value,
          "observaciones": this.direccionGrid.get('observaciones')?.value,
          "partes": this.modificacionPartesData?.map(parte => ({
              rfc: parte.tbodyData[0],
              nombre: parte.tbodyData[1],
              caracter_de: parte.tbodyData[2]
          })),
          "es_modificacion": this.modification
        };
  this.AvisoModifyService.validarInmueble(dataToSend).subscribe((resp) => {
    if(resp.codigo === '00'){
      const FORM_VALUES = direccionGrid.getRawValue();
      const NUEVA_ITEM: MostrarGridNuevoHeader = {
        id_solicitud: this.seleccionadasFila?.id_solicitud ?? resp.datos.id ?? this.mostrarGridNuevoHeaderData.length + 1,
        id_avi_inmueble: resp.datos.id_avi_inmueble || '',
        domicilio: resp.datos.direccion || '',
        codigo_postal: resp.datos.codigo_postal || '',
        entidadFederativa: resp.datos.cve_entidad || '',
        cve_entidad: resp.datos.cve_entidad || '',
        cve_municipio: resp.datos.cve_municipio || '',
        tipoDeDocumentoConElQueSeAcreditaElUsoYGoce: resp.datos.tipoDeDocumentoConElQueSeAcreditaElUsoYGoce || '',
        cve_tipo_doc: resp.datos.cve_tipo_doc || '',
        fecha_inicio_anterior: resp.datos.fecha_inicio_anterior || '',
        fecha_fin_actual: resp.datos.fecha_fin_actual || '',
        fecha_fin_anterior: resp.datos.fecha_fin_anterior || '',
        observaciones: resp.datos.observaciones || '',
        partes: resp.datos.partes || [],
        fecha_inicio_actual: resp.datos.fecha_inicio_actual || '',
        direccion: resp.datos.direccion || '',
        es_modificacion: resp.datos.es_modificacion,
        fecha_aviso: resp.datos.fecha_aviso || '',
        numero_aviso: resp.datos.numero_aviso,
        tipo_modificacion: resp.datos.tipo_modificacion || '',
        bln_partes: resp.datos.bln_partes,
        bln_vigencia: resp.datos.bln_vigencia,
        generico_1: resp.datos.generico_1 ||'',
      };

    const INDEX = this.mostrarGridNuevoHeaderData.findIndex(
      item => item.id_solicitud === NUEVA_ITEM.id_solicitud
    );

    if (INDEX !== -1) {
      this.mostrarGridNuevoHeaderData = this.mostrarGridNuevoHeaderData.map((item, i) =>
        i === INDEX ? NUEVA_ITEM : item
      );
    } else {
      this.mostrarGridNuevoHeaderData = [
        ...this.mostrarGridNuevoHeaderData,
        NUEVA_ITEM
      ];
    }

    this.store.setMostrarGridNuevoHeaderData(this.mostrarGridNuevoHeaderData);
    this.seleccionadasFila = null;

    if (this.modalDomiciliosInmuebleNuevoInstance) {
      this.modalDomiciliosInmuebleNuevoInstance.hide();
    }
    this.direccionGrid.reset();
    }
      
  });


  }


    aceptarInfo(event: boolean): void {
    if (event) {
      this.modification = true;
    }
  }

  /** Cierra el modal del domicilio nuevo */
  cerrarDialogoDomInmuebleNvo(): void {
    this.closeModalDomiciliosInmuebleNuevoModel();
  }

  /** Abre el modal para modificar el domicilio */
  openModificarModel(): void {
    this.modificarNotificacion = {
      /**
       * Tipo de notificación: alerta.
       */
      tipoNotificacion: 'alert',

      /**
       * Categoría de la notificación: peligro (danger).
       */
      categoria: 'success',

      /**
       * Modo de la notificación: acción requerida.
       */
      modo: 'action',

      /**
       * Título de la notificación (actualmente vacío).
       */
      titulo: '',

      /**
       * Mensaje de la notificación, indicando que No es posible presentar Alta y Modificación de domicilios en elmismo aviso de manera simultánea. Se eliminará la informacióncapturada ¿Desea cambiar a la opción modificar domicilio?.
       */
      mensaje:
        'No es posible presentar Alta y Modificación de domicilios en elmismo aviso de manera simultánea. Se eliminará la informacióncapturada ¿Desea cambiar a la opción modificar domicilio?',

      /**
       * Indica si la notificación debe cerrarse automáticamente (false = no se cerrará).
       */
      cerrar: false,

      /**
       * Tiempo de espera antes de cerrar la notificación (2000 milisegundos).
       */
      tiempoDeEspera: 2000,

      /**
       * Texto del botón de aceptación en la notificación.
       */
      txtBtnAceptar: 'Aceptar',

      /**
       * Texto del botón de cancelación en la notificación (actualmente vacío).
       */
      txtBtnCancelar: 'Cancelar',
    };
  }

  /** Abre el modal de domicilio nuevo */
  openModalDomiciliosInmuebleNuevoModel(): void {
    if (this.modalDomiciliosInmuebleNuevoInstance) {
      this.modalDomiciliosInmuebleNuevoInstance.show();
    }
  }

  /** Cierra el modal de domicilio nuevo */
  closeModalDomiciliosInmuebleNuevoModel(): void {
    if (this.modalDomiciliosInmuebleNuevoInstance) {
      this.modalDomiciliosInmuebleNuevoInstance.hide(); // Oculta el modal
    }
  }

  /** Abre el modal para modificar el registro */
  openModificarRecordModel(): void {
    this.modificarRecordNotificacion = {
      /**
       * Tipo de notificación: alerta.
       */
      tipoNotificacion: 'alert',

      /**
       * Categoría de la notificación: peligro (danger).
       */
      categoria: 'success',

      /**
       * Modo de la notificación: acción requerida.
       */
      modo: 'action',

      /**
       * Título de la notificación (actualmente vacío).
       */
      titulo: '',

      /**
       * Mensaje de la notificación, indicando que Selecciona sólo un registro para modificar.
       */
      mensaje: 'Selecciona sólo un registro para modificar.',

      /**
       * Indica si la notificación debe cerrarse automáticamente (false = no se cerrará).
       */
      cerrar: false,

      /**
       * Tiempo de espera antes de cerrar la notificación (2000 milisegundos).
       */
      tiempoDeEspera: 2000,

      /**
       * Texto del botón de aceptación en la notificación.
       */
      txtBtnAceptar: 'Aceptar',

      /**
       * Texto del botón de cancelación en la notificación (actualmente vacío).
       */
      txtBtnCancelar: '',
    };
  }

  /** Maneja la destrucción del componente y la limpieza de observables */
  ngOnDestroy(): void {
    /** Envía una señal para destruir los observables */
    this.destroy$.next();

    /** Completa el Subject para evitar memory leaks */
    this.destroy$.complete();
  }
  /**
   * Maneja la selección de filas en la tabla de seleccionadas.
   * 
   * Este método asigna la fila seleccionada a `seleccionadasFila`.
   * 
   * @param {FraccionGridItem} evento - La fila seleccionada en la tabla de mercancías seleccionadas.
   */
  seleccionDeFilas(evento: MostrarGridNuevoHeader): void {
    this.seleccionadasFila = evento;
  }
  /**
   * Modifica la fila seleccionada en la tabla de mercancías seleccionadas.
   * 
   * Este método actualiza el formulario con los valores de la fila seleccionada y muestra el modal de fracciones.
   * 
   * @param {FraccionGridItem} seleccionadasTablaDatos - La fila seleccionada en la tabla de mercancías seleccionadas.
   */
  modificarDomicilioSeleccionado(seleccionadasTablaDatos?: MostrarGridNuevoHeader): void {
    if(!this.seleccionadasFila) {
      this.openModificarRecordModel();
      return;
    }
    
    const FORM_VALUES = seleccionadasTablaDatos;
    if (this.modalDomiciliosInmuebleNuevoInstance && this.seleccionadasFila) {
      this.modalDomiciliosInmuebleNuevoInstance?.show();
    }
    
    console.log( FORM_VALUES?.partes?.map((parte: any) => ({
          rfc: parte.rfc || '',
          nombre: parte.nombre || '',
          caracter: parte.caracter_de || ''
        }) ))
    if (FORM_VALUES) {
      this.getFraccionArancelariaForModifi(FORM_VALUES.cve_entidad);
      this.direccionGrid.patchValue({
        id_solicitud: this.seleccionadasFila?.id_solicitud ?? FORM_VALUES.id_solicitud ?? this.mostrarGridNuevoHeaderData.length + 1,
        id_avi_inmueble: FORM_VALUES.id_avi_inmueble || '',
        domicilio: FORM_VALUES.direccion || '',
        codigoPostal: FORM_VALUES.codigo_postal || '',
        cveEntidad: FORM_VALUES.cve_entidad || '',
        alcaldiaOMunicipio: FORM_VALUES.alcaldiaOMunicipio || '',
        cveMunicipio: FORM_VALUES.cve_municipio || '',
        tipoDeDocumentoConElQueSeAcreditaElUsoYGoce: FORM_VALUES.tipoDeDocumentoConElQueSeAcreditaElUsoYGoce || '',
        cveTipoDoc: FORM_VALUES.cve_tipo_doc || '',
        fechaInicioDeVigencia: FORM_VALUES.fecha_inicio_actual || '',
        fechaFinVigencia: FORM_VALUES.fecha_fin_actual || '',
        observaciones: FORM_VALUES.observaciones || '',
      });

       this.modificacionPartesData  = FORM_VALUES.partes?.map((parte: any) => ({
                                    tbodyData: [
                                      parte.rfc,
                                      parte.nombre,
                                      parte.caracter_de
                                    ]
                                  }))

    }
  }
  /**
   * Elimina la fracción seleccionada de la lista de fracciones.
   * 
   * Este método busca la fracción por su ID y la elimina de la lista `gridFraccionesHeader`.
   * Si la fracción no se encuentra, actualiza el store con la lista actualizada.
   * 
   * @param {number} id - El ID de la fracción a eliminar.
   */
  eliminaDomicilioSeleccionado(id: number): void {
    const INDEX = this.mostrarGridNuevoHeaderData.findIndex(item => item.id_solicitud === id);
    if (INDEX !== -1) {
      this.mostrarGridNuevoHeaderData = this.mostrarGridNuevoHeaderData.filter(item => item.id_solicitud !== id);
      this.seleccionadasFila = null;
      this.store.setMostrarGridNuevoHeaderData(this.mostrarGridNuevoHeaderData);
    }
  }
}
