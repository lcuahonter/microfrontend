/**
 * @component SectoresYMercanciasComponent
 * @description Este componente es responsable de manejar los sectores y mercancías.
 * Incluye la lógica para obtener y gestionar los datos de los sectores, así como los catálogos relacionados.
 * 
 * @import { Component, OnInit } from '@angular/core';
 * @import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 * @import { PARATEXTO } from '../../../../shared/constantes/prosec/prosec.module';
 * @import { CatalogosSelect } from '../../../../core/models/shared/components.model';
 * @import { Catalogo } from '../../../../core/models/shared/catalogos.model';
 * @import { ProsecService } from '../../../../core/services/90101/prosec.module';
 * @import { SECTORCOLUMNS } from '../../../../shared/constantes/prosec/prosec.module';
 */

import { AlertComponent, Catalogo, CatalogoServices, Notificacion, NotificacionesComponent, SoloNumerosDirective, TablaDinamicaComponent, TituloComponent, doDeepCopy } from '@ng-mf/data-access-user';
import { AutorizacionProsecStore, ProsecState } from '../../estados/autorizacion-prosec.store';
import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { FilaProducir, FilaSectors } from '../../models/prosec.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, delay, map, takeUntil, tap } from 'rxjs';
import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpErrorResponse } from '@angular/common/http';
import { PARATEXTO } from '../../constantes/prosec.module';
import { ProsecService } from '../../services/prosec.service';
import { SeccionLibQuery } from '@ng-mf/data-access-user';
import { SeccionLibState } from '@ng-mf/data-access-user';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';



/**
 * @component SectoresYMercanciasComponent
 * @description
 * [ES] Este componente es responsable de manejar los sectores y mercancías en el trámite 90101.
 * Permite la gestión de la selección de sectores, la visualización de catálogos y la interacción con el formulario reactivo.
 * Utiliza servicios y stores para obtener y actualizar el estado de los sectores y mercancías, así como para validar el formulario.
 * Implementa la lógica para inicializar el formulario, recuperar datos de catálogos, manejar el modo solo lectura y sincronizar los valores con el store global.
 * 
 * @compodoc
 * @example
 * <app-sectores-y-mercancias [formularioDeshabilitado]="true"></app-sectores-y-mercancias>
 */
@Component({
  selector: 'app-sectores-y-mercancias',
  templateUrl: './sectores-y-mercancias.component.html',
  styleUrl: './sectores-y-mercancias.component.scss',
  standalone: true,
  imports: [ ReactiveFormsModule,AlertComponent, TablaDinamicaComponent, CatalogoSelectComponent, TituloComponent, CommonModule, forwardRef(() => SoloNumerosDirective), NotificacionesComponent ]
})
export class SectoresYMercanciasComponent implements OnInit, OnDestroy {

  /**
   * @property {string} loginRfc - RFC del usuario que ha iniciado sesión.
   */
  @Input() loginRfc!: string;

  /**
   * @input
   * @description
   * [ES] Indica si el formulario debe estar deshabilitado. Cuando es `true`, los controles del formulario estarán inactivos y no permitirán la interacción del usuario.
   * @type {boolean}
   * @default false
   * @compodoc
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * @property {FormGroup} sectoresYMercancias - El grupo de formularios para capturar los datos de los sectores y mercancías.
   * @compodoc
   */
  sectoresYMercancias!: FormGroup;

  /**
   * @property {string} TEXTO - Constante de texto utilizada en el componente.
   * @compodoc
   */
  TEXTO: string = PARATEXTO;

  /**
   * @property {Catalogo[]} sector - Array de catálogos de sectores.
   * @compodoc
   */
  sector: Catalogo[] = [];

  /**
   * @property {typeof TablaSeleccion} TablaSeleccion - Referencia al componente de selección de tabla.
   * @description [ES] Referencia utilizada para manejar la selección de filas en la tabla dinámica de sectores y mercancías.
   * @compodoc
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * @desc [ES] Arreglo que contiene las filas de sectores.
   * @type {FilaSectors[]}
   * @see FilaSectors
   * @memberof SectoresYMercanciasComponent
   * @compodoc
   * @description
   * [ES] Lista de sectores utilizada en el componente SectoresYMercancias.
   */
  sectors: FilaSectors[] = [];

  producir: FilaProducir[] = [];

