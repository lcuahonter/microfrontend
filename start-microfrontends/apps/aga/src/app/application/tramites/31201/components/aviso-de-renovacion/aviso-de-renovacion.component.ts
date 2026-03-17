import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AvisoValor, FECHA_DE_PAGO } from '../../models/aviso.model';
import { Catalogo, CatalogoSelectComponent, InputCheckComponent, InputFecha, InputFechaComponent, InputRadioComponent, TituloComponent, convertirFechaDdMmYyyyAMoment } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { map, takeUntil } from 'rxjs';
import { AvisoUnicoService } from '../../services/aviso-unico.service';
import { CommonModule } from '@angular/common';
import { PreOperativo } from '../../models/aviso.model';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { UnicoQuery } from '../../estados/queries/unico.query';
import { UnicoState } from '../../estados/renovacion.store';
import { UnicoStore } from '../../estados/renovacion.store';

/**
 * @componente
 * @name AvisoDeRenovacionComponent
 * @description
 * Componente que representa el aviso de renovación.
 * Este componente es responsable de inicializar el formulario, cargar datos desde servicios y manejar el estado de la aplicación.
 */
@Component({
  selector: 'app-aviso-de-renovacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    InputCheckComponent,
  ],
  templateUrl: './aviso-de-renovacion.component.html',
  styleUrls: ['./aviso-de-renovacion.component.scss'],
})
export class AvisoDeRenovacionComponent implements OnInit, OnDestroy {
  /**
   * Fecha inicial para el campo de fecha.
   * Se obtiene de la constante FECHA_DE_PAGO.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
   * Lista de localidades obtenidas desde el servicio.
   */
  public localidadList!: Catalogo[];

  /**
   * Observable para manejar la destrucción del componente.
   * Se usa para limpiar suscripciones cuando el componente es destruido.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Opciones de tipo de persona obtenidas desde el servicio.
   */
  tipoPersonaOptions: PreOperativo[] = [];

  /**
   * Formulario reactivo para el aviso de renovación.
   * Este formulario captura los datos de la solicitud de renovación.
   */
  avisoForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   * Contiene los datos actuales que se están gestionando en el estado de la aplicación.
   */
  public solicitudState!: UnicoState;

  /**
   * Estado actual de la consulta obtenido desde el servicio.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo de solo lectura.
   */
  soloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Inicializa las dependencias necesarias, como el servicio, el almacén y la consulta de estado.
   * @param {FormBuilder} fb Constructor de formularios reactivos.
   * @param {AvisoUnicoService} service Servicio para obtener datos relacionados con el aviso único.
   * @param {UnicoStore} unicoStore Almacén para manejar el estado de la aplicación.
   * @param {UnicoQuery} unicoQuery Consultas para obtener el estado actual de la aplicación.
   * @param {ConsultaioQuery} consultaioQuery Consulta para obtener el estado de la consulta.
   */
  constructor(
    private fb: FormBuilder,
    private service: AvisoUnicoService,
    private unicoStore: UnicoStore,
    private unicoQuery: UnicoQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Constructor del componente: inicializa las dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga datos iniciales y se suscribe al estado de la aplicación.
   */
  ngOnInit(): void {
    this.unicoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.initializeForm();
    this.loadLocalidad();
    this.loadAsignacionData();
    this.cargarRadio();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados basados en el estado actual de la solicitud.
   * @private
   */
  private initializeForm(): void {
    this.avisoForm = this.fb.group({
      mapTipoTramite: [this.solicitudState?.mapTipoTramite, [Validators.required]],
      mapDeclaracionSolicitud: [this.solicitudState?.mapDeclaracionSolicitud, [Validators.requiredTrue]],
      envioAviso: [this.solicitudState?.envioAviso, [Validators.requiredTrue]],
      numeroAviso: [this.solicitudState?.numeroAviso, [Validators.requiredTrue]],
      claveReferencia: [''],
      numeroOperacion: [
        this.solicitudState?.numeroOperacion,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      ],
      cadenaDependencia: [{ value: '', disabled: true }],
      banco: [this.solicitudState?.banco],
      llavePago: [
        this.solicitudState?.llavePago,
        [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
      ],
      fechaPago: [this.solicitudState?.fechaPago, [AvisoDeRenovacionComponent.validarFechaFutura]],
      importePago: [{ value: '', disabled: true }],
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * Carga datos de asignación desde el servicio y actualiza el formulario con la clave de referencia, cadena de dependencia y importe de pago.
   */
  loadAsignacionData(): void {
    this.service.getSolicitante()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: AvisoValor) => {
        this.avisoForm.patchValue({
          claveReferencia: data.claveReferencia,
          cadenaDependencia: data.cadenaDependencia,
          importePago: data.importePago,
        });
        
        // Deshabilitar los campos de solo lectura después de configurar sus valores
        this.avisoForm.get('claveReferencia')?.disable();
        this.avisoForm.get('cadenaDependencia')?.disable();
        this.avisoForm.get('importePago')?.disable();
      });
  }

  /**
   * Carga la lista de localidades desde el servicio y las almacena en la propiedad `localidadList`.
   */
  loadLocalidad(): void {
    this.service.obtenerDatosLocalidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.localidadList = data as Catalogo[];
      });
  }

  /**
   * Carga las opciones de tipo de persona desde el servicio y las almacena en la propiedad `tipoPersonaOptions`.
   */
  cargarRadio(): void {
    this.service.obtenerRadio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.tipoPersonaOptions = resp;
      });
  }

