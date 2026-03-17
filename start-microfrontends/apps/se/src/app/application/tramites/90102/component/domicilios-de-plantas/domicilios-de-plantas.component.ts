import {
  AlertComponent,
  Catalogo,
  CatalogoServices,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TituloComponent,
  doDeepCopy,
  esValidObject,
} from '@ng-mf/data-access-user';
import {
  AutorizacionProsecStore,
  ProsecState,
} from '../../estados/autorizacion-prosec.store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MODALIDAD,TEXTO} from '../../constantes/prosec.module';
import { Subject, delay, map, takeUntil, tap } from 'rxjs';
import { AUtorizacionProsecQuery } from '../../queries/autorizacion-prosec.query';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FilaPlantas } from '../../models/prosec.module';
import { HttpErrorResponse } from '@angular/common/http';
import { ProsecService } from '../../services/prosec.service';
import { SeccionLibQuery } from '@ng-mf/data-access-user';
import { SeccionLibState } from '@ng-mf/data-access-user';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-domicilios-de-plantas',
  templateUrl: './domicilios-de-plantas.component.html',
  styleUrls: ['./domicilios-de-plantas.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    CommonModule,
    NotificacionesComponent
  ],
})
export class DomiciliosDePlantasComponent implements OnInit, OnDestroy {
  /**
   * @property {FormGroup} forma - El grupo de formularios para capturar los datos de las plantas.
   */
  forma!: FormGroup;

  /**
   * @property {string} TEXTO - Constante de texto utilizada en el componente.
   */
  TEXTO: string = TEXTO;

  /**
   * @property {Catalogo[]} estadoSeleccionar - Array de catálogos de estados.
   */
  estadoSeleccionar: Catalogo[] = [];

    /** Bandera de solo lectura (puedes adaptarla si tienes lógica para esto) */
  public esFormularioSoloLectura: boolean = false;

   
  /** Lista de empleados seleccionados en la tabla */
  public seleccionarProsecDisponiblesLista: FilaPlantas[] = [] as FilaPlantas[];

   /**
   * Bandera para determinar si el formulario es de actualización.
   * Inicialmente establecido en `false`.
   *
   * @description Esta bandera se utiliza para controlar la lógica de actualización del formulario.
   */
  private esFormularioActualizacion: boolean = false;

  /**
   * @property {Catalogo[]} RepresentacionFederal - Array de catálogos de representación federal.
   */
  RepresentacionFederalLista: Catalogo[] = [];

    /**
     * Una propiedad pública que representa el estado de la solicitud de sectores y mercancías.
     * Esta propiedad se utiliza para almacenar el estado actual de la solicitud.
     * @type {SolicitudSectoresYMercanciasState}
     */
    public solicitudState!: ProsecState;

  /**
   * @property {Catalogo[]} ActividadProductiva - Array de catálogos de actividad productiva.
   */
  ActividadProductivaLista: Catalogo[] = [];

  plantasDatos: FilaPlantas[] = [];
  /** Datos de las plantas obtenidos del servicio */
  prosecDatos: FilaPlantas[] = [];
  
  TablaSeleccion = TablaSeleccion;

  private destroyNotifier$: Subject<void> = new Subject();

  private domiciliosState!: ProsecState;

  private seccionState!: SeccionLibState;

  /**
   * Identificador del trámite actual.
   */
  tramiteId: string = '90102';
  
    /**
     * @property {boolean} eliminarPlantasConfirmacion
     * @description
     * Indica si se debe mostrar el modal de confirmación para eliminar plantas seleccionadas.
     */
    eliminarPlantasConfirmacion: boolean = false;
  
    /**
     * @property {boolean} eliminarPlantasAlerta
     * @description
     * Indica si se debe mostrar una alerta cuando no se ha seleccionado ninguna planta para eliminar.
     */
    eliminarPlantasAlerta: boolean = false;
  
    /**
     * @property {Notificacion} nuevaNotificacion
     * @description
     * Objeto que contiene la información de la notificación a mostrar en el componente de notificaciones.
     */
    public nuevaNotificacion!: Notificacion;
  
    /**
     * @property {boolean} espectaculoAlerta
     * @description
     * Indica si se debe mostrar una alerta relacionada con la selección de entidad federativa o plantas.
     */
    espectaculoAlerta: boolean = false;
  
    /**
     * @property {boolean} espectaculoAlertaAgregar
     * @description
     * Indica si se debe mostrar una alerta relacionada con la acción de agregar plantas seleccionadas a la lista PROSEC.
     * Se utiliza para advertir al usuario cuando no ha seleccionado ninguna planta para agregar.
     */
    espectaculoAlertaAgregar: boolean = false;

