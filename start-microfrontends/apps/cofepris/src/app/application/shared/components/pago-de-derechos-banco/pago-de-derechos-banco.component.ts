import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {
  Catalogo,
  CatalogosSelect,
  InputFechaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CatalogoServices, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import {
  SolicitudPagoBancoState,
  TramitePagoBancoStore,
} from '../../estados/stores/pago-banco.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { INPUT_FECHA_CONFIG } from '../../constantes/pago-banco.enum';
import { PagoBancoService } from '../../services/pago-banco.service';
import { TramitePagoBancoQuery } from '../../estados/queries/pago-banco.query';

@Component({
  selector: 'app-pago-de-derechos-banco',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputFechaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './pago-de-derechos-banco.component.html',
  styleUrl: './pago-de-derechos-banco.component.scss',
})
export class PagoDeDerechosBancoComponent implements OnInit, OnDestroy, OnChanges {

   /**
   * Indica si sólo se requiere el campo "colón".
   *
   * @type {boolean}
   * @default false
   */
  @Input() soloDosPuntosRequeridos: boolean = false;

  /**
   * Indica si la fecha ingresada es válida (no es futura).
   * @type {boolean}
   */
  public esFechaValida: boolean = true;

  /** Indica si el botón continuar ha sido clickeado. */

  public isContinuarButtonClicked: boolean = false; 

  /**
   * Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

    /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   * Este valor se utiliza para cargar datos específicos relacionados con el procedimiento,
   * como catálogos o listas asociadas.
   */
  @Input() idProcedimiento!: number;

  /**
   * Indica si se debe eliminar el validador 'required' del campo claveDeReferencia en el formulario.
   * Cuando es verdadero, el campo claveDeReferencia no será obligatorio.
   */
  @Input() removeClaveDeReferenciaValidator: boolean = false;

  /**
   * Formulario de la solicitud.
   */
  formSolicitud!: FormGroup;

  /**
   * Emite el estado de validez del formulario.
   */
  @Output() formValidityChange = new EventEmitter<boolean>();

  /**
   * Estado de la solicitud de la sección PagoBanco.
   */
  public solicitudState!: SolicitudPagoBancoState;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constante para configurar el input de fecha.
   */
  INPUT_FECHA_CONFIG = INPUT_FECHA_CONFIG;

  /** Bandera de solo lectura (puedes adaptarla si tienes lógica para esto) */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   */
  constructor(
    private fb: FormBuilder,
    private tramitePagoBancoStore: TramitePagoBancoStore,
    private tramitePagoBancoQuery: TramitePagoBancoQuery,
    @Inject(PagoBancoService)
    private servicio: PagoBancoService,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Inicializa el formulario.
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly;
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Catálogo de bancos.
   */
  public bancoCatalogo: CatalogosSelect = {
    labelNombre: 'Banco',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

    /**
   * Inicializa el formulario reactivo para capturar el estado seleccionado.
   */
    inicializarFormulario(): void {
      this.tramitePagoBancoQuery.selectSolicitud$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        )
        .subscribe();

        this.configurarFormularioPagoBanco();
    }

  /**
   * Método para actualizar el banco seleccionado.
   * @param e {Catalogo} Banco seleccionado.
   */
  ngOnInit(): void {
    this.tramitePagoBancoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          if(this.formSolicitud) {
            this.formSolicitud.patchValue({
              datosImportadorExportador: {
                claveDeReferencia: this.solicitudState?.claveDeReferencia,
                cadenaDependencia: this.solicitudState?.cadenaDependencia,
                banco: this.solicitudState?.banco,
                llaveDePago: this.solicitudState?.llaveDePago,
                fechaPago: this.solicitudState?.fechaPago,
                importePago: this.solicitudState?.importePago
              }
            });
          }
        })
      )
      .subscribe();  
    this.obtenerDatosBanco();
    this.configurarFormularioPagoBanco();
    this.inicializarEstadoFormulario();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando cambian las propiedades de entrada del componente.
   * Marca el formulario como 'tocado' para mostrar los errores de validación si corresponde.
   */
  ngOnChanges(): void {
    this.markTouched();
  }

  /**
   * Marca como 'tocado' el formulario de importador/exportador si se ha activado la validación (isContinuarTriggered)
   * y existe una clave de referencia. Esto fuerza la visualización de errores de validación en los campos del formulario.
   */
  markTouched(): void {
    if (this.isContinuarTriggered && this.solicitudState?.claveDeReferencia !== '') {
      Promise.resolve().then(() => {
        this.formSolicitud.get('datosImportadorExportador')?.markAllAsTouched();
      });
    }
  }

  /**
   * Configura el formulario para la sección de pago de derechos en banco.
   */
  configurarFormularioPagoBanco(): void {
    const NOMULTISPACE = /^(?!.* {2,}).*$/;
    let CLAVE_VALIDATORS = [Validators.required, Validators.maxLength(9), Validators.pattern(NOMULTISPACE)];
    this.formSolicitud = this.fb.group({
      datosImportadorExportador: this.fb.group({
        claveDeReferencia: [this.solicitudState?.claveDeReferencia, CLAVE_VALIDATORS],
        cadenaDependencia: [this.solicitudState?.cadenaDependencia,[Validators.required, Validators.maxLength(14)]],
        banco: [this.solicitudState?.banco, [Validators.required]], 
        llaveDePago: [this.solicitudState?.llaveDePago,[Validators.required, Validators.maxLength(30),Validators.pattern(/^[A-Za-z0-9]+$/)]],
        fechaPago: [this.solicitudState?.fechaPago,[Validators.required, PagoDeDerechosBancoComponent.validarFechaNoFutura]],
        importePago: [this.solicitudState?.importePago,[Validators.required, Validators.maxLength(16),PagoDeDerechosBancoComponent.validarNumeroDecimal]],
      }),
    });
       this.formSolicitud.statusChanges.subscribe(status => {
      this.formValidityChange.emit(this.formSolicitud.valid);
    });

    if (this.removeClaveDeReferenciaValidator) {
      CLAVE_VALIDATORS = CLAVE_VALIDATORS.filter(v => v !== Validators.required);
      const CONTROL = this.formSolicitud.get('datosImportadorExportador.claveDeReferencia');
      CONTROL?.setValidators(CLAVE_VALIDATORS);
      CONTROL?.updateValueAndValidity();
    }
  }

  /**
   * Carga datos y deshabilita el formulario si es solo lectura.
  */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formSolicitud.disable();
    } else {
      this.formSolicitud.enable();
    }
  }

  /**
   * Método para actualizar el banco seleccionado.
   * @param e {Catalogo} Banco seleccionado.
   */
  obtenerDatosBanco(): void {
    if (this.idProcedimiento) {
      this.servicio
      .getBancoList(this.idProcedimiento.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.bancoCatalogo.catalogos = data.datos as Catalogo[];
      });
    } else {
      this.servicio
      .consultarDatosBanco()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.bancoCatalogo.catalogos = data as Catalogo[];
      });
    }
  }

   /**
   * @method cambioFechaPago
   * @description Updates the payment date in the form and validates it.
   *
   * @param {string} fecha - The selected date from the InputFecha component.
   */
  cambioFechaPago(fecha: string): void {
    this.datosImportadorExportador.patchValue({ fechaPago: fecha });
    const FECHACONTROL = this.datosImportadorExportador.get('fechaPago');
    if (FECHACONTROL) {
      FECHACONTROL.markAsTouched();
      FECHACONTROL.markAsDirty();
      this.esFechaPasada(fecha); 
      if (!this.esFechaValida) {
        FECHACONTROL.setErrors({ esFechaPasada: true });
      } else {
        FECHACONTROL.setErrors(null);
      }
    }
    this.setValoresStore(this.datosImportadorExportador, 'fechaPago', 'setFechaPago');
  }

 /**
   * @method esFechaPasada
   * @description Verifica si una fecha proporcionada es anterior o igual a la fecha actual.
   *
   * @param {string} fechaStr - La fecha en formato de cadena que se desea evaluar.
   *
   * @returns {void} No retorna ningún valor, pero actualiza la propiedad `esFechaValida`
   * indicando si la fecha proporcionada es válida.
   */
  esFechaPasada(fechaStr: string): void {
    if (!fechaStr) {
      this.esFechaValida = false;
      return;
    }

    const [DAY, MONTH, YEAR] = fechaStr.split('/').map(Number);
    const FECHA_ENTRADA = new Date(YEAR, MONTH - 1, DAY);
    const HOY = new Date();

   
    HOY.setHours(0, 0, 0, 0);
    FECHA_ENTRADA.setHours(0, 0, 0, 0);

    this.esFechaValida = FECHA_ENTRADA <= HOY;
  }

  

  /**
 * Valida el formulario principal de pago de derechos banco.
 * Retorna true si el formulario es válido, false en caso contrario.
 */
