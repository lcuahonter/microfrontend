import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
/**
 * compodoc
 * @fileoverview Componente `EstablecimientoComponent`
 * Este componente gestiona el formulario relacionado con los datos del establecimiento,
 * incluyendo información sobre productos, países de origen, países de procedencia,
 * y otros datos relacionados. También permite la interacción con modales y listas cruzadas.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Modal } from 'bootstrap';


import {
  Catalogo,
  CatalogoServices,
  ConfiguracionColumna,
  CrossListLable,
  CrosslistComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
 } from '@ng-mf/data-access-user';

import {ConsultaioQuery, Notificacion,NotificacionesComponent} from '@ng-mf/data-access-user';


import { CROSLISTA_DE_PAISES } from '../../constantes/datos-solicitud.enum';
import { DATOS_DE_LA_PRODUCTO_MODEL } from '../../constantes/aviso-de-funcionamiento.enum';
import { DatosDeLaProductoModel } from '../../models/datos-de-la-solicitud.model';
import { EstablecimientoService } from '../../services/establecimiento.service';

import { DatosDelSolicituteSeccionStateStore } from '../../estados/stores/datos-del-solicitute-seccion.store';

import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';


import { DomicillioDelEstablecimientoSeccionComponent } from '../domicillio-del-establecimiento-seccion/domicillio-del-establecimiento-seccion.component';
import { ManifiestosRepresentanteSeccionComponent } from '../manifiestos-representante-seccion/manifiestos-representante-seccion.component';

import { DatosDelEstablecimientoSeccionComponent } from '../datos-del-establecimiento-seccion/datos-del-establecimiento-seccion.component';

/**
 * Componente `EstablecimientoComponent`
 * Componente que gestiona los datos del establecimiento.
 */
@Component({
  selector: 'app-establecimiento',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    CrosslistComponent,
    NotificacionesComponent,
    DomicillioDelEstablecimientoSeccionComponent,
    ManifiestosRepresentanteSeccionComponent,
    DatosDelEstablecimientoSeccionComponent,
  ],
  templateUrl: './establecimiento.component.html',
  styleUrl: './establecimiento.component.scss',
})
export class EstablecimientoComponent implements OnInit, OnDestroy, AfterViewInit {
      /**
       * Identificador privado del procedimiento asociado al trámite.
       */
    /**
     * IDs de procedimientos y sus respectivos maxlength para nombreEspecifico
     * Puedes agregar más objetos { id, maxlength } según sea necesario
     */
    private readonly procedimientosMaxlength = [
      { id: 261401, maxlength: 120 },
    ];

    /**
     * Devuelve el maxlength correspondiente al idProcedimiento, o null si no aplica
     */
    get nombreEspecificoMaxLength(): number | null {
      if (this.idProcedimiento === undefined || this.idProcedimiento === null) {
        return null;
      }
      const ID = Number(this.idProcedimiento);
      const ENCONTRADA = this.procedimientosMaxlength.find(p => p.id === ID);
      return ENCONTRADA ? ENCONTRADA.maxlength : null;
    }
  /**
   * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Lista de países disponibles para la selección de procedencia.
   */
  public paisDeProcedenciaDatos = CROSLISTA_DE_PAISES;

