

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject,map,takeUntil } from 'rxjs';

import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { DATOS_SOLICITUD ,Mercancia } from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';
import { CONFIGURATION_TABLA_MERCANCIAS} from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { Solicitud221602State, Tramite221602Store } from '../../../../estados/tramites/tramite221602.store';
import { Tramite221602Query } from '../../../../estados/queries/tramite221602.query';
import realizar from '@libs/shared/theme/assets/json/221602/realizar.json';



/**
 * Componente que gestiona la visualización y el manejo de los datos de la solicitud 221602, incluyendo 
 * la gestión de mercancías y la visualización de una tabla dinámica con los requisitos y detalles de las mercancías.
 * 
 * Este componente utiliza formularios reactivos para capturar los datos de la solicitud y gestionar el estado
 * de los campos. También incluye la opción de mostrar/ocultar contenido relacionado con la solicitud.
 * 
 * @component
 * @example
 * <app-datos-de-la-solicitud></app-datos-de-la-solicitud>
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `FormsModule`: Módulo necesario para trabajar con formularios basados en plantillas.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 * - `TablaDinamicaComponent`: Componente para la visualización de tablas dinámicas.
 * - `CatalogoSelectComponent`: Componente para seleccionar valores de un catálogo.
 * - `AlertComponent`: Componente para mostrar alertas.
 * - `CommonModule`: Módulo común de Angular que permite utilizar directivas comunes como `ngIf`, `ngFor`, etc.
 * 
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    TituloComponent,
    TablaDinamicaComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    AlertComponent,
    CommonModule
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrls: ['./datos-de-la-solicitud.component.scss']
})

/**
 * Componente que maneja la visualización y actualización de los datos relacionados con la solicitud 221602.
 * Utiliza un formulario reactivo para capturar y persistir la información relacionada con la solicitud.
 * También incluye un modal para mostrar las mercancías y gestionar ciertos campos del formulario.
 * 
 * @class
 * @implements OnInit, OnDestroy
 * @example
 * <app-datos-de-la-solicitud></app-datos-de-la-solicitud>
 * 
 * @constructor
 * El componente se inicializa con un formulario reactivo que gestiona los datos de la solicitud, como justificación,
 * aduana, oficina y punto. También maneja la visualización de la tabla dinámica que contiene la lista de mercancías.
 * 
 * @property {FormGroup} TramitesForm - Formulario reactivo que gestiona los datos de la solicitud, como justificación,
 * aduana, oficina, etc.
 * @property {Catalogo[]} regimen - Lista de opciones de régimen obtenidas del catálogo.
 * @property {Mercancia[]} mercancias - Lista de mercancías obtenidas de un catálogo.
 * @property {ConfiguracionColumna<Mercancia>[]} configuracionTabla - Configuración de las columnas para la tabla dinámica.
 * @property {Solicitud221602State} solicitudState - Estado de la solicitud 221602 que contiene los valores actuales de la solicitud.
 * @property {string} TEXTOS - Contiene los datos relacionados con la solicitud (generalmente un texto descriptivo).
 * @property {boolean} showContent - Controla la visibilidad del contenido relacionado con la solicitud.
 * 
 * @method toggleContent() - Método que cambia la visibilidad del contenido asociado a la solicitud.
 * @method ngOnInit() - Inicializa el formulario reactivo y carga los datos de la solicitud.
 * @method setValoresStore() - Actualiza el store del trámite con el valor de un campo específico del formulario.
 * @method ngOnDestroy() - Se ejecuta cuando el componente es destruido. Limpia los recursos y previene memory leaks.
 */
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {

  /**
   * Lista de opciones de régimen obtenidas de un catálogo.
   */
  public regimen: Catalogo[] = realizar.regimen;

  /**
   * Estado de la solicitud 221602, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: Solicitud221602State;

  /**
   * Formulario reactivo que gestiona los datos de la solicitud.
   */
  TramitesForm!: FormGroup;

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constante para definir el tipo de selección de tabla (checkbox).
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Texto que contiene los datos de la solicitud.
   */
  TEXTOS: string = DATOS_SOLICITUD;

  /**
   * Variable para mostrar u ocultar el contenido de la solicitud.
   */
  showContent = true;

  /**
   * Lista de mercancías obtenidas del catálogo.
   */
  mercancias: Mercancia[] =realizar.mercancias;

  /**
   * Configuración de las columnas para la tabla dinámica que muestra las mercancías.
   */
  configuracionTabla: ConfiguracionColumna<Mercancia>[] = CONFIGURATION_TABLA_MERCANCIAS;
   /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente. Inicializa el formulario reactivo y configura las dependencias necesarias.
   * 
   * @param fb - FormBuilder utilizado para crear el formulario reactivo.
   * @param tramite221602Store - Store que gestiona los valores persistentes del trámite 221602.
   * @param tramite221602Query - Query que se utiliza para obtener el estado actual de la solicitud 221602.
   */
  constructor(
    private fb: FormBuilder,
    private tramite221602Store: Tramite221602Store,
    private tramite221602Query: Tramite221602Query,
     private consultaioQuery: ConsultaioQuery,
        ) { 
       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        
          this.inicializarCertificadoFormulario();
        })
      )
      .subscribe();
    }
     /**
   * Método que se ejecuta cuando el componente es inicializado.
   * 
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarCertificadoFormulario();
  }
   /**
   * Método para inicializar el formulario reactivo con los datos de la solicitud.
   * 
   * Este método configura los campos del formulario con los valores actuales del estado de la solicitud
   * y aplica las validaciones necesarias. También deshabilita ciertos campos y establece valores predeterminados.
   */
  inicializarCertificadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
     this.inicializarFormulario();
    }  
  }
  /**
   * @comdoc
   * Guarda los datos del formulario de combinación requerida.
   * 
   * Inicializa el formulario y ajusta su estado de habilitación según si es de solo lectura.
   * - Si el formulario es de solo lectura, lo deshabilita.
   * - Si no es de solo lectura, lo habilita.
   * - Si no aplica ninguna de las condiciones anteriores, no realiza ninguna acción adicional.
   */
  guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.TramitesForm.disable();
   
      } else {
        this.TramitesForm.enable();
      
      }
  }
  /**
   * Método que abre o cierra el contenido de la solicitud.
   */
  public toggleContent(): void {
    this.showContent = !this.showContent;
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales del estado de la solicitud.
   * 
   * Carga los datos de la solicitud, como justificación, aduana, oficina, punto, y régimen.
   */
  private inicializarFormulario(): void {
    this.tramite221602Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Solicitud221602State;
        })
      )
      .subscribe();

    this.TramitesForm = this.fb.group({
      justificacion: [this.solicitudState.justificacion, Validators.required],
      aduana: [this.solicitudState.aduana, Validators.required],
      oficina: [this.solicitudState.oficina, Validators.required],
      punto: [this.solicitudState.punto, Validators.required],
      guia: [this.solicitudState.guia],
      regimen: [this.solicitudState.regimen, Validators.required],
      carro: [this.solicitudState.carro]
    });

    this.TramitesForm.get('punto')?.disable();
    this.TramitesForm.get('aduana')?.disable();
    this.TramitesForm.get('oficina')?.disable();
    this.TramitesForm.get('aduana')?.setValue(realizar.formData.aduana);
    this.TramitesForm.get('oficina')?.setValue(realizar.formData.oficina);
    this.TramitesForm.get('punto')?.setValue(realizar.formData.punto);
  }

  /**
   * Método que actualiza los valores del store con los datos del formulario.
   * 
   * @param form - Formulario reactivo con los datos actuales.
   * @param campo - El campo que debe actualizarse en el store.
   * @param metodoNombre - El nombre del método en el store que se debe invocar.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite221602Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite221602Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método que se ejecuta cuando el componente es destruido. Limpia los recursos y previene memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
