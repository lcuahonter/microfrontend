import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent, Catalogo, InputFecha, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { AvisocalidadStore, SolicitudState } from '../../estados/stores/aviso-calidad.store';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs';
import { AvisoImportacionService } from '../../services/parmiso-importacion.service';
import { AvisocalidadQuery } from '../../estados/queries/aviso-calidad.query';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DEBES_CAPTURAR } from '../../constantes/pago-de-derechos.enum';
import { FECHA_DE_PAGO } from '../../models/pago-derechos.model';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { Subject } from 'rxjs';
/**
 * Component Define el componente de Angular.
 * selector 'app-pago-derechos' Selector del componente.
 * standalone true Indica que el componente es independiente.
 * imports Lista de módulos y componentes importados.
 * templateUrl Ruta de la plantilla HTML del componente.
 * styleUrl Ruta de los estilos CSS del componente.
 */
@Component({
  selector: 'app-shared-pago-derechos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CatalogoSelectComponent, TituloComponent, InputFechaComponent, AlertComponent],
  templateUrl: './shared-pago-derechos.component.html',
  styleUrl: './shared-pago-derechos.component.scss',
})
export class SharedPagoDerechosComponent implements OnInit, OnDestroy {
  /** Indica si se debe mostrar la notificación de alerta en el componente. */
  @Input() mostrarNotificacionAlerta: boolean = false;

  /**
   * Representa el tipo de alerta que se mostrará.
   * El valor es típicamente una cadena que indica el estilo de alerta, como 'alert-warning'.
   */
  public infoAlert = 'alert-warning';
  /**
   * property {FormGroup} derechosForm - Formulario reactivo para capturar los datos del pago de derechos.
   */
  derechosForm!: FormGroup;

  /**
   * property {SolicitudState} solicitudState - Estado actual de la solicitud.
   */
  public solicitudState!: SolicitudState;

  /**
   * property {Subject<void>} destroyed$ - Sujeto para manejar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();

  /**
   * property {Catalogo[]} derechosList - Lista de derechos obtenida del servicio.
   */
  public derechosList!: Catalogo[];

  /**
   * property {InputFecha} fechaInicioInput - Configuración de la fecha de pago.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si la fecha ingresada es válida.
   * Cuando es `true`, la fecha es válida; cuando es `false`, la fecha es inválida o pasada.
   */
  public esFechaValida: boolean = true;

  /**
   * Mensaje de alerta que indica que se deben capturar todos los campos de pago de derechos.
   * Este mensaje se muestra al usuario para recordarle que debe completar todos los campos necesarios.
   */
  public DEBES_CAPTURAR = DEBES_CAPTURAR.CONTENIDO; 

  /** Expresión regular para validar números con hasta dos decimales.
   * Permite números enteros y decimales con un punto o coma como separador decimal.
   * Ejemplos válidos: 123, 123.45, -123, -123,45
   */
  public numRegex = /^-?\d*[.,]?\d{0,2}$/;

  /**
   * constructor
   * param {FormBuilder} fb - Constructor para formularios reactivos.
   * param {AvisoImportacionService} service - Servicio para obtener datos relacionados con el aviso de importación.
   * param {AvisocalidadStore} avisocalidadStore - Store para gestionar el estado de aviso de calidad.
   * param {AvisocalidadQuery} avisocalidadQuery - Query para obtener datos del estado de aviso de calidad.
   */
  constructor(
    private fb: FormBuilder, // Inyección de dependencia para construir formularios.
    private service: AvisoImportacionService, // Inyección del servicio para obtener datos.
    private avisocalidadStore: AvisocalidadStore, // Inyección del store para manejar el estado.
    private avisocalidadQuery: AvisocalidadQuery,// Inyección de la query para consultar el estado.
    private consultaioQuery: ConsultaioQuery, // Inyección de la query para consultar datos de la aplicación.
    private servicioDeFormularioService: ServicioDeFormularioService,
  ) {
    //Reservado para futuras inyecciones de dependencias o inicializaciones.
  }