  /**
   * Etiquetas para la lista cruzada de países de origen.
   */
  public paisDeOriginLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen',
    derecha: 'País(es) seleccionado(s)',
  };

  /**
   * Etiquetas para la lista cruzada de países de procedencia.
   */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia',
    derecha: 'País(es) seleccionados',
  };

  /**
   * Lista de países disponibles para la selección de origen.
   */
  public seleccionarOrigenDelPais: string[] = [];

  /**
   * Referencia al modal de datos de mercancía.
   */
  @ViewChild('datosMercanciaModal', { static: false })
  datosMercanciaModal!: ElementRef;

  /**
   * Referencias a los componentes de listas cruzadas.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;
  @ViewChildren(CrosslistComponent) crossList1!: QueryList<CrosslistComponent>;

  /**
   * Instancia del modal de Bootstrap.
   */
  datosModalInstance!: Modal;

  /**
   * Formulario para gestionar los datos del producto.
   */
  datosProductoForm!: FormGroup;

  /**
   * Formulario para gestionar los datos de la mercancía.
   */
  datosMercanciaForm!: FormGroup;

  /**
   * Datos de los productos agregados.
   */
  establecimientoData: DatosDeLaProductoModel[] = [];

  /**
   * Configuración de las columnas de la tabla dinámica para los datos del producto.
   */
  configuracionTablaDatosProducto: ConfiguracionColumna<DatosDeLaProductoModel>[] = DATOS_DE_LA_PRODUCTO_MODEL;

  /**
   * Enumeración para la selección de tablas.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Datos del catálogo de estados.
   */
  estadoJson: Catalogo[] = [];

  /**
   * Datos del catálogo de tipo de producto.
   */
  catalogoTipoProducto: Catalogo[] = [];

  /**
   * Datos del catálogo de unidad de medida.
   */
  unidadDeMedida: Catalogo[] = [];

  /**
   * Datos del catálogo de uso específico.
   */
  usoEspecifico: Catalogo[] = [];

  /**
   * Estado del colapsable para países de procedencia.
   */
  colapsable_procedencia: boolean = false;

  /**
   * Lista de países seleccionados como procedencia.
   */
  public seleccionadasPaisDeProcedenciaDatos: string[] = [];

  /**
   * Estado del colapsable para países de origen.
   */
  colapsable: boolean = false;

  /**
   * Lista de países seleccionados como origen.
   */
  public seleccionadasPaisDeOriginDatos: string[] = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Almacena los productos seleccionados en la tabla.
   */
  public productosSeleccionados: DatosDeLaProductoModel[] = [];

  /**
   * Controla la visibilidad del modal de alerta para selección.
   */
  public mostrarAlertaSeleccion: boolean = false;

  /**
   * Controla la visibilidad del modal de confirmación de eliminación.
   */
  public mostrarConfirmacionEliminacion: boolean = false;

  /** Cadena que representa los trámites recibidos desde el componente padre,  
 *  utilizada para configurar o mostrar información relacionada. */
  private _tramites: string = '';
  @Input() set tramites(value: string) {
    this._tramites = value;
    if (value && value !== 'undefined' && value !== 'null' && !isNaN(Number(value))) {
      this.obtenerTipoProducto();
      this.obtenerUnidadMedida();
      this.obtenerUsoEspecifico();
      this.obtenerPaisDeOriginDatos();
    } else {
      this.catalogoTipoProducto = [];
      this.unidadDeMedida = [];
      this.usoEspecifico = [];
      this.seleccionarOrigenDelPais = [];
    }
  }
  get tramites(): string {
    return this._tramites;
  }

    /**
     * Setter para idProcedimiento que también establece tramites automáticamente
     */
    @Input() set idProcedimiento(value: number) {
      this._idProcedimiento = value ?? 0;
      if (value !== undefined && value !== null && !isNaN(Number(value))) {
        this.tramites = String(value);
      } else {
        this.tramites = '';
      }
    }
    get idProcedimiento(): number {
      return this._idProcedimiento;
    }

  /** Indica si la tabla se encuentra vacía  
 *  y permite controlar la visualización en la interfaz. */
  public tablaVacia: boolean = false;

  /** Almacena el valor del idProcedimiento */
  private _idProcedimiento: number = 0;

  /** Referencia al componente de domicilio del establecimiento  
 *  utilizada para acceder a sus métodos y datos desde este componente. */
  @ViewChild(DomicillioDelEstablecimientoSeccionComponent) domicilioEstablecimientoComponent!: DomicillioDelEstablecimientoSeccionComponent;

  /** Referencia al componente de datos del establecimiento  
 *  para acceder a su información y funcionalidades desde este componente. */
  @ViewChild (DatosDelEstablecimientoSeccionComponent) datosDelEstablecimientoComponent!: DatosDelEstablecimientoSeccionComponent;

  /** Referencia al componente de manifiestos del representante  */
  @ViewChild (ManifiestosRepresentanteSeccionComponent) manifiestosRepresentanteSeccionComponent!: ManifiestosRepresentanteSeccionComponent;

  /**
   * Notificación para mostrar cuando no hay filas seleccionadas.
   */
  public notificacionSeleccion: Notificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'Debe seleccionar al menos una fila para realizar esta acción.',
    cerrar: true,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };

  /**
   * Notificación para confirmación de eliminación.
   */
  public notificacionEliminacion: Notificacion = {
    tipoNotificacion: 'alert',
    categoria: 'warning',
    modo: 'action',
    titulo: '',
    mensaje: '¿Está seguro que desea eliminar los elementos seleccionados?',
    cerrar: true,
    tiempoDeEspera: 0,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: 'Cancelar',
  };

