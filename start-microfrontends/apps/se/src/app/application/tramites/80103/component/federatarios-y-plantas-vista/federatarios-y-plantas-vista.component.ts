
/* 
 * Importa interfaces compartidas de catálogos y tablas de selección
 * desde la librería de acceso a datos del usuario.
 */
import { ComplementarPlantaState, ComplementoDePlanta, MontoDeInversion } from '../../../../shared/constantes/complementar-planta.enum';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FEDERATARIOS, FederatariosEncabezado, PLANTAS_DIPONIBLES, PLANTAS_IMMEX, PlantasDisponibles, PlantasImmex } from '../../../../shared/models/federatarios-y-plantas.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TablaSeleccion,doDeepCopy, esValidArray, esValidObject } from '@libs/shared/data-access-user/src';
import { CapacidadInstalada } from '../../../../shared/constantes/capacidad-instalada.enum';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../../../shared/services/complimentos.service';
import { Directos } from '../../../../shared/constantes/empleados.enum';
import { FederatariosYPlantasComponent } from '../../../../shared/components/federatarios-y-planta/federatarios-y-plantas.component';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
/**
 * Componente para la vista de federatarios y plantas
 * @export FederatariosYPlantasVistaComponent
 * */
@Component({
  selector: 'app-federatarios-y-plantas-vista',
  standalone: true,
  imports: [CommonModule, FederatariosYPlantasComponent],
  templateUrl: './federatarios-y-plantas-vista.component.html',
  styleUrl: './federatarios-y-plantas-vista.component.scss',
})
/** Componente que muestra la vista combinada de federatarios y plantas.  
 * Maneja la visualización y gestión de datos relacionados desde el store. */
export class FederatariosYPlantasVistaComponent implements OnInit,OnDestroy {

  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.Add commentMore actions
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Datos de federatarios que se mostrarán en la tabla
   * @property {FederatariosEncabezado} datosFederatarios
   */
  public datosFederatarios!: FederatariosEncabezado;

    /**
     * Notificador utilizado para manejar la destrucción o desuscripción de observables.
     * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
     *
     * @property {Subject<void>} destroyNotifier$
     */
    private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Configuración de la tabla de federatarios
   * @property {Object} federatariosTablaConfiguracion
   */
  public federatariosTablaConfiguracion = {
    TablaSeleccion: TablaSeleccion.CHECKBOX,
    TablaEncabezado: FEDERATARIOS,
  };

  /**
   * Configuración de la tabla de plantas disponibles
   * @property {Object} plantasDisponiblesTablaConfiguracion
   */
  public plantasDisponiblesTablaConfiguracion = {
    TablaSeleccion: TablaSeleccion.CHECKBOX,
    TablaEncabezado: PLANTAS_DIPONIBLES,
  };

  /**
   * Configuración de la tabla de plantas IMMEX
   * @property {Object} plantasImmexTablaConfiguracion
   */
  public plantasImmexTablaConfiguracion = {
    TablaSeleccion: TablaSeleccion.CHECKBOX,
    TablaEncabezado: PLANTAS_IMMEX,
  };

  /**
   * Lista de federatarios para mostrar en la tabla
   * @property {FederatariosEncabezado[]} federatariosTablaLista
   */
  public federatariosTablaLista: FederatariosEncabezado[] = [];

  /**
   * Lista de plantas disponibles para mostrar en la tabla
   * @property {PlantasDisponibles[]} plantasDisponiblesTablaLista
   */
  public plantasDisponiblesTablaLista: PlantasDisponibles[] = [];

