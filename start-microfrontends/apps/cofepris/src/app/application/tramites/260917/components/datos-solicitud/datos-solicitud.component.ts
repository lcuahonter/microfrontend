import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, CrossListLable, CrosslistComponent, InputCheckComponent, InputFecha, InputFechaComponent, InputRadioComponent, LISTACLAVESDELOSLOTES, Listaclaves, MERCANCIAS_DATA, MercanciasInfo, NICO_TABLA, Notificacion, ScianModel, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FECHA_DE_PAGO } from '../../constantes/certificados-licencias.enum';
import { LOCALIDAD_COLONIA } from '../../constantes/certificados-licencias.enum';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PcuerdoPublicar, PropietarioTipoPersona } from '../../modelos/datos-solicitud.model';
import { Solicitud260917State, Tramite260917Store } from '../../estados/tramites/tramite260917.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CROSLISTA_DE_PAISES } from '@libs/shared/data-access-user/src/core/enums/260917/domicillo-del.enum';
import { CommonModule } from '@angular/common';
import { MANIFIESTOS_DECLARACION } from '../../constantes/certificados-licencias.enum';
import { Tramite260917Query } from '../../estados/queries/tramite260917.query';
import radioOptions from '@libs/shared/theme/assets/json/260917/datos.solicitud.json';

import { Solocitud260917Service } from '../../services/service260917.service';

@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CrosslistComponent,
    InputFechaComponent,
    InputRadioComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    AlertComponent,
    InputCheckComponent
  ],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.scss',
})
export class DatosSolicitudComponent implements OnInit, OnDestroy {

  /**
       * Lista de componentes Crosslist disponibles en la vista.
       */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Texto de los manifiestos.
   */
  private destroy$ = new Subject<void>();

    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los formularios estarán deshabilitados y no se podrán editar.
   * Cuando es `false`, los formularios estarán habilitados para edición.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente DomicilloDelComponent.
   * 
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param certificadosLicenciasSvc - Un servicio para manejar operaciones relacionadas con certificados y licencias.
   */
  constructor(
    private readonly fb: FormBuilder,
    private tramite260917Store: Tramite260917Store,
    private tramite260917Query: Tramite260917Query,
    private consultaioQuery: ConsultaioQuery,
    private solocitud260917Service: Solocitud260917Service,
  ) {
    // Dependencia inyectada para uso posterior
        this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()
  }

  /**
   * Opciones genéricas del tipo de persona (física o moral).
   */
  genericOptions: PropietarioTipoPersona[] = [];

  /**
   * Opciones transformadas para usarse como botones de tipo radio.
   */
  hacerlosRadioOptions: PcuerdoPublicar[] = [];

  /**
   * Modelo de datos para una nueva notificación que se va a crear.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Identificador del elemento que se desea eliminar.
   */
  elementoParaEliminar!: number;


  /**
* Texto de los manifiestos.
*/
  manifiestosText: string = '';



  /**
   * Grupo de formularios para domicilio.
   */
  public domicilio!: FormGroup;

  /**
   * Grupo de formularios para agente.
   */
  public formAgente!: FormGroup;

  /**
   * Grupo de formularios para mercancías.
   */
  public formMercancias!: FormGroup;

  /**
 * Formulario que contiene los datos relacionados con los manifiestos.
 */
  public formularioManifiestos!: FormGroup;

  /**
   * Lista de catálogos de estados.
   */
  public estado: Catalogo[] = [];

  /**
   * Lista de países para la selección de origen.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;

  /**
   * Configuración de tabla para selección de tipo checkbox.
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla NICO.
   */
  public nicoTabla: ConfiguracionColumna<ScianModel>[] = NICO_TABLA;

  /**
   * Datos cargados para la tabla NICO.
   */
  public nicoTablaDatos: ScianModel[] = [];

  /**
   * Configuración de columnas para la tabla de mercancías.
   */
  public mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIAS_DATA;

  /**
   * Datos cargados para la tabla de mercancías.
   */
  public mercanciasTablaDatos: MercanciasInfo[] = [];

  /**
   * Lista de aduanas seleccionadas.
   */
  public aduanasDeEntradaSeleccionadas: string[] = [];

  /**
   * Lista de datos de aduanas de entrada.
   */
  public aduanasDeEntradaDatos: string[] = [];

  /**
   * Indica si la sección es colapsable.
   */
  public colapsable: boolean = false;