/**
 * Arreglo que contiene el catálogo de países de origen.
 * Utilizado para poblar listas desplegables o validaciones relacionadas.
 */
  catalogoPaisesOrigen: Catalogo[] = [];

  public nuevaNotificacion!: Notificacion ;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para inicializar formularios reactivos.
   * @param establecimientoService Servicio para obtener datos relacionados con el establecimiento.
   * @param establecimientoStore Store para gestionar el estado del establecimiento.
   * @param establecimientoQuery Query para obtener el estado inicial del establecimiento.
   */
  constructor(
    private fb: FormBuilder,
    private establecimientoService: EstablecimientoService,
    private establecimientoStore: DatosDelSolicituteSeccionStateStore,
    private establecimientoQuery: DatosDelSolicituteSeccionQuery,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices
  ) {

    this.initializeForms();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState?.readonly || false;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa los formularios reactivos
   */
  private initializeForms(): void {
    this.datosMercanciaForm = this.fb.group({
      nombreEspecifico: ['', Validators.required],
      tipoDeProducto: ['', Validators.required],
      fraccionArancelaria: ['', Validators.required],
      descripcionFraccionArancelaria: [{value: '', disabled: true}],
      cantidadUMT: ['', Validators.required],
      umt: [{value: '', disabled: true}],
      cantidadOVolumen: ['', Validators.required],
      unidadDeMedida: ['', Validators.required],
      presentacionaFrmaceutica: ['', Validators.required],
      almacenamientoEnvasePrimario: [''],
      almacenamientoEnvaseSecundario: [''],
      transporteEnvasePrimario: [''],
      transporteEnvaseSecundario: [''],
      usoEspecifico: ['', Validators.required],
      paisDeDestino: ['']
    });
  }

  /**
   * Ciclo de vida `AfterViewInit`.
   * Inicializa la instancia del modal de Bootstrap.
   */
  ngAfterViewInit(): void {
    if (this.datosMercanciaModal) {
      this.datosModalInstance = new Modal(this.datosMercanciaModal.nativeElement);
    }
  }

  /**
   * Ciclo de vida `OnInit`.
   * Inicializa los formularios y carga los datos iniciales.
   */
  ngOnInit(): void {
    this.estadoActualizacion();
  }

  /**
   * Ciclo de vida OnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * Si el formulario está en modo solo lectura, lo deshabilita; de lo contrario, actualiza el estado.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    }
  }

  /**
   * Guarda el estado del formulario y lo deshabilita si está en modo solo lectura.
   * Si no está en modo solo lectura, habilita el formulario.
   */
  guardarDatosFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.datosMercanciaForm?.disable();
    } else {
      this.datosMercanciaForm?.enable();
    }
  }

  /**
   * Actualiza el estado de los datos del establecimiento desde el store.
   */
  estadoActualizacion(): void {
    this.establecimientoQuery
      .select('establecimientoData')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: DatosDeLaProductoModel[]) => {
        this.establecimientoData = data || [];
      });
  }

  /**
   * Maneja el cambio de selección de países de origen.
   * @param events Lista de países seleccionados.
   */
  paisDeOriginSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisDeOriginDatos = events;
  }

  /**
   * Maneja el cambio de selección de países de procedencia.
   * @param events Lista de países seleccionados.
   */
  paisDeProcedenciaSeleccionadasChange(events: string[]): void {
    this.seleccionadasPaisDeProcedenciaDatos = events;
  }

  /**
   * Add the missing method for the blur event
   */
  onRepresentanteRfcBlur(): void {
    const FRACCION_ARANCELARIA = this.datosMercanciaForm.get('fraccionArancelaria')?.value;

    if(FRACCION_ARANCELARIA){
      this.establecimientoService.obtenerFraccionesArancelarias(Number(this.tramites), FRACCION_ARANCELARIA)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(response => {
        if (response.codigo === "00") {
          const DATOS_FRACCION = response.datos as { descripcionAlternativa: string };
          this.datosMercanciaForm.get('descripcionFraccionArancelaria')?.setValue(DATOS_FRACCION.descripcionAlternativa);
        } else {
          this.abrirModal()
        }
      });

      this.establecimientoService.obtenerUMT(Number(this.tramites), FRACCION_ARANCELARIA)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(response => {
        if (response.codigo === "00") {
          const DATOS_FRACCION = response.datos as { descripcion: string };
          this.datosMercanciaForm.get('umt')?.setValue(DATOS_FRACCION.descripcion);
        } else {
          this.abrirModal()
        }
      });
    }
  }

