import { Catalogo,CatalogoSelectComponent,InputFechaComponent,TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component,OnDestroy,OnInit} from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { Solicitud221601State, Tramite221601Store } from '../../../../estados/tramites/tramite221601.store';
import { Subject,map,takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { INPUT_FECHA_CONFIG } from '@libs/shared/data-access-user/src/core/enums/221601/fecha.enum';
import { Tramite221601Query } from '../../../../estados/queries/tramite221601.query';
import realizar from '@libs/shared/theme/assets/json/221601/zoosanitario.json';

import { CommonModule } from '@angular/common';


/**
 * Componente encargado de gestionar el pago de derechos dentro del trámite 221601.
 * Permite al usuario ingresar los datos correspondientes al pago de derechos, como clave, dependencia, banco,
 * llave, fecha e importe. También interactúa con el store para almacenar los datos del trámite.
 * 
 * Este componente utiliza un formulario reactivo para gestionadr los datos del pago de derechos, y actualiza el store 
 * con los valores proporcionados.
 * 
 * @component
 * @example
 * <app-pago-de-derechos221601></app-pago-de-derechos221601>
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `FormsModule`: Módulo necesario para trabajar con formularios basados en plantillas.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 * - `CatalogoSelectComponent`: Componente para seleccionar valores de un catálogo.
 * 
 */
@Component({
  selector: 'app-pago-de-derechos221601',
  standalone: true,
  imports: [
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,InputFechaComponent,CommonModule
  ],
  templateUrl: './pago-de-derechos221601.component.html',
  styleUrls: ['./pago-de-derechos221601.component.scss']
})

/**
 * Componente encargado de gestionar el pago de derechos del trámite 221601.
 * Utiliza un formulario reactivo para que el usuario ingrese datos como la clave, dependencia, banco, 
 * llave, fecha e importe. Además, actualiza el estado del trámite en el store.
 * 
 * @class
 * @implements OnInit, OnDestroy
 * @example
 * <app-pago-de-derechos221601></app-pago-de-derechos221601>
 * 
 * @constructor
 * El constructor inicializa las dependencias necesarias y prepara el formulario reactivo para gestionar los 
 * datos del pago de derechos.
 * 
 * @property {FormGroup} pagoDerechosForm - Formulario reactivo que gestiona los datos relacionados con el 
 * pago de derechos, como clave, dependencia, banco, llave, fecha e importe.
 * @property {Catalogo[]} bancocatalogo - Lista de opciones de bancos obtenidas del catálogo.
 * @property {Solicitud221601State} solicitudState - Estado de la solicitud 221601 que contiene los valores actuales de la solicitud.
 * 
 * @method ngOnInit() - Método que se ejecuta cuando el componente es inicializado. Inicializa el formulario reactivo
 * y carga los datos de la solicitud.
 * @method setValoresStore() - Método para actualizar el store del trámite con los valores del formulario.
 * @method ngOnDestroy() - Método que se ejecuta cuando el componente es destruido, liberando recursos y completando
 * la notificación de destrucción.
 */
export class PagoDeDerechos221601Component implements OnInit, OnDestroy {

  /**
   * Lista de opciones de banco obtenidas de un catálogo.
   */
  public bancocatalogo: Catalogo[] =realizar.banco;

  /**
   * Estado de la solicitud 221601, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: Solicitud221601State;

  /**
   * Formulario reactivo que gestiona los datos relacionados con el pago de derechos, como clave, dependencia, banco,
   * llave, fecha e importe.
   */
  pagoDerechosForm!: FormGroup;

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
 esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente. Inicializa las dependencias necesarias y prepara el formulario reactivo.
   * 
   * @param fb - FormBuilder utilizado para crear el formulario reactivo.
   * @param tramite221601Store - Store que gestiona los valores persistentes del trámite 221601.
   * @param tramite221601Query - Query que se utiliza para obtener el estado actual de la solicitud 221601.
   */
  constructor(
    private fb: FormBuilder,
    private tramite221601Store: Tramite221601Store,
    private tramite221601Query: Tramite221601Query,
     private consultaioQuery: ConsultaioQuery,
         private validacionesService: ValidacionesFormularioService, 
  ) { // Constructor que inyecta las dependencias necesarias
       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
       
          this.inicializarCertificadoFormulario();
        })
      )
      .subscribe()
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
     this.inicializarFormulario()
    }  
  }
  /** Inicializa los datos del formulario suscribiéndose al estado del trámite.  
 *  Asigna el estado actual al modelo local del componente. */
   inicializarFormulario(): void {
    this.tramite221601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Solicitud221601State;
        })
      )
      .subscribe();
    this.pagoDerechosForm = this.fb.group({
      claves: [this.solicitudState.claves, Validators.required],
      dependencia: [this.solicitudState.dependencia, Validators.required],
      banco: [this.solicitudState.banco, Validators.required],
      llave: [this.solicitudState.llave, Validators.required],
      fecha: [this.solicitudState.fecha, Validators.required],
      importe: [this.solicitudState.importe, [Validators.required, Validators.min(1)]]
    });
    
    this.pagoDerechosForm.get('claves')?.disable();
    this.pagoDerechosForm.get('dependencia')?.disable();
    this.pagoDerechosForm.get('importe')?.disable();
    this.pagoDerechosForm.get('claves')?.setValue(realizar.formData.claves);
    this.pagoDerechosForm.get('dependencia')?.setValue(realizar.formData.dependencia);
    this.pagoDerechosForm.get('importe')?.setValue(realizar.formData.importe);
    this.updateStoreWithFormData();
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
       this.pagoDerechosForm.disable();
      } else {
      this.pagoDerechosForm.enable();
      }
  }
  /**
* Verifica si un campo específico del formulario `formCombinacion` no es válido
* y ha sido tocado (modificado por el usuario).
*
* @param field - El nombre del campo dentro del formulario que se desea validar.
* @returns Retorna `true` si el campo tiene errores y ha sido tocado, de lo contrario `false`.
*/
  public isValid(field: string): boolean | null {
    return this.validacionesService.isValid(this.pagoDerechosForm, field);
  }
  /**
 * Actualiza el estado del store `tramite221601Store` con los datos del formulario `MedioForm`.
 *
 * Extrae los valores de los campos `transporte` y `empresa` del formulario y los fusiona con el
 * estado actual `solicitudState`, creando un nuevo objeto que se usa para actualizar el store.
 *
 * @private
 * @returns void
 */
  private updateStoreWithFormData(): void {
    const UPDATE_PAGO_FORM: Solicitud221601State = {
      ...this.solicitudState,
      claves: this.pagoDerechosForm.get('claves')?.value,
      dependencia: this.pagoDerechosForm.get('dependencia')?.value,
      importe: this.pagoDerechosForm.get('importe')?.value
    };
  
   // Actualiza el store con el estado modificado
    this.tramite221601Store.update(UPDATE_PAGO_FORM);
  }
  /**
   * Método que actualiza el store con los valores del formulario.
   * 
   * @param form - Formulario reactivo con los datos actuales.
   * @param campo - El campo que debe actualizarse en el store.
   * @param metodoNombre - El nombre del método en el store que se debe invocar.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite221601Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite221601Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
 /**
   * Constante para configurar el input de fecha.
   * Define las propiedades del campo de entrada de fecha.
   */
    INPUT_FECHA_CONFIG = INPUT_FECHA_CONFIG;

    /**

 * Método para cambiar la fecha final.

 * @param nuevo_valor Nuevo valor de la fecha final.

 */