  /**
   * method ngOnInit
   * description Método de inicialización del componente.
   */
  ngOnInit(): void {
    /**
    * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
    *
    * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
    * - Llama a `configurarGrupoForm()` para aplicar configuraciones basadas en el estado recibido.
    * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
    */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()

    this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
      if (formName === 'derechosForm') {
        this.derechosForm.markAllAsTouched();
      }
    });

    this.configurarGrupoForm(); // Configura el formulario reactivo.
    this.loadComboUnidadMedida(); // Carga la lista de derechos.
  }

  /**
   * @method configurarGrupoForm
   * @description Configures the reactive form group for the "Datos del Establecimiento RFC" component.
   * This method initializes the form group with default values and validation rules for the fields:
   * - `rfcDel`: Optional field with a maximum length of 254 characters.
   * - `denominacionRazonSocial`: Required field with a maximum length of 254 characters.
   * - `correoElectronico`: Required field with a valid email format and a maximum length of 320 characters.
   * 
   * @memberof DatosDelEstablecimientoRfcComponent
   */
  configurarGrupoForm(): void {
    this.avisocalidadQuery.selectSolicitud$ // Observa los cambios en el estado de la solicitud.
      .pipe(
        takeUntil(this.destroyed$), // Finaliza la suscripción al destruir el componente.
        map((seccionState) => { // Mapea el estado recibido.
          this.solicitudState = seccionState; // Asigna el estado a la propiedad solicitudState.
        })
      )
      .subscribe(); // Se suscribe al observable.

    // Inicializa el formulario reactivo con los valores del estado.
    this.derechosForm = this.fb.group({
      claveReferencia: [this.solicitudState?.claveReferencia], // Campo claveReferencia.
      cadenaDependencia: [this.solicitudState?.cadenaDependencia], // Campo cadenaDependencia.
      banco: [this.solicitudState?.banco, Validators.required], // Campo banco.
      llavePago: [this.solicitudState?.llavePago], // Campo llavePago.
      fechaDePago: [this.solicitudState?.fechaPago, Validators.required], // Campo fechaDePago.
      importePago: [
        this.solicitudState?.importePago,
        [
          Validators.required,
          Validators.pattern(this.numRegex), Validators.maxLength(16)
        ]
      ],
    });

    if (this.solicitudState?.fechaPago) {
      this.derechosForm.get('fechaDePago')?.setValue(this.solicitudState.fechaPago);
    }

    /*
    * Si el formulario está en modo solo lectura, deshabilita todos los campos.
    * En caso contrario, habilita los campos para permitir la edición.
    * Esto asegura que el formulario refleje correctamente el estado de solo lectura.
    */
    if (this.esFormularioSoloLectura && this.derechosForm) {
      this.derechosForm.disable();
    }

    this.servicioDeFormularioService.registerForm('derechosForm', this.derechosForm);
  }
/**
 * Obtiene el control del formulario 'importePago' del formulario 'derechosForm'.
 * 
 * @returns {AbstractControl} El control 'importePago' del formulario.
 */
  get importePago(): AbstractControl | null {
    return this.derechosForm.get('importePago');
  }
  /**
   * method loadComboUnidadMedida
   * description Carga la lista de derechos desde el servicio.
   */
  loadComboUnidadMedida(): void {
    this.service.getDatos() // Llama al servicio para obtener los datos.
      .pipe(takeUntil(this.destroyed$)) // Finaliza la suscripción al destruir el componente.
      .subscribe((data): void => { // Maneja los datos recibidos.
        this.derechosList = data as Catalogo[]; // Asigna los datos a la lista de derechos.
      });
  }

  /**
   * @method setValoresStore
   * @description Actualiza el estado del store con los valores del formulario.
   * @param form Formulario reactivo.
   * @param campo Campo del formulario que se desea actualizar.
   * @param metodoNombre Nombre del método del store que se invocará.
   */

  setValoresStore<T>(form: FormGroup, campo: string, metodoNombre: keyof AvisocalidadStore): void {
    const CONTROL = form.get(campo);

    if (!CONTROL) {
      console.warn(`Control '${campo}' not found in form`);
      return;
    }

    if (CONTROL.invalid) {
      console.warn(`Invalid input in field '${campo}':`, CONTROL.errors);
      // Optional: Mark as touched to trigger validation error display
      CONTROL.markAsTouched();
      return;
    }

    const VALOR = CONTROL.value as T;
    const STOREMETHOD = this.avisocalidadStore[metodoNombre] as (value: T) => void;

    if (typeof STOREMETHOD === 'function') {
      STOREMETHOD(VALOR);
    } else {
      console.error(`Store method '${String(metodoNombre)}' is not a function`);
    }

    this.servicioDeFormularioService.setFormValue('derechosForm', {
        [campo]: VALOR as string | object,
      });
  }


  /**
  * @method onReset
  * @description Limpia todos los campos del formulario de pago de derechos.
  */
  alReiniciar(): void {
    this.derechosForm.reset();
  }
  /**
   * Indica si se ha seleccionado una fecha futura.
   * Cuando es `true`, la fecha seleccionada es futura; cuando es `false`, la fecha es pasada o actual.
   */
