import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { Catalogo, CatalogoSelectComponent, CatalogoServices, ConsultaioQuery, TituloComponent } from '@libs/shared/data-access-user/src';
import { Solicitud110203State, Tramite110203Store } from '../../../../estados/tramites/tramite110203.store';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';


/**
 * Componente que gestiona la visualización y actualización de los datos relacionados con el transporte para el trámite 110203.
 * Este componente permite la selección de un medio de transporte desde un catálogo y guarda los valores seleccionados
 * en el estado de la solicitud a través de un formulario reactivo.
 * 
 * @component
 * @example
 * <app-transporte-110203></app-transporte-110203>
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `FormsModule`: Módulo necesario para trabajar con formularios basados en plantillas.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 * - `CatalogoSelectComponent`: Componente para la selección de valores desde un catálogo.
 * 
 */
@Component({
  selector: 'app-transporte-110203',
  standalone: true,
  imports: [TituloComponent, FormsModule, ReactiveFormsModule, CatalogoSelectComponent],
  templateUrl: './transporte-110203.component.html',
  styleUrl: './transporte-110203.component.scss'
})

/**
 * Componente que maneja la visualización y actualización de los datos relacionados con el medio de transporte
 * para el trámite 110203. Utiliza un formulario reactivo para seleccionar el medio de transporte y persistir
 * estos datos en el estado de la solicitud.
 * 
 * @class
 * @implements OnInit, OnDestroy
 * @example
 * <app-transporte-110203></app-transporte-110203>
 * 
 * @constructor
 * El componente se inicializa con un formulario reactivo que contiene el campo 'medio', el cual se rellena
 * con los valores provenientes del estado de la solicitud 110203. Además, se obtiene la lista de medios de transporte
 * desde un archivo JSON (mediocatalogo.json).
 * 
 * @property {FormGroup} transporteForm - Formulario reactivo que gestiona el campo 'medio' para el transporte.
 * @property {Catalogo[]} medio - Lista de opciones de medios de transporte cargadas desde el archivo JSON.
 * @property {Solicitud110203State} solicitudState - Estado de la solicitud 110203 que contiene los valores actuales de la solicitud.
 * @property {Subject<void>} destroyNotifier$ - Subject utilizado para gestionar la destrucción del componente.
 * 
 * @method ngOnInit() - Inicializa el formulario reactivo con los valores actuales del estado de la solicitud.
 * @method inicializarFormulario() - Inicializa el formulario reactivo con el valor 'medio' del estado de la solicitud.
 * @method setValoresStore() - Actualiza el store del trámite con el valor de un campo específico del formulario.
 * @method ngOnDestroy() - Se ejecuta cuando el componente es destruido. Limpia los recursos y previene memory leaks.
 */
export class Transporte110203Component implements OnInit, OnDestroy {
  
  /**
   * Formulario reactivo que gestiona el campo 'medio' para el transporte.
   * El campo 'medio' es el único control en este formulario.
   */
  transporteForm!: FormGroup;

  /**
   * Lista de opciones de medios de transporte cargadas desde un archivo JSON.
   * Cada opción representa un medio de transporte que el usuario puede seleccionar.
   */
  public medioOptions: Catalogo[] = [];

  /**
   * Estado de la solicitud 110203, que contiene el valor actual del campo 'medio'.
   */
  public solicitudState!: Solicitud110203State;

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente. Inicializa el formulario reactivo y configura las dependencias necesarias.
   * 
   * @param fb - FormBuilder utilizado para crear el formulario reactivo.
   * @param tramite110203Store - Store que gestiona los valores persistentes del trámite 110203.
   * @param tramite110203Query - Query que se utiliza para obtener el estado actual de la solicitud 110203.
   */

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  /**
   * Identificador único del trámite asociado a este componente.
   * @default '110203'
   */
  tramites: string = '110203';

  /**
   * Inicializa el componente Transporte110203Component.
   *
   * @param fb - Servicio FormBuilder para crear formularios reactivos.
   * @param tramite110203Store - Servicio Store para gestionar el estado de Tramite110203.
   * @param tramite110203Query - Servicio Query para acceder al estado de Tramite110203.
   * @param consultaioQuery - Servicio Query para acceder al estado de Consultaio.
   *
   * Se suscribe al estado de Consultaio para:
   * - Actualizar la propiedad `esFormularioSoloLectura` según el estado `readonly`.
   * - Llamar a `inicializarEstadoFormulario()` para aplicar configuraciones según el estado recibido.
   * - Cancelar la suscripción automáticamente cuando `destroyNotifier$` emite, para evitar fugas de memoria.
   */
  constructor(
    private fb: FormBuilder,
    private tramite110203Store: Tramite110203Store,
    private tramite110203Query: Tramite110203Query,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices
  ) {
     /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Se ejecuta cuando el componente se inicializa. Llama al método `inicializarFormulario` para cargar los valores
   * predeterminados en el formulario y establece la lista de opciones de medio de transporte.
   */
  ngOnInit(): void {
    this.obtenerMedioTransporte()
    this.inicializarFormulario();
  }

  /**
   * Método que inicializa el formulario reactivo con el valor actual del campo 'medio' desde el estado de la solicitud.
   * El formulario contiene solo un campo: 'medio', que es el medio de transporte seleccionado.
   */
  private inicializarFormulario(): void {
    this.tramite110203Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Solicitud110203State;
        })
      )
      .subscribe();

    // Inicializa el formulario con el valor 'medio' del estado de la solicitud
    this.transporteForm = this.fb.group({
      medio: [this.solicitudState.medio],
    });
  }

  /**
   * Método para actualizar el store del trámite con el valor de un campo específico del formulario.
   * 
   * @param form - Formulario que contiene los valores.
   * @param campo - Nombre del campo del formulario.
   * @param metodoNombre - Nombre del método del store que se utilizará para guardar el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite110203Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite110203Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Obtiene el catálogo de medios de transporte utilizando el servicio `catalogoService`
   * y actualiza la propiedad `medio` con los datos recibidos.
   * 
   * Realiza la petición pasando los trámites actuales (`this.tramites`) y gestiona la suscripción
   * para que se cancele automáticamente cuando el componente se destruya, usando `destroyNotifier$`.
   * 
   * @remarks
   * Los datos recibidos se asignan a la propiedad `medio`. Si la respuesta no contiene datos,
   * se asigna un arreglo vacío.
   */
  obtenerMedioTransporte(): void {
    this.catalogoService.medioTransporteCatalogo(this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.medioOptions = response?.datos ?? [];
        }
      });
  }

  /**
   * Se ejecuta cuando el componente es destruido. Se limpia el `destroyNotifier$` para evitar memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
