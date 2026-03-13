import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CONTROL_INVENTARIOS, DATOS_COMUNES, DOMICILIOS_CONFIGURACION_COLUMNAS, DOMICILIO_TABLA, INVENTARIOS_CONFIGURACION, MIEMBRO_DE_LA_EMPRESA, MIEMBRO_DE_LA_EMPRESA_TABLA, MODAL_MIEMBRO_DE_LA_EMPRESA, MODIFICAR_INSTALACIONES, NUMERO_DE_EMPLEADOS, NUMERO_DE_EMPLEADOS_CONFIGURACION, NUMERO_DE_EMPLEADOS_TABLA, PRINCIPALES_INSTALACIONES, PRINCIPALES_INSTALACIONES_COLUMNA, SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS, SI_NO_OPCIONES } from '../../constants/datos-comunes-tres.enum';
import { Catalogo, ConfiguracionAporteColumna, ConfiguracionColumna, InputRadioComponent, ModeloDeFormaDinamica, TablaConEntradaComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { DatosComunesTresState, DatosComunesTresStore } from '../../estados/stores/datos-comunes-tres.store';
import { Domicilios, Inventarios, NumeroDeEmpleados, PrincipalesInstalaciones, SeccionSociosIC } from '../../models/datos-comunes-tres.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DatosComunesTresQuery } from '../../estados/queries/datos-comunes-tres.query';
import { DatosComunesTresService } from '../../services/datos-comunes-tres.service';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Modal } from 'bootstrap';

/**
 * Componente que gestiona los formularios y tablas dinámicas de datos comunes del trámite 32613, incluyendo inventarios, domicilios, empleados y socios.
 */
@Component({
  selector: 'app-datos-comunes-tres',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TablaDinamicaComponent,
    TituloComponent,
    InputRadioComponent,
    TablaConEntradaComponent,
  ],
  templateUrl: './datos-comunes-tres.component.html',
  styleUrl: './datos-comunes-tres.component.scss',
})

