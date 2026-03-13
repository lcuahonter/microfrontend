
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Catalogo, CatalogoSelectComponent, InputFecha, InputFechaComponent, REGEX_CURP, REGEX_REEMPLAZAR, REGEX_SOLO_DIGITOS, TituloComponent } from '@libs/shared/data-access-user/src';
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud260702State, Solicitud260702Store, } from '../../../estados/stores/shared2607/tramites260702.store';
import { BANCO_DATA } from '../../../constantes/catalogs.enum';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { RegistrarSolicitudMcpService } from '../../../services/shared2607/registrar-solicitud-mcp.service';
import { Solicitud260702Query } from '../../../estados/queries/shared2607/tramites260702.query';

/**
 * Componente para gestionar el pago de derechos en el trámite.
 */
@Component({
  selector: 'app-pago-de-derecho',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
  ],
  templateUrl: './pago-de-derecho.component.html',
  styleUrls: ['./pago-de-derecho.component.scss'],
})
export class PagoDeDerechoComponent implements OnInit, OnDestroy,OnChanges {
  /** Formulario reactivo para gestionar los datos del pago de derechos */
  pagoDeDerechosForm!: FormGroup;

  /**
   * ID del procedimiento.
   * Este campo almacena el identificador único del procedimiento asociado a la solicitud.
   */
  @Input() idProcedimiento!: number;

  /** Observable para manejar la destrucción del componente */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Estado del pago de derechos que se está gestionando */
  pagoDeDerechosState!: Solicitud260702State;

  /** Datos del catálogo de bancos disponibles */
  public bancoData = BANCO_DATA;
  /**
   * Datos del catálogo de bancos disponibles. 
   */
   bancoDatos: Catalogo[] = [];
  /**
   * Configuración para el campo de selección de la fecha de pago.
   */
  fechaPago: InputFecha = {
    labelNombre: 'Fecha de pago',
    required: false,
    habilitado: true,
  };


  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  
    /**
     * Indica si se ha activado el evento de continuar.
     * Este valor se utiliza para controlar el flujo de la solicitud
     * dependiendo de si el usuario ha decidido continuar con el proceso.
     */
     @Input() isContinuarTriggered: boolean = false;
  /**
   * Constructor del componente.
   * @param registrarsolicitudmcp Servicio para registrar solicitudes MCP.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param cdr ChangeDetectorRef para detectar cambios.
   * @param solicitud260702Store Almacén de estado para el trámite 260702.
   * @param solicitud260702Query Almacén de estado para el trámite 260702.
   * @param consultaioQuery Consulta de estado para el trámite 260702
   */
  constructor(
    private registrarsolicitudmcp: RegistrarSolicitudMcpService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private solicitud260702Store: Solicitud260702Store,
    private solicitud260702Query: Solicitud260702Query,
    private consultaioQuery: ConsultaioQuery
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
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  
 /**
 * Detecta cambios en las propiedades de entrada del componente y ejecuta validaciones cuando se activa el botón continuar.
 * Utiliza Promise.resolve() para asegurar que la validación se ejecute en el próximo ciclo del event loop.
 */
  ngOnChanges(): void {
    if (this.isContinuarTriggered && this.pagoDeDerechosForm.get('pagoDeDerechos')) {
     this.pagoDeDerechosForm.get('pagoDeDerechos')?.markAllAsTouched();
    }
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
   * Validador estático que verifica si la fecha ingresada es futura.
   * @returns ValidatorFn
   */
  static validadorDeFechaFutura(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) { return null; }
      // Parse DD/MM/YYYY format
      const PARTS = control.value.split('/');
      if (PARTS.length !== 3) {return null;}
      const DAY = parseInt(PARTS[0], 10);
      const MONTH = parseInt(PARTS[1], 10) - 1; // JS months are 0-based
      const YEAR = parseInt(PARTS[2], 10);
      const SELECTED_DATE = new Date(YEAR, MONTH, DAY);
      if (isNaN(SELECTED_DATE.getTime())) {return null;}
      const TODAY = new Date();
      SELECTED_DATE.setHours(0, 0, 0, 0);
      TODAY.setHours(0, 0, 0, 0);
      return SELECTED_DATE > TODAY ? { futureDate: true } : null;
    };
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.solicitud260702Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.pagoDeDerechosState = seccionState;
        })
      )
      .subscribe();

    this.crearFormulario();
    this.getBancoData();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.pagoDeDerechosForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.pagoDeDerechosForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Obtiene los datos del catálogo de bancos.
   */
  getBancoData(): void {
    if (this.idProcedimiento) {
      this.registrarsolicitudmcp
        .obtenerBancos(this.idProcedimiento?.toString())
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.bancoDatos = data.datos ?? [];
        });
    } else {
      this.registrarsolicitudmcp
        .getBancoData()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data): void => {
          this.bancoDatos = data;
        });
    }
  }

  /**
   * Crea el formulario reactivo para gestionar los datos del pago de derechos.
   */
  crearFormulario(): void {
    this.pagoDeDerechosForm = this.fb.group({
      pagoDeDerechos: this.fb.group({
        clavedereferencia: [
          { value: this.pagoDeDerechosState?.clavedereferencia, disabled: this.esFormularioSoloLectura },
          [Validators.required, Validators.pattern(REGEX_REEMPLAZAR)],
        ],
        cadenadeladependencia: [
          { value: this.pagoDeDerechosState?.cadenadeladependencia, disabled: this.esFormularioSoloLectura },
          [Validators.pattern(REGEX_REEMPLAZAR)],
        ],
        banco: [
          { value: this.pagoDeDerechosState?.banco, disabled: this.esFormularioSoloLectura },
          [Validators.required],
        ],
        llavedepago: [
          { value: this.pagoDeDerechosState?.llavedepago, disabled: this.esFormularioSoloLectura },
          [Validators.required, Validators.maxLength(18), Validators.pattern(REGEX_CURP)],
        ],
        fechadepago: [
          { value: this.pagoDeDerechosState?.fechadepago, disabled: this.esFormularioSoloLectura },
          [Validators.required, PagoDeDerechoComponent.validadorDeFechaFutura()],
        ],
        importedepago: [
          { value: this.pagoDeDerechosState?.importedepago, disabled: this.esFormularioSoloLectura },
          [
            Validators.pattern(REGEX_SOLO_DIGITOS)
          ],
        ],
      }),
    });
  }
  cambioFechaPago(nuevo_fechadepago: string): void {
    this.pagoDeDerechosForm.get('pagoDeDerechos.fechadepago')?.setValue(nuevo_fechadepago);
    this.pagoDeDerechosForm.get('pagoDeDerechos.fechadepago')?.markAsTouched();
    this.setValoresStore(this.pagoDeDerechosForm, 'fechadepago', 'setFechadePago');
  }

  /**
   * Limpia los datos del formulario.
   */
  clearForm(): void {
    this.pagoDeDerechosForm.reset();
  }

  /**
   * Getter para obtener el formulario de pago de derechos.
   */
  get pagoDeDerechos(): FormGroup {
    return this.pagoDeDerechosForm.get('pagoDeDerechos') as FormGroup;
  }

  /**
   * Establece valores en el store a partir del formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Método del store para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud260702Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud260702Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