  /**
   * Lista de plantas IMMEX para mostrar en la tabla
   * @property {PlantasImmex[]} plantasImmexTablaLista
   */
  public plantasImmexTablaLista: PlantasImmex[] = [];
    /**
   * Lista de federatarios para mostrar en la tabla
   * @property {FederatariosEncabezado[]} federatariosTablaLista
   */
    public federatariosTablaLista$!: Observable<FederatariosEncabezado[]>;
    /** 
   * Lista de plantas disponibles para mostrar en la tabla
   * @property {PlantasDisponibles[]} plantasDisponiblesTablaLista
   */
    public plantasDisponiblesTablaLista$!: Observable<PlantasDisponibles[]>;
    /** 
   * Lista de plantas IMMEX para mostrar en la tabla
   * @property {PlantasImmex[]} plantasImmexTablaLista
   */
    public plantasImmexTablaLista$!: Observable<PlantasImmex[]>;

    /** Estado seleccionado actualmente. */
    public estadoValor: string = '';
/** Inyecta el store y query del trámite 80101 para gestionar el estado.  
 * Inicializa el observable para la lista de federatarios desde el query. */
  constructor(
    private store: Tramite80101Store, 
    private query: Tramite80101Query,
    private _complimentoSvc: ComplimentosService
  ) {

  }

  /** 
   * Suscripción al ciclo de vida de Angular para inicializar datos al cargar el componente. 
   */
  ngOnInit(): void {
    this.federatariosTablaLista$ = this.query.selectDatosFederatarios$;
    this.plantasDisponiblesTablaLista$ = this.query.selectDatosPlantasDisponibles$;
    this.plantasImmexTablaLista$ = this.query.selectDatosPlantasImmex$;
    this.query.selectDatosFederatariosFormulario$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.datosFederatarios = datos;
      });
  }

  /**
   * Establece los datos de los federatarios en el almacén.
   * También captura los datos del FormControl para almacenarlos en el store.
   * 
   * @param datos - Objeto de tipo `FederatariosEncabezado` que contiene la información
   *                de los federatarios a ser almacenada.
   */
  setFormaDatos(datos: FederatariosEncabezado): void {
    this.store.setFederatarios(datos);
    
    // Capturar los datos del FormControl de federatarios
    this.captureFederatariosFormControlData(datos, 'federatariosForm');
  }


    /**
   * Establece los datos de las plantas disponibles en el almacén.
   * También captura los datos del FormControl para almacenarlos en el store.
   */
  setPlantasDisponiblesDatos(): void {
    const PAYLOAD = {
        "rfcEmpresaSubManufacturera": "AAL0409235E6",
        "entidadFederativa": this.estadoValor,
        "idPrograma": null
    }
    this._complimentoSvc.getPlantasDisponibles(PAYLOAD).pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if(esValidObject(response)) {
          const API_DATOS = doDeepCopy(response);
          if(esValidArray(API_DATOS.datos)) {
            const DATOS: PlantasDisponibles[] = this._complimentoSvc.mapApiResponseToPlantasDisponibles(API_DATOS.datos);
            this.store.setPlantasDisponiblesTablaLista(DATOS);
            // Capturar los datos del FormControl de plantas disponibles
            this.capturePlantasDisponiblesFormControlData(DATOS);
          }
        }
      }, (error) => {
        console.error('Error al obtener los plantas disponibles:', error);
      });
  }

  /** 
   * Establece los datos de las plantas IMMEX en el almacén.
   * También captura los datos del FormControl para almacenarlos en el store.
   */
  setPlantasImmexDatos(datos: PlantasImmex[]): void {
    this.store.setPlantasImmexTablaLista(datos);
    
    // Capturar los datos del FormControl de plantas IMMEX
    this.capturePlantasImmexFormControlData(datos);
  }

/**
 * Establece los datos complementarios de plantas en el almacén.
 * También captura los datos del FormControl para almacenarlos en el store.
 * 
 * @param event - Lista de datos complementarios de planta a almacenar.
 */
  setComplementarPlantaList(event: ComplementoDePlanta[]): void {
    this.store.setComplementarPlantaDatos(event);
    
    // Capturar los datos del FormControl de complementar planta
    this.captureComplementarPlantaFormControlData(event);
  }