fechaFuturaSeleccionada = false;
  cambioFechaFinal(nuevo_valor: string): void {
    this.pagoDerechosForm.patchValue({
      fecha: nuevo_valor,
    });
   this.tramite221601Store.setFecha(nuevo_valor);
  this.pagoDerechosForm.get('fecha')?.setValue(nuevo_valor);

  let seleccionada: Date | null = null;
  if (nuevo_valor && nuevo_valor.includes('/')) {
    const [DAY, MONTH, YEAR] = nuevo_valor.split('/').map(Number);
    seleccionada = new Date(YEAR, MONTH - 1, DAY);
  } else {
    seleccionada = new Date(nuevo_valor); 
  }

  const HOY = new Date();
  HOY.setHours(0, 0, 0, 0);

  if (seleccionada && seleccionada > HOY) {
    this.fechaFuturaSeleccionada = true;
    this.pagoDerechosForm.get('fecha')?.setErrors({ futureDate: true });
  } else {
    this.fechaFuturaSeleccionada = false;
    this.pagoDerechosForm.get('fecha')?.setErrors(null);
  }
  }

  /**
   * Método para borrar todos los datos del formulario de pago de derechos.
   * Resetea los valores del formulario y actualiza el store con valores vacíos,
   * manteniendo los campos deshabilitados que no deben ser editables.
   */
  borrarDatosPago(): void {
    // Reset form values
    this.pagoDerechosForm.patchValue({
      claves: realizar.formData.claves, // Keep default value
      dependencia: realizar.formData.dependencia, // Keep default value
      banco: '',
      llave: '',
      fecha: '',
      importe: realizar.formData.importe // Keep default value
    });

    // Clear form validation errors
    this.pagoDerechosForm.markAsUntouched();
    this.pagoDerechosForm.markAsPristine();

    // Reset future date validation flag
    this.fechaFuturaSeleccionada = false;

    // Update store with cleared values
    const CLEARED_PAGO_FORM: Solicitud221601State = {
      ...this.solicitudState,
      claves: realizar.formData.claves,
      dependencia: realizar.formData.dependencia,
      banco: '',
      llave: '',
      fecha: '',
      importe: realizar.formData.importe
    };

    this.tramite221601Store.update(CLEARED_PAGO_FORM);
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * 
   * Libera los recursos y completa la notificación de destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}