import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  CrossListLable,
  CrosslistComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDetalle, DatosSolicitud } from '../../models/datos-tramite.model';
import { ENCABEZADO_DE_TABLA_DETALLE, ENCABEZADO_DE_TABLE_CONFIGURACION } from '../../enum/destinatario-tabla.enum';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud230201State, Tramite230201Store } from '../../estados/tramite230201.store';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { PhytosanitaryExportacionService } from '../../services/phytosanitary-exportacion.service';
import { Tramite230201Query } from '../../estados/tramite230201.query';
/**
 * Componente principal para gestionar los datos de la solicitud del trámite 230201.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    CrosslistComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario principal del trámite.
   */
  solicitudForm!: FormGroup;

  /**
   * Formulario para agregar mercancías.
   */
  agregarMercanciasForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud230201State;

  /**
   * Sujeto para manejar la destrucción de observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de catálogos disponibles para el número de certificado.
   */
  paisDeProcedencia!: Catalogo[];

  /**
   * Lista de catálogos disponibles para aduanas.
   */
  aduana!: Catalogo[];

  /**
   * Lista de catálogos disponibles para países.
   */

  /**
   * Lista de catálogos disponibles para entidades.
   */
  entidades!: Catalogo[];

  /**
   * Lista de catálogos disponibles para la descripción del producto.
   */
  descripcionProducto!: Catalogo[];

  /**
   * Lista de catálogos disponibles para fracciones arancelarias.
   */
  fraccionArancelaria!: Catalogo[];

  /**
   * Lista de rangos de días seleccionados.
   */

  /**
   * Lista de entidades seleccionadas.
   */
  selectEntidades: string[] = [];

  /**
   * Lista de catálogos disponibles para géneros .
   */
  genero!: Catalogo[];

  /**
   * Lista de catálogos disponibles para especies.
   */
  especie!: Catalogo[];

  /**
   * Lista de catálogos disponibles para nombres comunes.
   */
  nombreComun!: Catalogo[];

  /**
   * Lista de catálogos disponibles para unidades de medida.
   */
  unidadDeMedida!: Catalogo[];

  /**
   * Lista de catálogos disponibles para medios de transporte.
   */
  medioDeTransporte!: Catalogo[];

  /**
   * Lista de catálogos disponibles para estados.
   */
  estado!: Catalogo[];

  /**
   * Control de formulario para la fecha.
   */
  fecha: FormControl = new FormControl('');

  /**
   * Control de formulario para la fecha seleccionada.
   */
  fechaSeleccionada: FormControl = new FormControl('');

  /**
   * Referencia a los componentes Crosslist en la vista.
   */
   @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Referencia al modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias', { static: false }) modalRef!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

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
   * @property moduloEmergente
   * @description Indica si el módulo emergente está activo.
   */
  public moduloEmergente: boolean = false;

  /**
   * @property nuevaNotificacion
   * @description Objeto que contiene la configuración de la notificación a mostrar.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property mostrarErrorCantidad
   * @description Controla si se muestra el error personalizado para el campo cantidad.
   */
  public mostrarErrorCantidad: boolean = false;

  /**
   * Etiquetas para la lista de países de origen.
   */
  public paisDeOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'País(es) seleccionado(s)*:',
  };

  /**
   * Etiquetas para la lista de entidades.
   */
  public entidadesLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Entidades disponibles:',
    derecha: 'Entidades seleccionadas*:',
  };

  /**
   * Lista de datos de la solicitud.
   */
  public datosSolicitud: DatosSolicitud[] = [];

  /**
   * Filas seleccionadas en la tabla de solicitudes.
   */
  selectedRows: number[] = [];

  /**
   * Filas seleccionadas en la tabla de detalles.
   */
  selectedRowsDetalle: number[] = [];

  /**
   * Lista de datos de detalle.
   */
  public datosDetalle: DatosDetalle[] = [];

  /**
   * Configuración de la tabla de selección.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de las columnas de la tabla de solicitudes.
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosSolicitud>[] = ENCABEZADO_DE_TABLE_CONFIGURACION;

  /**
   * Configuración de las columnas de la tabla de detalles.
   */
  public encabezadoDeTablaDetalle: ConfiguracionColumna<DatosDetalle>[] = ENCABEZADO_DE_TABLA_DETALLE;

  /**
   * @description Arreglo de objetos que define los botones para la funcionalidad de entrada de aduanas.
   * Cada objeto contiene el nombre del botón, la clase CSS para su estilo y la función asociada que se ejecuta al hacer clic.
   * @type {Array<{btnNombre: string, class: string, funcion: () => void}>}
   */
  entidadFederativaOrigenBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn btn-primary',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Constructor del componente.
   * @param phytosanitaryExportacionService Servicio para gestionar datos fitosanitarios.
   * @param store Almacén del estado del trámite.
   * @param query Consulta del estado del trámite.
   * @param fb Constructor de formularios reactivos.
   */
  constructor(
    public phytosanitaryExportacionService: PhytosanitaryExportacionService,
    public store: Tramite230201Store,
    public query: Tramite230201Query,
    private consultaioQuery: ConsultaioQuery,
    public fb: FormBuilder
  ) {}

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.inicializarFormulario();
    this.datosSolicitud = this.solicitudState.datosSolicitud;
    
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.updateEstadoFormulario();
        })
      )
      .subscribe();

  }


  /**
   * Actualiza el estado de los formularios del componente según el modo de solo lectura.
   *
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los formularios asociados
   * (`solicitudForm`, `agregarMercanciasForm`, `exportacionForm`, y `datosMercancia`).
   * Si es falsa, habilita dichos formularios para permitir la edición.
   */
  updateEstadoFormulario(): void {
    if (this.soloLectura) {
      this.solicitudForm.disable();
      this.exportacionForm?.disable();
      this.datosMercancia?.disable();
    } else {
      this.solicitudForm?.enable();
      this.exportacionForm?.enable();
      this.datosMercancia?.enable();
    }
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Obtiene el grupo de formulario de exención de impuestos.
   */
  get exportacionForm(): FormGroup {
    return this.solicitudForm.get('exportacionForm') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario de datos de mercancía.
   */
  inicializarFormulario(): void {
    this.solicitudForm = this.fb.group({
      exportacionForm: this.fb.group({
        paisDeProcedencia: [
          this.solicitudState?.paisDeProcedencia
        ],
        aduana: [this.solicitudState?.aduana, [Validators.required]],
        entidades: [this.solicitudState?.entidades, [Validators.required]],
        descripcionProducto: [
          this.solicitudState?.descripcionProducto,
          [Validators.required],
        ],
        unidadDeMedida: [
          this.solicitudState?.unidadDeMedida,
          Validators.required,
        ],
        lungarDeEntrada: [
          this.solicitudState?.lungarDeEntrada,
          Validators.required,
        ],
        destinoDeImportador: [
          this.solicitudState?.destinoDeImportador,
          Validators.required,
        ],
        medioDeTransporte: [
          this.solicitudState?.medioDeTransporte,
          Validators.required,
        ],
        numeroYDescripcion: [
          this.solicitudState?.numeroYDescripcion,
          Validators.required,
        ],
        codigoPostal: [
          this.solicitudState?.codigoPostal, 
          Validators.required,
        ],
        estado: [
          this.solicitudState?.estado,
          Validators.required,
        ],
        calle: [
          this.solicitudState?.calle,
          Validators.required,
        ],
        numeroExterior: [
          this.solicitudState?.numeroExterior,
          Validators.required,
        ],
        numeroInterior: [
          this.solicitudState?.numeroInterior,
          Validators.required,
        ],
        colonia: [
          this.solicitudState?.colonia,
          Validators.required,
        ],
        fechasSeleccionadas: this.fb.array([]),
      }),
    });

    this.agregarMercanciasForm = this.fb.group({
      datosMercancia: this.fb.group({
        fraccionArancelaria: [
          this.solicitudState?.fraccionArancelaria,
          [Validators.required],
        ],
        descripcionfraccionArancelaria: [
          {
            value: this.solicitudState?.descripcionFraccionArancelaria,
            disabled: true,
          },
        ],
        cantidad: [this.solicitudState?.cantidad, Validators.required],
        cantidadLetra: [
          { value: this.solicitudState?.cantidadLetra, disabled: true },
        ],
        genero: [this.solicitudState?.genero, Validators.required],
        especie: [this.solicitudState?.especie, Validators.required],
        nombreComun: [this.solicitudState?.nombreComun, Validators.required],
       
      }),
    });
  }

  /**
   * Inicializa los catálogos necesarios para el componente.
   */
  inicializaCatalogos(): void {
    const PAIS_DE_PROCEDENCIA$ = this.phytosanitaryExportacionService
      .getPaisDeProcedencia()
      .pipe(
        map((resp) => {
          this.paisDeProcedencia = resp.data;
          if(this.paisDeProcedencia.length > 0) {
            this.solicitudForm.patchValue({
              "exportacionForm.paisDeProcedencia": this.paisDeProcedencia[0].id,
            });
          }
        })
      );

    const ADUANA$ = this.phytosanitaryExportacionService.getAduana().pipe(
      map((resp) => {
        this.aduana = resp.data;
      })
    );

    const ENTIDADES$ = this.phytosanitaryExportacionService
      .getEntidades()
      .pipe(
        map((resp) => {
          this.entidades = resp.data;
          this.selectEntidades = this.entidades.map(
            (entidades: Catalogo) => entidades.descripcion
          );
        })
      );

    const DESCRIPCION_PRODUCTO$ = this.phytosanitaryExportacionService
      .getDescripcionProducto()
      .pipe(
        map((resp) => {
          this.descripcionProducto = resp.data;
        })
      );

    const FRACCION$ = this.phytosanitaryExportacionService
      .getFraccionArancelaria()
      .pipe(
        map((resp) => {
          this.fraccionArancelaria = resp.data;
        })
      );

    const GENERO$ = this.phytosanitaryExportacionService.getGenero().pipe(
      map((resp) => {
        this.genero = resp.data;
      })
    );

    const ESPECIE$ = this.phytosanitaryExportacionService.getEspecie().pipe(
      map((resp) => {
        this.especie = resp.data;
      })
    );

    const NOMBRE_COMUN$ = this.phytosanitaryExportacionService
      .getNombreComun()
      .pipe(
        map((resp) => {
          this.nombreComun = resp.data;
        })
      );

    const UNIDAD_DE_MEDIDA$ = this.phytosanitaryExportacionService
      .getUnidadDeMedida().pipe(
        map((resp) => {
          this.unidadDeMedida = resp.data;
        })
      );

    const MEDIO_DE_TRANSPORTE$ = this.phytosanitaryExportacionService
      .getMedioDeTransporte()
      .pipe(
        map((resp) => {
          this.medioDeTransporte = resp.data;
        })
      );

    const ESTADO$ = this.phytosanitaryExportacionService
      .getEstado().pipe(
        map((resp) => {
          this.estado = resp.data;
        })
      );

    merge(
      PAIS_DE_PROCEDENCIA$,
      ADUANA$,
      ENTIDADES$,
      DESCRIPCION_PRODUCTO$,
      FRACCION$,
      GENERO$,
      ESPECIE$,
      NOMBRE_COMUN$,
      UNIDAD_DE_MEDIDA$,
      MEDIO_DE_TRANSPORTE$,
      ESTADO$
    )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe();
  }

  /**
   * Obtiene el grupo de formulario relacionado con los datos de mercancía.
   * @returns El grupo de formulario `datosMercancia`.
   */
  get datosMercancia(): FormGroup {
    return this.solicitudForm.get('datosMercancia') as FormGroup;
  }

  /**
   * Maneja la selección del número de certificado.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  paisDeProcedenciaSeleccion(): void {
    const PAISE_DE_PROCEDENCIA = this.solicitudForm.get(
      'exportacionForm.paisDeProcedencia'
    )?.value;
    this.store.setpaisDeProcedencia(PAISE_DE_PROCEDENCIA);
  }

  /**
   * Maneja la selección de la aduana.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  aduanaSeleccion(): void {
    const ADUANA = this.solicitudForm.get('exportacionForm.aduana')?.value;
    this.store.setAduana(ADUANA);
  }

  /**
   * Maneja la selección del país.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  paisSeleccion(): void {
    const PAIS = this.solicitudForm.get('exportacionForm.pais')?.value;
    this.store.setPais(PAIS);
  }

  /**
   * Maneja la selección de las entidades.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  entidadesSeleccion(): void {
    const ENTIDADES = this.solicitudForm.get(
      'exportacionForm.entidades'
    )?.value;
    this.store.setEntidades(ENTIDADES);
  }

  /**
   * Maneja la selección de la descripción del producto.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  descripcionProductoSeleccion(): void {
    const DESCRIPCION_PRODUCTO = this.solicitudForm.get('exportacionForm.descripcionProducto')?.value;
    this.store.setDescripcionProducto(DESCRIPCION_PRODUCTO);
  }

  /**
   * Maneja la selección de la fracción arancelaria.
   * Obtiene el valor del formulario y lo establece en el store.
   * También auto-llena el campo de descripción con la descripción de la fracción seleccionada.
   */
  fraccionArancelariaSeleccion(): void {
    const FRACCION_ID = this.agregarMercanciasForm.get(
      'datosMercancia.fraccionArancelaria'
    )?.value;
    
    if (FRACCION_ID && this.fraccionArancelaria?.length > 0) {
      const FRACCION_SELECCIONADA = this.fraccionArancelaria.find(
        fraccion => String(fraccion.id) === String(FRACCION_ID)
      );
      
      if (FRACCION_SELECCIONADA) {
        const DESCRIPCION_FIELD = this.agregarMercanciasForm.get('datosMercancia.descripcionfraccionArancelaria');
        if (DESCRIPCION_FIELD) {
          DESCRIPCION_FIELD.setValue(FRACCION_SELECCIONADA.descripcion);
        }
      }
    }
    
    this.store.setFraccionArancelaria(FRACCION_ID);
  }

  /**
   * Maneja la selección del género.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  generoSeleccion(): void {
    const GENERO = this.solicitudForm.get('datosMercancia.genero')?.value;
    this.store.setGenero(GENERO);
  }

  /**
   * Maneja la selección de la especie.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  especieSeleccion(): void {
    const ESPECIE = this.solicitudForm.get('datosMercancia.especie')?.value;
    this.store.setEspecie(ESPECIE);
  }

  /**
   * Maneja la selección del nombre común.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  nombreComunSeleccion(): void {
    const NOMBRE_COMUN = this.solicitudForm.get(
      'datosMercancia.nombreComun'
    )?.value;
    this.store.setNombreComun(NOMBRE_COMUN);
  }

  /**
   * Maneja la selección de la unidad de medida.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  unidadDeMedidaSeleccion(): void {
    const UNIDAD_DE_MEDIDA = this.solicitudForm.get(
      'exportacionForm.unidadDeMedida'
    )?.value;
    this.store.setUnidadDeMedida(UNIDAD_DE_MEDIDA);
  }

  /**
   * Maneja la selección del medio de transporte.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  medioDeTransporteSeleccion(): void {
    const MEDIO_DE_TRANSPORTE = this.solicitudForm.get(
      'exportacionForm.medioDeTransporte'
    )?.value;
    this.store.setMedioDeTransporte(MEDIO_DE_TRANSPORTE);
  }

  /**
   * Maneja la selección del estado.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  estadoSeleccion(): void {
    const ESTADO = this.solicitudForm.get('exportacionForm.estado')?.value;
    this.store.setEstado(ESTADO);
  }
  

  /**
   * Obtiene el array del formulario 'fechasSeleccionadas' del grupo de formulario  'datosServicio'.
   *
   * @returns {FormArray} El array de formulario 'fechasSeleccionadas'.
   */
  get fechasSeleccionadas(): FormArray {
    return this.exportacionForm.get('fechasSeleccionadas') as FormArray;
  }

  set fechasSeleccionadas(fechas: FormArray) {
    this.exportacionForm.setControl('fechasSeleccionadas', fechas);
  }

  /**
   * Actualiza la lista de fechas seleccionadas y las almacena en el estado.
   * 
   * @param fechas - Arreglo de fechas a agregar.
   * @returns void
   */
  changeCrosslist(fechas: string[]): void {
    fechas.forEach((fecha) => {
      this.fechasSeleccionadas.push(new FormControl(fecha));
    });
    this.store.setFechasSeleccionadas(fechas);
  }

  /**
   * Actualiza la lista de fechas seleccionadas y las almacena en el estado.
   * 
   * @param fechas - Arreglo de fechas a agregar.
   * @returns void
   */
  onEntidadesSeleccionadasChange(fechas: string[]): void {
    fechas.forEach((fecha) => {
      this.fechasSeleccionadas.push(new FormControl(fecha));
    });
    this.store.setFechasSeleccionadas(fechas);
  }

  /**
   * Agrega un nuevo detalle a la lista de detalles.
   * Obtiene los datos del servicio y los agrega a la lista local y al store.
   */
  agregarDetalle(): void {
    this.phytosanitaryExportacionService
      .agregarDetalle()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta?.success) {
          respuesta.datos.id = this.datosDetalle.length + 1;
          this.datosDetalle.push(respuesta.datos);
          (
            this.store.setDatosDetalle as unknown as (
              valor: DatosDetalle[]
            ) => void
          )(this.datosDetalle);
        }
      });
  }

  /**
   * Limpia el formulario de agregar mercancías.
   * Útil para preparar el formulario para una nueva entrada de mercancía.
   */
  agregarMercancias(): void {
    this.agregarMercanciasForm.reset();
  }

  /**
   * Agrega una nueva solicitud a la lista de solicitudes.
   * Obtiene los datos del servicio y los agrega a la lista local y al store.
   * También reinicia el formulario de la solicitud.
   */
  agregarSolicitud(): void {
    this.phytosanitaryExportacionService.agregarSolicitud().pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta?.success) {
          respuesta.datos.id = this.datosSolicitud.length + 1;
          this.datosSolicitud = [...this.datosSolicitud, respuesta.datos];
          this.store.setDatosSolicitud(this.datosSolicitud);
          this.solicitudForm.patchValue({
            fraccionArancelaria: this.solicitudState?.fraccionArancelaria,
            cantidad: this.solicitudState?.cantidad,
            cantidadLetra: this.solicitudState?.cantidadLetra,
          });
          this.solicitudForm.reset();
          this.solicitudForm.markAsUntouched();
          this.solicitudForm.markAsPristine();
          this.cerrarModal();
        }
      });
  }

  /**
   * Maneja el cambio de filas seleccionadas en la tabla de solicitudes.
   * @param selectedRows Lista de filas seleccionadas en la tabla de solicitudes.
   */
  onSelectedRowsChange(selectedRows: DatosSolicitud[]): void {
    this.selectedRows = selectedRows.map(row => row.id);
  }

  /**
   * Elimina las filas seleccionadas de la tabla de solicitudes.
   */
  eliminar(): void {
    if (this.selectedRows && this.selectedRows.length > 0) {
      this.datosSolicitud = this.datosSolicitud.filter(row => !this.selectedRows.includes(row.id));
      this.store.setDatosSolicitud(this.datosSolicitud);
      this.selectedRows = [];
    } else {
      this.mostrarNotificacionSeleccion('Selecciona un registro.');
    }
  }

  /**
   * Modifica las filas seleccionadas en la tabla de solicitudes.
   * Abre un modal para realizar los cambios.
   */
  modificar(): void {
    if (this.selectedRows && this.selectedRows.length > 0) {
      this.agregarMercanciasForm.patchValue(this.selectedRows);
      if (this.modalRef) {
        const MODEL = new Modal(this.modalRef.nativeElement);
        MODEL.show();
      }
    } else {
      this.mostrarNotificacionSeleccion('Selecciona sólo un registro para modificar.');
    }
  }

  /**
   * Maneja el cambio de filas seleccionadas en la tabla de detalles.
   * @param selectedRowsDetalle Lista de filas seleccionadas en la tabla de detalles.
   */
  onSelectedRows(selectedRowsDetalle: DatosDetalle[]): void {
    this.selectedRowsDetalle = selectedRowsDetalle.map(row => row.id);
  }

  /**
   * Elimina las filas seleccionadas de la tabla de detalles.
   */
  eliminarDetalle(): void {
    if (this.selectedRowsDetalle && this.selectedRowsDetalle.length > 0) { 
      this.datosDetalle = this.datosDetalle.filter(row => !this.selectedRowsDetalle.includes(row.id));
      this.store.setDatosDetalle(this.datosDetalle);
      this.selectedRowsDetalle = [];
    }
  }

  /**
   * Cierra el modal actual.
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Establece valores en el store del trámite.
   * @param form Formulario del cual se obtiene el valor.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite230201Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Maneja la confirmación del modal de notificación.
   * @param _confirmacion Indica si se confirmó o canceló la acción.
   */
  manejarConfirmacionNotificacion(_confirmacion: boolean): void {
    this.moduloEmergente = false;
  }

  /**
   * Muestra una notificación de alerta con el mensaje proporcionado.
   * @param mensaje El mensaje a mostrar en la notificación.
   */
  mostrarNotificacionSeleccion(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.moduloEmergente = true;
  }

  /**
   * Maneja el evento focus del campo cantidad.
   * Muestra el error personalizado cuando el usuario hace clic en el campo.
   */
  onCantidadFocus(): void {
    this.mostrarErrorCantidad = true;
  }

  /**
   * Maneja el evento blur del campo cantidad.
   * Oculta el error personalizado cuando el usuario sale del campo.
   */
  onCantidadBlur(): void {
    this.mostrarErrorCantidad = false;
    
    const CANTIDAD_VALUE = this.agregarMercanciasForm.get('datosMercancia.cantidad')?.value;
    if (CANTIDAD_VALUE) {
      const RANDOM_TEXTS = [
        'Cien piezas',
        'Doscientos kilogramos', 
        'Quinientos litros',
        'Mil unidades',
        'Cincuenta cajas',
        'Trescientos metros',
        'Setecientos gramos',
        'Novecientos toneladas'
      ];
      
      const RANDOM_INDEX = Math.floor(Math.random() * RANDOM_TEXTS.length);
      const RANDOM_TEXT = RANDOM_TEXTS[RANDOM_INDEX];
      
      this.agregarMercanciasForm.get('datosMercancia.cantidadLetra')?.setValue(RANDOM_TEXT);
    }
  }

  
  /**
   * Limpia el formulario de agregar mercancías.
   */
  limpiarAgregarMercanciasForm(): void {
    this.agregarMercanciasForm.reset();
    this.agregarMercanciasForm.markAsUntouched();
    this.agregarMercanciasForm.markAsPristine();
  }

}