  /**
   * Indica si la sección "Duo" es colapsable.
   */
  public colapsableDos: boolean = false;

  /**
   * Indica si la sección "Tres" es colapsable.
   */
  public colapsableTres: boolean = false;

  /**
   * Lista de países para seleccionar el origen de la primera sección.
   */
  seleccionarOrigenDelPais: string[] = this.crosListaDePaises;

  /**
   * Lista de países para seleccionar el origen de la segunda sección.
   */
  public seleccionarOrigenDelPaisDos: string[] = this.crosListaDePaises;

  /**
   * Lista de países para seleccionar el origen de la tercera sección.
   */
  public seleccionarOrigenDelPaisTres: string[] = this.crosListaDePaises;

  /**
   * Etiqueta para el crosslist de país de procedencia.
   */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia',
    derecha: 'País(es) seleccionados',
  };

  /**
   * Un Subject que emite un valor `void` cuando el componente es destruido.
   * Se utiliza para gestionar y limpiar suscripciones, evitando fugas de memoria.
   */
  private destroyed$: Subject<void> = new Subject();

  /**
   * Una constante que contiene el valor de `LOCALIDAD_COLONIA`.
   * Probablemente se utiliza para representar o almacenar información textual
   * relacionada con una localidad o colonia específica en la aplicación.
   */
  public TEXTO = LOCALIDAD_COLONIA;
  /**
   * Representa el tipo de alerta que se mostrará.
   * El valor es típicamente una cadena que indica el estilo de alerta, como 'alert-warning'.
   */
  public infoAlert = 'alert-warning';

  /**
   * Configuración de las fechas de inicio y fin.
   * @type {InputFecha}
   */
  public fechaCaducidadInput: InputFecha = FECHA_DE_PAGO;

  /**
   * Representa una lista de columnas de configuración para objetos "Listaclaves".
   * Esta propiedad se inicializa con la constante `LISTACLAVESDELOSLOTES`.
   * 
   * @type {ConfiguracionColumna<Listaclaves>[]}
   */
  public listaClavesDeLosLotes: ConfiguracionColumna<Listaclaves>[] = LISTACLAVESDELOSLOTES;
  /**
   * Un arreglo que contiene una lista de objetos `Listaclaves`.
   * Esta propiedad se utiliza para almacenar datos relacionados con las claves de los lotes.
   */
  public listaClavesDeLosLotesDatos: Listaclaves[] = [];
  /**
   * Representa el estado de la Solicitud 260701.
   * Esta propiedad contiene los datos y la gestión del estado para la solicitud actual.
   * Se espera que se inicialice con una instancia de `Solicitud260917State`.
   */
  public solicitudState!: Solicitud260917State;

  /**
   * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * Este método inicializa varios formularios y obtiene los datos necesarios para el componente.
   *
   * - Llama a métodos para recuperar listas de estados, datos de tablas, datos de mercancías y claves de lotes.
   * - Inicializa el grupo de formularios `domicilio` con controles para campos relacionados con la dirección.
   * - Inicializa el grupo de formularios `formAgente` con controles para campos relacionados con el agente.
   * - Inicializa el grupo de formularios `formMercancias` con controles para campos relacionados con las mercancías.
   */
  ngOnInit(): void {
    /**
 * Texto de declaración relacionado con manifiestos.
 */
    this.manifiestosText = MANIFIESTOS_DECLARACION.MANIFIESTOS;

    /**
     * Opciones genéricas para el tipo de operación.
     */
    this.genericOptions = radioOptions?.tipoOperacion;

    /**
     * Opciones para la publicación de información confidencial.
     */
    this.hacerlosRadioOptions = radioOptions?.publicarInformacionConfidencial;

    /**
     * Opciones de estado disponibles.
     */
    this.estado = radioOptions?.estado;



    this.inicializarEstadoFormulario();

        this.solocitud260917Service.getScianDatos().pipe(takeUntil(this.destroy$))
          .subscribe((response: ScianModel[]) => {
            this.nicoTablaDatos = response
          });

          this.solocitud260917Service.getMercanciasDatos().pipe(takeUntil(this.destroy$))
          .subscribe((response: MercanciasInfo[]) => {
            this.mercanciasTablaDatos = response
          });
    
  }

    /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
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
        this.domicilio.disable();
        this.formAgente.disable();
        this.formMercancias.disable();
        this.formularioManifiestos.disable();
      } else {
        this.domicilio.enable();
        this.formAgente.enable();
        this.formMercancias.enable();
        this.formularioManifiestos.enable();
      }
  }

  inicializarFormulario():void{
    /**
 * Suscripción al estado de la sección "solicitud" desde el query de Akita.
 * Se actualiza `solicitudState` cada vez que cambia el estado en el store.
 */
    this.tramite260917Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();


    this.domicilio = this.fb.group({
      /** Tipo de operación seleccionada por el usuario */
      tipoOperacion: [this.solicitudState.tipoOperacion, Validators.required],

      /** Justificación proporcionada para la solicitud */
      justificacion: [this.solicitudState.justificacion, Validators.required],

      /** RFC del responsable sanitario */
      rfcResponsableSanitario: [this.solicitudState.rfcResponsableSanitario],

      /** Razón social de la empresa o entidad */
      razonSocial: [this.solicitudState.razonSocial, Validators.required],

      /** Correo electrónico de contacto */
      correoElectronico: [this.solicitudState.correoElectronico, Validators.required],

      /** Código postal del domicilio */
      codigoPostal: [this.solicitudState.codigoPostal, Validators.required],

      /** Estado donde se ubica el domicilio */
      estado: [this.solicitudState.estado, Validators.required],

      /** Municipio correspondiente al domicilio */
      muncipio: [this.solicitudState.muncipio, Validators.required],

      /** Localidad del domicilio */
      localidad: [this.solicitudState.localidad],

      /** Colonia donde se ubica el domicilio */
      colonia: [this.solicitudState.colonia],

      /** Calle del domicilio */
      calle: [this.solicitudState.calle,Validators.required],

      /** Clave LADA del número telefónico */
      lada: [this.solicitudState.lada],

      /** Número de teléfono de contacto */
      telefono: [this.solicitudState.telefono, Validators.required],

      /** Indica si se muestra el aviso correspondiente */
      avisoCheckbox: [this.solicitudState.avisoCheckbox],

      /** Número de licencia sanitaria asociada */
      licenciaSanitaria: [this.solicitudState.licenciaSanitaria],

      /** Campo utilizado para marcar en caso de que aplique una condición especial */
      marcarEnCasoDeQueSea: [this.solicitudState.marcarEnCasoDeQueSea],

      /** Régimen fiscal o legal correspondiente */
      regimen: [this.solicitudState.regimen, Validators.required],

      /** Lista de aduanas por las que se realizará la entrada */
      aduanasEntradas: [this.solicitudState.aduanasEntradas,Validators.required],
    });


    this.formAgente = this.fb.group({
      /** Clave SCiAN seleccionada del modal */
      claveScianModal: [this.solicitudState.claveScianModal,Validators.required],

      /** Descripción asociada a la clave SCiAN seleccionada */
      claveDescripcionModal: [this.solicitudState.claveDescripcionModal],
    });


    this.formMercancias = this.fb.group({
      /** Clasificación del producto (p. ej. medicamento, cosmético, etc.) */
      clasificacion: [this.solicitudState.clasificacion,Validators.required],

      /** Detalle adicional si se selecciona "Otro" en clasificación */
      especificarClasificacionProducto: [this.solicitudState.especificarClasificacionProducto,Validators.required],

      /** Denominación específica del producto */
      denominacionEspecifica: [this.solicitudState.denominacionEspecifica,Validators.required],

      /** Denominación distintiva del producto (marca, sello, etc.) */
      denominacionDistintiva: [this.solicitudState.denominacionDistintiva,Validators.required],

      /** Nombre común del producto */
      denominacionComun: [this.solicitudState.denominacionComun,Validators.required],

      /** Tipo de producto (sólido, líquido, etc.) */
      tipoDeProducto: [this.solicitudState.tipoDeProducto,Validators.required],

      /** Estado físico del producto */
      estadoFisico: [this.solicitudState.estadoFisico,Validators.required],

      /** Fracción arancelaria del producto */
      fraccionArancelaria: [this.solicitudState.fraccionArancelaria,Validators.required],

      /** Descripción asociada a la fracción arancelaria */
      descripcionFraccion: [this.solicitudState.descripcionFraccion,Validators.required],

      /** Cantidad expresada en unidad de medida de trámite (UMT) */
      cantidadUMT: [this.solicitudState.cantidadUMT,Validators.required],

      /** Unidad de medida de trámite (UMT) */
      UMT: [this.solicitudState.UMT, Validators.required],

      /** Cantidad expresada en unidad de medida comercial (UMC) */
      cantidadUMC: [this.solicitudState.cantidadUMC,Validators.required],

      /** Unidad de medida comercial (UMC) */
      UMC: [this.solicitudState.UMC,Validators.required],

      /** Presentación del producto (empaque, forma de venta, etc.) */
      presentacion: [this.solicitudState.presentacion,Validators.required],

      /** Número de registro sanitario del producto */
      numeroRegistro: [this.solicitudState.numeroRegistro,Validators.required],

      /** Fecha de caducidad del producto */
      fechaCaducidad: [this.solicitudState.fechaCaducidad],

      /** Clave de los lotes del producto */
      claveDeLosLotes: [this.solicitudState.claveDeLosLotes,Validators.required],
    });


    this.formularioManifiestos = this.fb.group({
      /** Indica si acepta los términos relacionados con los manifiestos */
      aceptaManifiestos: [this.solicitudState.aceptaManifiestos,Validators.required],

      /** Indica si acepta la publicación en medios oficiales */
      aceptaPublicacion: [this.solicitudState.aceptaPublicacion,Validators.required],

      /** RFC del representante legal que firma la solicitud */
      rfcRepresentante: [this.solicitudState.rfcRepresentante,Validators.required],

      /** Razón social del representante legal */
      razonSocialRepresentante: [this.solicitudState.razonSocialRepresentante,Validators.required],

      /** Apellido paterno del representante legal */
      apellidoPaternoRepresentante: [this.solicitudState.apellidoPaternoRepresentante,Validators.required],

      /** Apellido materno del representante legal */
      apellidoMaternoRepresentante: [this.solicitudState.apellidoMaternoRepresentante],
    });
  }


  /**
   * Botones de acción para gestionar listas de países en la primera sección.
   */
  paisDeProcedenciaBotons = [
    { btnNombre: 'Agregar todos', class: 'btn-primary', funcion: (): void => this.crossList.toArray()[0].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-default', funcion: (): void => this.crossList.toArray()[0].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-danger', funcion: (): void => this.crossList.toArray()[0].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: (): void => this.crossList.toArray()[0].quitar('t') },
  ];

  /**
   * Botones de acción para gestionar listas de países en la segunda sección.
   */
  paisDeProcedenciaBotonsDos = [
    { btnNombre: 'Agregar todos', class: 'btn-primary', funcion: (): void => this.crossList.toArray()[1].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-default', funcion: (): void => this.crossList.toArray()[1].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-danger', funcion: (): void => this.crossList.toArray()[1].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: (): void => this.crossList.toArray()[1].quitar('t') },
  ];

  /**
   * Botones de acción para gestionar listas de países en la tercera sección.
   */
  paisDeProcedenciaBotonsTres = [
    { btnNombre: 'Agregar todos', class: 'btn-primary', funcion: (): void => this.crossList.toArray()[2].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-default', funcion: (): void => this.crossList.toArray()[2].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-danger', funcion: (): void => this.crossList.toArray()[2].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: (): void => this.crossList.toArray()[2].quitar('t') },
  ];



  /**
   * Abre el modal de notificación para informar que no hay comunicación
   * con el sistema de COFEPRIS, solicitando al usuario capturar su establecimiento.
   * 
   * @param i Índice del elemento que se desea eliminar (por defecto es 0).
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
      txtBtnCancelar: 'Cancelar',
    };

    this.elementoParaEliminar = i;
  }


  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite260917Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260917Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Alterna el estado colapsable de la primera sección.
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Alterna el estado colapsable de la segunda sección.
   */
  mostrar_colapsableDos(): void {
    this.colapsableDos = !this.colapsableDos;
  }

  /**
   * Alterna el estado colapsable de la tercera sección.
   */
  mostrar_colapsableTres(): void {
    this.colapsableTres = !this.colapsableTres;
  }


  /**
   * Cambia el valor de la fecha final en el formulario.
   * @param nuevo_valor Nuevo valor de la fecha final.
   */
  public cambioFechaFinal(nuevo_valor: string): void {

    this.formMercancias.get('fechaCaducidad')?.setValue(nuevo_valor);
    this.formMercancias.get('fechaCaducidad')?.markAsUntouched();
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyed$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
