import { ALERT, AlertComponent, CrossListLable,CrosslistComponent } from '@libs/shared/data-access-user/src';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CROSLISTA_DE_PAISES, ScianData } from '../../models/datos-modificacion.model';
import { Catalogo, ConfiguracionColumna, Notificacion, NotificacionesComponent, Pedimento, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { DatosSolicitudState, DatosSolicitudStore } from '../../estados/stores/datos-de-la-solicitud-modificacion.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MANIFIESTOS_DECLARACION, MERCANCIAS_DATA } from '../../constantes/aviso-de-funcionamiento.enum';
import { MercanciasInfo, PropietarioTipoPersona, ScianModel } from '../../models/datos-de-la-solicitud.model';
import { Subject, map, takeUntil } from 'rxjs';
import { ALERT_INSUMOS } from '../../constantes/datos-domicilio-legal.enum';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDelEstablecimientoRFCComponent } from '../datos-del-establecimiento-rfc/datos-del-establecimiento-rfc.component';
import { DatosSolicitudQuery } from '../../estados/queries/datos-de-la-solicitud-modificacion.query';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { Modal } from 'bootstrap';
import { RepresentanteLegalRfcComponent } from '../representante-legal-rfc/representante-legal-rfc.component';
import { SCIAN_DATA } from '../../constantes/datos-scian.enum';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
/**
 * @description
 * Componente que gestiona el formulario y las interacciones relacionadas con la modificación de datos de la solicitud.
 * Este componente permite al usuario capturar, visualizar y modificar datos relacionados con la solicitud.
 */