  /**
   * @property {ConfiguracionColumna<FilaSectors>[]} sectorColumnsConfiguracion
   * @description
   * [ES] Configuración de las columnas para la tabla de sectores. Define los encabezados, claves y el orden de las columnas que se mostrarán en la tabla dinámica de sectores y mercancías.
   * @type {ConfiguracionColumna<FilaSectors>[]}
   * @memberof SectoresYMercanciasComponent
   * @compodoc
   */
  sectorColumnsConfiguracion: ConfiguracionColumna<FilaSectors>[] = [
    { encabezado: 'Lista de sectores', clave: (fila) => fila.sector, orden: 1 },
    { encabezado: 'Clave del sector', clave: (fila) => fila.cvSectorCatalogo, orden: 2 },
  ];

  producirColumnConfiguracion: ConfiguracionColumna<FilaProducir>[] = [
    { encabezado: 'Fracción arancelaria', clave: (fila) => fila.fraccionCompuesta, orden: 1 },
    { encabezado: 'Clave del sector', clave: (fila) => fila.cveSector, orden: 2 },
  ];

  /**
   * @descripcion
   * [ES] Subject utilizado como notificador para destruir suscripciones y evitar fugas de memoria.
   * Se utiliza junto con el operador `takeUntil` para cancelar las suscripciones al destruir el componente.
   * @private
   * @compodoc
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @descripcion
   * [ES] Estado actual de los sectores, obtenido del store de Prosec.
   * @private
   * @compodoc
   */
  private sectoresState!: ProsecState

  /**
   * @descripcion
   * [ES] Estado actual de la sección, obtenido del store de la sección.
   * @private
   * @compodoc
   */
  private seccionState!: SeccionLibState

  /**
   * @descripcion
   * [ES] Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los controles del formulario estarán deshabilitados.
   * @compodoc
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {FilaSectors[]} listSelectedView
   * @description
   * [ES] Arreglo que contiene los sectores seleccionados en la tabla dinámica para realizar acciones como eliminar.
   */
  listSelectedView: FilaSectors[] = [];

  /**
   * @property {FilaProducir[]} listSelectedProducir
   * @description
   * [ES] Arreglo que contiene las mercancías seleccionadas en la tabla dinámica para realizar acciones como eliminar.
   */
  listSelectedProducir: FilaProducir[] = [];

  /**
   * @property {boolean} espectaculoAlerta
   * @description
   * [ES] Indica si se debe mostrar una alerta relacionada con la validación o acciones sobre los sectores o mercancías.
   */
  espectaculoAlerta: boolean = false;
  /**
   * @property {boolean} espectaculoAlertaProducir
   * @description
   * [ES] Indica si se debe mostrar una alerta relacionada con la validación o acciones sobre las mercancías a producir.
   * Se utiliza para controlar la visualización de mensajes de alerta específicos para la sección de mercancías.
   */
  espectaculoAlertaProducir: boolean = false;

  /**
   * @property {boolean} espectaculoConfirmar
   * @description
   * [ES] Indica si se debe mostrar el modal de confirmación para eliminar sectores o mercancías seleccionadas.
   */
  espectaculoConfirmar: boolean = false;
  /**
   * @property {boolean} espectaculoConfirmarProducir
   * @description
   * [ES] Indica si se debe mostrar el modal de confirmación para eliminar mercancías a producir seleccionadas.
   * Se utiliza para controlar la visualización del diálogo de confirmación específico para la sección de mercancías.
   */
  espectaculoConfirmarProducir: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacion
   * @description
   * [ES] Objeto que contiene la información de la notificación a mostrar en el componente de notificaciones.
   */
  public nuevaNotificacion!: Notificacion;

  tramiteId: string = '90201';

  /**
   * @constructor
   * @description
   * [ES] Constructor del componente SectoresYMercanciasComponent. Inyecta las dependencias necesarias para la gestión de formularios, servicios y estados.
   * @param fb - FormBuilder para la creación de formularios reactivos.
   * @param ProsecService - Servicio para obtener datos relacionados con sectores y mercancías.
   * @param AutorizacionProsecStore - Store para manejar el estado de autorización Prosec.
   * @param AUtorizacionProsecQuery - Query para consultar el estado de autorización Prosec.
   * @param seccionStore - Store para manejar el estado de la sección.
   * @param seccionQuery - Query para consultar el estado de la sección.
   * @compodoc
   */
  constructor(
    private readonly fb: FormBuilder, 
    private ProsecService: ProsecService, 
    private AutorizacionProsecStore: AutorizacionProsecStore,
    private AUtorizacionProsecQuery: AUtorizacionProsecQuery,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private consultaQuery: ConsultaioQuery,
    private catalogoServices: CatalogoServices
  ) {}

