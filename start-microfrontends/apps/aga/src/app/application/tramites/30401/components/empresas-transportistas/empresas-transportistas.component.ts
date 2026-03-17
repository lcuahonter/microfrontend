import { Catalogo, REGEX_SOLO_DIGITOS, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CROSLISTA_ENTRADA } from '../../enums/croslista.enums';
import { CapitalSocialComponent } from '../capital-social/capital-social.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { CrosslistComponent } from '@libs/shared/data-access-user/src/tramites/components/crosslist/crosslist.component';
import { DatosGeneralesComponent } from '../datos-generales/datos-generales.component';
import { DireccionEmpresaComponent } from '../direccion-empresa/direccion-empresa.component';
import { NOTA } from '../../enums/registro-empresas-transporte.enum';
import { RegistroEmpresasTransporteService } from '../../services/registro-empresas-transporte.service';
import { Tramite30401Query } from '../../estados/tramites30401.query';
import { Tramites30401State } from '../../estados/tramites30401.store';
import { permisoComponent } from '../permiso-expedido/permiso-expedido.component';
/**
 * @packageDocumentation
 * @module EmpresasTransportistasComponent
 *
 * Este componente es responsable de gestionar el formulario reactivo para las empresas transportistas.
 * Proporciona funcionalidades para la creación, validación y manejo de datos relacionados con las empresas transportistas.
 */

/**
 * Importa módulos y utilidades necesarias para el funcionamiento del componente.
 * - Angular: Formularios reactivos, validación, ciclo de vida, etc.
 * - Servicios: `RegistroEmpresasTransporteService` para obtener datos relacionados.
 * - Componentes: Componentes reutilizables como `CrosslistComponent`, `TituloComponent`, etc.
 * - RxJS: Manejo de observables y suscripciones.
 */

@Component({
  selector: 'app-empresas-transportistas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CrosslistComponent,
    DatosGeneralesComponent,
    DireccionEmpresaComponent,
    CapitalSocialComponent,
    permisoComponent,
  ],
  providers: [RegistroEmpresasTransporteService],
  templateUrl: './empresas-transportistas.component.html',
  styleUrl: './empresas-transportistas.component.scss',
})
export class EmpresasTransportistasComponent implements OnInit, OnDestroy {
    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * @property {FormGroup} empresasForm
   * Formulario reactivo que contiene los controles y validaciones para los datos de las empresas transportistas.
   */
  public empresasForm!: FormGroup;

  /**
   * @property {Subject<void>} destroyed$
   * Observable utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  public destroyed$ = new Subject<void>();

  /**
   * @property {Observable<Catalogo[]>} tipoTransitoList$
   * Observable que contiene la lista de tipos de tránsito.
   */
  public tipoTransitoList$!: Observable<Catalogo[]>;

  /**
   * @property {Observable<Catalogo[]>} entidadFederativaList$
   * Observable que contiene la lista de entidades federativas.
   */
  public entidadFederativaList$!: Observable<Catalogo[]>;

  /**
   * @property {Observable<Catalogo[]>} delegacionMunicipioList$
   * Observable que contiene la lista de delegaciones o municipios.
   */
  public delegacionMunicipioList$!: Observable<Catalogo[]>;

  /**
   * @property {Observable<string>} cveFolioCaat$
   * Observable que contiene el valor del folio CAAT.
   */
  public cveFolioCaat$!: Observable<string>;

  /**
   * @property {Observable<Catalogo[]>} coloniaList$
   * Observable que contiene la lista de colonias.
   */
  public coloniaList$!: Observable<Catalogo[]>;

  /**
   * @property {string} CAPITAL_SOCIAL_NOTA
   * Nota relacionada con el capital social.
   */
  public CAPITAL_SOCIAL_NOTA = NOTA.CAPITAL_SOCIAL_NOTA;

  /**
   * @property {string} MI_REPRESENTADA_NOTA
   * Nota relacionada con la representación.
   */
  public MI_REPRESENTADA_NOTA = NOTA.MI_REPRESENTADA_NOTA;

  /**
   * @property {QueryList<CrosslistComponent>} crossList
   * Lista de componentes `CrosslistComponent` utilizados en el formulario.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * @property {any} aduanasAutorizadas
   * Lista de aduanas autorizadas.
   */
  public aduanasAutorizadas = CROSLISTA_ENTRADA;

  /**
   * @property {any} seleccionarAduanasEntrada
   * Lista de aduanas seleccionadas para entrada.
   */
  public seleccionarAduanasEntrada = CROSLISTA_ENTRADA;

  /**
   * @property {string[]} seleccionadasAduanasEntradaDatos
   * Datos de las aduanas seleccionadas.
   */
  public seleccionadasAduanasEntradaDatos: string[] = [];