/**
 * Establece los datos de firmantes en el almacén.
 * También captura los datos del FormControl para almacenarlos en el store.
 * 
 * @param event - Lista de datos de firmantes a almacenar.
 */
  setFirmantesList(event: ComplementarPlantaState[]): void {
    this.store.setFirmantesDatos(event);
    
    // Capturar los datos del FormControl de firmantes
    this.captureFirmantesFormControlData(event);
  }

/**
 * Establece los datos de montos de inversión en el almacén.
 * 
 * @param event - Lista de montos de inversión a almacenar.
 */
  setMontosInversionList(event: MontoDeInversion[]): void {
    this.store.setMontosInversionDatos(event);
    
    // Capturar los datos del FormControl de montos de inversión
    this.captureMontosInversionFormControlData(event);
  }

 /**
 * Establece los datos de empleados directos en el almacén.
 * También captura los datos del FormControl para almacenarlos en el store.
 * 
 * @param event - Lista de empleados directos a almacenar.
 */
  setEmpleadosList(event: Directos[]): void {
    this.store.setEmpleadosDatos(event);
    
    // Capturar los datos del FormControl de empleados
    this.captureEmpleadosFormControlData(event);
  }
  
  /**
   * Establece los datos de los federatarios y actualiza el estado seleccionado.
   * @param {FederatariosEncabezado} datos - Datos del encabezado de federatarios.
   * @returns {void}
   */
  setDatosFederatarios(datos: FederatariosEncabezado): void {
    this.estadoValor = datos.estadoDos;
    this.store.setFederatariosCatalogo(datos);
    
    // Capturar los datos del FormControl de federatarios
    this.captureFederatariosFormControlData(datos, 'federatariosEvent');
  }

  /**
   * Captura y almacena los datos del FormControl de federatarios.
   * @param {FederatariosEncabezado} data - Datos de federatarios
   * @param {string} source - Fuente del evento
   */
  private captureFederatariosFormControlData(data: FederatariosEncabezado, source: string): void {
    const formControlData: { [key: string]: any } = {
      federatariosData: data,
      timestamp: new Date().toISOString(),
      source: source,
      
      // Campos específicos de federatarios
      nombre: data.nombre || '',
      primerApellido: data.primerApellido || '',
      segundoApellido: data.segundoApellido || '',
      numeroDeActa: data.numeroDeActa || '',
      fechaDelActa: data.fechaDelActa || '',
      numeroDeNotaria: data.numeroDeNotaria || '',
      entidadFederativa: data.entidadFederativa || '',
      municipioODelegacion: data.municipioODelegacion || '',
      estado: data.estado || '',
      estadoOptions: data.estadoOptions || '',
      estadoUno: data.estadoUno || '',
      estadoDos: data.estadoDos || '',
      estadoTres: data.estadoTres || '',
    };

    this.store.updateFederatariosFormControlField('federatarios', formControlData);
  }

  /**
   * Captura y almacena los datos del FormControl de plantas disponibles.
   * @param {PlantasDisponibles[]} data - Datos de plantas disponibles
   */
  private capturePlantasDisponiblesFormControlData(data: PlantasDisponibles[]): void {
    const formControlData: { [key: string]: any } = {
      plantasDisponiblesData: data,
      timestamp: new Date().toISOString(),
      count: data?.length || 0,
      rfcEmpresaSubManufacturera: "AAL0409235E6",
      entidadFederativa: this.estadoValor,
    };

    if (data && data.length > 0) {
      formControlData['firstPlantaDisponible'] = data[0];
    }

    this.store.updateFederatariosFormControlField('plantasDisponibles', formControlData);
  }

  /**
   * Captura y almacena los datos del FormControl de plantas IMMEX.
   * @param {PlantasImmex[]} data - Datos de plantas IMMEX
   */
  private capturePlantasImmexFormControlData(data: PlantasImmex[]): void {
    const formControlData: { [key: string]: any } = {
      plantasImmexData: data,
      timestamp: new Date().toISOString(),
      count: data?.length || 0,
    };

    if (data && data.length > 0) {
      formControlData['firstPlantaImmex'] = data[0];
    }

    this.store.updateFederatariosFormControlField('plantasImmex', formControlData);
  }

  /**
   * Captura y almacena los datos del FormControl de complementar planta.
   * @param {ComplementoDePlanta[]} data - Datos de complementar planta
   */
  private captureComplementarPlantaFormControlData(data: ComplementoDePlanta[]): void {
    const formControlData: { [key: string]: any } = {
      complementarPlantaData: data,
      timestamp: new Date().toISOString(),
      count: data?.length || 0,
    };

    if (data && data.length > 0) {
      formControlData['firstComplementarPlanta'] = data[0];
    }

    this.store.updateFederatariosFormControlField('complementarPlanta', formControlData);
  }

  /**
   * Captura y almacena los datos del FormControl de firmantes.
   * @param {ComplementarPlantaState[]} data - Datos de firmantes
   */
  private captureFirmantesFormControlData(data: ComplementarPlantaState[]): void {
    const formControlData: { [key: string]: any } = {
      firmantesData: data,
      timestamp: new Date().toISOString(),
      count: data?.length || 0,
    };

    if (data && data.length > 0) {
      formControlData['firstFirmante'] = data[0];
    }

    this.store.updateFederatariosFormControlField('firmantes', formControlData);
  }

  /**
   * Captura y almacena los datos del FormControl de montos de inversión.
   * @param {MontoDeInversion[]} data - Datos de montos de inversión
   */
  private captureMontosInversionFormControlData(data: MontoDeInversion[]): void {
    const formControlData: { [key: string]: any } = {
      montosInversionData: data,
      timestamp: new Date().toISOString(),
      count: data?.length || 0,
    };

    if (data && data.length > 0) {
      formControlData['firstMontoInversion'] = data[0];
    }

    this.store.updateFederatariosFormControlField('montosInversion', formControlData);
  }

  /**
   * Captura y almacena los datos del FormControl de empleados.
   * @param {Directos[]} data - Datos de empleados
   */
  private captureEmpleadosFormControlData(data: Directos[]): void {
    const formControlData: { [key: string]: any } = {
      empleadosData: data,
      timestamp: new Date().toISOString(),
      count: data?.length || 0,
    };

    if (data && data.length > 0) {
      formControlData['firstEmpleado'] = data[0];
    }

    this.store.updateFederatariosFormControlField('empleados', formControlData);
  }

  /**
   * Captura y almacena los datos del FormControl de capacidad instalada.
   * @param {CapacidadInstalada[]} data - Datos de capacidad instalada
   */
  private captureCapacidadInstaladaFormControlData(data: CapacidadInstalada[]): void {
    const formControlData: { [key: string]: any } = {
      capacidadInstaladaData: data,
      timestamp: new Date().toISOString(),
      count: data?.length || 0,
    };

    if (data && data.length > 0) {
      formControlData['firstCapacidadInstalada'] = data[0];
    }

    this.store.updateFederatariosFormControlField('capacidadInstalada', formControlData);
  }

  /**
   * Cierra el popup de capacidad instalada.
   * Establece la variable `mostrarCapacidadInstaladaPopup` a `false` para ocultar el popup.
   * También captura los datos del FormControl para almacenarlos en el store.
   */
  obtenerCapacidadInstaladaTablaList(event: CapacidadInstalada[]): void {
    this.store.setCapacidadInstaladaTableLista(event);
    
    // Capturar los datos del FormControl de capacidad instalada
    this.captureCapacidadInstaladaFormControlData(event);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación a través del observable `destroyNotifier$` para limpiar suscripciones
   * y otros recursos, y luego completa el observable para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
