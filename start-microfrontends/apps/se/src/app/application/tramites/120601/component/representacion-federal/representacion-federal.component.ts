import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, DATOS_GENERALES_REPRESENTACION, TablaDinamicaComponent, TableComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { RepresentacionFederal } from '../../modelos/datos-empresa.model';
import { Tramite120601Query } from '../../estados/tramite-120601.query';
import { Tramite120601Store } from '../../estados/tramite-120601.store';
/**
 * Componente que representa la representación federal en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-representacion-federal',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,  
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TableComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './representacion-federal.component.html',
  styleUrl: './representacion-federal.component.scss',
})

export class RepresentacionFederalComponent implements OnInit, OnDestroy {

  /**
   * Datos del encabezado de la tabla.
   */
  tableHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla.
   */
  tableBodyData: { tbodyData: string[] }[] = [];

  /**
   * Representa el formulario del componente.
   * Se espera que esta propiedad sea del tipo 'FormGroup'.
   */
  public formulario!: FormGroup;

  /**
   * Representa el estado seleccionado del catálogo.
   * Se espera que esta propiedad sea del tipo 'Catalogo[]'.
   */
  public estado!: Catalogo[];

  /**
   * Índice de la fila seleccionada en la tabla. Por defecto, se inicializa en 1.
   */
  selectedRow: number = 1;

  /**
   * Configuración de la tabla para los socios.
   */
  configuracionTabla = DATOS_GENERALES_REPRESENTACION;

  /**
   * Arreglo de datos para los socios.
   */
  datosSocios: RepresentacionFederal[] = [];

  /**
   * Representa la representación seleccionada del catálogo.
   * Se espera que esta propiedad sea del tipo 'Catalogo[]'.
   */
  public representacion!: Catalogo[];

  /**
   * Subject que se utiliza para manejar la destrucción del componente.
   */

  private destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario es de solo lectura.
   * Por defecto, se inicializa en false.
   */

  esFormularioSoloLectura: boolean = false; 

  /**
   * Identificador del trámite actual.
   * 
   * @remarks
   * Este valor representa el código único asociado al trámite que se está gestionando en el componente.
   */
  tramites:string='120601';

  /** Notificador utilizado para cancelar suscripciones al destruir el componente.  
  *  Ayuda a prevenir fugas de memoria en flujos observables. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**  
 * @Output() plantasDataEmitted — Emite un arreglo de objetos `RepresentacionFederal`  
 * para comunicar los datos de plantas al componente padre.  
 */ 
   @Output() plantasDataEmitted = new EventEmitter<RepresentacionFederal[]>();

  /**
   * Método que se ejecuta al inicializar el componente.
   * @returns {void}
   */

  /**
   * Constructor del componente.
   * 
   * @param fb - Instancia de FormBuilder para la creación de formularios reactivos.
   */


  constructor(
    private fb: FormBuilder,
    private query: Tramite120601Query,
    private store: Tramite120601Store,
    private datosEmpresaService: DatosEmpresaService,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices,
  ) {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe()
  }
 /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.crearFormulario();

    this.query.selectEstado$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data)=>{
      this.formulario.patchValue({
        estado: data
      })
    });

    this.query.selectRepresentacion$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data)=>{
      this.formulario.patchValue({
        representacion: data
      })
    })
 
     this.obtenerEstado();
     this.suscribirCambioEstado();
  }

  /**
   * Crea el formulario con los campos necesarios y sus validaciones.
   * @returns {void}
   */
  crearFormulario(): void {
    this.formulario = this.fb.group({
      estado: [''],
      representacion: ['', Validators.required],
    });
  }

  /**
   * Recupera y establece la información de la entidad federativa.
   * @returns {void}
   */
  public getEntidadFederativa(): void {
    this.datosEmpresaService.obtenerEstado().subscribe((data)=>{
      this.estado = data;
    });
  }

  /**
   * Recupera y establece la información de la representación federal.
   * @returns {void}
   */

  getRepresentacionFederal():void {
    this.datosEmpresaService.obtenerDatosDeRepresentacionFederal().subscribe((data)=>{
      this.representacion = data;
    });
  }

  /**
   * Recupera y establece la información de la representación federal.
   * @returns {void}
   */
  public getDatosSocios(): void {
    this.datosEmpresaService.ObtenerTablaDeRepresentaciónFederal().subscribe((data)=>{
      this.datosSocios = data;
    })
    
  }

  /**
   * Método para validar la representación federal.
   * @param _e El evento de selección de documento.
   * @returns {void}
   */

  public docSeleccionado(_e: Event): void {
    // Esta es una función dinámica; una vez que obtengamos la API, la implementaremos.
    this.store.setEstado(this.formulario.get('estado')?.value);
  }

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.formulario.get(nombreControl);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Método para validar la representación federal.
   * @param _e El evento de validación de representación federal.
   * @returns {void}
   */

  public validarRepresentacionFederalIDCSECEROR_(_e: Event): void {
    // Esta es una función dinámica; una vez que obtengamos la API, la implementaremos.
    this.store.setRepresentacion(this.formulario.get('representacion')?.value);
  }

