
import { Catalogo, CatalogoSelectComponent,TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud221602State, Tramite221602Store } from '../../../../estados/tramites/tramite221602.store';
import { Subject,map,takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite221602Query } from '../../../../estados/queries/tramite221602.query';
import realizar from '@libs/shared/theme/assets/json/221602/realizar.json';

/**
 * Componente encargado de la gestión de la movilización de mercancías, permitiendo seleccionar el medio de transporte, 
 * verificación, y empresa relacionada con la solicitud 221602.
 * 
 * Este componente utiliza un formulario reactivo para gestionar los datos de la movilización, permitiendo 
 * a los usuarios seleccionar opciones como el medio de transporte, verificación y empresa.
 * 
 * @component
 * @example
 * <app-movilizacion></app-movilizacion>
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `FormsModule`: Módulo necesario para trabajar con formularios basados en plantillas.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 * - `CatalogoSelectComponent`: Componente para seleccionar valores de un catálogo.
 * 
 */
@Component({
  selector: 'app-movilizacion',
  standalone: true,
  imports: [
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent
  ],
  templateUrl: './movilizacion.component.html',
  styleUrls: ['./movilizacion.component.scss']
})

/**
 * Componente que maneja la movilización de mercancías en el contexto de la solicitud 221602.
 * Utiliza un formulario reactivo para gestionar los datos de la movilización, como el medio de transporte, 
 * la verificación y la empresa. También interactúa con el store para actualizar el estado del trámite.
 * 
 * @class
 * @implements OnInit
 * @example
 * <app-movilizacion></app-movilizacion>
 * 
 * @constructor
 * El constructor inicializa el formulario reactivo y configura las dependencias necesarias para gestionar los
 * datos de la solicitud y la movilización de mercancías.
 * 
 * @property {FormGroup} MedioForm - Formulario reactivo que gestiona los datos de la movilización, como el medio
 * de transporte, verificación y empresa.
 * @property {Catalogo[]} medio - Lista de opciones de medio de transporte obtenidas del catálogo.
 * @property {Catalogo[]} verificacion - Lista de opciones de verificación obtenidas del catálogo.
 * @property {Solicitud221602State} solicitudState - Estado de la solicitud 221602 que contiene los valores actuales de la solicitud.
 * 
 * @method ngOnInit() - Método que se ejecuta cuando el componente es inicializado. Inicializa el formulario reactivo
 * y carga los datos de la solicitud.
 * @method setValoresStore() - Método para actualizar el store del trámite con los valores del formulario.
 */
export class MovilizacionComponent implements OnInit, OnDestroy {
 /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;
  /**
   * Lista de opciones de medio de transporte obtenidas de un catálogo.
   */
  public medio: Catalogo[] = realizar.medio;

  /**
   * Lista de opciones de verificación obtenidas de un catálogo.
   */
  public verificacion: Catalogo[] = realizar.verificacion;

  /**
   * Estado de la solicitud 221602, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: Solicitud221602State;

  /**
   * Formulario reactivo que gestiona los datos de la movilización.
   */
  MedioForm!: FormGroup;

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente. Inicializa las dependencias necesarias y prepara el formulario reactivo.
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
        this.MedioForm.disable();
      } else {
        this.MedioForm.enable();        
      }
  }
 

  /**
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   * 
   * Configura el formulario para gestionar los campos relacionados con la movilización, como medio, transporte,
   * verificación y empresa. También asigna valores predeterminados a algunos campos.
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

    this.MedioForm = this.fb.group({
      medio: [this.solicitudState.medio, Validators.required],
      transporte: [this.solicitudState.transporte, Validators.required],
      verificacion: [this.solicitudState.verificacion, Validators.required],
      empresa: [this.solicitudState.empresa, Validators.required]
    });

    this.MedioForm.get('empresa')?.setValue(realizar.formData.empresa);
  }

  /**
   * Método que actualiza el store con los valores del formulario.
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
