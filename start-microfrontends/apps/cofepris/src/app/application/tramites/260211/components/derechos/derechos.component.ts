import { Component, OnDestroy, OnInit } from '@angular/core'; // Import Angular core decorators for component lifecycle.
import { CommonModule } from '@angular/common'; // Import CommonModule for Angular common directives.

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@libs/shared/data-access-user/src'; // Import InputFechaComponent for date input handling.

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { FECHA_DE_PAGO } from '../../constantes/derechos.model';


import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder and FormGroup for reactive forms.

import { Catalogo, TituloComponent } from '@ng-mf/data-access-user'; // Import Catalogo and TituloComponent from shared library.
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule for reactive form handling.

import { SanitarioService } from '../../services/sanitario.service'; // Import SanitarioService for API calls.

import { Subject ,map,takeUntil } from 'rxjs'; // Import RxJS operators for reactive programming.

import {
  Solicitud260211State,
  Tramite260211Store
} from '../../../../estados/tramites/tramite260211.store';
import { Permiso260211Query } from '../../../../estados/queries/permiso260211.query'; // Import query for fetching data from the store.
import { Tramite260211Query } from '../../../../estados/queries/tramite260211.query';
/**
 * compondoc
 * component
 * @name DerechosComponent
 * @description
 * Este componente es responsable de gestionar la funcionalidad relacionada con los derechos en el sistema.
 * Proporciona un formulario para capturar los datos de los derechos y carga una lista de datos relacionados.
 * 
 * @selector app-derechos
 * @standalone true
 * @imports
 * - CommonModule
 * - TituloComponent
 * - ReactiveFormsModule
 * - CatalogoSelectComponent
 * 
 * @templateUrl ./derechos.component.html
 * @styleUrl ./derechos.component.css
 */
@Component({
  selector: 'app-derechos', // Define the selector for the component.
  standalone: true, // Mark the component as standalone.
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent,InputFechaComponent], // Import required modules and components.
  templateUrl: './derechos.component.html', // Path to the HTML template.
  styleUrls: ['./derechos.component.scss'], // Path to the CSS styles.
})
export class DerechosComponent implements OnInit, OnDestroy {
/** 
  * compodoc
  * property {InputFecha} fechaInicioInput
*/
   public fechaInicioInput = FECHA_DE_PAGO;
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
 public esFormularioSoloLectura: boolean = false; 
  /**
  /**
   * compodoc
   *@ property {FormGroup} derechosForm
   * @description Formulario reactivo para capturar los datos de los derechos.
   */
  derechosForm!: FormGroup; // Reactive form instance for managing form controls.

  /**
   *compodoc
   * property {Subject<void>} destroyNotifier$
   * description Sujeto utilizado para notificar la destrucción del componente.
   * private
   */
  private destroyNotifier$: Subject<void> = new Subject(); // Subject para notificar la destrucción del componente..

 
  /**
   * compodoc
   * property {Catalogo[]} derechosList
   * description Lista de datos relacionados con los derechos.
   */
  public derechosList!: Catalogo[]; // Array to store the list of rights-related data.

  /**
   * compodoc
   * property {Solicitud260211State} solicitudState
   * description Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud260211State; // Current state of the application.

  /**
   * compodoc
   * constructor
   * description Constructor del componente.
   * param {FormBuilder} fb - Constructor para formularios reactivos.
   * param {SanitarioService} service - Servicio para manejar datos sanitarios.
   * param {Sanitario260211Store} sanitario260211Store - Almacén de estado para la solicitud.
   * param {Permiso260211Query} permiso260211Query - Consulta para obtener datos relacionados con permisos.
   */
  constructor(
    private fb: FormBuilder, // Inject FormBuilder for creating reactive forms.
    private service: SanitarioService, // Inject SanitarioService for API calls.
    private sanitario260211Store: Tramite260211Store, // Inject store for managing state.
    private permiso260211Query: Permiso260211Query,// Inject query for fetching data from the store.
    private consultaioQuery: ConsultaioQuery ,
    private tramite260211Query : Tramite260211Query // Inject query for fetching data from the store. 
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
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
       
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe();
  }