  plantaColumnsConfiguracion: ConfiguracionColumna<FilaPlantas>[] = [
    { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 1 },
    {
      encabezado: 'Número exterior',
      clave: (fila) => fila.numeroExterior,
      orden: 2,
    },
    {
      encabezado: 'Número interior',
      clave: (fila) => fila.numeroInterior,
      orden: 3,
    },
    {
      encabezado: 'Código postal',
      clave: (fila) => fila.codigoPostal,
      orden: 4,
    },
    {
      encabezado: 'Colonia',
      clave: (fila) => fila.colonia,
      orden: 5,
    },
    {
      encabezado: 'Municipio o alcaldía',
      clave: (fila) => fila.municipioOAlcaldia,
      orden: 6,
    },
    {
      encabezado: 'País',
      clave: (fila) => fila.pais,
      orden: 7,
    },
    {
      encabezado: 'Registro',
      clave: (fila) => fila.registro,
      orden: 8,
    },
    {
      encabezado: 'Registro federal de contribuyentes',
      clave: (fila) => fila.registroFederalDeContribuyentes,
      orden: 9,
    },
    {
      encabezado: 'Razón social',
      clave: (fila) => fila.razonSocial,
      orden: 10,
    },
    {
      encabezado: 'Domicilio fiscal del solicitante',
      clave: (fila) => fila.domicilioFiscalDelSolicitante,
      orden: 11,
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private prosecService: ProsecService,
    private autorizacionProsecStore: AutorizacionProsecStore,
    private autorizacionProsecQuery: AUtorizacionProsecQuery,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private consultaioQuery: ConsultaioQuery,
    private catalogoServices: CatalogoServices
  ) {
      // Inicializa el formulario.
      this.forma = this.fb.group({
      modalidad: [{ value: MODALIDAD, disabled: true }],
      Estado: ['', Validators.required],
      RepresentacionFederal: ['', Validators.required],
      ActividadProductiva: ['', Validators.required],
    });
   
  }

  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    this.autorizacionProsecQuery.selectProsec$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.domiciliosState = state as ProsecState;
          this.plantasDatos = state.plantasDatos;
          this.prosecDatos = state.prosecDatos;
          if(state.RepresentacionFederalLista && state.RepresentacionFederalLista.length > 0){
          this.RepresentacionFederalLista = state.RepresentacionFederalLista;
          }
         
           this.forma.patchValue({
            modalidad: state.modalidad ? state.modalidad : MODALIDAD,
            Estado: state.Estado,
            RepresentacionFederal: state.RepresentacionFederal,
            ActividadProductiva: state.ActividadProductiva,
          });
        })
      )
      .subscribe();
    this.obtenerLista();

    this.forma.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_value) => {
          if (this.forma.valid) {
            this.autorizacionProsecStore.setDomiciliosFormaValida(true);
          }
        })
      )
      .subscribe();

       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.esFormularioActualizacion = seccionState.update;
        })
      )
      .subscribe();
      this.nuevaNotificacion = {} as Notificacion;

     

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
   * Carga datos y deshabilita el formulario si es solo lectura.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.forma.disable();
    } else {
      this.forma.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el estado seleccionado.
   */
  inicializarFormulario(): void {
    this.autorizacionProsecQuery.selectProsec$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.initActionFormBuild();
  }

  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof AutorizacionProsecStore
  ): void {
    // Cambiado el tipo "any" por "unknown" para cumplir con las reglas de TypeScript
    const VALOR = form.get(campo)?.value;
    (this.autorizacionProsecStore[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  initActionFormBuild(): void {
    // Se asegura que el formulario se inicialice correctamente con las validaciones necesarias
    this.forma = this.fb.group({
      modalidad: [{value:this.domiciliosState.modalidad ? this.domiciliosState.modalidad : MODALIDAD, disabled: true}],
      Estado: [this.domiciliosState.Estado, Validators.required],
      RepresentacionFederal: [
        this.domiciliosState.RepresentacionFederal,
        Validators.required,
      ],
      ActividadProductiva: [
        this.domiciliosState.ActividadProductiva,
        Validators.required,
      ],
    });
  }

  

  /**
   * @method obtenserListaEstado
   * @description Obtiene la lista de estados desde el servicio.
   */
  obtenerListaEstado(): void {
    this.catalogoServices.estadosCatalogo(this.tramiteId).subscribe({
      next: (data) => {
        this.estadoSeleccionar = data.datos as Catalogo[];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener los datos:', error);
        this.estadoSeleccionar = [];
      }
  });
  }

  /**
   * @method obtenserListaFederal
   * @description Obtiene la lista de representación federal desde el servicio.
   */
  obtenerListaFederal(): void {
    const ESTADO_VALOR = this.domiciliosState.Estado;
    this.catalogoServices.getRepresentacionFederalMexCatalogo(this.tramiteId.toString(), ESTADO_VALOR).subscribe({
      next: (data) => {
        this.RepresentacionFederalLista = data.datos as Catalogo[];
        this.autorizacionProsecStore.setRepresentacionFederalLista(this.RepresentacionFederalLista);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener los datos:', error);
        this.RepresentacionFederalLista = [];
      }
  });
  }

  /**
   * @method obtenserListaActividad
   * @description Obtiene la lista de actividad productiva desde el servicio.
   */
  obtenerListaActividad(): void {
    this.catalogoServices.getActividadProductivaProsecCatalogo(this.tramiteId.toString()).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.ActividadProductivaLista = DATOS;
  });
  }

  /**
   * @method obtenserLista
   * @description Obtiene las listas de datos de estados, representación federal y actividad productiva.
   */
  obtenerLista(): void {
    this.obtenerListaEstado();
    this.obtenerListaActividad();
    if (this.esFormularioSoloLectura) {
      this.recuperarDatos();
    }
   
  }

 

  onEstadoChange(): void {
  const ESTADO_VALOR = this.forma.get('Estado')?.value;
  if (ESTADO_VALOR) {
    this.setValoresStore(this.forma, 'Estado', 'setEstado');
    this.obtenerListaFederal(); 
    this.forma.get('RepresentacionFederal')?.markAsUntouched();
  }
}
  /**
 * Recupera los datos de las plantas desde el servicio.
 *
 * Este método realiza una petición al servicio `ProsecService` para obtener los datos de las plantas
 * desde el archivo `plantasDatos.json`. Si la respuesta contiene la propiedad `plantasDatos` y es un
 * arreglo, asigna esos datos a la propiedad `plantasDatos` del componente. En caso contrario, o si ocurre
 * un error en la petición, la propiedad `plantasDatos` se inicializa como un arreglo vacío.
 *
 * @returns {void}
 */
recuperarDatos(): void { 
  const PAYLOAD = {
    "rfc_solicitante": "AAL0409235E6",
    "enitdad_federativa": this.forma.get('Estado')?.value,
    "planta_idc": "1"
  };

  this.prosecService.obtenerEstadoTablaDatos(PAYLOAD).pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        if (esValidObject(response)) {
          const API_DATOS = doDeepCopy(response);
          if (API_DATOS.codigo !== "00") {
            this.plantasDatos = [];
            return;
          }
          if (esValidObject(API_DATOS.datos) && Array.isArray(API_DATOS.datos.plantas)) {
              const PLANTAS_ARRAY = API_DATOS.datos.plantas;
              const PLANTAS_DATOS_ARRAY: FilaPlantas[] = PLANTAS_ARRAY.map((planta: any) => ({
                calle: planta.domicilioDto?.calle,
                numeroExterior: planta.domicilioDto?.numExterior,
                numeroInterior: planta.domicilioDto?.numInterior,
                codigoPostal: planta.domicilioDto?.codigoPostal,
                colonia: planta.domicilioDto?.coloniaEntity?.nombre,
                municipioOAlcaldia: planta.domicilioDto?.delegacionMunicipio?.nombre,
                pais: planta.domicilioDto?.pais?.nombre,
                registro: planta.domicilioDto?.entidadFederativa?.nombre,
                registroFederalDeContribuyentes: planta.empresaDto?.rfc,
                razonSocial: planta.empresaDto?.razonSocial,
                domicilioFiscalDelSolicitante: planta.empresaDto?.domicilioCompleto
              }));
              this.plantasDatos = PLANTAS_DATOS_ARRAY as FilaPlantas[];
              this.autorizacionProsecStore.setPlantasDatos(this.plantasDatos);
          } else {
            this.plantasDatos = [];
          }
        }
      }
    });
}
 /**
   * @method agregarPlantasconfirmar
   * @description
   * Oculta la alerta relacionada con la acción de agregar plantas seleccionadas a la lista PROSEC.
   * Se utiliza para cerrar el mensaje de advertencia cuando el usuario confirma la acción.
   */
  agregarPlantasconfirmar(): void {
    this.espectaculoAlertaAgregar = false
  }
