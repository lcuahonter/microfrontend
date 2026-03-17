import { Catalogo, ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ExportarIlustraciones270101State, Tramite270101Store } from '../../../../estados/tramites/270101/tramite270101.store';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { MOTIVO_DE_LA_EXPORTACION } from '../../constantes/exportar-ilustraciones.enum';
import { Tramite270101Query } from '../../../../estados/queries/270101/tramite270101.query';

/**
  * @component MotivoDeLaExportacionComponent
  * @selector motivo-de-la-exportacion
  * @description
  * Este componente es responsable de gestionar y renderizar los datos relacionados con el motivo de la exportación 
  * en el proceso de exportación de obras de arte. Incluye formularios dinámicos para capturar información 
  * como el motivo y el nombre asociado.
  * 
  * Funcionalidades principales:
  * - Renderiza un formulario dinámico basado en la configuración definida en `MOTIVO_DE_LA_EXPORTACION`.
  * - Obtiene datos relacionados con el motivo de la exportación desde el servicio `ExportarIlustracionesService`.
  * - Maneja los cambios en los valores del formulario y actualiza el estado dinámico en el store.
  * 
  * Componentes importados:
  * - `FormasDinamicasComponent`: Componente para renderizar formularios dinámicos.
  * 
  * @templateUrl ./motivo-de-la-exportacion.component.html
  * @styleUrl ./motivo-de-la-exportacion.component.scss
  */
@Component({
  selector: 'motivo-de-la-exportacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './motivo-de-la-exportacion.component.html',
  styleUrl: './motivo-de-la-exportacion.component.scss',
})

export class MotivoDeLaExportacionComponent implements OnInit, OnDestroy {

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;

  /**
   * compo doc
   * @property motivoFormData
   * @type {ModeloDeFormaDinamica[]}
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `MOTIVO_DE_LA_EXPORTACION`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
    public motivoFormData = MOTIVO_DE_LA_EXPORTACION;

    /**
    * compo doc
    * @type {FormGroup}
    * @memberof RepresentacionFederalComponent
    * @description
    * Este es un formulario reactivo de Angular representado por un FormGroup.
    * Se utiliza para manejar y validar los datos del formulario en el componente.
    */
    public forma: FormGroup = new FormGroup({
      ninoFormGroup: new FormGroup({}),
    });
     
    /**
    * compo doc
    * @getter ninoFormGroup
    * @description
    * Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup`
    * dentro del formulario reactivo principal `forma`.
    * Se utiliza para acceder y manipular los controles y valores específicos de este grupo de formularios.
    *
    * @returns {FormGroup} El grupo de formularios `ninoFormGroup` como un objeto de tipo `FormGroup`.
    *
    * @example
    * const grupo = this.ninoFormGroup;
    * grupo.get('campo').setValue('nuevo valor');
    */
    get ninoFormGroup(): FormGroup {
      return this.forma.get('ninoFormGroup') as FormGroup;
    }

    /** Subject para destruir el componente */
    private destroy$ = new Subject<void>();
    
    /**
    * @property {Catalogo[]} motivoData
    * @description
    * Almacena los datos relacionados con las monedas.
    * @default []
    */
    public motivoData: Catalogo[] = [];

    /**
    * Estado de la solicitud de la sección 301.
    * @type {ExportarIlustraciones270101State}
    * @memberof MotivoDeLaExportacionComponent
    */
    public exportarIlustracionesState!: ExportarIlustraciones270101State;

    /**
  * @constructor
  * @description
  * Este constructor inicializa el componente `MotivoDeLaExportacionComponent` e inyecta los servicios necesarios 
  * para gestionar los datos y el estado del formulario relacionado con el motivo de la exportación.
  * 
  * Servicios inyectados:
  * - `ExportarIlustracionesService`: Servicio utilizado para obtener y gestionar datos relacionados con la exportación.
  * - `Tramite270101Store`: Servicio encargado de gestionar el estado dinámico asociado al trámite 270101.
  * - `Tramite270101Query`: Servicio utilizado para consultar datos específicos del estado del trámite 270101.
  * 
  * @param {ExportarIlustracionesService} exportarIlustracionesService - Servicio para gestionar datos de exportación.
  * @param {Tramite270101Store} tramite270101Store - Servicio para gestionar el estado dinámico del trámite.
  * @param {Tramite270101Query} tramite270101Query - Servicio para consultar datos del estado del trámite.
  */
  constructor(
    public exportarIlustracionesService: ExportarIlustracionesService,
    private tramite270101Store: Tramite270101Store,
    private tramite270101Query: Tramite270101Query
  ) {
    //
  }