public validarFormularios(): boolean {
  return this.formSolicitud?.valid ?? false;
}
 /**
   * Método para actualizar el banco seleccionado.
   * @param e {Catalogo} Banco seleccionado.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof TramitePagoBancoStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (
      this.tramitePagoBancoStore[metodoNombre] as (
        value: string | number | null
      ) => void
    )(VALOR);
  }

  /**
  * @method borrarDatos
  * @description
  * Método que limpia los datos del formulario relacionado con el importador/exportador.
  */
  borrarDatos(): void {
    this.datosImportadorExportador.reset();
    this.tramitePagoBancoStore.limpiarSolicitud();
  }

  /**
   * Método para actualizar el banco seleccionado.
   * @param e {Catalogo} Banco seleccionado.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método para actualizar el banco seleccionado.
   * @param e {Catalogo} Banco seleccionado.
   */
  get datosImportadorExportador(): FormGroup {
    return this.formSolicitud.get('datosImportadorExportador') as FormGroup;
  }
  static validarNumeroDecimal(control: AbstractControl): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === '') {
      return null;
    }
    
    // Allow numbers with up to 2 decimal places
    const REGEX = /^\d+(\.\d{1,2})?$/;
    return REGEX.test(VALOR.toString()) ? null : { invalidDecimal: true };
  }
  static validarFechaNoFutura(control: AbstractControl): ValidationErrors | null {
    const FECHA_INGRESADA = new Date(control.value);
    const FECHA_ACTUAL = new Date();
  
    // Clear time for accurate comparison
    FECHA_INGRESADA.setHours(0, 0, 0, 0);
    FECHA_ACTUAL .setHours(0, 0, 0, 0);
  
    return FECHA_INGRESADA > FECHA_ACTUAL ? { fechaFuturaInvalida: true } : null;
  }

  formularioSolicitudValidacion(): boolean {
  this.isContinuarButtonClicked = false;

  const GRUPO = this.formSolicitud.get('datosImportadorExportador') as FormGroup;
  const CLAVE_REFERENCIA_VALUE = GRUPO.get('claveDeReferencia')?.value;
  const CADENA_DEPENDENCIA_VALUE = GRUPO.get('cadenaDependencia')?.value;
  const LLAVE_PAGO_VALUE = GRUPO.get('llaveDePago')?.value;
  const IMPORTE_PAGO_VALUE = GRUPO.get('importePago')?.value;
  const FECHA_PAGO_VALUE = GRUPO.get('fechaPago')?.value;
  const BANCO_PAGO_VALUE = GRUPO.get('banco')?.value;

  const ANY_FIELDS_HAVE_VALUE =
    (CLAVE_REFERENCIA_VALUE !== '' && CLAVE_REFERENCIA_VALUE !== null) ||
    (CADENA_DEPENDENCIA_VALUE !== '' && CADENA_DEPENDENCIA_VALUE !== null) ||
    (LLAVE_PAGO_VALUE !== '' && LLAVE_PAGO_VALUE !== null) ||
    (IMPORTE_PAGO_VALUE !== '' && IMPORTE_PAGO_VALUE !== null) ||
    (FECHA_PAGO_VALUE !== '' && FECHA_PAGO_VALUE !== null) ||
    (BANCO_PAGO_VALUE !== '' && BANCO_PAGO_VALUE !== null && BANCO_PAGO_VALUE !== '-1');

  if (ANY_FIELDS_HAVE_VALUE) {
    GRUPO.markAllAsTouched();
    this.isContinuarButtonClicked = true;
  }

  return this.isAllFieldHaveValue();
}