/**
 * Abre un modal de notificación de alerta.
 * Muestra un mensaje informativo cuando no hay comunicación con el sistema de COFEPRIS.
 */
  abrirModal(): void {
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
  }

  /**
   * Maneja la selección de filas en la tabla de productos.
   * @param productos Lista de productos seleccionados
   */
  onProductosSeleccionados(productos: DatosDeLaProductoModel[]): void {
    this.productosSeleccionados = productos;
  }

  /**
   * Modifica el producto seleccionado.
   * Abre el modal con los datos del producto para edición.
   */
  modificarProducto(): void {
    if (!this.productosSeleccionados.length) {
      this.mostrarAlertaSeleccion = true;
      return;
    }

    if (this.productosSeleccionados.length > 1) {
      this.notificacionSeleccion.mensaje = 'Solo puede modificar un producto a la vez.';
      this.mostrarAlertaSeleccion = true;
      return;
    }
    const PRODUCTOSELECCIONADO = this.productosSeleccionados[0];
    this.cargarDatosEnFormulario(PRODUCTOSELECCIONADO);
    this.openDatosMercanciaModal();
  }

  /**
   * Carga los datos de un producto en el formulario para edición.
   * @param producto Producto a cargar
   */
  private cargarDatosEnFormulario(producto: DatosDeLaProductoModel): void {
    this.datosMercanciaForm.patchValue({
      nombreEspecifico: producto.nombreEspecifico,
      tipoDeProducto: producto.tipoDeProducto,
      fraccionArancelaria: producto.fraccionArancelaria,
      descripcionFraccionArancelaria: producto.descripcionDeLaFraccion,
      cantidadUMT: producto.cantidadUMT,
      umt: producto.unidadDeMedidaDeTarifa,
      cantidadOVolumen: producto.cantidadOVolumen,
      unidadDeMedida: producto.unidadDeMedida,
      presentacionaFrmaceutica: producto.Presentacion,
      almacenamientoEnvasePrimario: producto.envasePrimario,
      almacenamientoEnvaseSecundario: producto.envaseSecundario,
      usoEspecifico: producto.usoEpecifico,
    });

    if (producto.paisDeOrigen) {
      this.seleccionadasPaisDeOriginDatos = producto.paisDeOrigen.split(', ');
    }
    if (producto.paisDeProcedencia) {
      this.seleccionadasPaisDeProcedenciaDatos = producto.paisDeProcedencia.split(', ');
    }
  }

  /**
   * Elimina los productos seleccionados.
   */
  eliminarProductos(): void {
    if (!this.productosSeleccionados.length) {
      this.mostrarAlertaSeleccion = true;
      return;
    }

    this.mostrarConfirmacionEliminacion = true;
  }

  /**
   * Confirma la eliminación de productos.
   * @param confirmar True si se confirma la eliminación
   */
  confirmarEliminacion(confirmar: boolean): void {
    this.mostrarConfirmacionEliminacion = false;

    if (confirmar) {

      this.establecimientoData = this.establecimientoData.filter(producto =>
        !this.productosSeleccionados.some(seleccionado =>
          EstablecimientoComponent.compararProductos(producto, seleccionado)
        )
      );
      this.establecimientoStore.update({ establecimientoData: this.establecimientoData });
      this.productosSeleccionados = [];
      this.notificacionSeleccion.mensaje = 'Productos eliminados correctamente.';
      this.notificacionSeleccion.categoria = 'success';
      this.mostrarAlertaSeleccion = true;
    }
  }

  /**
   * Compara dos productos para determinar si son iguales.
   * @param producto1 Primer producto
   * @param producto2 Segundo producto
   * @returns True si son iguales
   */
  private static compararProductos(producto1: DatosDeLaProductoModel, producto2: DatosDeLaProductoModel): boolean {
    return producto1.nombreEspecifico === producto2.nombreEspecifico &&
      producto1.fraccionArancelaria === producto2.fraccionArancelaria &&
      producto1.tipoDeProducto === producto2.tipoDeProducto;
  }

  /**
   * Cierra el modal de alerta.
   */
  cerrarAlerta(): void {
    this.mostrarAlertaSeleccion = false;
    this.notificacionSeleccion.mensaje = 'Debe seleccionar al menos una fila para realizar esta acción.';
    this.notificacionSeleccion.categoria = 'danger';
  }

  /**
   * Guarda los datos de la mercancía y los agrega a la tabla.
   * Modificado para manejar tanto agregar como modificar.
   */
  guardarDatosMercancia(): void {
    if (this.datosMercanciaForm.valid) {
      const CLAVE_PAIS_DE_ORIGEN = this.seleccionadasPaisDeOriginDatos
      .map(desc => {
      const VALOR = this.catalogoPaisesOrigen.find(p => p.descripcion === desc);
      return VALOR ? VALOR.descripcion : desc;
    });

      const MERCANCIA_DATA: DatosDeLaProductoModel = {
        tipoDeProducto: EstablecimientoComponent.obtenerDescripcion(this.catalogoTipoProducto, this.datosMercanciaForm.get('tipoDeProducto')?.value),
        tipoDeProductoId: this.datosMercanciaForm.get('tipoDeProducto')?.value,
        nombreEspecifico: this.datosMercanciaForm.get('nombreEspecifico')?.value,
        cantidadOVolumen: Number(this.datosMercanciaForm.get('cantidadOVolumen')?.value).toFixed(2),
        unidadDeMedida: EstablecimientoComponent.obtenerDescripcion(this.unidadDeMedida, this.datosMercanciaForm.get('unidadDeMedida')?.value),
        unidadDeMedidaId: this.datosMercanciaForm.get('unidadDeMedida')?.value,
        Presentacion: this.datosMercanciaForm.get('presentacionaFrmaceutica')?.value,
        fraccionArancelaria: this.datosMercanciaForm.get('fraccionArancelaria')?.value,
        descripcionDeLaFraccion: this.datosMercanciaForm.get('descripcionFraccionArancelaria')?.value,
        unidadDeMedidaDeTarifa: this.datosMercanciaForm.get('umt')?.value,
        cantidadUMT: Number(this.datosMercanciaForm.get('cantidadUMT')?.value).toFixed(2),
        envasePrimario: this.datosMercanciaForm.get('almacenamientoEnvasePrimario')?.value,
        envaseSecundario: this.datosMercanciaForm.get('almacenamientoEnvaseSecundario')?.value,
        transporteEnvasePrimario: this.datosMercanciaForm.get('transporteEnvasePrimario')?.value,
        transporteEnvaseSecundario: this.datosMercanciaForm.get('transporteEnvaseSecundario')?.value,
        paisDeOrigen: '',
        paisDeProcedencia: this.seleccionadasPaisDeProcedenciaDatos.join(', '),
        paisDeDestino: CLAVE_PAIS_DE_ORIGEN.join(', '),
        usoEpecifico: EstablecimientoComponent.obtenerDescripcion(this.usoEspecifico, this.datosMercanciaForm.get('usoEspecifico')?.value),
        usoEpecificoId: this.datosMercanciaForm.get('usoEspecifico')?.value,
      };

      let UPDATED_DATA: DatosDeLaProductoModel[];
      if (this.productosSeleccionados.length === 1) {
        const PRODUCTTOORIGINAL = this.productosSeleccionados[0];
        const INDEX = this.establecimientoData.findIndex(producto =>
          EstablecimientoComponent.compararProductos(producto, PRODUCTTOORIGINAL)
        );

        if (INDEX !== -1) {
          UPDATED_DATA = [...this.establecimientoData];
          UPDATED_DATA[INDEX] = MERCANCIA_DATA;
        } else {
          UPDATED_DATA = [...this.establecimientoData, MERCANCIA_DATA];
        }
      } else {

        UPDATED_DATA = [...this.establecimientoData, MERCANCIA_DATA];
      }

      this.establecimientoStore.update({ establecimientoData: UPDATED_DATA });

      this.datosMercanciaForm.reset();
      this.productosSeleccionados = [];
      this.seleccionadasPaisDeOriginDatos = [];
      this.seleccionadasPaisDeProcedenciaDatos = [];
      this.closeDatosMercanciaModal();
    } else {
      this.datosMercanciaForm.markAllAsTouched();
    }
  }

  /**
   * @method obtenerDescripcion
   * @description
   * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
   * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
   */
    public static obtenerDescripcion(array: Catalogo[], clave: string): string {
      const DESCRIPCION = array.find((ele: Catalogo) => Number(ele.clave) === Number(clave))?.descripcion;
      return DESCRIPCION ?? '';
    }

  /**
   * Limpia todos los campos del formulario.
   */
  limpiarFormulario(): void {
    this.datosMercanciaForm.reset();
    this.seleccionadasPaisDeOriginDatos = [];
    this.seleccionadasPaisDeProcedenciaDatos = [];
  }

  /**
   * Botones para gestionar la lista cruzada de países de procedencia.
   */
  paisDeProcedenciaBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => this.crossList1.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: (): void => this.crossList1.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: (): void => this.crossList1.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Botones para gestionar la lista cruzada de países de origen - Fixed duplicate property
   */
  paisDeOriginBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Abre el modal de datos de mercancía.
   */
  openDatosMercanciaModal(): void {
    if (this.datosModalInstance) {
      this.datosModalInstance.show();
    }
  }

  /**
   * Cierra el modal de datos de mercancía.
   */
  closeDatosMercanciaModal(): void {
    if (this.datosModalInstance) {
      this.datosModalInstance.hide();
    }
  }

  /**
   * Alterna el estado del colapsable para países de origen.
   */
  mostrar_colapsable_pais(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Alterna el estado del colapsable para países de procedencia.
   */
  mostrar_colapsable_pais_procedencia(): void {
    this.colapsable_procedencia = !this.colapsable_procedencia;
  }

/** Obtiene el catálogo de tipos de producto según el trámite actual,  
 *  asignando los datos recibidos a la propiedad `catalogoTipoProducto`. */
  obtenerTipoProducto(): void {
    // Validar que tramites no sea undefined antes de hacer la llamada API
    if (!this.tramites || this.tramites === 'undefined') {
      this.catalogoTipoProducto = [];
      return;
    }
    this.catalogoService.tiposProductoCatalogo(this.tramites, this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.catalogoTipoProducto = response?.datos ?? []
        }
      });
}