/**
 * @description Obtiene el estado desde el servicio y asigna los datos a la variable `estado`.
 * @returns {void} No devuelve ningún valor, solo actualiza el estado del componente.
 */
  obtenerEstado(): void {
    this.catalogoService.catalogoEstadoUnidadesAdministrativas(this.tramites,'TIUAD.RF')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.estado = response?.datos ?? [];
        }
      });
  }

/**
 * @description Obtiene el representación federal desde el servicio y asigna los datos a la variable `representacion`.
 * @returns {void} No devuelve ningún valor, solo actualiza el estado del componente.
 */
  obtenerRepresentacionFederal(claveEstado: string): void {
  this.catalogoService.catalogoRepresentacionFederalVecina(this.tramites, claveEstado)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.representacion = response?.datos ?? [];
        if (this.representacion.length > 0) {
          const CLAVE: string = this.representacion[0].clave as string;
          this.formulario.patchValue({
            representacion: CLAVE
          });
          this.store.setRepresentacion(CLAVE);
        }
      }
    });
}

  /**
 * Recupera y establece la información de las plantas según el estado seleccionado.
 * @param estadoId El ID del estado seleccionado.
 * @returns {void}
 */
obtenerPlantasPorEstado(estadoId: string): void {
  this.datosEmpresaService.obtenerPlantas(estadoId)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        if (response?.datos?.length > 0) {
          this.datosSocios = response.datos.map((planta: RepresentacionFederal) => ({
            calle: planta.calle,
            numeroInterior: planta.numeroInterior,
            numeroExterior: planta.numeroExterior,
            codigoPostal: planta.codigoPostal,
            colonia: planta.colonia,
            localidad: planta.localidad,
            municipio: planta.municipio,
            estado: planta.estado,
            pais: planta.pais,
          }));
          this.plantasDataEmitted.emit(this.datosSocios);
        }
      },
      error: (err) => {
        console.error('Error al obtener las plantas:', err);
      }
    });
}

/**
 * Suscribe al cambio de valor del dropdown de estado.
 * Llama a la API de plantas cuando se selecciona un estado.
 */
suscribirCambioEstado(): void {
  this.formulario.get('estado')?.valueChanges
    .pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      takeUntil(this.destroyNotifier$))
      .subscribe((cveEntidad) => {
      if (cveEntidad) {
        const ESTADO_SELECCIONADO = this.estado.find((item) => item.clave === cveEntidad);
        const CLAVE_ESTADO = ESTADO_SELECCIONADO?.clave;
        if (CLAVE_ESTADO) {
          this.obtenerRepresentacionFederal(CLAVE_ESTADO);
        }
        this.obtenerPlantasPorEstado(cveEntidad);
      }
    });
}

  /**
   * Método que se ejecuta cuando se destruye el componente.
   * Se utiliza para limpiar los recursos y evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