  /**
   * @method ngOnInit
   * @description
   * [ES] Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Realiza las siguientes acciones:
   * - Se suscribe al estado de la sección y actualiza la propiedad `seccionState` con los datos recibidos.
   * - Se suscribe al estado de autorización PROSEC y actualiza la propiedad `sectoresState`.
   * - Inicializa el formulario reactivo llamando a `initActionFormBuild()`.
   * - Obtiene la lista de sectores desde el servicio llamando a `obtenserListaEstado()`.
   * - Recupera los datos de los sectores llamando a `recuperarDatos()`.
   * - Establece el formulario como no válido por defecto en el store de la sección.
   * - Se suscribe a los cambios de estado del formulario (`statusChanges`) y, si el formulario es válido, actualiza el store y llama a la validación global del formulario.
   * - Si el formulario está deshabilitado (`formularioDeshabilitado`), inicializa el estado del formulario en modo solo lectura.
   * @returns {void}
   * @compodoc
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    this.AUtorizacionProsecQuery.selectProsec$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.sectoresState = state as ProsecState;
          this.sectors = state.sectorDatos as FilaSectors[];
          this.producir = state.producirDatos as FilaProducir[];
          this.initActionFormBuild();
        })
      )
      .subscribe();
    this.initActionFormBuild();
    this.obtenserListaEstado();

    this.sectoresYMercancias.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_value) => {
          if (this.sectoresYMercancias.valid) {
            this.AutorizacionProsecStore.setSectoresFromValida(true);
            
          }
        })
      )
      .subscribe();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.sectors = Array.isArray(this.sectoresState.sectorDatos)
        ? this.sectoresState.sectorDatos as FilaSectors[]
        : [this.sectoresState.sectorDatos as FilaSectors];
    this.producir = Array.isArray(this.sectoresState.producirDatos)
      ? this.sectoresState.producirDatos as FilaProducir[]
      : [this.sectoresState.producirDatos as FilaProducir];

    this.nuevaNotificacion = {} as Notificacion;
  }

  /**
   * @method inicializarEstadoFormulario
   * @description
   * [ES] Inicializa el estado del formulario de sectores y mercancías según el modo de solo lectura.
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es `true`), deshabilita todos los controles del formulario.
   * En caso contrario, habilita los controles para permitir la edición por parte del usuario.
   * @returns {void}
   * @compodoc
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.sectoresYMercancias.disable();
      
    }
    else {
      this.sectoresYMercancias.enable();
    } 
  }
  
  /**
   * @method initActionFormBuild
   * @description
   * [ES] Inicializa el formulario reactivo `sectoresYMercancias` con los valores actuales del estado de sectores.
   * Define los controles del formulario para el sector (obligatorio) y la fracción arancelaria.
   * Este método se utiliza para construir la estructura del formulario al cargar el componente o al actualizar el estado.
   * @returns {void}
   * @compodoc
   */
  initActionFormBuild(): void {
    this.sectoresYMercancias = this.fb.group({
      sector: [
        this.sectoresState.Sector
      ],
      Fraccion_arancelaria: [
        { value: this.sectoresState.Fraccion_arancelaria, disabled: this.esFormularioSoloLectura },
        Validators.required
      ],
    })
  }

