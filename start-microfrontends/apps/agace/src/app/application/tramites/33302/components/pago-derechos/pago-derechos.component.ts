import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFecha, InputFechaComponent } from '@libs/shared/data-access-user/src';
import { Subject,map, takeUntil } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import {Solicitud32301Service} from '../../services/solicitud.service';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite33302Query } from '../../estados/tramite33302.query';
import { Tramite33302State } from '../../estados/tramite33302.store';
import { Tramite33302Store } from '../../estados/tramite33302.store';
/**
 * @component PagoDerechosComponent
 * @description
 * Componente Angular que gestiona el formulario de pago de derechos en el trámite 33302.
 * Este componente permite capturar, validar y guardar datos relacionados con el pago,
 * como la clave de referencia, banco, fecha de pago, y otros detalles.
 * 
 * @selector app-pago-derechos
 * Selector utilizado para incluir este componente en una plantilla HTML.
 * 
 * @standalone true
 * Este componente es independiente y no requiere ser declarado en un módulo.
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título de la sección.
 * - `ReactiveFormsModule`: Módulo para trabajar con formularios reactivos en Angular.
 * - `InputRadioComponent`: Componente para manejar entradas de tipo radio.
 * - `InputFechaComponent`: Componente para manejar entradas de tipo fecha.
 * - `CatalogoSelectComponent`: Componente para manejar la selección de catálogos.
 * 
 * @templateUrl ./pago-derechos.component.html
 * Ruta al archivo HTML que define la plantilla del componente.
 */

@Component({
  selector: 'app-pago-derechos',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    InputFechaComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './pago-derechos.component.html',
 
})
export class PagoDerechosComponent implements OnInit, OnDestroy {

  /**
    * Formulario reactivo para gestionar los datos del pago de derechos.
    */
  pagosDerechosForm!: FormGroup;

  /**
   * @property {Tramite33302State} tramiteState
   * @description
   * Estado del trámite 33302 que contiene los datos relacionados con el pago de derechos.
   */

  tramiteState: Tramite33302State={} as Tramite33302State;

   
  /**
   * Lista de datos relacionados con bancos obtenidos desde el servicio.
   */
  public bancoList!: Catalogo[];

  /**
 * @property {InputFecha} configuracionFechaFinVigencia
 * @description
 * Configuración del campo de fecha de fin de vigencia para el formulario de pago de derechos.
 * @type {InputFecha}
 */
  configuracionFechaFinVigencia: InputFecha = {
    labelNombre: 'Fecha de pago',
    required: false,
    habilitado: true,
  };
  /**
 * @method cambioFechaDePago
 * @description
 * Maneja los cambios en el campo de fecha de inicio.
 * @param {string} nuevo_valor - El nuevo valor de fecha seleccionado.
 * @returns {void}
 */
cambioFechaDePago(nuevo_valor: string): void {
  this.tramiteStore.actualizarEstado({fechaDePago:nuevo_valor});
}


   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
   esFormularioSoloLectura: boolean = false; 

   /**
    * Indica si el campo debe ser deshabilitado.
    * @property {boolean} campoDeshabilitar
    */
   campoDeshabilitar:boolean= false;
 