  /**
   * compodoc
   * method ngOnInit
   * description Método de inicialización del componente.
   * Se suscribe al estado de la solicitud, configura el formulario reactivo y carga los datos iniciales.
   * returns {void}
   */
  ngOnInit(): void {
 this.inicializarEstadoFormulario();
  

if (this.esFormularioSoloLectura) {
  this.derechosForm.get('deFetch')?.disable();
} else {
  this.derechosForm.get('deFetch')?.enable();
}
    // Carga de datos iniciales
    this.loadComboUnidadMedida(); // Llamar al método para cargar los datos iniciales.
  }
 /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
    
  }
    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.derechosForm.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.derechosForm.enable();
      } 
  }
  /* * compodoc
   * Inicializa el formulario con los valores del estado de la solicitud.
   */
  inicializarFormulario():void{
    
    // Suscripción al estado de la solicitud
    this.tramite260211Query.selectSolicitud$ // Observable para obtener el estado actual de la aplicación.
      .pipe(
        takeUntil(this.destroyNotifier$), // Darse de baja automáticamente cuando el componente se destruya..
        map((seccionState) => {
          this.solicitudState = seccionState; // Asignar el estado obtenido a solicitudState..
        })
      )
      .subscribe(); // Suscribirse al observable..

    // Configuración del formulario reactivo
    this.derechosForm = this.fb.group({
      referencia: [this.solicitudState?.referencia], 
      cadenaDependencia: [this.solicitudState?.cadenaDependencia], 
      Llave: [this.solicitudState?.Llave, Validators.pattern(/^\d+$/)], 
      banco: [this.solicitudState?.banco], 
      deFetch: [this.solicitudState?.deFetch], 
      importe: [this.solicitudState?.importe, Validators.pattern(/^\d+$/)], 
    });
  }
 /**
   * compodoc
   * method setValoresStore
   * description Actualiza el valor de un campo en el almacén de estado.
   * Este método se utiliza para sincronizar los valores del formulario con el estado global de la aplicación.
   * param {FormGroup} form - El formulario reactivo que contiene los datos.
   * param {string} campo - El nombre del campo que se desea actualizar.
   * param {keyof Sanitario260211Store} metodoNombre - El método del almacén que se invocará para actualizar el valor.
   * returns {void}
   */
 setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite260211Store): void {
  const VALOR = form.get(campo)?.value; // Obtener el valor del campo especificado del formulario.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this.sanitario260211Store[metodoNombre] as (value: any) => void)(VALOR); 
}

  /**
   * compodoc
   * method loadComboUnidadMedida
   * description Carga la lista de datos relacionados con los derechos desde el servicio.
   * Realiza una solicitud al servicio para obtener los datos y los asigna a la lista de derechos.
   * returns {void}
   */
  loadComboUnidadMedida(): void {
    this.service.getDatos() // Llamar al método del servicio para obtener datos.
      .pipe(takeUntil(this.destroyNotifier$)) // Darse de baja automáticamente cuando el componente sea destruido. .
      .subscribe((data): void => {
        this.derechosList = data as Catalogo[]; // Asignar los datos obtenidos a derechosList.
      });
  }
  /**
   * compodoc
   * method onFechaCambiada
   * description Maneja el evento de cambio de fecha en el formulario.
   * Actualiza el valor del campo 'fechaPago' en el formulario con la nueva fecha seleccionada.
   * param {string} fecha - La nueva fecha seleccionada por el usuario.
   * returns {void}
   */
onFechaCambiada(fecha: string): void {
    this.derechosForm.patchValue({ deFetch: fecha });
  }
 /**
   * compodoc
   * method ngOnDestroy
   * description Método de limpieza al destruir el componente.
   * Libera los observables y notifica la destrucción del componente para evitar fugas de memoria.
   * returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); 
    this.destroyNotifier$.complete(); 
  }
}