isAllFieldHaveValue(): boolean {
  const GRUPO = this.formSolicitud.get('datosImportadorExportador') as FormGroup;
  const CLAVE_REFERENCIA_VALUE = GRUPO.get('claveDeReferencia')?.value;
  const CADENA_DEPENDENCIA_VALUE = GRUPO.get('cadenaDependencia')?.value;
  const LLAVE_PAGO_VALUE = GRUPO.get('llaveDePago')?.value;
  const IMPORTE_PAGO_VALUE = GRUPO.get('importePago')?.value;
  const FECHA_PAGO_VALUE = GRUPO.get('fechaPago')?.value;
  const BANCO_PAGO_VALUE = GRUPO.get('banco')?.value;

  const ALL_FIELDS_VALID =
    (CLAVE_REFERENCIA_VALUE !== '' && CLAVE_REFERENCIA_VALUE !== null) &&
    (CADENA_DEPENDENCIA_VALUE !== '' && CADENA_DEPENDENCIA_VALUE !== null) &&
    (LLAVE_PAGO_VALUE !== '' && LLAVE_PAGO_VALUE !== null) &&
    (IMPORTE_PAGO_VALUE !== '' && IMPORTE_PAGO_VALUE !== null) &&
    (FECHA_PAGO_VALUE !== '' && FECHA_PAGO_VALUE !== null) &&
    (BANCO_PAGO_VALUE !== '' && BANCO_PAGO_VALUE !== null && BANCO_PAGO_VALUE !== '-1');

  return ALL_FIELDS_VALID;
}

llavePagoCase(): void {
  const GRUPO = this.formSolicitud.get('datosImportadorExportador') as FormGroup;
  const LLAVEPAGOCONTROL = GRUPO.get('llaveDePago');
  if (LLAVEPAGOCONTROL && LLAVEPAGOCONTROL.value) {
    const LLAVE_PAGO = LLAVEPAGOCONTROL.value.toUpperCase();
    LLAVEPAGOCONTROL.setValue(LLAVE_PAGO);
    this.setValoresStore(GRUPO, 'llaveDePago', 'setllaveDePago');
  }
}

}