  /**
   * Subject utilizado para gestionar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * 
   * @param fb Servicio de FormBuilder para crear formularios reactivos.
   * @param fitosanitarioService Servicio para interactuar con la lógica de negocio relacionada con la acuicultura.
   */
  constructor(
    private readonly fb: FormBuilder,
     private tramiteStore: Tramite33302Store,
    private solicitudService: Solicitud32301Service,
    private tramiteStoreQuery: Tramite33302Query,

    
    private readonly consultaioQuery: ConsultaioQuery
     ) {
       this.consultaioQuery.selectConsultaioState$
         .pipe(
           takeUntil(this.destroyNotifier$),
           map((seccionState) => {
             this.esFormularioSoloLectura = seccionState.readonly;
             this.inicializarEstadoFormulario();
           })
         ).subscribe();
      }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
     this.iniciarFormulario();
    }  

  }
  
  /**
 * @method ngOnInit
 * @description
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 * Este método realiza las siguientes acciones:
 * - Llama al método `obtenerBancoList` para obtener la lista de bancos desde el servicio.
 * - Se suscribe al estado global del trámite (`selectTramite33302$`) para actualizar el formulario
 *   reactivo `pagosDerechosForm` con los valores almacenados en el estado.
 * - Utiliza `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * 
 * @returns {void} Este método no retorna ningún valor.
 */
  ngOnInit(): void {
    this.obtenerBancoList();
    this.tramiteStoreQuery.selectTramite33302$.pipe(
      takeUntil(this.destroyNotifier$),
      map((datos: Tramite33302State) => {
       this.tramiteState = datos;
        this.pagosDerechosForm.patchValue({
          claveDeReferencia: this.tramiteState.claveDeReferencia,
          cadenaDependencia: this.tramiteState.cadenaDependencia,
          banco: this.tramiteState.banco,
          llaveDePago: this.tramiteState.llaveDePago,
          importeDePago: this.tramiteState.importeDePago,
          numeroDe: this.tramiteState.numeroDe,
        });
      })
    )
      .subscribe();
  }
 /**
  * Actualiza el estado del store con los valores del formulario según el campo modificado.
  * @param {string} campo - El nombre del campo que ha cambiado.
  * @return {void} Este método no retorna ningún valor.
  * @method setValoresStore
  * @description
  * Este método se encarga de actualizar el estado del store `tramiteStore` con los valores del formulario `pagosDerechosForm`.
  * Dependiendo del campo que se modifique, se actualiza el estado correspondiente en el store.
  * Se utiliza un `switch` para determinar qué campo ha cambiado y actualizar el estado del store con el nuevo valor.
  * @param {string} campo - El nombre del campo que ha cambiado.
  * @return {void} Este método no retorna ningún valor.
  */
    
    setValoresStore(campo: string): void {
      switch (campo) {
        case 'claveDeReferencia':
          this.tramiteStore.actualizarEstado({claveDeReferencia:this.pagosDerechosForm.get('claveDeReferencia')?.value});
          break;
    
        case 'numeroDe':
          this.tramiteStore.actualizarEstado({numeroDe:this.pagosDerechosForm.get('numeroDe')?.value});
          break;
    
        case 'banco':
          this.tramiteStore.actualizarEstado({banco:this.pagosDerechosForm.get('banco')?.value});
          break;
    
        case 'llaveDePago':
          this.tramiteStore.actualizarEstado({llaveDePago:this.pagosDerechosForm.get('llaveDePago')?.value});
          break;
    
        case 'fechaDePago':
          this.tramiteStore.actualizarEstado({fechaDePago:this.pagosDerechosForm.get('fechaDePago')?.value});
          break;
    
        case 'importeDePago':
          this.tramiteStore.actualizarEstado({importeDePago:this.pagosDerechosForm.get('importeDePago')?.value});
          break;
    
        case 'cadenaDependencia':
          this.tramiteStore.actualizarEstado({cadenaDependencia:this.pagosDerechosForm.get('cadenaDependencia')?.value});
          break;
        default:
        
    }}
  
  /**
   * Guarda los datos del formulario y actualiza el estado del componente.
   * Si el formulario está en modo solo lectura, deshabilita los campos.
   * Si no, habilita los campos para permitir la edición.
   *
   * @method guardarDatosFormulario
   * @returns {void} Este método no retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.iniciarFormulario();
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar=true;
      this.pagosDerechosForm.disable();
    } else {
      this.campoDeshabilitar=false;
      this.pagosDerechosForm.enable();
    }

  }
  /**
   * @method iniciarFormulario
   * @description
   *  
   * Inicializa el formulario reactivo `pagosDerechosForm` con los campos necesarios
   * para gestionar los datos del pago de derechos.
   * Este método utiliza el servicio `FormBuilder` para crear un grupo de controles
   * con validaciones requeridas para cada campo.
   * @returns {void} Este método no retorna ningún valor.
   */

  
  iniciarFormulario(): void {
    this.pagosDerechosForm = this.fb.group({
      claveDeReferencia: [{ value:this.tramiteState.claveDeReferencia }, Validators.required],
      numeroDe: [{ value:this.tramiteState.numeroDe }, Validators.required],
      banco: [{ value:this.tramiteState.banco}, Validators.required],
      llaveDePago: [{ value:this.tramiteState.llaveDePago}, Validators.required],
      fechaDePago: [{ value:this.tramiteState.fechaDePago}, Validators.required],
      importeDePago: [{ value:this.tramiteState.importeDePago}, Validators.required],
      cadenaDependencia: [{ value:this.tramiteState.cadenaDependencia}, Validators.required],
      
    });
  }
 /**
 * @method obtenerBancoList
 * @description
 * Obtiene la lista de bancos desde el servicio y la almacena en la propiedad `bancoList`.
 * Este método realiza una suscripción al servicio `onBancoList` y actualiza la lista de bancos
 * en el componente. Además, utiliza `takeUntil` para gestionar la destrucción de la suscripción
 * y evitar fugas de memoria.
 * 
 * @returns {void} Este método no retorna ningún valor.
 */
obtenerBancoList(): void {
  this.solicitudService.onBancoList()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((data: Catalogo[]) => {
      this.bancoList = data;
    });
}
  /**
   * Método que se encarga de borrar los datos del pago en el formulario.
   * Resetea el formulario a su estado inicial.
   */
  public borrarDatosDelPago(): void {
    this.pagosDerechosForm.reset();
  }
  /**
   * Método que se ejecuta al destruir el componente.
   * Se encarga de liberar las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }
}