export class DatosComunesTresComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Estado de la consulta que se obtiene del store. */
  @Input() public consultaState!: ConsultaioState;

  /** Referencia a la plantilla personalizada customTemplate1 utilizada en el componente. */
  @ViewChild('customTemplate1') customTemplate1!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate2 utilizada en el componente. */
  @ViewChild('customTemplate2') customTemplate2!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate3 utilizada en el componente. */
  @ViewChild('customTemplate3') customTemplate3!: TemplateRef<unknown>;

  /** Referencia a la plantilla personalizada customTemplate4 utilizada en el componente. */
  @ViewChild('customTemplate4') customTemplate4!: TemplateRef<unknown>;

  /** Referencia al modal para agregar miembros de la empresa.*/
  @ViewChild('modalAgregarMiembrosEmpresa', { static: false }) modalAgregarMiembrosEmpresa!: ElementRef;

  /** Referencia al modal de la sección de subcontratados.*/
  @ViewChild('modalSeccionSubcontratados', { static: false }) modalSeccionSubcontratadosElement!: ElementRef;

  /** Referencia al modal de instalaciones principales.*/
  @ViewChild('modalInstalacionesPrincipales', { static: false }) modalInstalacionesPrincipalesElement!: ElementRef;

  /** Referencia al modal de instalaciones principales.*/
  @ViewChild('modalModificar', { static: false }) modalModificar!: ElementRef;

  /** Referencia al modal de instalaciones principales.*/
  @ViewChild('modalGuardadosCorrectamente', { static: false }) modalGuardadosCorrectamente!: ElementRef;

  /** Referencia al modal para agregar miembros de la empresa.*/
  @ViewChild('modalConfirmacion', { static: false }) modalConfirmacion!: ElementRef;

  /** Referencia al modal para agregar miembros de la empresa.*/
  @ViewChild('modalprogreso', { static: false }) modalprogreso!: ElementRef;

  /** Mapa que asocia claves de sección con sus respectivas plantillas personalizadas. */
  public templateMap: Record<string, TemplateRef<unknown>> = {};

  /** Formulario principal reactivo que contiene los grupos y controles para los datos comunes del trámite 32613. */
  public datosComunesForm!: FormGroup;

  /** Arreglo con la configuración dinámica de los campos para el formulario de datos comunes. */
  public formDataUno = DATOS_COMUNES;

  /** Arreglo con la configuración dinámica de los campos para el formulario de control de inventarios. */
  public formDataDos = CONTROL_INVENTARIOS;

  /** Arreglo con la configuración dinámica de los campos para el formulario de control de inventarios. */
  public formDataTres = MIEMBRO_DE_LA_EMPRESA;

  /** Arreglo con la configuración dinámica de los campos para el formulario de control de inventarios. */
  public formDataModalUno = NUMERO_DE_EMPLEADOS;

  /** Arreglo con la configuración dinámica de los campos para el formulario de control de inventarios. */
  public formDataModalDuo = PRINCIPALES_INSTALACIONES;

  /** Arreglo con la configuración dinámica de los campos para el formulario de control de inventarios. */
  public formDataModalTres = MODIFICAR_INSTALACIONES;

  /** Arreglo con la configuración dinámica de los campos para el formulario de control de inventarios. */
  public formDataModalCuatro = MODAL_MIEMBRO_DE_LA_EMPRESA;

  /** Tipo de tabla utilizada para mostrar número de empleados (checkbox) */
  public tablaSeleccionCheckbox = TablaSeleccion.CHECKBOX;

  /** Configuración de columnas para la tabla de número de empleados */
  public numeroDeEmpleadosConfiguracionColumnas: ConfiguracionColumna<NumeroDeEmpleados>[] = NUMERO_DE_EMPLEADOS_CONFIGURACION;

  /** Lista completa de número de empleados */
  public numeroDeEmpleadosLista: NumeroDeEmpleados[] = NUMERO_DE_EMPLEADOS_TABLA as NumeroDeEmpleados[];

  /** Lista completa de número de empleados */
  public instalacionesTablaDatos: PrincipalesInstalaciones[] = [] as PrincipalesInstalaciones[];

  /** Lista de empleados seleccionados en la tabla */
  public seleccionarNumeroDeEmpleadosLista: NumeroDeEmpleados[] = [] as NumeroDeEmpleados[];

  /** Domicilios seleccionados por el usuario */
  public seleccionarDomiciliosDatos: Domicilios[] = [] as Domicilios[];

  /** Inventarios seleccionados por el usuario */
  public seleccionarInventarios: Inventarios[] = [] as Inventarios[];

  /** Lista de socios IC seleccionados por el usuario */
  public seleccionarListaSeccionSociosIC: SeccionSociosIC[] = [] as SeccionSociosIC[];

  /** Lista de socios IC seleccionados por el usuario */
  public seleccionarListaInstalaciones: PrincipalesInstalaciones[] = [] as PrincipalesInstalaciones[];

  /** Configuración de columnas para la tabla de domicilios */
  public domiciliosConfiguracionColumnas: ConfiguracionColumna<Domicilios>[] = DOMICILIOS_CONFIGURACION_COLUMNAS;

  /** Configuración de columnas para la tabla de inventarios */
  public inventariosConfiguracionColumnas: ConfiguracionAporteColumna<Inventarios>[] = INVENTARIOS_CONFIGURACION;

  /** Configuración de columnas para la sección de socios IC */
  public seccionSociosICConfiguracionColumnas: ConfiguracionAporteColumna<SeccionSociosIC>[] = SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS as ConfiguracionAporteColumna<SeccionSociosIC>[];

  /** Configuración de columnas para la sección de socios IC */
  public instalacionesConfiguracionColumnas: ConfiguracionColumna<PrincipalesInstalaciones>[] = PRINCIPALES_INSTALACIONES_COLUMNA;

  /** Lista de socios IC registrados */
  public listaSeccionSociosIC: SeccionSociosIC[] = MIEMBRO_DE_LA_EMPRESA_TABLA as SeccionSociosIC[];

  /** Datos de los domicilios disponibles */
  public domiciliosDatos: Domicilios[] = DOMICILIO_TABLA as Domicilios[];

  /** Datos de inventarios registrados */
  public inventariosDatos: Inventarios[] = [] as Inventarios[];

  /** Bandera para mostrar u ocultar la sección del número de solicitud en el formulario de datos comunes. */
  public mostrarNumeroSolicitudSeccion: boolean = false;

  /** Indica si el modal está en modo de edición (true) o creación (false). */
  public esModalEdicion: boolean = false;

  /** Modelo para la opción de tipo sí/no representado como radio button */
  public sinoOpciones = SI_NO_OPCIONES;

  /** Subject para destruir el componente */
  public destroy$ = new Subject<void>();

  /** Opciones de catálogo para el campo de bimestre en el formulario de datos comunes. */
  private bimestreOpciones: Catalogo[] = [];

  /** Instancia del modal utilizada para mostrar y ocultar los diferentes modales del componente. */
  private modalInstance!: Modal;

  /** Porcentaje de avance para la barra de progreso en el formulario de datos comunes. */
  public progresoPercent: number = 0;

  /** Opciones de catálogo para el campo de enSuCaracterOpciones en el formulario de datos comunes. */
  public enSuCaracterOpciones: Catalogo[] = [];

  /** Opciones de catálogo para el campo de nacionalidad en el formulario de datos comunes. */
  public nacionalidadOpciones: Catalogo[] = [];

  /** Cambia el tipo de intervalId a 'any' para evitar el error de asignación con setInterval en TypeScript. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private intervalId: any;

  /** Estado de la solicitud de la datos comunes tres.*/
  public datosComunesTresState!: DatosComunesTresState;

  /** Nombre del archivo seleccionado por el usuario. */
  public archivoSeleccionado: string | null = null;

  /** Nombre del proveedor seleccionado por el usuario. */
  public proveedoresSeleccionado: string | null = null;

  /** Constructor que inyecta los servicios necesarios para gestionar datos comunes, detectar cambios, manejar el estado y consultar datos en el trámite 32613. */
  constructor(
    private datosComunesTresService: DatosComunesTresService,
    private changeDetectorRef: ChangeDetectorRef,
    private datosComunesTresStore: DatosComunesTresStore,
    private datosComunesTresQuery: DatosComunesTresQuery,
  ) {
    //
  }

  /** Inicializa los estados y datos necesarios del componente, suscribiéndose al store y cargando las opciones dinámicas para los formularios de datos comunes. */
  ngOnInit(): void {
    this.datosComunesTresQuery.selectDatosComunesTres$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.datosComunesTresState = seccionState;
          if (
            this.datosComunesTresState &&
            typeof this.datosComunesTresState === 'object' &&
            this.datosComunesTresState !== null &&
            'numeroDeEmpleadosLista' in this.datosComunesTresState
          ) {
            const DATOS = this.datosComunesTresState['numeroDeEmpleadosLista'] as NumeroDeEmpleados[];
            DATOS.forEach((dato: NumeroDeEmpleados) => {
              const IS_ALREADY_ADDED = this.numeroDeEmpleadosLista.some(
                (item: NumeroDeEmpleados) => item.RFC === dato.RFC
              );

              if (!IS_ALREADY_ADDED) {
                this.numeroDeEmpleadosLista.push(dato);
              }
            });
          }

          if (
            this.datosComunesTresState &&
            typeof this.datosComunesTresState === 'object' &&
            this.datosComunesTresState !== null &&
            'domiciliosDatos' in this.datosComunesTresState
          ) {
            const DATOS = this.datosComunesTresState['domiciliosDatos'] as Domicilios[];
            DATOS.forEach((dato: Domicilios) => {
              const IS_ALREADY_ADDED = this.domiciliosDatos.some(
                (item: Domicilios) => item.instalacionPrincipal === dato.instalacionPrincipal
              );

              if (!IS_ALREADY_ADDED) {
                this.domiciliosDatos.push(dato);
              }
            });
          }

          if (
            this.datosComunesTresState &&
            typeof this.datosComunesTresState === 'object' &&
            this.datosComunesTresState !== null &&
            'inventarios' in this.datosComunesTresState
          ) {
            const DATOS = this.datosComunesTresState['inventarios'] as Inventarios[];
            DATOS.forEach((dato: Inventarios) => {
              const IS_ALREADY_ADDED = this.inventariosDatos.some(
                (item: Inventarios) => item.nombre === dato.nombre
              );

              if (!IS_ALREADY_ADDED) {
                this.inventariosDatos.push(dato);
              }
            });
          }

          if (
            this.datosComunesTresState &&
            typeof this.datosComunesTresState === 'object' &&
            this.datosComunesTresState !== null &&
            'seccionSociosIC' in this.datosComunesTresState
          ) {
            const DATOS = this.datosComunesTresState['seccionSociosIC'] as SeccionSociosIC[];
            DATOS.forEach((dato: SeccionSociosIC) => {
              const IS_ALREADY_ADDED = this.listaSeccionSociosIC.some(
                (item: SeccionSociosIC) => item.tipoPersonaMuestra === dato.tipoPersonaMuestra
              );

              if (!IS_ALREADY_ADDED) {
                this.listaSeccionSociosIC.push(dato);
              }
            });
          }
        })
      )
      .subscribe();

    this.initializeForm();
    this.asignarValorCondicional();
    this.obtenerSectorProductivoOpciones();
    this.obtenerServicioOpciones();
    this.obtenerBimestreOpciones();
    this.obtenerIndiqueTodosOpciones();
    this.conseguirInventarios();
    this.obtenerEntidadFederativaOpciones();
    this.obtenertipoDeInstalacionOpciones();
    this.obtenerEnSuCaracterDeOpciones();
    this.obtenerNacionalidadOpciones();
  }

  /** Inicializa el formulario principal reactivo con sus grupos y controles, y aplica valores y estados según el modo de consulta. */
  initializeForm(): void {
    this.datosComunesForm = new FormGroup({
      ninoFormGroupUno: new FormGroup({}),
      ninoFormGroupDos: new FormGroup({}),
      ninoFormGroupTres: new FormGroup({}),
      ninoFormGroupmodal1: new FormGroup({}),
      ninoFormGroupmodal2: new FormGroup({}),
      ninoFormGroupmodal3: new FormGroup({}),
      ninoFormGroupmodal4: new FormGroup({}),
      archivoExtranjero: new FormControl(''),
      proveedoresExtranjero: new FormControl(''),
      clientesActualmente: new FormControl(''),
      proveedoresActualmente: new FormControl(''),
      senaleSiElSAT: new FormControl(''),
      senaleSiIngresaMensualmente: new FormControl(''),
    });

    if (this.consultaState.readonly) {
      this.datosComunesForm.get('archivoExtranjero')?.disable();
      this.datosComunesForm.get('proveedoresExtranjero')?.disable();
      this.datosComunesForm.get('clientesActualmente')?.disable();
      this.datosComunesForm.get('proveedoresActualmente')?.disable();
      this.datosComunesForm.get('senaleSiElSAT')?.disable();
      this.datosComunesForm.get('senaleSiIngresaMensualmente')?.disable();
    }

    if (this.consultaState.update) {
      this.archivoSeleccionado = typeof this.datosComunesTresState?.['archivoExtranjero'] === 'string'
        ? this.datosComunesTresState['archivoExtranjero']
        : null;
      this.proveedoresSeleccionado = typeof this.datosComunesTresState?.['proveedoresExtranjero'] === 'string'
        ? this.datosComunesTresState['proveedoresExtranjero']
        : null;
      this.datosComunesForm.patchValue({
        clientesActualmente: this.datosComunesTresState['clientesActualmente'],
        proveedoresActualmente: this.datosComunesTresState['proveedoresActualmente'],
        senaleSiElSAT: this.datosComunesTresState['senaleSiElSAT'],
        senaleSiIngresaMensualmente: this.datosComunesTresState['senaleSiIngresaMensualmente'],
      });
    }
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroupUno`*/
  get ninoFormGroupUno(): FormGroup {
    return this.datosComunesForm.get('ninoFormGroupUno') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroupDos`*/
  get ninoFormGroupDos(): FormGroup {
    return this.datosComunesForm.get('ninoFormGroupDos') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroupTres`*/
  get ninoFormGroupTres(): FormGroup {
    return this.datosComunesForm.get('ninoFormGroupTres') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroupmodal1`*/
  get ninoFormGroupmodal1(): FormGroup {
    return this.datosComunesForm.get('ninoFormGroupmodal1') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroupmodal2`*/
  get ninoFormGroupmodal2(): FormGroup {
    return this.datosComunesForm.get('ninoFormGroupmodal2') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroupmodal3`*/
  get ninoFormGroupmodal3(): FormGroup {
    return this.datosComunesForm.get('ninoFormGroupmodal3') as FormGroup;
  }

  /** Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroupmodal4`*/
  get ninoFormGroupmodal4(): FormGroup {
    return this.datosComunesForm.get('ninoFormGroupmodal4') as FormGroup;
  }

  /** Asigna valores condicionales y muestra/oculta campos en el formulario de datos comunes según el estado actual. */
  asignarValorCondicional(): void {
    if (this.datosComunesTresState['senaleEspecializadas']) {
      this.mostrarNumeroSolicitudSeccion = true;
      this.mostrarCampos(this.formDataUno, 'enSuCasoLFT', true);
    }

    this.datosComunesForm.patchValue({
      clientesActualmente: this.datosComunesTresState?.['clientesActualmente'],
      proveedoresActualmente: this.datosComunesTresState?.['proveedoresActualmente'],
      senaleSiElSAT: this.datosComunesTresState?.['senaleSiElSAT'],
      senaleSiIngresaMensualmente: this.datosComunesTresState?.['senaleSiIngresaMensualmente'],
    })
  }

  /** Método para obtener los datos de inventarios desde el servicio. Los resultados se asignan a la propiedad `inventariosDatos`.*/
  conseguirInventarios(): void {
    this.datosComunesTresService
      .conseguirInventarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: Inventarios[]) => {
          this.inventariosDatos = respuesta;
        },
      });
  }

  /** Obtiene las opciones de nacionalidad desde el servicio y las asigna al campo correspondiente en el formulario dinámico de miembros de la empresa. */
  obtenerNacionalidadOpciones(): void {
    this.datosComunesTresService
      .getNacionalidadDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.nacionalidadOpciones = data;
        const NACIONLIDAD_FIELD = this.formDataModalCuatro.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'miembroNacionalidad'
        ) as ModeloDeFormaDinamica;
        if (NACIONLIDAD_FIELD) {
          if (Array.isArray(data)) {
            NACIONLIDAD_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerSectorProductivoOpciones(): void {
    this.datosComunesTresService
      .getProductivoDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const PRODUCTIVO_FIELD = this.formDataUno.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'catseleccionados'
        ) as ModeloDeFormaDinamica;
        if (PRODUCTIVO_FIELD && !PRODUCTIVO_FIELD.opciones) {
          if (Array.isArray(data)) {
            PRODUCTIVO_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerServicioOpciones(): void {
    this.datosComunesTresService
      .getServicioDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const SERVICIO_FIELD = this.formDataUno.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'servicio'
        ) as ModeloDeFormaDinamica;
        if (SERVICIO_FIELD && !SERVICIO_FIELD.opciones) {
          if (Array.isArray(data)) {
            SERVICIO_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

  /** Obtiene las opciones de bimestre desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerBimestreOpciones(): void {
    this.datosComunesTresService
      .getBimestreDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.bimestreOpciones = data;
        const BIMESTRE_FIELD = this.formDataUno.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'bimestre'
        ) as ModeloDeFormaDinamica;
        if (BIMESTRE_FIELD) {
          if (Array.isArray(data)) {
            BIMESTRE_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
        // subcontrataBimestre opciones
        const SUBCONTRATA_BIMESTRE_FIELD = this.formDataModalUno.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'subcontrataBimestre'
        ) as ModeloDeFormaDinamica;
        if (SUBCONTRATA_BIMESTRE_FIELD) {
          if (Array.isArray(data)) {
            SUBCONTRATA_BIMESTRE_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerIndiqueTodosOpciones(): void {
    this.datosComunesTresService
      .getIndiqueTodosdatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Catalogo) => {
        const INDIQUE_TODOS_FIELD = this.formDataUno.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'indiqueTodos'
        ) as ModeloDeFormaDinamica;
        if (INDIQUE_TODOS_FIELD) {
          if (Array.isArray(data)) {
            INDIQUE_TODOS_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerEntidadFederativaOpciones(): void {
    this.datosComunesTresService
      .getEntidadDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const ENTIDAD_FIELD = this.formDataModalDuo.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'entidadFederativa'
        ) as ModeloDeFormaDinamica;
        if (ENTIDAD_FIELD) {
          if (Array.isArray(data)) {
            ENTIDAD_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenertipoDeInstalacionOpciones(): void {
    this.datosComunesTresService
      .getTipoDeInstalacionDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const TIPO_DE_INSTALACION_FIELD = this.formDataModalTres.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'tipoDeInstalacion'
        ) as ModeloDeFormaDinamica;
        if (TIPO_DE_INSTALACION_FIELD) {
          if (Array.isArray(data)) {
            TIPO_DE_INSTALACION_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

  /** Obtiene las opciones de sector productivo desde el servicio y las asigna al campo correspondiente en el formulario dinámico. */
  obtenerEnSuCaracterDeOpciones(): void {
    this.datosComunesTresService
      .getEnSuCaracterDeDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.enSuCaracterOpciones = data;
        const EN_SU_CARACTER_FIELD = this.formDataModalCuatro.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'miembroCaracterDe'
        ) as ModeloDeFormaDinamica;
        if (EN_SU_CARACTER_FIELD) {
          if (Array.isArray(data)) {
            EN_SU_CARACTER_FIELD.opciones = data.map(
              (item: { id: number; descripcion: string }) => ({
                descripcion: item.descripcion,
                id: item.id,
              })
            );
          }
        }
      });
  }

  /** Asigna las referencias de las plantillas personalizadas al mapa después de la inicialización de la vista. */
  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.templateMap = {
        customSection1: this.customTemplate1,
        customSection2: this.customTemplate2,
        customSection3: this.customTemplate3,
        customSection4: this.customTemplate4
      };
    });
  }

  /**
   * Método para establecer un cambio de valor en el store.
   * @param event Objeto que contiene el campo y el valor a actualizar.
   * Si el campo es 'tipoOperacion', se ejecuta el método alCambiarTipoOperacion.
   */
  establecerCambioDeValorUno(event: { campo: string; valor: object | string }): void {
    if (event) {
      if (event.campo === 'senaleSiCuenta') {
        this.mostrarCampos(this.formDataUno, 'cualEsElNumero', true);
        this.mostrarCampos(this.formDataUno, 'empleados', true);
        this.mostrarCampos(this.formDataUno, 'bimestre', true);
      }

      if (this.ninoFormGroupUno.get('empleados')?.value) {
        const CONTROL = this.ninoFormGroupUno.get('bimestre');
        if (!this.ninoFormGroupUno.get('bimestre')?.value) {
          if (CONTROL) {
            CONTROL.setErrors({ custom: { mensaje: 'Se debe agregar los datos del número de empleados propios del último bimestre.' } });
            CONTROL.markAsTouched();
            CONTROL.updateValueAndValidity();
            this.changeDetectorRef.detectChanges();
          }
        } else {
          CONTROL?.setErrors({ custom: null });
          this.changeDetectorRef.detectChanges();
        }
      }

      if (event.campo === 'senaleEspecializadas') {
        this.mostrarNumeroSolicitudSeccion = true;
        this.mostrarCampos(this.formDataUno, 'enSuCasoLFT', true);
      }

      if (event.campo === 'senaleSiAlMomentoFraccionVI' || event.campo === 'senaleSiSusCertificados' || event.campo === 'senalesiSeSectorial') {
        this.mostrarModalConfirmacion();
      }
      this.datosComunesTresStore.setDynamicFieldValue(event.campo, event.valor);
    }
  }

  /** Muestra el modal de confirmación utilizando la referencia al elemento correspondiente. */
  mostrarModalConfirmacion(): void {
    if (this.modalConfirmacion) {
      this.modalInstance = new Modal(this.modalConfirmacion.nativeElement);
      this.modalInstance.show();
    }
  }

  /**
   * Método para establecer un cambio de valor en el store.
   * @param event Objeto que contiene el campo y el valor a actualizar.
   * Si el campo es 'tipoOperacion', se ejecuta el método alCambiarTipoOperacion.
   */
  establecerCambioDeValorDos(event: { campo: string; valor: object | string }): void {
    if (event) {
      this.datosComunesTresStore.setDynamicFieldValue(event.campo, event.valor);
    }
  }

  /** Actualiza la lista de instalaciones principales desde el servicio al detectar un cambio en el formulario modal de instalaciones. */
  establecerCambioDeValorModalDuo(event: { campo: string; valor: object | string }): void {
    if (event) {
      this.datosComunesTresService
        .getInstalacionesTablaDatos()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.instalacionesTablaDatos = data;
        });
    }
  }

  /** Muestra u oculta un campo específico en la configuración dinámica del formulario según el parámetro recibido. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
  mostrarCampos(formData: any[], campo: string, mostrar: boolean): void {
    const CAMPO = formData.find(f => f.campo === campo);
    if (CAMPO) {
      CAMPO.mostrar = mostrar;
    }
  }

  /** Guarda la selección de número de empleados hecha por el usuario.*/
  seleccionarNumeroDeEmpleadosDato(evento: NumeroDeEmpleados[]): void {
    this.seleccionarNumeroDeEmpleadosLista = evento;
  }

  /**  Guarda la selección de domicilios hecha por el usuario.*/
  seleccionarDomiciliosDato(evento: Domicilios[]): void {
    this.seleccionarDomiciliosDatos = evento;
  }

  /** Guarda los datos de domicilios actuales en el store. */
  guardarDomiciliosDatos(): void {
    this.datosComunesTresStore.setDynamicFieldValue('domiciliosDatos', this.domiciliosDatos);
    this.mostrarGuardadosCorrectamenteModal();
  }

  /**  Guarda la selección de inventarios hecha por el usuario.*/
  seleccionarInventariosDatos(evento: Inventarios[]): void {
    this.seleccionarInventarios = evento;
  }

  /**  Guarda la selección de socios hecha por el usuario.*/
  seleccionarlistaSeccionSociosIC(evento: SeccionSociosIC[]): void {
    this.seleccionarListaSeccionSociosIC = evento;
  }

  /**  Guarda la selección de socios hecha por el usuario.*/
  seleccionarlistaInstalaciones(evento: PrincipalesInstalaciones[]): void {
    this.seleccionarListaInstalaciones = evento;
  }

  /** Muestra el modal para agregar subcontratados a la empresa.
  * Utiliza el elemento referenciado como modalSeccionSubcontratadosElement.
  */
  agregarSubcontratados(): void {
    if (this.modalSeccionSubcontratadosElement) {
      this.esModalEdicion = false; // Set mode to "add"
      this.ninoFormGroupmodal1.reset(); // Clear the form
      this.modalInstance = new Modal(this.modalSeccionSubcontratadosElement.nativeElement);
      this.modalInstance.show();
    }
  }

  /** Muestra el modal de subcontratados y carga los datos del primer empleado seleccionado en el formulario modal. */
  modificarSubcontratados(): void {
    if (this.seleccionarNumeroDeEmpleadosLista.length !== 0 && this.modalSeccionSubcontratadosElement) {
      this.esModalEdicion = true; // Set mode to "edit"
      
      // Open modal and populate with selected data
      this.modalInstance = new Modal(this.modalSeccionSubcontratadosElement.nativeElement);
      this.modalInstance.show();
      
     this.ninoFormGroupmodal1.patchValue({
        subcontrataRFCBusqueda: this.seleccionarNumeroDeEmpleadosLista[0]?.RFC,
        subcontrataRFC: this.seleccionarNumeroDeEmpleadosLista[0]?.RFC,
        subcontrataRazonSocial: this.seleccionarNumeroDeEmpleadosLista[0]?.denominacion,
        subcontrataEmpleados: this.seleccionarNumeroDeEmpleadosLista[0]?.numeroDeEmpleados,
        subcontrataBimestre: this.seleccionarNumeroDeEmpleadosLista[0]?.bimestre
      });
    }
  }

  /**
   * Muestra el modal para agregar instalaciones principales de la empresa.
   * Utiliza el elemento referenciado como modalInstalacionesPrincipalesElement.
   */
  agregarInstalacionesPrincipales(): void {
    if (this.modalInstalacionesPrincipalesElement) {
      this.modalInstance = new Modal(this.modalInstalacionesPrincipalesElement.nativeElement);
      this.modalInstance.show();
    }
  }

  /** Muestra el modal de instalaciones principales y carga los datos del primer domicilio seleccionado en el formulario modal. */
  modificarInstalacionesPrincipales(): void {
    if (this.modalModificar && this.seleccionarDomiciliosDatos.length) {
      this.modalInstance = new Modal(this.modalModificar.nativeElement);
      this.modalInstance.show();
      this.ninoFormGroupmodal3.patchValue({
        municipio: this.seleccionarDomiciliosDatos[0]?.municipioDelegacion,
        entidadFederativa: this.seleccionarDomiciliosDatos[0]?.cveEntidadFederativa,
        registroSESAT: this.seleccionarDomiciliosDatos[0]?.registroSESAT,
        coloniaDescripcion: this.seleccionarDomiciliosDatos[0]?.direccion,
        modificarCodigoPostal: this.seleccionarDomiciliosDatos[0]?.codigoPostal
      })
    }
  }

  /**
   * Muestra el modal para agregar miembros de la empresa.
   * Se utiliza el elemento del DOM referenciado como modalAgregarMiembrosEmpresa.
   */
  agregarMiembrosEmpresa(): void {
    if (this.modalAgregarMiembrosEmpresa) {
      this.modalInstance = new Modal(this.modalAgregarMiembrosEmpresa.nativeElement);
      this.modalInstance.show();
    }
  }

  /**
   * Muestra el modal para modificar miembros de la empresa y carga los datos del miembro seleccionado.
   * Se utiliza el elemento del DOM referenciado como modalAgregarMiembrosEmpresa.
   */
  modificarMiembrosEmpresa(): void {
    if (this.seleccionarListaSeccionSociosIC.length !== 0 && this.modalAgregarMiembrosEmpresa) {
      
      this.modalInstance = new Modal(this.modalAgregarMiembrosEmpresa.nativeElement);
      this.modalInstance.show();
      
      
      this.ninoFormGroupmodal4.patchValue({
        miembroTipoPersonaMuestra: this.seleccionarListaSeccionSociosIC[0]?.tipoPersonaMuestra,
        miembroNombreCompleto: this.seleccionarListaSeccionSociosIC[0]?.nombreCompleto,
        miembroRfc: this.seleccionarListaSeccionSociosIC[0]?.rfc,
        miembroCaracterDe: this.seleccionarListaSeccionSociosIC[0]?.caracterDe,
        miembroNacionalidad: this.seleccionarListaSeccionSociosIC[0]?.nacionalidad,
        miembroTributarMexico: this.seleccionarListaSeccionSociosIC[0]?.tributarMexico,
        miembroNombreEmpresa: this.seleccionarListaSeccionSociosIC[0]?.nombreEmpresa
      });
    }
  }

  /** Elimina los registros de número de empleados seleccionados.*/
  eliminarNumeroDeEmpleadosDato(): void {
    if (this.seleccionarNumeroDeEmpleadosLista.length > 0) {
    
      this.numeroDeEmpleadosLista = this.numeroDeEmpleadosLista.filter(item => {
        
        return !this.seleccionarNumeroDeEmpleadosLista.some(selectedItem =>
          selectedItem.RFC === item.RFC &&
          selectedItem.denominacion === item.denominacion &&
          selectedItem.numeroDeEmpleados === item.numeroDeEmpleados &&
          selectedItem.bimestre === item.bimestre
        );
      });

      this.seleccionarNumeroDeEmpleadosLista = [];
      this.datosComunesTresStore.setDynamicFieldValue('numeroDeEmpleadosLista', this.numeroDeEmpleadosLista);
    }
  }

  /** Elimina los domicilios seleccionados de la lista.*/
  eliminarDomiciliosDatos(): void {
    if (this.seleccionarDomiciliosDatos.length > 0) {

      this.domiciliosDatos = this.domiciliosDatos.filter(item => {

        return !this.seleccionarDomiciliosDatos.some(selectedItem =>
          selectedItem.cveTipoInstalacion === item.cveTipoInstalacion ||
          (selectedItem.instalacionPrincipal === item.instalacionPrincipal &&
            selectedItem.entidadFederativa === item.entidadFederativa &&
            selectedItem.municipioDelegacion === item.municipioDelegacion)
        );
      });

      
      this.seleccionarDomiciliosDatos = [];

      
      this.datosComunesTresStore.setDynamicFieldValue('domiciliosDatos', this.domiciliosDatos);
    }
  }

  /** Elimina los inventarios seleccionados de la lista.*/
  eliminarInventariosDatos(): void {
    if (this.seleccionarInventarios.length > 0) {

      this.inventariosDatos = this.inventariosDatos.filter(item => {

        return !this.seleccionarInventarios.some(selectedItem =>
          selectedItem.nombre === item.nombre &&
          selectedItem.lugarRadicacion === item.lugarRadicacion
        );
      });

      this.seleccionarInventarios = [];
      this.datosComunesTresStore.setDynamicFieldValue('inventariosDatos', this.inventariosDatos);
    }
  }

  /** Elimina los socios seleccionados de la lista.*/
  eliminarlistaSeccionSociosIC(): void {
    if (this.seleccionarListaSeccionSociosIC.length > 0) {

      this.listaSeccionSociosIC = this.listaSeccionSociosIC.filter(item => {

        return !this.seleccionarListaSeccionSociosIC.some(selectedItem =>
          selectedItem.rfc === item.rfc ||
          (selectedItem.nombreCompleto === item.nombreCompleto &&
            selectedItem.caracterDe === item.caracterDe)
        );
      });

      this.seleccionarListaSeccionSociosIC = [];
      this.datosComunesTresStore.setDynamicFieldValue('listaSeccionSociosIC', this.listaSeccionSociosIC);
    }
  }

  /** Actualiza el valor del archivo 2 desde un input file.
   * @param {Event} valor - Evento de cambio del input.
   */
  cambioEvento(event: Event | string | number, campo: string): void {
    let VALOR;
    if (event instanceof Event && event.target instanceof HTMLInputElement && event.target.files?.length) {
      const FILE = event.target.files[0].name;
      this.datosComunesTresStore.setDynamicFieldValue(campo, FILE);
    } else if (event instanceof Event && event.target) {
      VALOR = (event.target as HTMLInputElement).value;
      this.datosComunesTresStore.setDynamicFieldValue(campo, VALOR);
    } else {
      VALOR = event;
      this.datosComunesTresStore.setDynamicFieldValue(campo, VALOR);
    }
  }

  /** Busca el RFC de subcontratado y asigna la razón social en el formulario modal de subcontratados. */
  buscarEvento(): void {
    if (this.ninoFormGroupmodal1.get('subcontrataRFCBusqueda')?.value) {
      this.ninoFormGroupmodal1.patchValue({
        subcontrataRFC: this.ninoFormGroupmodal1.get('subcontrataRFCBusqueda')?.value,
        subcontrataRazonSocial: 'INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV'
      })
    }
  }

  /** Guarda o actualiza el registro de número de empleados en la lista y muestra el modal de confirmación. */
  aceptarModalUno(): void {
    if (!this.esModalEdicion) {
      // Add new record
      const NUEVO_EMPLEADO = {
        denominacion: this.ninoFormGroupmodal1.get('subcontrataRazonSocial')?.value,
        RFC: this.ninoFormGroupmodal1.get('subcontrataRFCBusqueda')?.value,
        numeroDeEmpleados: this.ninoFormGroupmodal1.get('subcontrataEmpleados')?.value,
        bimestre: DatosComunesTresComponent.obtenerDescripcion(this.bimestreOpciones, this.ninoFormGroupmodal1.get('subcontrataBimestre')?.value)
      };
      
      
      this.numeroDeEmpleadosLista = [...this.numeroDeEmpleadosLista, NUEVO_EMPLEADO];
      this.datosComunesTresStore.setDynamicFieldValue('numeroDeEmpleadosLista', this.numeroDeEmpleadosLista);
    } else {
      
      const INDICE = this.numeroDeEmpleadosLista.findIndex((item) => item.RFC === this.seleccionarNumeroDeEmpleadosLista?.[0]?.RFC);
      if (INDICE >= 0) {
       
        this.numeroDeEmpleadosLista = this.numeroDeEmpleadosLista.map((item, index) => {
          if (index === INDICE) {
            return {
              RFC: this.ninoFormGroupmodal1.get('subcontrataRFCBusqueda')?.value,
              bimestre: DatosComunesTresComponent.obtenerDescripcion(this.bimestreOpciones, this.ninoFormGroupmodal1.get('subcontrataBimestre')?.value),
              denominacion: this.ninoFormGroupmodal1.get('subcontrataRazonSocial')?.value,
              numeroDeEmpleados: this.ninoFormGroupmodal1.get('subcontrataEmpleados')?.value
            };
          }
          return item;
        });
        this.datosComunesTresStore.setDynamicFieldValue('numeroDeEmpleadosLista', this.numeroDeEmpleadosLista);
      }
    }
    
    
    this.seleccionarNumeroDeEmpleadosLista = [];
    this.modalInstance.hide();
    this.mostrarGuardadosCorrectamenteModal();
  }

  /** Muestra el modal de confirmación de guardado exitoso utilizando la referencia al elemento correspondiente. */
  mostrarGuardadosCorrectamenteModal(): void {
    if (this.modalGuardadosCorrectamente) {
      this.modalInstance = new Modal(this.modalGuardadosCorrectamente.nativeElement);
      this.modalInstance.show();
    }
  }

  /** Guarda el domicilio seleccionado en la lista y actualiza el store, luego cierra el modal. */
  aceptarModalDuo(): void {
    if (this.seleccionarListaInstalaciones.length) {
      const NUEVO_DOMICILIO = {
        entidadFederativa: this.seleccionarListaInstalaciones[0].entidadFederativa ?? '',
        municipioDelegacion: this.seleccionarListaInstalaciones[0].municipioDelegacion ?? '',
        codigoPostal: this.seleccionarListaInstalaciones[0].codigoPostal ?? '',
        direccion: this.seleccionarListaInstalaciones[0].colonio,
        registroSESAT: this.seleccionarListaInstalaciones[0].registro
      };
      
      
      this.domiciliosDatos = [...this.domiciliosDatos, NUEVO_DOMICILIO];
      
      
      this.seleccionarListaInstalaciones = [];
    }
    
    
    this.datosComunesTresStore.setDynamicFieldValue('domiciliosDatos', this.domiciliosDatos);
    
    
    this.modalInstance.hide();
    
    
    this.mostrarGuardadosCorrectamenteModal();
  }

  /** Actualiza los datos del domicilio seleccionado en el formulario modal y cierra el modal. */
  aceptarModalTres(): void {
    if (this.ninoFormGroupmodal3.valid && this.seleccionarDomiciliosDatos.length) {
      const INDICE = this.domiciliosDatos.findIndex((item) => item.cveTipoInstalacion === this.seleccionarDomiciliosDatos[0].cveTipoInstalacion);
      
      if (INDICE >= 0) {
        // Create new array to trigger change detection
        this.domiciliosDatos = this.domiciliosDatos.map((item, index) => {
          if (index === INDICE) {
            return {
              ...item,
              instalacionPrincipal: this.ninoFormGroupmodal3.get('principales')?.value,
              municipioDelegacion: this.ninoFormGroupmodal3.get('municipio')?.value,
              tipoInstalacion: this.ninoFormGroupmodal3.get('tipoDeInstalacion')?.value,
              entidadFederativa: this.ninoFormGroupmodal3.get('entidadFederativa')?.value,
              codigoPostal: this.ninoFormGroupmodal3.get('modificarCodigoPostal')?.value,
              direccion: this.ninoFormGroupmodal3.get('coloniaDescripcion')?.value,
              registroSESAT: this.ninoFormGroupmodal3.get('registroSESAT')?.value,
              procesoProductivo: this.ninoFormGroupmodal3.get('procesoProductivo')?.value,
              acreditaInmueble: this.ninoFormGroupmodal3.get('goceDelInmueble')?.value,
              instalacionPerfil: this.ninoFormGroupmodal3.get('empresa')?.value
            };
          }
          return item;
        });
        
        // Update store
        this.datosComunesTresStore.setDynamicFieldValue('domiciliosDatos', this.domiciliosDatos);
        
        // Clear selection
        this.seleccionarDomiciliosDatos = [];
      }
      
      // Close modal
      this.modalInstance.hide();
      
      // Show success message
      this.mostrarGuardadosCorrectamenteModal();
    }
  }

  /**
 * @method obtenerDescripcion
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public static obtenerDescripcion(array: Catalogo[], id: string): string {
    const DESCRIPCION = array.find((ele: Catalogo) => Number(ele.id) === Number(id))?.descripcion;
    return DESCRIPCION ?? '';
  }

  /** Muestra el modal de progreso y ejecuta la animación si el archivo extranjero está presente en el formulario. */
  anexar(): void {
    if (this.datosComunesForm.get('archivoExtranjero')?.value && this.modalprogreso) {
      this.restablecerProgreso();
      this.modalInstance = new Modal(this.modalprogreso.nativeElement);
      this.modalInstance.show();
      this.inicioProgreso();
    }
  }

  /** Inicia la animación de la barra de progreso en dos etapas: primero del 0 al 90% rápidamente y luego del 91 al 100% más lento. */
  inicioProgreso(): void {
    this.ejecutarProgreso(0, 90, 10, () => {
      this.ejecutarProgreso(91, 100, 200);
    });
  }

  /** Ejecuta la animación de la barra de progreso desde el valor `start` hasta `end` con el intervalo de tiempo especificado. */
  ejecutarProgreso(start: number, end: number, delay: number, callback?: () => void): void {
    this.intervalId = setInterval(() => {
      if (this.progresoPercent < end) {
        this.progresoPercent++;
      } else {
        clearInterval(this.intervalId);
        if (callback) {
          callback();
        }
      }
    }, delay);
  }

  /** Reinicia la barra de progreso y detiene cualquier animación activa. */
  restablecerProgreso(): void {
    clearInterval(this.intervalId);
    this.progresoPercent = 0;
  }

  /** Agrega un nuevo registro de inventario a la lista y actualiza el store si los campos requeridos están completos, luego reinicia el formulario. */
  agregarControlInventarios(): void {
    if (this.ninoFormGroupDos.get('identificacion')?.value && this.ninoFormGroupDos.get('lugarDeRadicacion')?.value && this.ninoFormGroupDos.get('indiqueAnexo24')?.value) {
      this.inventariosDatos.push({
        nombre: this.ninoFormGroupDos.get('identificacion')?.value,
        lugarRadicacion: this.ninoFormGroupDos.get('lugarDeRadicacion')?.value,
        anexo24: this.ninoFormGroupDos.get('checkbox')?.value,
      });
      this.datosComunesTresStore.setDynamicFieldValue('inventarios', this.inventariosDatos);
      this.ninoFormGroupDos.reset();
    }
  }

  /** Carga los datos del inventario seleccionado en el formulario modal para su edición. */
  modificarControlInventarios(): void {
    if (this.seleccionarInventarios.length) {
      this.ninoFormGroupDos.patchValue({
        identificacion: this.seleccionarInventarios[0]?.nombre,
        lugarDeRadicacion: this.seleccionarInventarios[0]?.lugarRadicacion,
        indiqueAnexo24: this.seleccionarInventarios[0]?.anexo24,
      })
    }
  }

  /** Muestra u oculta campos en el formulario dinámico de miembros de la empresa según la nacionalidad y tipo de persona seleccionados. */
  establecerCambioDeValorModalCuatro(event: { campo: string; valor: object | string | number }): void {
    if (event.campo === 'miembroTributarMexico') {
      if (event.valor === 'Si') {
        this.mostrarCampos(this.formDataModalCuatro, 'miembroRfc', true);
        this.mostrarCampos(this.formDataModalCuatro, 'buscar', true);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroRegistroFederal', true);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroNombreCompleto', true);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroTipoPersonaMuestra', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroNombre', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroApellidoPaterno', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroApellidoMaterno', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroNombreEmpresa', false);
      } else {
        this.mostrarCampos(this.formDataModalCuatro, 'miembroTipoPersonaMuestra', true);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroRfc', false);
        this.mostrarCampos(this.formDataModalCuatro, 'buscar', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroRegistroFederal', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroNombreCompleto', false);
      }
    }
    if (event.campo === 'miembroTipoPersonaMuestra') {
      if (event.valor === "1") {
        this.mostrarCampos(this.formDataModalCuatro, 'miembroNombre', true);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroApellidoPaterno', true);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroApellidoMaterno', true);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroNombreEmpresa', false);
      } else {
        this.mostrarCampos(this.formDataModalCuatro, 'miembroNombre', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroApellidoPaterno', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroApellidoMaterno', false);
        this.mostrarCampos(this.formDataModalCuatro, 'miembroNombreEmpresa', true);
      }
    }
  }

  /** Guarda o actualiza el registro de socios IC en la lista y actualiza el store, luego cierra el modal. */
  aceptarModalCuatro(): void {
    if (!this.seleccionarListaSeccionSociosIC.length) {
      // Add new member
      const NUEVO_MIEMBRO = {
        tipoPersonaMuestra: this.ninoFormGroupmodal4.get('miembroTipoPersonaMuestra')?.value,
        nombreCompleto: this.ninoFormGroupmodal4.get('miembroNombreCompleto')?.value,
        rfc: this.ninoFormGroupmodal4.get('miembroRfc')?.value,
        caracterDe: DatosComunesTresComponent.obtenerDescripcion(this.enSuCaracterOpciones, this.ninoFormGroupmodal4.get('miembroCaracterDe')?.value),
        nacionalidad: DatosComunesTresComponent.obtenerDescripcion(this.nacionalidadOpciones, this.ninoFormGroupmodal4.get('miembroNacionalidad')?.value),
        tributarMexico: this.ninoFormGroupmodal4.get('miembroTributarMexico')?.value,
        nombreEmpresa: this.ninoFormGroupmodal4.get('miembroNombreEmpresa')?.value,
      };
      
      // Create new array to trigger change detection
      this.listaSeccionSociosIC = [...this.listaSeccionSociosIC, NUEVO_MIEMBRO];
      this.datosComunesTresStore.setDynamicFieldValue('seccionSociosIC', this.listaSeccionSociosIC);
    } else {
      // Update existing member
      const INDICE = this.listaSeccionSociosIC.findIndex((el: SeccionSociosIC) => el.rfc === this.seleccionarListaSeccionSociosIC[0]?.rfc);
      if (INDICE >= 0) {
        // Create new array and update only the specific record
        this.listaSeccionSociosIC = this.listaSeccionSociosIC.map((item, index) => {
          if (index === INDICE) {
            return {
              tipoPersonaMuestra: this.ninoFormGroupmodal4.get('miembroTipoPersonaMuestra')?.value,
              nombreCompleto: this.ninoFormGroupmodal4.get('miembroNombreCompleto')?.value,
              rfc: this.ninoFormGroupmodal4.get('miembroRfc')?.value,
              caracterDe: DatosComunesTresComponent.obtenerDescripcion(this.enSuCaracterOpciones, this.ninoFormGroupmodal4.get('miembroCaracterDe')?.value),
              nacionalidad: DatosComunesTresComponent.obtenerDescripcion(this.nacionalidadOpciones, this.ninoFormGroupmodal4.get('miembroNacionalidad')?.value),
              tributarMexico: this.ninoFormGroupmodal4.get('miembroTributarMexico')?.value,
              nombreEmpresa: this.ninoFormGroupmodal4.get('miembroNombreEmpresa')?.value,
            };
          }
          return item;
        });
        this.datosComunesTresStore.setDynamicFieldValue('seccionSociosIC', this.listaSeccionSociosIC);
      }
    }
    
    // Clear selection and close modal
    this.seleccionarListaSeccionSociosIC = [];
    this.modalInstance.hide();
  }

  /** Establece el valor de un campo en el store y muestra el modal de confirmación si corresponde. */
  establecerCambioDeValorTres(event: { campo: string; valor: object | string | number }): void {
    if (event.campo === 'manifiesteSiSusSocios') {
      this.mostrarModalConfirmacion();
    }
    if (event) {
      this.datosComunesTresStore.setDynamicFieldValue(event.campo, event.valor);
    }
  }

  /** Limpia y completa la señal de destrucción para evitar fugas de memoria.*/
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