  /**
   * @method setValoresStore
   * @description
   * [ES] Actualiza el valor de un campo específico en el store `AutorizacionProsecStore` utilizando el método proporcionado.
   * @param form El formulario reactivo (`FormGroup`) del cual se obtiene el valor.
   * @param campo El nombre del campo dentro del formulario cuyo valor se va a extraer.
   * @param metodoNombre El nombre del método del store `AutorizacionProsecStore` que se invocará para actualizar el valor.
   * @returns {void}
   * @compodoc
   * Este método facilita la sincronización entre los valores del formulario y el store, permitiendo una actualización dinámica y reutilizable.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof AutorizacionProsecStore
  ): void {
    const VALOR = form.get(campo)?.value as unknown;
    (this.AutorizacionProsecStore[metodoNombre] as (value: unknown) => void) (
      VALOR
    );
  }

  /**
   * @method obtenserListaEstado
   * @description
   * [ES] Obtiene la lista de sectores desde el servicio llamando al archivo `sector.json`.
   * Si la petición es exitosa, asigna los datos recibidos a la propiedad `sector`.
   * En caso de error, muestra el error en consola y asigna un arreglo vacío.
   * @returns {void}
   * @compodoc
   */
  obtenserListaEstado(): void {
    this.catalogoServices.sectoresCatalogo(this.tramiteId).subscribe({
      next: (data) => {
        this.sector = data.datos as Catalogo[];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener los datos:', error);
        this.sector = [];
      }
  });
    // this.ProsecService.obtenerMenuDesplegable('sector.json').subscribe({
    //   next: (data) => {
    //     this.sector = data as Catalogo[];
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     console.error('Error al obtener los datos:', error);
    //     this.sector = [];
    //   }
    // });
  }

  /**
   * @method recuperarDatos
   * @description
   * [ES] Recupera los datos de los sectores desde el servicio llamando al método `obtenerTablaDatos` con el archivo `sectorDatos.json`.
   * Si la respuesta es un arreglo, actualiza la propiedad `sectors` con los datos obtenidos.
   * @returns {void}
   * @compodoc
   */
  recuperarDatos(): void {
    this.ProsecService.obtenerSectoresTablaDatos(this.sectoresYMercancias.get('sector')?.value).subscribe(
      (response) => {
        const API_DATOS = doDeepCopy(response);
        if(API_DATOS.codigo === '00'){
          if (API_DATOS && API_DATOS.datos && Array.isArray(API_DATOS.datos.sector_seleccionado)) {
            this.sectors = [...this.sectors, ...API_DATOS.datos.sector_seleccionado];
            this.AutorizacionProsecStore.setSectorDatos(this.sectors);
          }
        }
      }
    );
  }

    /**
   * @method recuperarProducirDatos
   * @description
   * Recupera los datos de producción desde el archivo 'producirDatos.json' utilizando el servicio ProsecService.
   * Si la respuesta es un arreglo, asigna los datos a la propiedad `producir` como un arreglo de `FilaProducir`.
   * 
   * @returns {void}
   */
  recuperarProducirDatos(): void {
    const PAYLOAD = {
      "fraccion": this.sectoresYMercancias.get('Fraccion_arancelaria')?.value,
      "id_conf_programa_se": this.listSelectedView[0]?.idConfProgramaSE,
      "cve_sector": this.listSelectedView[0]?.cvSectorCatalogo,
      "id_programa_autorizado": null
    }
    this.ProsecService.obtenerFraccionArancelariaDatos(PAYLOAD).subscribe(
      (response) => {
        const API_DATOS = doDeepCopy(response);
        if(API_DATOS.codigo === '00'){
          if(API_DATOS && API_DATOS.datos && API_DATOS.datos.fraccion_seleccionada.length === 0){
            this.espectaculoAlerta = true;
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: '',
              mensaje: API_DATOS?.datos?.response,
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
            return;
          }
          if (API_DATOS && API_DATOS.datos && Array.isArray(API_DATOS.datos.fraccion_seleccionada)) {
            this.producir = [...this.producir, ...API_DATOS.datos.fraccion_seleccionada];
            this.AutorizacionProsecStore.setProducirDatos(this.producir);
          }
        }
      }
    );
  }

  /**
   * @method agregarSector
   * @description
   * Llama al método `recuperarDatos()` para obtener la información más reciente de los sectores y actualizar la tabla.
   * 
   * @returns {void}
   */
  agregarSector(): void {
    const SECTOR_SELECCIONADO = this.sectoresYMercancias.get('sector')?.value;
    if(SECTOR_SELECCIONADO.length > 0){
      if(this.sectors.some(sector => sector.cvSectorCatalogo === SECTOR_SELECCIONADO)){
        this.espectaculoAlerta = true;
        this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('El sector que intenta ingresar ya existe en la lista de sectores capturados.');
        return;
      }
      this.recuperarDatos();
    }
  }

