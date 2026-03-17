import { Catalogo, TablaSeleccion,doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { ComplementarPlantaState, ComplementoDePlanta, MontoDeInversion } from '../../../../shared/constantes/complementar-planta.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FEDERATARIOS,
  FederatariosEncabezado,
  PLANTAS_DIPONIBLES,
  PLANTAS_IMMEX,
  PlantasDisponibles,
  PlantasImmex,
} from '../../../../shared/models/federatarios-y-plantas.model';
import { CapacidadInstalada } from '../../../../shared/constantes/capacidad-instalada.enum';
import { Directos } from '../../../../shared/constantes/empleados.enum';

import { Observable, Subject, takeUntil } from 'rxjs';
import { ComplimentosService } from '../../../../shared/services/complimentos.service';
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
  styleUrl: './federatarios-y-plantas-vista.component.css',
})
export class FederatariosYPlantasVistaComponent implements OnInit, OnDestroy {

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
   * Catálogo de estados disponibles.
   * 
   * Esta propiedad contiene un arreglo de objetos de tipo `Catalogo` que representan los estados disponibles
   * para selección en la interfaz. Cada objeto incluye un identificador único (`id`) y una descripción del estado.
   * 
   * @type {Catalogo[]}
   */
  public estadosCatalogos: Catalogo[] = [{ "id": 1, "descripcion": "JALISCO" }];

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
    /** 
     * Estado seleccionado actualmente. 
     */
    public estadoValor: string = '';

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
   * 
   * @param datos - Objeto de tipo `FederatariosEncabezado` que contiene la información
   *                de los federatarios a ser almacenada.
   */
  setFormaDatos(datos: FederatariosEncabezado): void {
    this.store.setFederatarios(datos);
  }

  /**
   * Establece los datos de las plantas disponibles en el almacén.
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
          }
        }
      }, (error) => {
        console.error('Error al obtener los plantas disponibles:', error);
      });
  }

  /** 
   * Establece los datos de las plantas IMMEX en el almacén.
   */
  setPlantasImmexDatos(datos: PlantasImmex[]): void {
    this.store.setPlantasImmexTablaLista(datos);
  }

/**
 * Establece los datos complementarios de plantas en el almacén.
 * 
 * @param event - Lista de datos complementarios de planta a almacenar.
 */
  setComplementarPlantaList(event: ComplementoDePlanta[]): void {
    this.store.setComplementarPlantaDatos(event);
  }

/**
 * Establece los datos de firmantes en el almacén.
 * 
 * @param event - Lista de datos de firmantes a almacenar.
 */
  setFirmantesList(event: ComplementarPlantaState[]): void {
    this.store.setFirmantesDatos(event);
  }

/**
 * Establece los datos de montos de inversión en el almacén.
 * 
 * @param event - Lista de montos de inversión a almacenar.
 */
  setMontosInversionList(event: MontoDeInversion[]): void {
    this.store.setMontosInversionDatos(event);
  }

 /**
 * Establece los datos de empleados directos en el almacén.
 * 
 * @param event - Lista de empleados directos a almacenar.
 */
  setEmpleadosList(event: Directos[]): void {
    this.store.setEmpleadosDatos(event);
  }

  /**
   * Establece los datos de los federatarios y actualiza el estado seleccionado.
   * @param {FederatariosEncabezado} datos - Datos del encabezado de federatarios.
   * @returns {void}
   */
  setDatosFederatarios(datos: FederatariosEncabezado): void {
    this.estadoValor = datos.estadoDos;
    this.store.setFederatariosCatalogo(datos);
  }

  /**
   * Actualiza la lista de capacidad instalada en la tabla utilizando el evento recibido.
   *
   * @param event - Arreglo de objetos de tipo `CapacidadInstalada` que representa la nueva lista de capacidad instalada.
   */

    obtenerCapacidadInstaladaTablaList(event: CapacidadInstalada[]): void {
      this.store.setCapacidadInstaladaTableLista(event);
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
