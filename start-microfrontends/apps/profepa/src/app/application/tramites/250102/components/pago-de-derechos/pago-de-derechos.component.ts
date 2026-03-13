import { Catalogo, CatalogoSelectComponent, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { INPUT_FECHA_PAGO } from '../../constantes/flora-fauna.enum';
import catalogoDatos from '@libs/shared/theme/assets/json/250102/banco.json';
import pago from '@libs/shared/theme/assets/json/250102/pago-formdatos.json';

import { Tramite250102State, Tramite250102Store } from '../../estados/tramite250102.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite250102Query } from '../../estados/tramite250102.query';

/**
 * Componente encargado de gestionar el pago de derechos dentro del trámite 221602.
 * Permite al usuario ingresar los datos correspondientes al pago de derechos, como clave, dependencia, banco,
 * llave, fecha e importe. También interactúa con el store para almacenar los datos del trámite.
 * 
 * Este componente utiliza un formulario reactivo para gestionar los datos del pago de derechos, y actualiza el store 
 * con los valores proporcionados.
 * 
 * @component
 * @example
 * <app-pago-de-derechos250102</app-pago-de-derechos250102>
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `FormsModule`: Módulo necesario para trabajar con formularios basados en plantillas.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 * - `CatalogoSelectComponent`: Componente para seleccionar valores de un catálogo.
 * 
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent, InputFechaComponent
  ],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
})

/**
 * Componente encargado de gestionar el pago de derechos del trámite 250102.
 * Utiliza un formulario reactivo para que el usuario ingrese datos como la clave, dependencia, banco, 
 * llave, fecha e importe. Además, actualiza el estado del trámite en el store.
 * 
 * @class
 * @implements OnInit, OnDestroy
 * @example
 * <app-pago-de-derechos250102></app-pago-de-derechos250102>
 * 
 * @constructor
 * El constructor inicializa las dependencias necesarias y prepara el formulario reactivo para gestionar los 
 * datos del pago de derechos.
 * 
 * @property {FormGroup} pagoDerechosForm - Formulario reactivo que gestiona los datos relacionados con el 
 * pago de derechos, como clave, dependencia, banco, llave, fecha e importe.
 * @property {Catalogo[]} bancocatalogo - Lista de opciones de bancos obtenidas del catálogo.
 * @property {Solicitud250102State} solicitudState - Estado de la solicitud 250102 que contiene los valores actuales de la solicitud.
 * 
 * @method ngOnInit() - Método que se ejecuta cuando el componente es inicializado. Inicializa el formulario reactivo
 * y carga los datos de la solicitud.
 * @method setValoresStore() - Método para actualizar el store del trámite con los valores del formulario.
 * @method ngOnDestroy() - Método que se ejecuta cuando el componente es destruido, liberando recursos y completando
 * la notificación de destrucción.
 */
export class PagoDeDerechosComponent implements OnInit, OnDestroy {

  /**
   * Lista de opciones de banco obtenidas de un catálogo.
   */
  public bancocatalogo: Catalogo[] = catalogoDatos.banco;

  /**
   * Estado de la solicitud 250102, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: Tramite250102State;

   /** Indica si el formulario está en modo solo lectura */
  esFormularioSoloLectura: boolean = false;

  /**
   * Formulario reactivo que gestiona los datos relacionados con el pago de derechos, como clave, dependencia, banco,
   * llave, fecha e importe.
   */
  pagoDerechosForm!: FormGroup;

  /**
   * Constante para configurar el input de fecha.
   * Define las propiedades del campo de entrada de fecha.
   */
  INPUT_FECHA_CONFIG = INPUT_FECHA_PAGO;
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
   * @param consultaioQuery - Query que se utiliza para obtener el estado de solo lectura del componente.
   */
  constructor(
    private fb: FormBuilder,
    private tramite250102Store: Tramite250102Store,
    private tramite250102Query: Tramite250102Query,
    public consultaioQuery: ConsultaioQuery,
  ) { 
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  
    /**
   * Inicializa el formulario dependiendo del modo (solo lectura o editable).
   * Si está en solo lectura, carga y bloquea el formulario.
   * Si no, crea un formulario editable.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Crea el formulario y, si está en modo solo lectura, lo deshabilita.
   * De lo contrario, lo habilita para edición.
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
   * Método que se ejecuta cuando el componente es inicializado.
   * 
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   * 
   * Configura el formulario para gestionar los campos relacionados con el pago de derechos, como clave, 
   * dependencia, banco, llave, fecha e importe. También asigna valores predeterminados a algunos campos.
   */
  private inicializarFormulario(): void {
    this.tramite250102Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250102State;
        })
      )
      .subscribe();

    this.pagoDerechosForm = this.fb.group({
      clave: [this.solicitudState?.clave, [Validators.required, Validators.maxLength(14)]],
      dependencia: [this.solicitudState?.dependencia, [Validators.required, Validators.maxLength(20)]],
      banco: [this.solicitudState?.banco, Validators.required],
      llave: [this.solicitudState?.llave, [Validators.required, Validators.maxLength(10)]],
      fecha: [this.solicitudState?.fecha, Validators.required],
      importe: [this.solicitudState?.importe, [Validators.required, Validators.maxLength(16)]],
      revisados: [this.solicitudState?.revisados]
    });

    this.pagoDerechosForm.get('clave')?.disable();
    this.pagoDerechosForm.get('dependencia')?.disable();
    this.pagoDerechosForm.get('importe')?.disable();
    this.pagoDerechosForm.get('clave')?.setValue(pago.formData.clave);
    this.pagoDerechosForm.get('dependencia')?.setValue(pago.formData.dependencia);
    this.pagoDerechosForm.get('importe')?.setValue(pago.formData.importe);
  }

    /**
    * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
    * @param form - El formulario reactivo.
    * @param campo - El nombre del campo en el formulario.
    */
    setValoresStore(form: FormGroup, campo: string): void {
      const VALOR = form.get(campo)?.value;
      this.tramite250102Store.establecerDatos({ [campo]: VALOR });
    }
  /**
  * Maneja los cambios en el campo "Fecha de Pago".
  * Actualiza el estado del almacén con la fecha de pago proporcionada.  
  */
  cambioFechaFinal(nuevo_valor: string): void {
    this.pagoDerechosForm.patchValue({
      fecha: nuevo_valor,
    });
    this.tramite250102Store.establecerDatos({ fecha: nuevo_valor });
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