public fechaFuturaSeleccionada = false;
  /**
   * Actualiza el campo de fecha de pago en el formulario y en el estado global.
   *
   * @param nuevo_fechaDePago Nueva fecha de pago seleccionada.
   */
  cambioFechaDePago(nuevo_valor: string): void { 
   this.derechosForm.patchValue({
      fechaDePago: nuevo_valor,
    });
    this.avisocalidadStore.setfechaPago(nuevo_valor);
  this.derechosForm.get('fechaDePago')?.setValue(nuevo_valor);

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
    this.derechosForm.get('fechaDePago')?.setErrors({ futureDate: true });
  } else {
    this.fechaFuturaSeleccionada = false;
    this.derechosForm.get('fechaDePago')?.setErrors(null);
  }
  }

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
  esInvalido(nombreControl: string): boolean {
    if (
      nombreControl === 'fechaDePago' &&
      this.derechosForm.get('fechaDePago')?.value !== '' &&
      this.derechosForm.get('fechaDePago')?.value !== null
    ) {
      this.esFechaPasada(this.derechosForm.get('fechaDePago')?.value);
      if (!this.esFechaValida) {
        this.derechosForm
          .get('fechaDePago')
          ?.setErrors({ esFechaPasada: true });
        return true;
      }

      this.derechosForm
        .get('fechaDePago')
        ?.setErrors({ esFechaPasada: false });
      return false;
    }
    const CONTROL = this.derechosForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
    * @method esFechaPasada
    * @description Verifica si una fecha proporcionada es anterior a la fecha actual.
    *
    * @param {string} fechaStr - La fecha en formato de cadena que se desea evaluar.
    *
    * @returns {void} No retorna ningún valor, pero actualiza la propiedad `esFechaValida`
    * indicando si la fecha proporcionada es una fecha pasada.
    *
    * @example
    * // Supongamos que la fecha actual es 2023-03-15
    * this.esFechaPasada('2023-03-14'); // esFechaValida será true
    * this.esFechaPasada('2023-03-16'); // esFechaValida será false
    */
  esFechaPasada(fechaStr: string): void {
    if (!fechaStr) {
      this.esFechaValida = false;
      return;
    }

    const [DAY, MONTH, YEAR] = fechaStr.split('/').map(Number);

    const FECHA_ENTRADA = new Date(YEAR, MONTH - 1, DAY);
    const HOY = new Date();
    if (isNaN(FECHA_ENTRADA.getTime())) {
      this.esFechaValida = false;
      return;
    }
    HOY.setHours(0, 0, 0, 0);
    FECHA_ENTRADA.setHours(0, 0, 0, 0);
    this.esFechaValida = FECHA_ENTRADA <= HOY;
  }


  /**
   * @method ngOnDestroy
   * @description Método para limpiar las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(); // Emite un valor para finalizar las suscripciones.
    this.destroyed$.complete(); // Completa el Subject.
  }
}
