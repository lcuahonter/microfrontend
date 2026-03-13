import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, CrossListLable,CrosslistComponent, InputFecha, InputFechaComponent, LISTACLAVESDELOSLOTES,Listaclaves, MERCANCIAS_DATA, MercanciasInfo, NICO_TABLA, ScianModel, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FECHA_DE_PAGO, LOCALIDAD_COLONIA } from '../../services/certificados-licencias.enum';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CROSLISTA_DE_PAISES } from '@libs/shared/data-access-user/src/core/enums/260701/domicillo-del.enum';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';
/**
 * Componente `DomicilloDelComponent` que representa una sección de la aplicación
 * para gestionar información relacionada con domicilios, agentes y mercancías.
 * 
 * Este componente incluye formularios reactivos, tablas dinámicas y listas cruzadas
 * para la selección y gestión de datos. Además, implementa los ciclos de vida de Angular
 * `OnInit` y `OnDestroy` para inicializar y limpiar recursos.
 */
@Component({
  selector: 'app-domicillo-del',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    CrosslistComponent,
    ReactiveFormsModule,
    InputFechaComponent,
    TooltipModule,
  ],
  templateUrl: './domicillo-del.component.html',
  styleUrl: './domicillo-del.component.scss',
})
export class DomicilloDelComponent implements OnInit, OnDestroy {
  /**
   * Lista de componentes Crosslist disponibles en la vista.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
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
    private certificadosLicenciasSvc: CertificadosLicenciasService,
    private tramite260701Store: Tramite260701Store,
    private tramite260701Query: Tramite260701Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (seccionState.readonly || seccionState.update) {
            this.obtenerTablaDatos();
            this.obtenerMercanciasDatos();
          }
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

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
   * Control para la fecha de aduanas de entrada.
   */
  public aduanasDeEntradaFecha: FormControl = new FormControl('');

  /**
   * Control para la fecha seleccionada de aduanas de entrada.
   */
  public aduanasDeEntradaFechaSeleccionada: FormControl = new FormControl('');

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
   * Lista de elementos seleccionados en la tabla NICO.
   */
  public seleccionadosScian: ScianModel[] = [];