  /**
   * @property {Tramites30401State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Tramites30401State;

  /**
   * @property {Array} aduanasEntradaBotons
   * Configuración de los botones para gestionar las aduanas de entrada.
   */
  aduanasEntradaBotons = [
    {
      btnNombre: 'Agregar',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Agregar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Eliminar',
      class: 'btn-danger',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Eliminar todas',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * @constructor
   * Constructor para inyectar los servicios y dependencias necesarias.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite30401Query} tramite30401Query - Servicio para consultar datos del estado.
   * @param {RegistroEmpresasTransporteService} Servicio - Servicio para obtener datos relacionados con empresas transportistas.
   */
  constructor(
    public fb: FormBuilder,
    private tramite30401Query: Tramite30401Query,
    private Servicio: RegistroEmpresasTransporteService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe();
  }

  /**
   * @method aduanasEntradaSeleccionadasChange
   * Maneja el cambio de selección de aduanas de entrada.
   * @param {string[]} events - Lista de aduanas seleccionadas.
   */
  aduanasEntradaSeleccionadasChange(events: string[]): void {
    this.seleccionadasAduanasEntradaDatos = events;
    this.empresasForm.patchValue({
      cboAduanasActuarSeleccionadas: events,
    });
  }

  /**
   * @method ngOnInit
   * Hook de ciclo de vida para inicializar el componente.
   */
  ngOnInit(): void {
    this.enPatchStoredFormData();
    this.obtenerlistadescargable();
     this.inicializarEstadoFormulario();
  }

  /**
   * @method crearForm
   * Crea el formulario reactivo con sus controles y validaciones.
   */
  crearForm(): void {
    this.empresasForm = this.fb.group({
      numeroCaat: this.fb.group({
        cveFolioCaat: [{ value: '', disabled: true }, Validators.required],
        tipoTransito: [this.seccionState?.tipoTransito, Validators.required],
      }),
      cboAduanasActuarSeleccionadas: [
      this.seccionState?.cboAduanasActuarSeleccionadas || [],
      Validators.required,
    ],
      domicilio: this.fb.group({
        calle: [
          this.seccionState?.calle,
          [Validators.required, Validators.maxLength(100)],
        ],
        numeroExterior: [
          this.seccionState?.numeroExterior,
          [Validators.required, Validators.maxLength(55), Validators.pattern(REGEX_SOLO_DIGITOS)],
        ],
        numeroInterior: [
          this.seccionState?.numeroInterior,
          [Validators.maxLength(55),Validators.pattern(REGEX_SOLO_DIGITOS)],
        ],
        entidadFederativa: [
          this.seccionState?.entidadFederativa,
          Validators.required,
        ],
        delegacionMunicipio: [
          this.seccionState?.delegacionMunicipio,
          Validators.required,
        ],
        colonia: [this.seccionState?.colonia, Validators.required],
        localidad: [this.seccionState?.localidad, Validators.required],
        codigoPostal: [
          this.seccionState?.codigoPostal,
          [Validators.required, Validators.maxLength(6)],
        ],
      }),
      empresasCapitalSocial: this.fb.group({
        capitalSocial: [
          this.seccionState?.capitalSocial, 
          [
            Validators.required,
            Validators.pattern(REGEX_SOLO_DIGITOS),
            Validators.maxLength(20)
          ]
        ],
      }),
      permiso: this.fb.group({
        numeroFolioPermiso: [
          this.seccionState?.numeroFolioPermiso,
          [Validators.required, Validators.maxLength(20),Validators.pattern(REGEX_SOLO_DIGITOS)],
        ],
        fechaExpedicion: [
          this.seccionState?.fechaExpedicion,
          Validators.required,
        ],
        elCapitalSocial: [
          this.seccionState?.elCapitalSocial,
          Validators.requiredTrue,
        ],
        miRepresentada: [
          this.seccionState?.miRepresentada,
          Validators.requiredTrue,
        ],
      }),
    });
  }

  /**
   * @method inicializarEstadoFormulario
   * Inicializa el estado del formulario dependiendo del modo de solo lectura.
   * Si el formulario está en modo solo lectura, se guardan los datos del formulario.
   * Si no, se crea el formulario reactivo.
   */
inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearForm();
    }
  }
    /**
   * @method
   * @name guardarDatosFormulario
   * @description
   * Inicializa los formularios y obtiene los datos de la tabla.
   * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
   * deshabilita o habilita todos los formularios del componente.
   * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
   * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
   *
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.crearForm();
    if (this.esFormularioSoloLectura) {
      this.empresasForm.disable();
    } else {
      this.empresasForm.enable();
    }
  }
  /**
   * @method obtenerlistadescargable
   * Obtiene las listas necesarias para llenar los selectores del formulario.
   */
  obtenerlistadescargable(): void {
    this.tipoTransitoList$ = this.Servicio.tipoTransitoList();
    this.entidadFederativaList$ = this.Servicio.entidadFederativaList();
    this.delegacionMunicipioList$ = this.Servicio.delegacionMunicipioList();
    this.coloniaList$ = this.Servicio.coloniaList();
    this.cveFolioCaat$ = this.Servicio.cveFolioCaat().pipe(
      map((datos: { id?: number; value: string }) => datos.value)
    );
  }

  /**
   * @method enPatchStoredFormData
   * Actualiza el formulario con los datos almacenados en el estado.
   */
  public enPatchStoredFormData(): void {
    this.tramite30401Query.selectTramite30401$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Tramites30401State) => {
        this.seccionState = datos;
      });
  }

  /**
   * @method esInvalido
   * Verifica si un control del formulario es inválido.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - `true` si el control es inválido, de lo contrario `false`.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.empresasForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @method ngOnDestroy
   * Hook de ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