/**   * Método para mostrar los domicilios de las plantas.
   * Este método llama a la función `recuperarDatos` para obtener y mostrar los domicilios de las plantas.
   * @returns {void}
   */
  public mostrarDomicilios(): void {
    if( this.forma.get('Estado')?.value.length === 0){
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona la Entidad Federativa.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
    else {
      this.espectaculoAlerta = false;
      this.recuperarDatos();
    }
  }

  /**
   * Método para agregar las plantas seleccionadas a la lista de plantas PROSEC.
   * Este método copia las plantas seleccionadas desde la lista `plantasDatos` a la lista `prosecDatos`
   * y luego limpia la lista `plantasDatos`.
   * @returns {void}
   */
 public agregarPlantas(): void {
  if (this.seleccionarProsecDisponiblesLista.length > 0) {
    const STORE_VALOR = this.autorizacionProsecStore.getValue();
    const CURRENT_PROSEC_DATOS = STORE_VALOR.prosecDatos || [];
    const SELECTED_DATOS = STORE_VALOR.selectedDatos || [];

    const MERGED_PROSEC_DATOS = [...CURRENT_PROSEC_DATOS, ...SELECTED_DATOS];

    const FILTERED_PLANTAS_DATOS = STORE_VALOR.plantasDatos.filter(
      (item) => !SELECTED_DATOS.includes(item)
    );

    this.autorizacionProsecStore.update((state) => ({
      ...state,
      plantasDatos: FILTERED_PLANTAS_DATOS,
      prosecDatos: MERGED_PROSEC_DATOS,
      selectedDatos: [],
    }));

    this.seleccionarProsecDisponiblesLista = [];
    this.espectaculoAlertaAgregar = false;
  } else {
    this.espectaculoAlertaAgregar = true;
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: '',
      mensaje: 'Selecciona al menos una planta donde se realizarán las operaciones PROSEC.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}
/**
   * @method seleccionTabla
   * @description
   * Actualiza la lista de plantas seleccionadas en la tabla dinámica y sincroniza el estado en el store.
   * @param {FilaPlantas[]} event - Arreglo de plantas seleccionadas.
   */
  seleccionTabla(event: FilaPlantas[]): void {
    this.seleccionarProsecDisponiblesLista = event;
    this.autorizacionProsecStore.update(
      (state) => ({
        ...state,
        selectedDatos: event
      })
    )
  }
  /**
   * Método para eliminar las plantas seleccionadas de la lista de plantas PROSEC.
   * Este método elimina las plantas que están en la lista `seleccionarProsecDisponiblesLista`
   * de la lista `plantasDatos` y luego limpia la lista `seleccionarProsecDisponiblesLista`.
   * @returns {void}
   */
  public eliminarPlantas(): void {
   
    if (this.seleccionarProsecDisponiblesLista.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona la planta que desea eliminar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.eliminarPlantasAlerta = true;
    }
    else if (this.seleccionarProsecDisponiblesLista.length > 0) {
      this.eliminarPlantasConfirmacion = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Estás seguro de eliminar la(s) planta(s)?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   *
   * Este método emite un valor y completa el Subject `destroyNotifier$` para cancelar todas las suscripciones
   * activas realizadas con `takeUntil(this.destroyNotifier$)`, evitando así posibles fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
    /**
   * @method validarFormulario
   * @description
   * Valida el formulario de domicilios de plantas. Si el formulario es válido, retorna `true`.
   * Si no es válido, marca todos los controles como tocados para mostrar los errores y retorna `false`.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
    validarFormulario(): boolean {
     if (!this.forma) {return false;}
      this.forma.markAllAsTouched();
      return this.forma.valid;
    }
   
     /**
       * @method eliminarPedimento
       * @description
       * Oculta la alerta de eliminación si el evento es verdadero.
       * @param {boolean} event - Indica si se debe ocultar la alerta.
       */
      eliminarPedimento(event: boolean): void {
        if (event === true) {
          this.eliminarPlantasAlerta = !event;
        }
      }
    
      /**
       * @method eliminarPedimentoDatos
       * @description
       * Elimina las plantas seleccionadas del estado y actualiza la lista en el store.
       * @param {boolean} event - Indica si se debe proceder con la eliminación.
       */
      eliminarPedimentoDatos(event: boolean): void {
        if (event === true) {
          this.eliminarPlantasConfirmacion = false;
          const VALOR = this.autorizacionProsecStore.getValue().prosecDatos;
          if (VALOR.length === 0) {
            return;
          }
          const FILTERED_VALOR = VALOR.filter(
            (item) => !this.autorizacionProsecStore.getValue().selectedDatos?.includes(item)
          );
          this.autorizacionProsecStore.update(
            (state) => ({
              ...state,
              prosecDatos: FILTERED_VALOR,
              selectedDatos: [],
            })
          );
          this.seleccionarProsecDisponiblesLista = [];
        }
        else {
          this.eliminarPlantasConfirmacion = false;
        }
      }
}
