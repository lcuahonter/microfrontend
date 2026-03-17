/* eslint-disable sort-imports */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Catalogo,
  Notificacion,
  TablaSeleccion,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import {
  UNIDAD_TABLA_CONFIG,
  VEHICULOS_TABLA_CONFIG,
} from '../../enum/transportista-terrestre.enum';
import {
  Tramite40102State,
  Tramite40102Store,
} from '../../estados/tramite40102.store';
import {
  CatalogoLista,
  UnidadTabla,
  VehiculoTabla,
  VehiculoTablaDatos,
} from '../../models/registro-muestras-mercancias.model';
import { modificarTerrestreService } from '../services/modificacar-terrestre.service';
import { map, Subject, takeUntil } from 'rxjs';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Tramite40102Query } from '../../estados/tramite40102.query';
/**
 * @component VehiculosComponent
 * @description
 * Componente responsable de la gestión de vehículos y unidades de arrastre en el trámite 40102.
 * Permite agregar, editar, eliminar y mostrar información de vehículos y unidades de arrastre,
 * así como gestionar los formularios reactivos, la interacción con tablas dinámicas y la visualización de modales.
 *
 * También se encarga de la comunicación con servicios para obtener catálogos y datos, y de la sincronización con el store de estado.
 *
 * @selector app-vehiculos
 * @templateUrl ./vehiculos.component.html
 * @styleUrl ./vehiculos.component.scss
 *
 * @implements OnInit
 */
@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
})
export class VehiculosComponent implements OnInit {
  /**
   * Almacena la lista de vehículos.
   */
  VehiculoTabla: VehiculoTabla[] = [];

  /**
   * Referencia al modal de vehículo.
   */
  @ViewChild('vehiculoModal') vehiculoModal!: ElementRef;

  /**
   * Referencia al modal de unidad de arrastre.
   */
  @ViewChild('unidadModal') unidadModal!: ElementRef;

  /**
   * Formulario reactivo para vehículos.
   */
  vehiculoFormulario!: FormGroup;

  /**
   * Formulario reactivo para unidades de arrastre.
   */
  unidadFormulario!: FormGroup;

  /**
   * Sujeto para destruir las suscripciones.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Catálogo de tipos de vehículo.
   */
  tipoDeVehiculoCatalogo: Catalogo[] = [];

  /**
   * Notificación actual.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Nombre de la pestaña seleccionada.
   */
  selectedTab: string = 'Parque vehicular';

  /**
   * Nombre de la pestaña activa.
   */
  activeTab: string = 'parquevehicular';

  /**
   * Tipo de selección de la tabla.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Estado actual del trámite.
   */
  public tramiteState!: Tramite40102State;

  /**
   * Referencia al botón de cierre del modal de vehículo.
   */
  @ViewChild('closeModal') public closeModal!: ElementRef;

  /**
   * Referencia al botón de cierre del modal de unidad de arrastre.
   */
  @ViewChild('closeUnidadModal') public closeUnidadModal!: ElementRef;
  
  /**
   * Indica si el formulario o componente está en modo solo lectura.
   * Cuando es `true`, los campos no pueden ser editados por el usuario.
   */
  isReadonly: boolean = false;
  
  /**
   * Almacena el estado de consulta actual.
   * Contiene información relevante para determinar el modo de solo lectura y otros datos de consulta.
   */
  datosConsulta!: ConsultaioState;
  
  /**
   * Constructor del componente.
   * @param fb Instancia de FormBuilder para la creación de formularios reactivos.
   * @param store Store que gestiona el estado del trámite 40102.
   * @param tramiteQuery Query para consultar el estado del trámite 40102.
   * @param modificarTerrestreService Servicio encargado de modificar y obtener datos de vehículos terrestres.
   * @param validacionesService Servicio para validaciones personalizadas de los formularios.
   * @param consultaioQuery Query para consultar el estado de consulta y modo de solo lectura.
   */
  