  /**
   * @method agregarProducir
   * @description
   * Llama al método `recuperarProducirDatos()` para obtener la información más reciente de los datos de producción y actualizar la tabla.
   * 
   * @returns {void}
   */
  agregarProducir(): void {
    if( this.listSelectedView.length === 0 ){
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Se debe seleccionar un sector.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    const FRACCION_ARANCELARIA = this.sectoresYMercancias.get('Fraccion_arancelaria')?.value;
    if (FRACCION_ARANCELARIA === '') {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe de ingresar una fracción que corresponda al sector selecciondado.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else if(this.producir.some(producir => producir?.fraccionArancelaria?.cveFraccion === FRACCION_ARANCELARIA && producir.cveSector === this.listSelectedView[0]?.cvSectorCatalogo)){
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('El sector que intenta ingresar ya existe en la lista de sectores capturados.');
    }
    else {
      this.espectaculoAlerta = false;
      this.recuperarProducirDatos();
    }
  }

  /**
   * @method sectorSeleccion
   * @description
   * [ES] Actualiza el estado del store con el sector seleccionado.
   * Este método se utiliza para guardar el sector elegido por el usuario en el store de autorización PROSEC,
   * permitiendo que el estado global del trámite refleje la selección actual.
   * @param {Catalogo} Sector - Objeto de tipo `Catalogo` que representa el sector seleccionado.
   * @returns {void}
   * @compodoc
   */
  // sectorSeleccion(Sector: Catalogo): void {
  //   this.AutorizacionProsecStore.setActividadProductiva([Sector]);
  // }

  /**
   * @method seleccionarFila
   * @description
   * [ES] Actualiza la lista de sectores seleccionados en la tabla dinámica y sincroniza el estado en el store.
   * @param {FilaSectors} row - Fila de sector seleccionada.
   */
  seleccionarFila(row: FilaSectors): void {
    this.listSelectedView = row ? [row] : [];
    this.AutorizacionProsecStore.update(
      (state) => ({
        ...state,
        selectedSectorDatos: this.listSelectedView
      })
    );
  }

  /**
   * @method seleccionarFilaProducir
   * @description
   * [ES] Actualiza la lista de mercancías seleccionadas en la tabla dinámica y sincroniza el estado en el store.
   * @param {FilaProducir} row - Fila de mercancía seleccionada.
   */
  seleccionarFilaProducir(row: FilaProducir): void {
    this.listSelectedProducir = row ? [row] : [];
    this.AutorizacionProsecStore.update(
      (state) => ({
        ...state,
        selectedProducirDatos: this.listSelectedProducir
      })
    );
  }

  /**
   * @method eliminarSector
   * @description
   * [ES] Muestra una alerta si no hay sectores o mercancías seleccionadas para eliminar.
   * Si hay sectores o mercancías seleccionadas, muestra una confirmación antes de eliminarlas.
   */
  eliminarSector(): void {
    if (this.listSelectedView.length === 0) {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione el sector que desea eliminar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '', 
      };
    }
    else if (this.listSelectedView.length > 0) {
      this.espectaculoConfirmar = true;
      this.espectaculoAlerta = false;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Está seguro que desea eliminar el sector seleccionado?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }
    
  }
  /**
   * @method eliminarSectorProducir
   * @description
   * [ES] Muestra una alerta si no hay fracciones seleccionadas para eliminar.
   * Si hay fracciones seleccionadas, muestra un diálogo de confirmación antes de eliminarlas.
   * Configura las propiedades `espectaculoAlertaProducir` y `espectaculoConfirmarProducir` para controlar 
   * la visualización de alertas y diálogos de confirmación específicos para las mercancías a producir.
   * 
   * @returns {void}
   */
  eliminarSectorProducir(): void {
    if (this.listSelectedProducir.length === 0){
      this.espectaculoAlertaProducir = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione la fraccion que desea eliminar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
    else if (this.listSelectedProducir.length > 0){
      this.espectaculoConfirmarProducir = true;
      this.espectaculoAlertaProducir = false;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Está seguro que desea eliminar la fracción seleccionada?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }
  }

  /**
   * @method eliminarPedimento
   * @description
   * [ES] Oculta la alerta de eliminación si el evento es verdadero.
   * @param {boolean} event - Indica si se debe ocultar la alerta.
   */
  eliminarPedimento(event: boolean): void {
    this.espectaculoAlerta = !event;
  }

  /**
   * @method eliminarPedimentoProducirAlerta
   * @description
   * [ES] Controla la visibilidad de la alerta relacionada con las mercancías a producir.
   * Si el evento recibido es verdadero, oculta la alerta (estableciendo `espectaculoAlertaProducir` a `false`).
   * Si el evento es falso, muestra la alerta (estableciendo `espectaculoAlertaProducir` a `true`).
   * 
   * @param {boolean} event - Valor booleano que determina si se debe ocultar la alerta.
   * @returns {void}
   */
  eliminarPedimentoProducirAlerta(event: boolean): void {
    this.espectaculoAlertaProducir = !event;
  }
  /**
   * @method eliminarPedimentoDatos
   * @description
   * [ES] Elimina los sectores o mercancías seleccionadas del estado y actualiza la lista en el store.
   * @param {boolean} event - Indica si se debe proceder con la eliminación.
   */
  eliminarPedimentoDatos(event: boolean): void {
    if (event && this.listSelectedView.length > 0) {
      this.espectaculoConfirmar = false;
      const VALOR = this.AutorizacionProsecStore.getValue().sectorDatos;
      if (VALOR.length === 0) {
        return;
      }
      const FILTERED_VALOR = VALOR.filter(
        (item) => !this.AutorizacionProsecStore.getValue().selectedSectorDatos?.includes(item)
      );
      this.AutorizacionProsecStore.update(
        (state) => ({
          ...state,
          sectorDatos: FILTERED_VALOR,
          selectedSectorDatos: [],
        })
      );
      this.listSelectedView = [];
    }
  }

  /**
   * @method eliminarPedimentoProducirDatos
   * @description
   * [ES] Elimina las mercancías a producir seleccionadas del estado cuando el usuario confirma la eliminación.
   * Si el evento recibido es verdadero y hay elementos seleccionados en `listSelectedProducir`:
   * - Oculta el diálogo de confirmación.
   * - Obtiene los datos actuales de mercancías a producir del store.
   * - Filtra el arreglo para eliminar los elementos seleccionados.
   * - Actualiza el store con el arreglo filtrado y limpia la selección.
   * - Vacía la lista local de elementos seleccionados.
   * 
   * @param {boolean} event - Indica si se debe proceder con la eliminación (true) o cancelar (false).
   * @returns {void}
   */
  eliminarPedimentoProducirDatos(event: boolean): void {
    if (event && this.listSelectedProducir.length > 0) {
      this.espectaculoConfirmarProducir = false;
      const VALOR = this.AutorizacionProsecStore.getValue().producirDatos;
      if (VALOR.length === 0) {
        return;
      }
      const FILTERED_VALOR = VALOR.filter(
        (item) => !this.AutorizacionProsecStore.getValue().selectedProducirDatos?.includes(item)
      );
      this.AutorizacionProsecStore.update(
        (state) => ({
          ...state,
          producirDatos: FILTERED_VALOR,
          selectedProducirDatos: [],
        })
      );
      this.listSelectedProducir = [];
    }
  }

  /**
   * @method obtenerConfiguracionDeNotificacion
   * @description Obtiene la configuración de notificación para mostrar mensajes al usuario.
   *
   * @param {string} mensaje - El mensaje a mostrar en la notificación.
   * @param {string} [titulo=''] - El título de la notificación.
   * @param {string} [categoria=''] - La categoría de la notificación (ej. 'success', 'error').
   * @param {string} [txtBtnCancelar=''] - El texto del botón de cancelar.
   * @returns {Notificacion} La configuración de la notificación.
   */
  obtenerConfiguracionDeNotificacion(mensaje: string, titulo: string = '', categoria: string = '', txtBtnCancelar: string = ''): Notificacion {
    return {
        tipoNotificacion: 'alert',
        categoria: categoria,
        modo: 'action',
        titulo: titulo,
        mensaje: mensaje,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: txtBtnCancelar,
      };
  }

    /**
   * @method validarFormulario
   * @description
   * [ES] Valida el formulario de sectores y mercancías. Si el formulario es válido, retorna `true`.
   * Si no es válido, marca todos los controles como tocados para mostrar los errores y retorna `false`.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    if (this.sectoresYMercancias.valid) {
      return true;
    }
    this.sectoresYMercancias.markAllAsTouched();
    return false
  }

  /**
   * @method ngOnDestroy
   * @description
   * [ES] Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Notifica y completa el Subject `destroyNotifier$` para cancelar todas las suscripciones activas y evitar fugas de memoria.
   * Es fundamental para la correcta gestión de recursos y la prevención de memory leaks en componentes que utilizan observables.
   * @returns {void}
   * @compodoc
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}