@Component({
  selector: 'app-datos-de-la-solicitud-modificacion',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificacionesComponent,
    InputRadioComponent,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    InputCheckComponent,
    AlertComponent,
    DatosDelEstablecimientoRFCComponent,
    RepresentanteLegalRfcComponent,
    CrosslistComponent,
    TooltipModule
  ],
  templateUrl: './datos-de-la-solicitud-modificacion.component.html',
  styleUrl: './datos-de-la-solicitud-modificacion.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DatosDeLaSolicitudModificacionComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Actualiza la descripción SCIAN en el formulario cuando cambia el dropdown SCIAN.
   * Este método se ejecuta cuando el usuario selecciona una nueva opción en el dropdown de códigos SCIAN,
   * actualizando automáticamente el campo de descripción con el valor correspondiente.
   * 
   * @param event - Evento del cambio en el dropdown que contiene el nuevo valor seleccionado
   */
  public onScianChange(event: any): void {
    this.scianForm.get('descripcionScian')?.setValue(event.target.value ? event.target.value : '');
  }


  /**
   * Array que contiene las filas SCIAN seleccionadas mediante checkbox.
   * Almacena los elementos que el usuario ha marcado para posibles operaciones como eliminación.
   */
  public selectedScianRows: any[] = [];

  /**
   * Maneja la selección de filas SCIAN mediante checkbox.
   * Este método se ejecuta cuando el usuario selecciona o deselecciona filas en la tabla SCIAN,
   * actualizando el array de elementos seleccionados.
   * 
   * @param rows - Array de filas seleccionadas por el usuario
   */
  onSelectScianRows(rows: any[]): void {
    this.selectedScianRows = rows;
  }

  /**
   * Elimina las filas SCIAN que han sido seleccionadas mediante checkbox.
   * Filtra los elementos de `personaparas` removiendo aquellos que coincidan con las filas seleccionadas,
   * actualiza los datos de la tabla y limpia la selección.
   * 
   * @remarks
   * Solo procede si existen filas seleccionadas. Después de la eliminación, resetea el array de selección.
   */
  public eliminarScianSeleccionado(): void {
    if (this.selectedScianRows.length > 0) {
      this.personaparas = this.personaparas.filter(
        item => !this.selectedScianRows.some(sel => sel.clave === item.claveScian && sel.descripcion === item.descripcionScian)
      );
      this.datosData = this.personaparas.map(item => ({
        clave: item.claveScian,
        descripcion: item.descripcionScian
      }));
      this.selectedScianRows = [];
    }
  }
  /**
   * Valor que determina el tipo de modificación para genéricos.
   * Este valor controla la habilitación del campo Justificación y otros campos relacionados,
   * cambiando según la opción seleccionada en el control 'genericos'.
   * 
   * @default 'modificacion'
   */
  public valorModificacionGenericos: string = 'modificacion';


  /**
   * @description
   * Indica si el establecimiento no cuenta con licencia sanitaria.
   */
  public tieneNoLicenciaSanitaria: boolean = false;
  /**
   * @Input
   * Indica si los insumos están habilitados o no.
   */
  @Input() insumos: boolean = false;

  /**
   * @description
   * Formulario principal para capturar los datos de la solicitud.
   */
  public datosSolicitudform!: FormGroup;

  /**
   * @description
   * Formulario para capturar los manifiestos del representante.
   */
  public manifiestosRepresentanteForm!: FormGroup;

  /**
   * @description
   * Formulario para capturar datos SCIAN.
   */
  public scianForm!: FormGroup;

  /**
   * Grupo de formularios para mercancías.
   */
  public formMercancias!: FormGroup;

  /**
   * @description
   * Datos SCIAN agregados por el usuario.
   */
  public personaparas: ScianModel[] = [];

  /**
   * @description
   * Datos del catálogo SCIAN.
   */
  public scianJson: Catalogo[] = [];

  /**
   * @description
   * Instancia del modal de Bootstrap.
   */
  public modalInstance!: Modal;

  /**
   * @description
   * Referencia al modal del establecimiento.
   */
  @ViewChild('establecimientoModal', { static: false })
  /**
   * Referencia al elemento modal para "establecimiento".
   * Se utiliza para acceder y manipular el cuadro de diálogo modal en la plantilla del componente.
   * 
   * @remarks
   * Esta propiedad es poblada por el decorador {@link ViewChild} de Angular.
   */
  establecimientoModal!: ElementRef;
  /**
   * Un QueryList que contiene todas las instancias de {@link CrosslistComponent} encontradas dentro de la vista.
   * Esto permite interactuar con múltiples componentes hijos CrosslistComponent, como acceder a sus propiedades o invocar sus métodos.
   * 
   * @see {@link ViewChildren}
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;
    /**
   * @description
   * Referencia al modal de Bootstrap.
   */
    modalRef?: BsModalRef;

  /**
   * @description
   * Textos de alerta utilizados en el componente.
   */
  public TEXTOS = ALERT;
  /**
   * @description
   * Mensaje de alerta para insumos.
   */
  public TEXTOS_INSUMOS = ALERT_INSUMOS;

  /**
   * @description
   * Clase CSS para las alertas.
   */
  public class = 'alert-warning';

  /**
   * @description
   * Configuración de columnas para la tabla de datos SCIAN.
   */
  public configuracionTabla: ConfiguracionColumna<ScianData>[] = SCIAN_DATA;

  /**
   * @description
   * Configuración de selección de tabla.
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * @description
   * Datos cargados dinámicamente para la tabla SCIAN.
   */
  public datosData: ScianData[] = [];

  /**
   * @description
   * Enum para la selección de tablas.
   */
  public tipoSeleccionTabla = TablaSeleccion;

  /**
   * @description
   * Notificador para destruir observables y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
   * @description
   * Índice del elemento que se desea eliminar de la lista de pedimentos.
   */
  public elementoParaEliminar!: number;

  /**
   * @description
   * Notificación actual que se muestra en el componente.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @description
   * Lista de pedimentos gestionados en el componente.
   */
  public pedimentos: Array<Pedimento> = [];

  /**
   * @description
   * Configuración de columnas de la tabla de mercancías.
   */
  public mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIAS_DATA;

  /**
   * @description
   * Datos de la tabla de mercancías.
   */
  public mercanciasTablaDatos: MercanciasInfo[] = [];

  /**
   * @description
   * Texto de los manifiestos.
   */
  public mensajeManifiestos: string = '';

  /**
   * @description
   * Lista de estados disponibles.
   */
  public estado: Catalogo[] = [];
  /**
   * @description
   * Lista de clasificación del producto.
   */
  public classificacionDelProducto: Catalogo[] = [];
  /**
   * @description
   * Lista de tipo de producto.
   */
  public tipoDeProducto: Catalogo[] = [];
  /**
   * @description
   * Lista de especificar clasificación del producto.
   */
  public especificarClassificacion: Catalogo[] = [];
  /**
   * @description
   * Lista de unidades de medida comercial (UMC).
   */
  public umc: Catalogo[] = [];

  /**
   * @description
   * Opciones genéricas para el formulario.
   */
  public datosGenericos: PropietarioTipoPersona[] = [];

  /**
   * @description
   * Opciones para el radio de información confidencial.
   */
  public informacionConfidencialRadioOption: PropietarioTipoPersona[] = [];

  /**
   * @description
   * Estado actual de la solicitud.
   */
  public solicitudState!: DatosSolicitudState;

  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  public esFormularioSoloLectura: boolean = false;
  /**
   * Indica si la sección del componente es colapsable.
   * Cuando se establece en `true`, la sección puede ser expandida o colapsada por el usuario.
   */
  public colapsable: boolean = false;
  /**
   * Indica si la segunda sección colapsable está expandida o colapsada.
   * Cuando es `true`, la sección está expandida; cuando es `false`, está colapsada.
   */
  public colapsableDos: boolean = false;
  /**
   * Indica si la tercera sección colapsable está expandida o colapsada.
   * Cuando es `true`, la sección está expandida; cuando es `false`, está colapsada.
   */
  public colapsableTres: boolean = false;
  /**
   * Lista de países para la selección de origen.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;

  /**
   * Indica si se ha seleccionado un establecimiento.
   * Cuando es `true`, significa que el usuario ha seleccionado un establecimiento; cuando es `false`, no se ha seleccionado ninguno.
   * @default false
   */
  public tieneSeleccionEstablecimiento: boolean = false;
  /**
   * Botones de acción para gestionar listas de países en la primera sección.
   */
  public paisDeProcedenciaBotons = [
    { btnNombre: 'Agregar todos', class: 'btn-default', funcion: ():void => this.crossList.toArray()[0].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-primary', funcion: ():void => this.crossList.toArray()[0].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-primary', funcion: ():void => this.crossList.toArray()[0].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: ():void => this.crossList.toArray()[0].quitar('t') },
  ];

  /**
   * Botones de acción para gestionar listas de países en la segunda sección.
   */
  paisDeProcedenciaBotonsDos = [
    { btnNombre: 'Agregar todos', class: 'btn-default', funcion: ():void => this.crossList.toArray()[1].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-primary', funcion: ():void => this.crossList.toArray()[1].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-primary', funcion: ():void => this.crossList.toArray()[1].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: ():void => this.crossList.toArray()[1].quitar('t') },
  ];

  /**
   * Botones de acción para gestionar listas de países en la tercera sección.
   */
  paisDeProcedenciaBotonsTres = [
    { btnNombre: 'Agregar todos', class: 'btn-default', funcion: ():void => this.crossList.toArray()[2].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-primary', funcion: ():void => this.crossList.toArray()[2].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-primary', funcion: ():void => this.crossList.toArray()[2].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: ():void => this.crossList.toArray()[2].quitar('t') },
  ];

  /**
   * Etiqueta para el crosslist de país de origen.
   */
  public paisDeOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'País(es) seleccionado(s)*:',
  };
  /**
   * Etiqueta para el crosslist de país de procedencia.
   */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia:',
    derecha: 'País(es) seleccionado(s)*:',
  };
  /**
   * Etiqueta para el crosslist de uso específico.
   * Esta etiqueta se utiliza para mostrar información relacionada con el uso específico de un producto o servicio.
   */
  public usoEspecificoLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Uso específico:',
    derecha: 'Uso específico seleccionado*:',
  };

  /**
   * Indica si el formulario de mercancías ha sido enviado.
   * Se establece en `true` cuando el usuario agrega exitosamente una mercancía,
   * lo que puede afectar la validación y el comportamiento del formulario.
   */
  public tieneMercanciaFormaEnviada: boolean = false;
  /**
   * Lista de países disponibles para seleccionar el origen en la primera sección.
   * Contiene todos los países disponibles para el componente crosslist de origen.
   */
  public seleccionarOrigenDelPais: string[] = this.crosListaDePaises;
  
  /**
   * Lista de países disponibles para seleccionar el origen en la segunda sección.
   * Contiene todos los países disponibles para el segundo componente crosslist de origen.
   */
  public seleccionarOrigenDelPaisDos: string[] = this.crosListaDePaises;
  
  /**
   * Lista de países disponibles para seleccionar el origen en la tercera sección.
   * Contiene todos los países disponibles para el tercer componente crosslist de origen.
   */
  public seleccionarOrigenDelPaisTres: string[] = this.crosListaDePaises;

  /**
   * Identificador único del trámite que se está procesando.
   * Se recibe como entrada desde el componente padre y se utiliza
   * para obtener datos específicos del trámite desde los servicios.
   */
  @Input() tramiteID!: string;

    /**
   * Abre el modal de notificación para mostrar información sobre la falta de comunicación con COFEPRIS.
   * 
   * Configura los datos de la notificación que se mostrará al usuario indicando que debe
   * capturar manualmente la información del establecimiento debido a problemas de comunicación.
   * También alterna el estado de selección del establecimiento.
   * 
   * @param i - Índice del elemento que se desea procesar. Por defecto es 0.
   */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.tieneSeleccionEstablecimiento = !this.tieneSeleccionEstablecimiento;
    this.elementoParaEliminar = i;
  }
  /**
   * @description
   * Constructor del componente.
   * @param formBuilder Constructor de formularios reactivos.
   * @param establecimientoService Servicio para gestionar datos del establecimiento.
   * @param datosSolicitudStore Store para gestionar el estado de la solicitud.
   * @param datosSolicitudQuery Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private formBuilder: FormBuilder,
    private establecimientoService: EstablecimientoService,
    private datosSolicitudStore: DatosSolicitudStore,
    private datosSolicitudQuery: DatosSolicitudQuery,
    private consultaioQuery: ConsultaioQuery,
    @Inject(BsModalService)
    private modalService: BsModalService,
  ) {
    //Reservado para futuras inyecciones de dependencias o inicializaciones.
  }

  /**
   * Método del ciclo de vida `OnInit` que inicializa el componente.
   * 
   * Realiza las siguientes operaciones de inicialización:
   * - Se suscribe al estado de Consultaio para manejar el modo de solo lectura
   * - Se suscribe al estado de DatosSolicitud para obtener el estado actual
   * - Carga catálogos y datos necesarios desde los servicios
   * - Configura los formularios reactivos
   * - Establece las opciones para los controles del formulario
   */
  ngOnInit(): void {

    /**
    * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
    * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
    * - Llama a `configurarGrupoForm()` para aplicar configuraciones basadas en el estado recibido.
    * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
    */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()

    /**
     * Se suscribe al estado de `DatosSolicitud` para obtener información actualizada del estado de la solicitud.
     * - Asigna el estado de la solicitud a la propiedad `solicitudState`.
     * - La suscripción se cancela automáticamente cuando `destroy$` emite un valor (para evitar fugas de memoria).
     */

    this.datosSolicitudQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.mensajeManifiestos = MANIFIESTOS_DECLARACION.MANIFIESTOS;
    this.cargarEstado();
    this.cargarClassificacionDelProductoCatalogo();
    this.cargarTipoDeProductoCatalogo();
    this.cargarEspecificarClassificacionCatalogo();
    this.cargarUMCCatalogo();
    this.cargarScian();
    this.establecerOpcionesGenericas();
    this.manejarConfidencial();
    this.configurarGrupoForm();
    this.crearFormularioMercancias();
  }

  /**
   * Configura y crea los formularios reactivos del componente.
   * 
   * Inicializa tres formularios principales:
   * - `datosSolicitudform`: Formulario principal con datos del establecimiento
   * - `manifiestosRepresentanteForm`: Formulario para manifiestos del representante
   * - `scianForm`: Formulario para datos SCIAN
   * 
   * Configura validaciones, estados inicial y suscripciones a cambios.
   * Maneja la habilitación/deshabilitación de campos según el modo de solo lectura.
   */
  configurarGrupoForm(): void {
    this.datosSolicitudform = this.formBuilder.group({
      genericos: [this.solicitudState?.genericos, [Validators.required]],
      observaciones: [this.solicitudState?.observaciones, [Validators.required]],
      establecimientoRazonSocial: [this.solicitudState?.establecimientoRazonSocial, Validators.required],
      establecimientoCorreoElectronico: [this.solicitudState?.establecimientoCorreoElectronico, Validators.required],
      establecimientoDomicilioCodigoPostal: [this.solicitudState?.establecimientoDomicilioCodigoPostal, [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      establecimientoEstados: [this.solicitudState?.establecimientoEstados, Validators.required],
      descripcionMunicipio: [this.solicitudState?.descripcionMunicipio, Validators.required],
      localidad: [this.solicitudState?.localidad, [
    Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.\-#]{2,}$/)
  ]],
      establishomentoColonias: [this.solicitudState?.establishomentoColonias,[Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.\-#]{2,}$/)]],
      calle: [this.solicitudState?.calle, Validators.required],
      lada: [this.solicitudState?.lada,[Validators.pattern(/^[0-9]+$/)]],
      telefono: [this.solicitudState?.telefono, [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      avisoCheckbox: [this.solicitudState?.avisoCheckbox],
      noLicenciaSanitaria: [this.solicitudState?.noLicenciaSanitaria],
      regimen: [this.solicitudState?.regimen, Validators.required],
      aduanasEntradas: [this.solicitudState?.aduanasEntradas, Validators.required],
      aifaCheckbox: [this.solicitudState?.aifaCheckbox, Validators.required],
    });

    this.manifiestosRepresentanteForm = this.formBuilder.group({
      manifests: [this.solicitudState?.manifests, Validators.required],
      informacionConfidencialRadio: [this.solicitudState?.informacionConfidencialRadio, Validators.required],
    });

    this.scianForm = this.formBuilder.group({
      scian: [this.solicitudState?.scian, Validators.required],
      descripcionScian: [this.solicitudState?.descripcionScian],
    });

    if (this.datosSolicitudform && this.manifiestosRepresentanteForm && this.scianForm) {
      this.datosSolicitudform.disable();
      this.datosSolicitudform.get('noLicenciaSanitaria')?.enable();
      this.datosSolicitudform.get('genericos')?.enable();
      this.toggleJustificacionByGenericos(this.datosSolicitudform.get('genericos')?.value);
      this.manifiestosRepresentanteForm.disable();
      this.scianForm.disable();
    } else {
      this.datosSolicitudform.enable();
      this.manifiestosRepresentanteForm.enable();
      this.scianForm.enable();
    }
    this.datosSolicitudform.get('genericos')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.toggleJustificacionByGenericos(value);
      });
  }

  /**
   * Habilita o deshabilita múltiples campos del formulario según el valor de 'genericos'.
   * Cuando el valor es '1', habilita los campos para permitir modificaciones.
   * En caso contrario, los deshabilita y resetea sus valores.
   * 
   * @param value - Valor del control 'genericos' que determina la habilitación de campos
   * 
   * @remarks
   * Los campos afectados incluyen: observaciones, código postal, municipio, localidad,
   * colonias, calle, lada y teléfono.
   */
  toggleJustificacionByGenericos(value: string): void {
    // Lista de controles a habilitar/deshabilitar
    const controlNames = [
      'observaciones',
      'establecimientoDomicilioCodigoPostal',
      'descripcionMunicipio',
      'localidad',
      'establishomentoColonias',
      'calle',
      'lada',
      'telefono'
    ];
    controlNames.forEach(name => {
      const ctrl = this.datosSolicitudform.get(name);
      if (!ctrl) return;
      if (value ==='1') {
        ctrl.enable();
      } else {
        ctrl.disable();
        ctrl.reset();
      }
    });
  }


  /**
   * Inicializa el FormGroup `formMercancias` con controles para varios campos relacionados con el producto,
   * utilizando los valores del `solicitudState` actual como valores predeterminados.
   */
  public crearFormularioMercancias(): void {
    this.formMercancias = this.formBuilder.group({
      clasificacion: ['', Validators.required],
      especificarClasificacionProducto: ['', Validators.required],
      denominacionEspecifica: ['', Validators.required],
      denominacionDistintiva: ['', Validators.required],
      denominacionComun: ['', Validators.required],
      tipoDeProducto: ['', Validators.required],
      estadoFisico: ['', Validators.required],
      fraccionArancelaria: ['', Validators.required],
      descripcionFraccion: ['', Validators.required],
      cantidadUMT: ['', Validators.required],
      UMT: ['', Validators.required],
      cantidadUMC: ['', Validators.required],
      UMC: ['', Validators.required],
      presentacion: ['', Validators.required],
      numeroRegistro: ['', Validators.required],
    });
  }

  /**
   * Actualiza el estado del store con los valores del formulario especificado.
   * 
   * Extrae el valor del campo indicado del formulario y lo envía al store
   * utilizando el método especificado. Si el campo es 'genericos', también
   * ejecuta la lógica para alternar la habilitación del campo Justificación.
   * 
   * @param form - Formulario reactivo del cual extraer el valor
   * @param campo - Nombre del campo del formulario que se desea actualizar
   * @param metodoNombre - Nombre del método del store que se invocará para la actualización
   */
  actualizarValoresStore(form: FormGroup, campo: string, metodoNombre: keyof DatosSolicitudStore): void {
    const VALOR = form.get(campo)?.value;
    (this.datosSolicitudStore[metodoNombre] as (value: string | number) => void)(VALOR);
    // Si el campo es 'genericos', también alternar el campo Justificación
    if (campo === 'genericos') {
      this.toggleJustificacionByGenericos(VALOR);
    }
  }

  /**
   * Maneja los cambios en controles específicos del formulario, particularmente para el checkbox
   * de licencia sanitaria y campos relacionados.
   * 
   * Controla la lógica de habilitación/deshabilitación del campo 'noLicenciaSanitaria' basado
   * en el estado del checkbox y actualiza la bandera `tieneNoLicenciaSanitaria`.
   * 
   * @param event - Evento del cambio en el control
   * @param controlName - Nombre del control que ha cambiado
   */
  enControlCambioFormulario(event: Event,controlName: string): void {

    const UPDATED_VALUE = {
      [controlName]: this.datosSolicitudform.get(controlName)?.value,
    };

    if ((event.target as HTMLInputElement).checked) {
      this.datosSolicitudform.get('noLicenciaSanitaria')?.disable();
    } else {
      this.datosSolicitudform.get('noLicenciaSanitaria')?.enable();
    }

    if (controlName === 'noLicenciaSanitaria' && UPDATED_VALUE['noLicenciaSanitaria'] !== '') {
      this.tieneNoLicenciaSanitaria = true;
      this.datosSolicitudform.get('noLicenciaSanitaria')?.enable();
    } else if (controlName === 'noLicenciaSanitaria' && UPDATED_VALUE['noLicenciaSanitaria'] === '') {
      this.tieneNoLicenciaSanitaria = false;
    }
  }

  /**
   * @description
   * Establece las opciones genéricas para el formulario.
   */
  establecerOpcionesGenericas(): void {
    this.establecimientoService
      .getJustificationData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PropietarioTipoPersona[]) => {
        this.datosGenericos = data;
      });
  }

  /**
   * @description
   * Maneja las opciones de información confidencial.
   */
  manejarConfidencial(): void {
    this.establecimientoService
      .getInformacionConfidencialRadioOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PropietarioTipoPersona[]) => {
        this.informacionConfidencialRadioOption = data;
      });
  }

  /**
   * @description
   * Carga los datos del estado desde el servicio.
   */
  cargarEstado(): void {
    this.establecimientoService
      .getEstadodata(this.tramiteID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.estado = resp;
      });
  }

  /**
   * @description
   * Carga los datos SCIAN desde el servicio.
   */
  cargarScian(): void {
    this.establecimientoService
      .getSciandata(this.tramiteID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: Catalogo[]) => {
        this.scianJson = resp;
      });
  }

  /**
   * @description
   * Cierra el modal SCIAN.
   */
  cerrarModalScian(): void {
    this.modalInstance.hide();
  }

  /**
   * @description
   * Limpia el formulario SCIAN.
   */
  limpiarScianForm(): void {
    this.scianForm.reset();
  }

  /**
   * Guarda un nuevo dato SCIAN en la tabla y actualiza la vista.
   * 
   * Extrae los valores del formulario SCIAN, crea un nuevo objeto ScianModel
   * y lo agrega a la lista de datos. Si la descripción está vacía, la busca
   * automáticamente en el catálogo usando la clave SCIAN.
   * 
   * Después de agregar los datos:
   * - Actualiza la tabla con una nueva referencia para disparar change detection
   * - Limpia el formulario SCIAN
   * - Cierra el modal
   */
  guardarScian(): void {
    if (this.scianForm?.value?.scian) {
      const claveScian = this.scianForm.get('scian')?.value;
      let descripcionScian = this.scianForm.get('descripcionScian')?.value;
      // If descripcionScian is empty, get it from the selected option
      if (!descripcionScian && claveScian) {
        const selected = this.scianJson.find((item: any) => item.clave === claveScian);
        descripcionScian = selected ? selected.descripcion : '';
      }
      const SCIAN_DATA: ScianModel = {
        claveScian,
        descripcionScian,
      };


      // Agregar el nuevo dato a la tabla usando nueva referencia para disparar change detection
      this.personaparas = [...this.personaparas, SCIAN_DATA];
      // Actualizar datosData para que la tabla se actualice, mapeando a la estructura correcta
      this.datosData = this.personaparas.map(item => ({
        clave: item.claveScian,
        descripcion: item.descripcionScian
      }));

      // Limpiar el formulario
      this.scianForm.reset();

      // Cerrar el modal
      this.cerrarModalScian();
    }
  }

  /**
   * Elimina un pedimento de la lista según la confirmación del usuario.
   * 
   * Si el parámetro `borrar` es verdadero, elimina el pedimento en la posición
   * especificada por `elementoParaEliminar`. Además, si hay una selección
   * de establecimiento activa, habilita el formulario principal.
   * 
   * @param borrar - Indica si se debe proceder con la eliminación del pedimento
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
    if(this.tieneSeleccionEstablecimiento) {
      this.datosSolicitudform.enable();
    }
  }

  /**
   * Muestra el modal para la selección y captura de claves SCIAN.
   * 
   * Este método abre el modal de Bootstrap que permite al usuario
   * seleccionar códigos SCIAN y agregar nuevos registros a la tabla.
   */
  public mostrarModeloClave(): void {
    this.modalInstance.show();
  }

  /**
   * Alterna el estado colapsable de la primera sección del formulario.
   * Permite expandir o contraer la sección para mejorar la experiencia del usuario.
   */
  public mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Alterna el estado colapsable de la segunda sección del formulario.
   * Permite expandir o contraer la sección para mejorar la experiencia del usuario.
   */
  public mostrar_colapsableDos(): void {
    this.colapsableDos = !this.colapsableDos;
  }

  /**
   * Alterna el estado colapsable de la tercera sección del formulario.
   * Permite expandir o contraer la sección para mejorar la experiencia del usuario.
   */
  public mostrar_colapsableTres(): void {
    this.colapsableTres = !this.colapsableTres;
  }

  /**
   * @description
   * Abre el modal para agregar mercancía.
   * @param template Plantilla del modal a mostrar.
   */
  public agregarMercancia(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl',});
  }

  /**
   * Limpia todos los campos del formulario `formMercancias` restableciendo su estado.
   * Este método puede usarse para revertir el formulario a sus valores iniciales,
   * eliminando cualquier entrada o cambio realizado por el usuario.
   */
  public limpiarFormulario(): void {
    this.formMercancias.reset();
    this.formMercancias.markAsPristine();
    this.formMercancias.markAsUntouched();
    this.formMercancias.updateValueAndValidity();
    this.tieneMercanciaFormaEnviada = false;
  }

  /**
   * Carga el catálogo de clasificación de producto obteniendo los datos desde el `establecimientoService`.
   * Se suscribe al observable del servicio y asigna los datos recibidos de clasificación a `classificacionDelProducto`.
   * La suscripción se cancela automáticamente cuando el componente se destruye.
   */
  public cargarClassificacionDelProductoCatalogo(): void {
    this.establecimientoService.getClasificacionProducto().pipe(takeUntil(this.destroy$)).subscribe((response) => {
      const API_RESPONSE = JSON.parse(JSON.stringify(response));
        this.classificacionDelProducto = API_RESPONSE.data;
      });
  }

  /**
   * Carga el catálogo de tipo de producto obteniendo los datos desde el `establecimientoService`.
   * Se suscribe al observable del servicio y asigna los datos recibidos de tipo de producto a `tipoDeProducto`.
   * La suscripción se cancela automáticamente cuando el componente se destruye.
   */
  public cargarTipoDeProductoCatalogo(): void {
    this.establecimientoService.getTipoDeProducto().pipe(takeUntil(this.destroy$)).subscribe((response) => {
      const API_RESPONSE = JSON.parse(JSON.stringify(response));
        this.tipoDeProducto = API_RESPONSE.data;
      });
  }

  /**
   * Carga el catálogo de especificar clasificación obteniendo los datos desde el `establecimientoService`.
   * Se suscribe al observable del servicio y asigna los datos recibidos de especificar clasificación a `especificarClassificacion`.
   * La suscripción se cancela automáticamente cuando el componente se destruye.
   */
  public cargarEspecificarClassificacionCatalogo(): void {
    this.establecimientoService.getEspecificarProducto().pipe(takeUntil(this.destroy$)).subscribe((response) => {
      const API_RESPONSE = JSON.parse(JSON.stringify(response));
        this.especificarClassificacion = API_RESPONSE.data;
      });
  }

  /**
   * Carga el catálogo de unidades de medida comercial (UMC) obteniendo los datos desde el `establecimientoService`.
   * Se suscribe al observable del servicio y asigna los datos recibidos de UMC a `umc`.
   * La suscripción se cancela automáticamente cuando el componente se destruye.
   */
  public cargarUMCCatalogo(): void {
    this.establecimientoService.getUMCCatalogo().pipe(takeUntil(this.destroy$)).subscribe((response) => {
      const API_RESPONSE = JSON.parse(JSON.stringify(response));
        this.umc = API_RESPONSE.data;
      });
  }

  /**
   * @description
   * Ciclo de vida `AfterViewInit`.
   * Inicializa la instancia del modal de Bootstrap.
   */
  ngAfterViewInit(): void {
    if (this.establecimientoModal) {
      this.modalInstance = new Modal(this.establecimientoModal.nativeElement);
    }
  }

  /**
   * Agrega una nueva entrada de formulario al arreglo `mercanciasTablaDatos` utilizando los valores actuales
   * del grupo de formulario `formMercancias`. Establece `tieneMercanciaFormaEnviada` en `true`
   * y oculta el cuadro de diálogo modal si está abierto.
   *
   * La nueva entrada contiene diversos detalles del producto y mercancía como clasificación,
   * denominación, forma farmacéutica, estado físico, fracción arancelaria, unidades, cantidades,
   * presentación, número de registro, origen y uso específico.
   *
   * @remarks
   * Este método se llama normalmente cuando el usuario envía el formulario de mercancías en el flujo de solicitud de modificación.
   */
  public agregarFormulario(): void {
    this.tieneMercanciaFormaEnviada = true;
    const TABLA_DATOS = {
        clasificacion: this.formMercancias.get('clasificacion')?.value,
        especificar: this.formMercancias.get('especificarClasificacionProducto')?.value,
        denominacionEspecifica: this.formMercancias.get('denominacionEspecifica')?.value,
        denominacionDistintiva: this.formMercancias.get('denominacionDistintiva')?.value,
        denominacionComun: this.formMercancias.get('denominacionComun')?.value,
        formaFarmaceutica: this.formMercancias.get('formaFarmaceutica')?.value,
        estadoFisico: this.formMercancias.get('estadoFisico')?.value,
        estadoFormaFarmaceutica: this.formMercancias.get('estadoFormaFarmaceutica')?.value,
        fraccionArancelaria: this.formMercancias.get('fraccionArancelaria')?.value,
        descripcionFraccion: this.formMercancias.get('descripcionFraccion')?.value,
        unidad: this.formMercancias.get('unidad')?.value,
        cantidadUMC: this.formMercancias.get('cantidadUMC')?.value,
        unidadUMT: this.formMercancias.get('unidadUMT')?.value,
        cantidadUMT: this.formMercancias.get('cantidadUMT')?.value,
        presentacion: this.formMercancias.get('presentacion')?.value,
        numeroRegistro: this.formMercancias.get('numeroRegistro')?.value,
        paisDeOrigen: this.formMercancias.get('paisDeOrigen')?.value,
        paisDeProcedencia: this.formMercancias.get('paisDeProcedencia')?.value,
        tipoProducto: this.formMercancias.get('tipoProducto')?.value,
        usoEspecifico: this.formMercancias.get('usoEspecifico')?.value,
    }

    this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, TABLA_DATOS];
    this.modalRef?.hide();
  }

  /**
   * @description
   * Ciclo de vida `OnDestroy`.
   * Limpia los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