  constructor(
    public fb: FormBuilder,
    public store: Tramite40102Store,
    public tramiteQuery: Tramite40102Query,
    public modificarTerrestreService: modificarTerrestreService,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Suscribe a los cambios de estado del trámite y del modo de consulta (solo lectura),
   * inicializa los formularios y carga el catálogo de tipos de vehículo.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if (seccionState.readonly) {
            this.datosConsulta = seccionState;
            this.isReadonly = this.datosConsulta.readonly;
          }
        })
      ).subscribe();

    this.selectTab('parquevehicular');
    this.inicializarFormulario();
    this.cargarTipoDeVehiculo();
  }

  /**
   * Configuración de la tabla de vehículos.
   */
  vehiculosTablaConfig: {
    encabezadas: {
      encabezado: string;
      clave: (item: VehiculoTabla) => string;
      orden: number;
    }[];
    datos: VehiculoTabla[];
  } = VEHICULOS_TABLA_CONFIG;

  /**
   * Configuración de la tabla de unidades de arrastre.
   */
  unidadesTablaConfig: {
    encabezadas: {
      encabezado: string;
      clave: (item: UnidadTabla) => string;
      orden: number;
    }[];
    datos: UnidadTabla[];
  } = UNIDAD_TABLA_CONFIG;

  /**
   * Cambia la pestaña seleccionada.
   * @param tabName Nombre de la pestaña.
   * @returns Nombre de la pestaña activa.
   */
  selectTab(tabName: string): string {
    this.selectedTab =
      tabName === 'parquevehicular' ? 'Parque vehicular' : 'Unidad de arrastre';
    this.activeTab = tabName;
    return this.activeTab;
  }

  /**
   * Elimina todos los registros de la tabla de vehículos.
   */
  eliminarPedimento(): void {
    this.vehiculosTablaConfig.datos = [];
    this.editIndex = null;
    this.vehiculoFormulario.reset();
  }

  /**
   * Elimina todos los registros de la tabla de unidades de arrastre.
   */
  eliminarUnidadPedimento(): void {
    this.unidadesTablaConfig.datos = [];
    this.editUnidadIndex = null;
    this.unidadFormulario.reset();
  }

  /**
   * Abre el modal para agregar o editar un vehículo.
   */
  abiertoPedimento(): void {
    if (this.vehiculoModal) {
      const MODAL_INSTANCE = new Modal(this.vehiculoModal.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Abre el modal para agregar o editar una unidad de arrastre.
   */
  abiertoPedimentoUnidad(): void {
    if (this.unidadModal) {
      const MODAL_INSTANCE = new Modal(this.unidadModal.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Actualiza el valor de un campo en el store.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite40102Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Inicializa los formularios reactivos de vehículo y unidad de arrastre.
   */
  inicializarFormulario(): void {
    this.vehiculoFormulario = this.fb.group({
      numero: [this.tramiteState.datosVehiculo.numero, [Validators.required]],
      tipoDeVehiculo: [
        this.tramiteState.datosVehiculo.tipoDeVehiculo,
        [Validators.required],
      ],
      idDeVehiculo: [
        this.tramiteState.datosVehiculo.idDeVehiculo,
        [Validators.required],
      ],
      numeroPlaca: [
        this.tramiteState.datosVehiculo.numeroPlaca,
        [Validators.required],
      ],
      paisEmisor: [
        this.tramiteState.datosVehiculo.paisEmisor,
        [Validators.required],
      ],
      estado: [this.tramiteState.datosVehiculo.estado, [Validators.required]],
      marca: [this.tramiteState.datosVehiculo.marca, [Validators.required]],
      modelo: [this.tramiteState.datosVehiculo.modelo, [Validators.required]],
      ano: [this.tramiteState.datosVehiculo.ano, [Validators.required]],
      transponder: [
        this.tramiteState.datosVehiculo.transponder,
        [Validators.required],
      ],
      colorVehiculo: [
        this.tramiteState.datosVehiculo.colorVehiculo,
        [Validators.required],
      ],
      numuroEconomico: [
        this.tramiteState.datosVehiculo.numuroEconomico,
        [Validators.required],
      ],
      numero2daPlaca: [
        this.tramiteState.datosVehiculo.numero2daPlaca,
        [Validators.required],
      ],
      estado2daPlaca: [
        this.tramiteState.datosVehiculo.estado2daPlaca,
        [Validators.required],
      ],
      paisEmisor2daPlaca: [
        this.tramiteState.datosVehiculo.paisEmisor2daPlaca,
        [Validators.required],
      ],
      descripcion: [
        this.tramiteState.datosVehiculo.descripcion,
        [Validators.required],
      ],
    });

    this.unidadFormulario = this.fb.group({
      vinVehiculo: [
        this.tramiteState.datosUnidad.vinVehiculo,
        [Validators.required],
      ],
      tipoDeUnidadArrastre: [
        this.tramiteState.datosUnidad.tipoDeUnidadArrastre,
        [Validators.required],
      ],
      idDeVehiculo: [
        this.tramiteState.datosUnidad.idDeVehiculo,
        [Validators.required],
      ],
      numeroEconomico: [
        this.tramiteState.datosUnidad.numeroEconomico,
        [Validators.required],
      ],
      numeroPlaca: [
        this.tramiteState.datosUnidad.numeroPlaca,
        [Validators.required],
      ],
      paisEmisor: [
        this.tramiteState.datosUnidad.paisEmisor,
        [Validators.required],
      ],
      estado: [this.tramiteState.datosUnidad.estado, [Validators.required]],
      colorVehiculo: [
        this.tramiteState.datosUnidad.colorVehiculo,
        [Validators.required],
      ],
      numero2daPlaca: [
        this.tramiteState.datosUnidad.numero2daPlaca,
        [Validators.required],
      ],
      estado2daPlaca: [
        this.tramiteState.datosUnidad.estado2daPlaca,
        [Validators.required],
      ],
      paisEmisor2daPlaca: [
        this.tramiteState.datosUnidad.paisEmisor2daPlaca,
        [Validators.required],
      ],
      descripcion: [
        this.tramiteState.datosUnidad.descripcion,
        [Validators.required],
      ],
    });
  }

  /**
   * Valida si un campo del formulario es válido.
   * @param form Formulario reactivo.
   * @param field Nombre del campo.
   * @returns true si es válido, false en caso contrario.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Índice de edición para la tabla de vehículos.
   */
  editIndex: number | null = null;

  /**
   * Inicia la edición de un vehículo.
   * @param index Índice del vehículo a editar.
   */
  startEditVehiculo(index: number): void {
    this.editIndex = index;
    const VEHICULO = this.vehiculosTablaConfig.datos[index];
    this.vehiculoFormulario.patchValue(VEHICULO);
    this.abiertoPedimento();
  }

  /**
   * Agrega o actualiza un vehículo en la tabla.
   */
  agregarVahiculodata(): void {
    if (this.vehiculoFormulario.valid) {
      if (this.editIndex !== null) {
        // Actualiza la fila existente
        this.vehiculosTablaConfig.datos[this.editIndex] =
          this.vehiculoFormulario.value;
        this.editIndex = null;
      } else {
        // Agrega una nueva fila
        this.vehiculosTablaConfig.datos = [
          ...this.vehiculosTablaConfig.datos,
          this.vehiculoFormulario.value,
        ];
      }
      this.closeModal.nativeElement.click();
      this.vehiculoFormulario.reset();
    } else {
      this.vehiculoFormulario.markAllAsTouched();
    }
  }

  /**
   * Índice de edición para la tabla de unidades de arrastre.
   */
  editUnidadIndex: number | null = null;

  /**
   * Inicia la edición de una unidad de arrastre.
   * @param index Índice de la unidad a editar.
   */
  startEditUnidad(index: number): void {
    this.editUnidadIndex = index;
    const UNIDAD = this.unidadesTablaConfig.datos[index];
    this.unidadFormulario.patchValue(UNIDAD);
    this.abiertoPedimentoUnidad();
  }

  /**
   * Agrega o actualiza una unidad de arrastre en la tabla.
   */
  agregarUnidadData(): void {
    if (this.unidadFormulario.valid) {
      if (this.editUnidadIndex !== null) {
        this.unidadesTablaConfig.datos[this.editUnidadIndex] =
          this.unidadFormulario.value;
        this.editUnidadIndex = null;
      } else {
        this.unidadesTablaConfig.datos = [
          ...this.unidadesTablaConfig.datos,
          this.unidadFormulario.value,
        ];
      }
      this.closeUnidadModal.nativeElement.click();
      this.unidadFormulario.reset();
    } else {
      this.unidadFormulario.markAllAsTouched();
    }
  }

  /**
   * Carga los datos del pedimento en la tabla de vehículos.
   */
  public cargarPedimentoTabla(): void {
    this.modificarTerrestreService
      .obtenerPedimentoTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: VehiculoTablaDatos) => {
        this.vehiculosTablaConfig.datos = datos.datos;
      });
  }

  /**
   * Limpia el formulario de vehículo.
   */
  limpiarVahiculodata(): void {
    this.vehiculoFormulario.reset();
  }

  /**
   * Limpia el formulario de unidad de arrastre.
   */
  limpiarUnidaddata(): void {
    this.unidadFormulario.reset();
  }

  /**
   * Abre una notificación modal.
   */
  public abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'El registro fue agregado correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Carga el catálogo de tipos de vehículo.
   */
  public cargarTipoDeVehiculo(): void {
    this.modificarTerrestreService
      .obtenerTipoDeVehiculo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.tipoDeVehiculoCatalogo = datos.datos;
      });
  }
}