  /**
   * Validator for DD/MM/YYYY using existing utility
   * @param control Form control to validate
   * @returns Validation error or null
   */
  private static validarFechaFutura(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const FECHA_CONVERTIDA = convertirFechaDdMmYyyyAMoment(control.value);
    if (!FECHA_CONVERTIDA) {
      return null;
    }

    const FECHA = new Date(FECHA_CONVERTIDA);
    const HOY = new Date();
    
    FECHA.setHours(0, 0, 0, 0);
    HOY.setHours(0, 0, 0, 0);

    return FECHA > HOY ? { futureDateNotAllowed: true } : null;
  }

  /**
   * Maneja el cambio de valor en el campo de fecha de pago.
   * @param {string} nuevo_valor Nuevo valor de la fecha.
   */
  public onFechaCambiada(nuevo_valor: string): void {
    this.avisoForm.get('fechaPago')?.setValue(nuevo_valor);
    this.avisoForm.get('fechaPago')?.markAsTouched();
    this.avisoForm.get('fechaPago')?.updateValueAndValidity();
    this.unicoStore.setfechaPago(nuevo_valor);
  }

  /**
   * Resetea los datos relacionados con el pago en el formulario, borrando el número de operación, banco, llave de pago y fecha de pago.
   */
  resetPagoDatos(): void {
    this.avisoForm.patchValue({
      numeroOperacion: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
    });
    
    // Marque los campos obligatorios como tocados para activar la visualización de validación
    this.avisoForm.get('numeroOperacion')?.markAsTouched();
    this.avisoForm.get('llavePago')?.markAsTouched();
  }

  /**
   * Establece valores en el almacén desde el formulario.
   * @param {FormGroup} form Formulario reactivo.
   * @param {string} campo Nombre del campo en el formulario.
   * @param {keyof UnicoStore} metodoNombre Nombre del método en el almacén.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof UnicoStore): void {
    const VALOR = form.get(campo)?.value;
    (this.unicoStore[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Libera recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * @private
   */
  private inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.avisoForm?.disable();
    } else {
      this.avisoForm?.enable();
    }
  }

  /**
  * Verifica si un control del formulario es inválido, tocado o modificado.
  * @param nombreControl - Nombre del control a verificar.
  * @returns True si el control es inválido, de lo contrario false.
  */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.avisoForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
 * Maneja el evento blur (pérdida de foco) en los campos del formulario
 * para activar la validación visual.
 *
 * @param fieldName - Nombre del campo que perdió el foco.
 */
  public onFieldBlur(fieldName: string): void {
    const CONTROL = this.avisoForm.get(fieldName);
    if (CONTROL) {
      CONTROL.markAsTouched();
      CONTROL.markAsDirty();
    }
  }

  /**
   * Valida el formulario de aviso de renovación.
   * Marca todos los campos como tocados para mostrar errores de validación.
   * @returns {boolean} true si el formulario es válido, false en caso contrario.
   */
  public validarFormulario(): boolean {
    if (!this.avisoForm) {
      return false;
    }

    // Marcar todos los controles como tocados para mostrar errores
    this.marcarTodosLosCamposComoTocados();

    // Retornar el estado de validez del formulario
    return this.avisoForm.valid;
  }

  /**
   * Marca todos los campos del formulario como tocados para activar la visualización de errores.
   * @private
   */
  private marcarTodosLosCamposComoTocados(): void {
    Object.keys(this.avisoForm.controls).forEach(campo => {
      const CONTROL = this.avisoForm.get(campo);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.markAsDirty();
        CONTROL.updateValueAndValidity();
      }
    });
  }

}