    /**
  * @method ngOnInit
  * @description
  * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente 
  * después de que Angular haya inicializado todas las propiedades vinculadas al componente. 
  * En este caso, se utiliza para inicializar el estado del formulario, obtener datos relacionados 
  * con el motivo de la exportación y configurar las opciones del formulario dinámico.
  * 
  * Funcionalidad:
  * - Obtiene el estado actual del trámite desde `tramite270101Query`.
  * - Asigna los datos del motivo de la exportación obtenidos desde el servicio `ExportarIlustracionesService`.
  * - Configura las opciones del campo `motivo` en el formulario dinámico.
  * 
  * @example
  * ngOnInit(): void {
  *   this.tramite270101Query.selectExportarIlustraciones$
  *     .pipe(takeUntil(this.destroy$))
  *     .subscribe((seccionState) => {
  *       this.exportarIlustracionesState = seccionState;
  *     });
  * 
  *   this.exportarIlustracionesService.getMonedaData()
  *     .pipe(takeUntil(this.destroy$))
  *     .subscribe((data) => {
  *       this.motivoData = data;
  *       // Configura las opciones del campo `motivo`.
  *     });
  * }
  */
  ngOnInit(): void {
    this.tramite270101Query.selectExportarIlustraciones$
        .pipe(
            takeUntil(this.destroy$),
            map((seccionState) => {
                this.exportarIlustracionesState = seccionState;
            })
        )
        .subscribe();
    this.obtenerMonedadatos();
  }

  /**
  * @method obtenerMonedadatos
  * @description
  * Este método se utiliza para obtener los datos relacionados con las monedas desde el servicio 
  * `ExportarIlustracionesService` y asignarlos al campo `motivo` en el formulario dinámico.
  * 
  * Funcionalidad:
  * - Realiza una solicitud al servicio para obtener los datos de las monedas.
  * - Busca el campo `motivo` en la configuración del formulario dinámico.
  * - Asigna las opciones obtenidas al campo `motivo` si no están configuradas previamente.
  * - Utiliza `takeUntil` para gestionar la destrucción de las suscripciones y evitar fugas de memoria.
  * 
  * @example
  * this.obtenerMonedadatos();
  * // Obtiene los datos de las monedas y los asigna al campo `motivo` en el formulario dinámico.
  */
public obtenerMonedadatos(): void {
  this.exportarIlustracionesService.getMonedaData()
      .pipe(
          takeUntil(this.destroy$)
      )
      .subscribe((data) => {
          this.motivoData = data;
          const MOTIVO_FIELD = this.motivoFormData.find((datos: ModeloDeFormaDinamica) => datos.campo === 'motivo') as ModeloDeFormaDinamica;
          if (MOTIVO_FIELD) {
              if (!MOTIVO_FIELD.opciones) {
                  MOTIVO_FIELD.opciones = this.motivoData.map((item: { id: number; descripcion: string }) => ({
                      descripcion: item.descripcion,
                      id: item.id,
                  }));
              }
          }
      });
}

  /**
  * compo doc
  * @method establecerCambioDeValor
  * @description
  * Este método se utiliza para manejar los cambios en los valores de un formulario dinámico.
  * Recibe un evento que contiene el nombre del campo y su nuevo valor, y actualiza el estado
  * dinámico del formulario en el store correspondiente.
  * 
  * @param event - Un objeto que contiene el campo que ha cambiado y su nuevo valor.
  * El objeto tiene la estructura: `{ campo: string; valor: any }`.
  * 
  * @example
  * establecerCambioDeValor({ campo: 'nombre', valor: 'Juan' });
  * // Actualiza el campo 'nombre' con el valor 'Juan' en el store dinámico.
  */
    establecerCambioDeValor(event: { campo: string; valor: object | string}): void {
    if (event && this.ninoFormGroup.get('motivo')?.value) {
      const INDEX = this.motivoFormData.findIndex(item => item.campo === 'nombre');
      if (INDEX !== -1) {
        this.motivoFormData[INDEX] = { ...this.motivoFormData[INDEX], mostrar: true };
      }
      this.tramite270101Store.setDynamicFieldValue(event.campo, event.valor);
      this.exportarIlustracionesService.setForm('motivo', this.ninoFormGroup);
    }
  }

  /**
  * @method ngOnDestroy
  * @description
  * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente 
  * cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones 
  * activas y evitar fugas de memoria en la aplicación.
  * 
  * Funcionalidad:
  * - Notifica a través del `Subject` `destroy$` que el componente será destruido.
  * - Completa el `Subject` para liberar los recursos asociados.
  * 
  * @example
  * ngOnDestroy(): void {
  *   this.destroy$.next();
  *   this.destroy$.complete();
  * }
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