  /**
   * Configuración de columnas para la tabla de mercancías.
   */
  public mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] =
    MERCANCIAS_DATA;

  /**
   * Datos cargados para la tabla de mercancías.
   */
  public mercanciasTablaDatos: MercanciasInfo[] = [];

  /**
   * Lista de mercancías seleccionadas en la tabla de mercancías.
   */
  public seleccionadosMercancias: MercanciasInfo[] = [];

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
   * Etiqueta para el crosslist de país de origen.
   */
  public paiseDeOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'País(es) seleccionado(s)*:',
  };
  /**
   * Etiqueta para el crosslist de país de procedencia.
   */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia:',
    derecha: 'País(es) seleccionados(s)*:',
  };

  /**
   *  Etiqueta para el crosslist de uso específico.
   */
  public usoEspecificoLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Uso específico:',
    derecha: 'Uso(s) específico(s)*:',
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
  public listaClavesDeLosLotes: ConfiguracionColumna<Listaclaves>[] =
    LISTACLAVESDELOSLOTES;
  /**
   * Un arreglo que contiene una lista de objetos `Listaclaves`.
   * Esta propiedad se utiliza para almacenar datos relacionados con las claves de los lotes.
   */
  public listaClavesDeLosLotesDatos: Listaclaves[] = [];
  /**
   * Un arreglo que contiene una lista de objetos `Listaclaves` que han sido seleccionados.
   * Esta propiedad se utiliza para almacenar los elementos seleccionados por el usuario
   * en la interfaz de usuario.
   */
  public seleccionadosListaClaves: Listaclaves[] = [];
  /**
   * Representa el estado de la Solicitud 260701.
   * Esta propiedad contiene los datos y la gestión del estado para la solicitud actual.
   * Se espera que se inicialice con una instancia de `Solicitud260701State`.
   */
  public solicitudState!: Solicitud260701State;

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente es destruido.
   * Este método emite un valor a través del Subject `destroyed$` para notificar a todas las suscripciones
   */
  public tieneSeleccionadoBtnClicked: boolean = false;

  /**
   * Indica si el usuario ha seleccionado la opción de no tener licencia sanitaria.
   * Cuando es `true`, se asume que el usuario no posee una licencia sanitaria.
   */
  public tieneNoLicenciaSanitaria: boolean = false;

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
    this.certificadosLicenciasSvc.event$
      .pipe(
        takeUntil(this.destroyed$),
        map((valor) => {
          this.tieneSeleccionadoBtnClicked = valor as boolean;
          if (this.tieneSeleccionadoBtnClicked) {
            this.domicilio.enable();
            this.formAgente.enable();
            this.formMercancias.enable();
          }
        })
      )
      .subscribe();
    this.obtenerEstadoList();
    this.inicializarFormulario();
  }

  /**
   * Botones de acción para gestionar listas de países en la primera sección.
   */
  paisDeProcedenciaBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Botones de acción para gestionar listas de países en la segunda sección.
   */
  paisDeProcedenciaBotonsDos = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[1].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[1].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[1].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[1].quitar('t'),
    },
  ];

  /**
   * Botones de acción para gestionar listas de países en la tercera sección.
   */
  paisDeProcedenciaBotonsTres = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[2].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[2].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[2].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[2].quitar('t'),
    },
  ];

  /**
   * Inicializa el formulario del componente realizando las siguientes acciones:
   * - Se suscribe al observable `selectSolicitud$` de `tramite260701Query` para actualizar la propiedad local `solicitudState`,
   *   asegurando que la suscripción se limpie correctamente utilizando el subject `destroyed$`.
   * - Llama a los métodos para crear e inicializar los formularios de domicilio, agente y mercancías.
   */
  public inicializarFormulario(): void {
    this.tramite260701Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.crearFormularioDomicilio();
    this.crearFormularioAgente();
    this.crearFormularioMercancias();
  }

  /**
   * Inicializa el grupo de formulario `domicilio` con controles poblados a partir del `solicitudState` actual.
   */
  public crearFormularioDomicilio(): void {
    this.domicilio = this.fb.group({
      codigoPostal: [this.solicitudState?.codigoPostal],
      estado: [this.solicitudState?.estado],
      muncipio: [this.solicitudState?.muncipio],
      localidad: [this.solicitudState?.localidad],
      colonia: [this.solicitudState?.colonia],
      calle: [this.solicitudState?.calle],
      lada: [this.solicitudState?.lada],
      telefono: [this.solicitudState?.telefono],
      avisoCheckbox: [this.solicitudState?.avisoCheckbox],
      licenciaSanitaria: [this.solicitudState?.licenciaSanitaria],
      marcarEnCasoDeQueSea: [this.solicitudState?.marcarEnCasoDeQueSea],
      regimen: [this.solicitudState?.regimen],
      aduanasEntradas: [this.solicitudState?.aduanasEntradas],
      numeroPermiso: [this.solicitudState?.numeroPermiso],
    });
    this.domicilio.disable();
    this.domicilio.get('licenciaSanitaria')?.enable();
    this.domicilio.get('avisoCheckbox')?.enable();
    this.domicilio.get('marcarEnCasoDeQueSea')?.enable();
  }

  /**
   * Inicializa el FormGroup `formAgente` con controles para `claveScianModal` y `claveDescripcionModal`.
   * Los valores iniciales de estos controles se obtienen de la propiedad `solicitudState`.
   */
  public crearFormularioAgente(): void {
    this.formAgente = this.fb.group({
      claveScianModal: [this.solicitudState?.claveScianModal],
      claveDescripcionModal: [this.solicitudState?.claveDescripcionModal],
    });
  }

  /**
   * Inicializa el FormGroup `formMercancias` con controles para varios campos relacionados con el producto,
   * utilizando los valores del `solicitudState` actual como valores predeterminados.
   */
  public crearFormularioMercancias(): void {
    this.formMercancias = this.fb.group({
      clasificacion: [this.solicitudState?.clasificacion],
      especificarClasificacionProducto: [
        this.solicitudState?.especificarClasificacionProducto,
      ],
      denominacionEspecifica: [this.solicitudState?.denominacionEspecifica],
      denominacionDistintiva: [this.solicitudState?.denominacionDistintiva],
      denominacionComun: [this.solicitudState?.denominacionComun],
      tipoDeProducto: [this.solicitudState?.tipoDeProducto],
      estadoFisico: [this.solicitudState?.estadoFisico],
      fraccionArancelaria: [this.solicitudState?.fraccionArancelaria],
      descripcionFraccion: [{value: this.solicitudState?.descripcionFraccion, disabled: true}],
      cantidadUMT: [this.solicitudState?.cantidadUMT],
      UMT: [{value: this.solicitudState?.UMT, disabled: true}],
      cantidadUMC: [this.solicitudState?.cantidadUMC],
      UMC: [this.solicitudState?.UMC],
      presentacion: [this.solicitudState?.presentacion],
      numeroRegistro: [this.solicitudState?.numeroRegistro],
      fechaCaducidad: [this.solicitudState?.fechaCaducidad],
      fechaCaducidadDos: [''],
      claveDeLosLotes: [this.solicitudState?.claveDeLosLotes],
    });
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON.
   */
  public obtenerEstadoList(): void {
    this.certificadosLicenciasSvc
      .getEstadoCatalogo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        const DATOS = JSON.parse(JSON.stringify(response));
        this.estado = DATOS.data;
      });
  }

  /**
   * Obtiene los datos para la tabla de NICO desde un archivo JSON.
   */
  public obtenerTablaDatos(): void {
    this.certificadosLicenciasSvc
      .getScianTablaDatos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        const DATOS = JSON.parse(JSON.stringify(response));
        this.nicoTablaDatos = DATOS;
      });
  }

  /**
   * Obtiene los datos de la tabla de mercancías desde un archivo JSON.
   */
  public obtenerMercanciasDatos(): void {
    this.certificadosLicenciasSvc
      .getMercanciasTablaDatos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        const DATOS = JSON.parse(JSON.stringify(response));
        this.mercanciasTablaDatos = DATOS;
      });
  }

  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260701Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260701Store[metodoNombre] as (value: unknown) => void)(VALOR);
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
   * Cambia el valor de la segunda fecha final en el formulario.
   * @param nuevo_valor Nuevo valor de la segunda fecha final.
   */
  public cambioFechaFinalDos(nuevo_valor: string): void {
    this.formMercancias.get('fechaCaducidadDos')?.setValue(nuevo_valor);
    this.formMercancias.get('fechaCaducidadDos')?.markAsUntouched();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario y alterna el estado habilitado/deshabilitado del control de formulario `domicilio`
   * según el valor de la bandera `esFormularioSoloLectura`.
   */
  public guardarDatosFormulario(): void {
    this.inicializarFormulario();
    Promise.resolve().then(() => {
      if (this.esFormularioSoloLectura) {
        this.domicilio.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.domicilio.enable();
      }
    });
  }

  /** Maneja el evento de cambio en el formulario para la opción de no tener licencia sanitaria.
   * Si el checkbox está marcado, establece `tieneNoLicenciaSanitaria` en `true`, de lo contrario, lo establece en `false`.
   *
   * @param event - El evento disparado por el cambio en el checkbox.
   */
  public enControlCambioFormulario(event: Event): void {
    if ((event.target as HTMLInputElement).checked) {
      this.tieneNoLicenciaSanitaria = true;
    } else {
      this.tieneNoLicenciaSanitaria = false;
    }
  }

  /** Maneja el evento de cambio en el campo de selección de clave SCIA.
   * Este método establece el valor del campo `claveDescripcionModal` en '2' cada vez que se selecciona una nueva clave SCIA.
   */
  public onChangeClaveScian(): void {
    this.formAgente.get('claveDescripcionModal')?.setValue('2');
  }

  /** Agrega un nuevo agente a la tabla de datos NICO.
   * Este método crea un nuevo objeto `CLAVE_SCIAN` utilizando los valores actuales de los controles del formulario `formAgente`,
   * luego agrega este objeto a la lista `nicoTablaDatos` y finalmente restablece el formulario `formAgente`.
   */
  public onAgregarAgente(): void {
    const CLAVE_SCIAN = {
      clave: this.formAgente.get('claveScianModal')?.value,
      descripcion: this.formAgente.get('claveDescripcionModal')?.value,
    };
    this.nicoTablaDatos = [...this.nicoTablaDatos, CLAVE_SCIAN];
    this.formAgente.reset();
  }

  /** Maneja la selección de elementos en la tabla NICO.
   * Este método actualiza la lista `seleccionadosScian` con los elementos seleccionados en la tabla.
   *
   * @param event - Un arreglo de objetos `ScianModel` que representa los elementos seleccionados.
   */
  public onScianSeleccionados(event: ScianModel[]): void {
    this.seleccionadosScian = event;
  }

  /** Elimina las filas seleccionadas de la tabla NICO.
   * Este método filtra la lista `nicoTablaDatos` para eliminar los elementos que están presentes en la lista `seleccionadosScian`.
   * Después de la eliminación, limpia la lista `seleccionadosScian`.
   */
  public eliminarFila(): void {
    this.nicoTablaDatos = this.nicoTablaDatos.filter(
      (item) =>
        !this.seleccionadosScian
          .map((sel) => sel.clave)
          .includes(item.clave) &&
        !this.seleccionadosScian
          .map((sel) => sel.descripcion)
          .includes(item.descripcion)
    );
    this.seleccionadosScian = [];
  }

  /** 
   * Maneja los cambios en los campos específicos del formulario de mercancías.
   * Dependiendo del nombre del control que ha cambiado, este método actualiza otros campos relacionados en el formulario.
   *
   * @param controlName - El nombre del control que ha cambiado.
   */
  public onFormaValorChange(controlName:string): void {
    if(controlName === 'fraccionArancelaria') {
      this.formMercancias.get('descripcionFraccion')?.setValue('XTAT. 23CXFTSATX 656.9DHCVDHGS');
    } else if(controlName === 'cantidadUMT') {
      this.formMercancias.get('UMT')?.setValue(`Kilogramo`);
    }
  }

  /** 
   * Maneja la selección de mercancías en la tabla de mercancías.
   * Este método actualiza la lista `seleccionadosMercancias` con los elementos seleccionados en la tabla de mercancías.
   *
   * @param event - Un arreglo de objetos `MercanciasInfo` que representa los elementos seleccionados.
   */
  public onMercanciasSeleccionados(event: MercanciasInfo[]): void {
    this.seleccionadosMercancias = event;
  }

  /** 
   * Elimina las mercancías seleccionadas de la tabla de mercancías.
   * Este método filtra la lista `mercanciasTablaDatos` para eliminar los elementos que están presentes en la lista `seleccionadosMercancias`.
   * Después de la eliminación, limpia la lista `seleccionadosMercancias`.
   */
  public onEliminarMercancias(): void {
    this.mercanciasTablaDatos = this.mercanciasTablaDatos.filter(
      (item) =>
        !this.seleccionadosMercancias.map((sel) => sel.clasificacion).includes(item.clasificacion) &&
        !this.seleccionadosMercancias.map((sel) => sel.denominacionEspecifica).includes(item.denominacionEspecifica) &&
        !this.seleccionadosMercancias.map((sel) => sel.denominacionDistintiva).includes(item.denominacionDistintiva) &&
        !this.seleccionadosMercancias.map((sel) => sel.denominacionComun).includes(item.denominacionComun) &&
        !this.seleccionadosMercancias.map((sel) => sel.estadoFisico).includes(item.estadoFisico) &&
        !this.seleccionadosMercancias.map((sel) => sel.fraccionArancelaria).includes(item.fraccionArancelaria) &&
        !this.seleccionadosMercancias.map((sel) => sel.cantidadUMT).includes(item.cantidadUMT) &&
        !this.seleccionadosMercancias.map((sel) => sel.cantidadUMC).includes(item.cantidadUMC) &&
        !this.seleccionadosMercancias.map((sel) => sel.presentacion).includes(item.presentacion) &&
        !this.seleccionadosMercancias.map((sel) => sel.numeroRegistro).includes(item.numeroRegistro) &&
        !this.seleccionadosMercancias.map((sel) => sel.fechaCaducidad).includes(item.fechaCaducidad)
    );
    this.seleccionadosMercancias = [];
  }

  /** 
   * Agrega una nueva mercancía a la tabla de mercancías si el formulario es válido.
   * Si el formulario es inválido, marca todos los controles como tocados y actualiza su validez.
   * Después de agregar la mercancía, resetea el formulario para permitir la entrada de una nueva mercancía.
   */
  public agregarMercancia(): void {
    if(!this.formMercancias.invalid) {
      const MERCANCIA = {
        clasificacion: this.formMercancias.get('clasificacion')?.value,
        especificar: this.formMercancias.get('especificarClasificacionProducto')?.value,
        denominacionEspecifica: this.formMercancias.get('denominacionEspecifica')?.value,
        denominacionDistintiva: this.formMercancias.get('denominacionDistintiva')?.value,
        denominacionComun: this.formMercancias.get('denominacionComun')?.value,
        formaFarmaceutica: this.formMercancias.get('claveDeLosLotes')?.value,
        estadoFisico: this.formMercancias.get('estadoFisico')?.value,
        fraccionArancelaria: this.formMercancias.get('fraccionArancelaria')?.value,
        descripcionFraccion: this.formMercancias.get('descripcionFraccion')?.value,
        unidad: this.formMercancias.get('UMC')?.value,
        cantidadUMC: this.formMercancias.get('cantidadUMC')?.value,
        unidadUMT: this.formMercancias.get('UMT')?.value,
        cantidadUMT: this.formMercancias.get('cantidadUMT')?.value,
        presentacion: this.formMercancias.get('presentacion')?.value,
        numeroRegistro: this.formMercancias.get('numeroRegistro')?.value,
        paisDeOrigen: this.formMercancias.get('paisDeOrigen')?.value,
        paisDeProcedencia: this.formMercancias.get('paisDeProcedencia')?.value,
        tipoProducto: this.formMercancias.get('tipoDeProducto')?.value,
        usoEspecifico: this.formMercancias.get('usoEspecifico')?.value,
        fechaCaducidad: this.formMercancias.get('fechaCaducidad')?.value,
      };
      this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, MERCANCIA];
      this.formMercancias.reset();
      this.listaClavesDeLosLotesDatos = [];
    } else {
      this.formMercancias.markAllAsTouched();
      this.formMercancias.updateValueAndValidity();
    }
  }

  /** 
   * Agrega una nueva entrada a la lista de claves de los lotes.
   * Esta función crea un nuevo objeto `DATOS` utilizando los valores actuales de los controles del formulario `formMercancias`
   * y lo agrega a la lista `listaClavesDeLosLotesDatos`.
   */
  public agregarListaClaves(): void {
    const DATOS = {
      clave: this.formMercancias.get('claveDeLosLotes')?.value,
      fecha: this.formMercancias.get('fechaCaducidad')?.value,
      fechaDeCaducidad: this.formMercancias.get('fechaCaducidadDos')?.value,
    };
    this.listaClavesDeLosLotesDatos = [...this.listaClavesDeLosLotesDatos, DATOS];
  }

  /** 
   * Maneja la selección de elementos en la lista de claves de los lotes.
   * Este método actualiza la lista `seleccionadosListaClaves` con los elementos seleccionados en la lista de claves.
   */
  public onListaClavesSeleccionados(event: Listaclaves[]): void {
    this.seleccionadosListaClaves = event;
  }

  /** 
   * Elimina las claves seleccionadas de la lista de claves de los lotes.
   * Este método filtra la lista `listaClavesDeLosLotesDatos` para eliminar los elementos que están presentes en la lista `seleccionadosListaClaves`.
   * Después de la eliminación, limpia la lista `seleccionadosListaClaves`.
   */
  public onEliminarListaClaves(): void {
    this.listaClavesDeLosLotesDatos = this.listaClavesDeLosLotesDatos.filter(
      (item) => !this.seleccionadosListaClaves.map((sel) => sel.clave).includes(item.clave)
    );
    this.seleccionadosListaClaves = [];
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