/** Obtiene el catálogo de unidades de medida según el trámite actual,  
 *  asignando los datos recibidos a la propiedad `unidadDeMedida`. */
  obtenerUnidadMedida(): void {
    // Validar que tramites no sea undefined antes de hacer la llamada API
    if (!this.tramites || this.tramites === 'undefined') {
      this.unidadDeMedida = [];
      return;
    }
    this.catalogoService.catalogoUnidadMedida(this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.unidadDeMedida = response?.datos ?? []
        }
      });
}

/** Obtiene el catálogo de usos específicos de mercancía según el trámite actual,  
 *  asignando los datos recibidos a la propiedad `usoEspecifico`. */
  obtenerUsoEspecifico(): void {
    // Validar que tramites no sea undefined antes de hacer la llamada API
    if (!this.tramites || this.tramites === 'undefined') {
      this.usoEspecifico = [];
      return;
    }
    this.catalogoService.usosEspecificoMercanciaCatalogo(this.tramites, this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.usoEspecifico = response?.datos ?? []
        }
      });
}

/** Obtiene el catálogo de países según el trámite actual,  
 *  asignando sus descripciones a la propiedad `seleccionarOrigenDelPais`. */
obtenerPaisDeOriginDatos(): void {
  // Validar que tramites no sea undefined antes de hacer la llamada API
  if (!this.tramites || this.tramites === 'undefined') {
    this.catalogoPaisesOrigen = [];
    this.seleccionarOrigenDelPais = [];
    return;
  }
  this.catalogoService.paisesCatalogo(this.tramites)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.catalogoPaisesOrigen = response?.datos ?? [];
        this.seleccionarOrigenDelPais = this.catalogoPaisesOrigen.map((item: Catalogo) => item.descripcion);
      }
    });
}

/** Valida los formularios del domicilio y datos del establecimiento,  
 *  devolviendo `true` solo si ambos son correctos. */
validarEstablecimientoFormularios(): boolean {
const DOMICILIO_DEL_VALIDO = this.domicilioEstablecimientoComponent?.validarDomicilioFormularios?.() ?? false;
const DATOS_DEL_ESTABLECIMIENTO_VALIDO = this.datosDelEstablecimientoComponent?.validarDomicilioFormularios?.() ?? false;
const MANIFIESTOS_DEL_REPRESENTANTE_VALIDO = this.manifiestosRepresentanteSeccionComponent?.validarManifiestosFormularios?.() ?? false;
return DOMICILIO_DEL_VALIDO && DATOS_DEL_ESTABLECIMIENTO_VALIDO && MANIFIESTOS_DEL_REPRESENTANTE_VALIDO;
}
}