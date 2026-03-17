import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AlertComponent, Catalogo, REGEX_NUMERO_DECIMAL_2_DIGITOS, REGEX_PATRON_ALFANUMERICO, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputCheckComponent } from '@libs/shared/data-access-user/src/tramites/components/input-check/input-check.component';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';

import { Subject,combineLatest, takeUntil } from 'rxjs';
import { Tramite30401Store, Tramites30401State } from '../../estados/tramites30401.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { NOTA } from '../../enums/registro-empresas-transporte.enum';
import { RegistroEmpresasTransporteService } from '../../services/registro-empresas-transporte.service';
import { Tramite30401Query } from '../../estados/tramites30401.query';

/**
 * Componente PagoDeDerechosComponent para la gestión del proceso de pago de derechos.
 * 
 * Este componente independiente (`standalone`) permite capturar, validar y gestionar información
 * relacionada con el pago de derechos. Integra múltiples componentes reutilizables y utiliza servicios
 * para gestionar la lógica del negocio.
 * 
 * @component
 * @selector app-pago-de-derechos
 * @standalone true
 * @imports CommonModule, ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, AlertComponent, InputCheckComponent
 * @providers RegistroEmpresasTransporteService
 * @templateUrl ./pago-de-derechos.component.html
 * @styleUrl ./pago-de-derechos.component.scss
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    AlertComponent,
    InputCheckComponent,
  ],
  providers: [RegistroEmpresasTransporteService],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {
     /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Formulario reactivo para manejar los campos de entrada del usuario.
   */
  public pagoDeDerechosForm!: FormGroup;

  /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   */
  public destroyed$ = new Subject<void>();

  /**
   * Lista de datos relacionados con bancos obtenidos desde el servicio.
   */
  public bancoList!: Catalogo[];

  /**
   * Declaración bajo protesta de decir verdad.
   */
  public EFECTUAR_EL_PAGO = NOTA.EFECTUAR_EL_PAGO;

  /**
   * Nota: Debes capturar todos los campos de pago de aprovechamiento
   */
  public DEBES_CAPTURAR = NOTA.DEBES_CAPTURAR;

  /**
   * @property {Tramites30401State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Tramites30401State;

  /**
   * Constructor para inyectar los servicios y las tiendas necesarias.
   * @param fb - FormBuilder para formularios reactivos.
   * @param tramite30401Store - Tienda para gestionar el estado del formulario.
   * @param tramite30401Query - Servicio de consulta para acceder a los datos del store.
   * @param Servicio - Servicio para obtener la lista de bancos.
   */
  constructor(
    public fb: FormBuilder,
    private tramite30401Store: Tramite30401Store,
    private tramite30401Query: Tramite30401Query,
    private Servicio: RegistroEmpresasTransporteService,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Hook de ciclo de vida para inicializar la lógica del componente y cargar datos.
   */
  ngOnInit(): void {
    this.obtenerBancoList();
    this.inicializarComponenteConDatos();
  }

  /**
   * Inicializa el componente esperando a que ambos observables tengan datos
   */
  private inicializarComponenteConDatos(): void {
    combineLatest([
      this.consultaioQuery.selectConsultaioState$,
      this.tramite30401Query.selectTramite30401$
    ]).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(([consultaState, tramiteState]) => {
      const PREV_READONLY = this.esFormularioSoloLectura;
      this.esFormularioSoloLectura = consultaState.readonly;
      this.seccionState = tramiteState;

      if (!this.pagoDeDerechosForm || PREV_READONLY !== this.esFormularioSoloLectura) {
        this.crearForm();
      } else if (this.pagoDeDerechosForm) {
        this.actualizarValoresFormulario();
      }

      this.aplicarEstadoFormulario();
    });
  }

  /**
   * Crea el formulario reactivo con las reglas de validación para cada control.
   */
  crearForm(): void {
   this.pagoDeDerechosForm = this.fb.group({
  claveDeReferencia: [
    this.seccionState?.claveDeReferencia || '',
    [Validators.required, Validators.maxLength(9),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)],
  ],
  cadenaPagoDependencia: [
    this.seccionState?.cadenaPagoDependencia || '',
    [Validators.required, Validators.maxLength(14), Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
  ],
  clave: [this.seccionState?.clave || '', Validators.required],
  llaveDePago: [
    this.seccionState?.llaveDePago || '',
    [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)],
  ],
  fecPago: [
    this.seccionState?.fecPago || '',
    [Validators.required, PagoDeDerechosComponent.fechaLimValidator()],
  ],
  impPago: [
        this.seccionState?.impPago || '',
        [
          Validators.required,
          Validators.maxLength(16),
          PagoDeDerechosComponent.noComaValidator(),
          Validators.pattern(REGEX_NUMERO_DECIMAL_2_DIGITOS),
        ],
      ],
      manifiestoDeclaracion: [
        this.seccionState?.manifiestoDeclaracion || '',
        [Validators.requiredTrue],
      ],
});
  }

  /**
   * Actualiza los valores del formulario existente con los datos del estado
   */
  private actualizarValoresFormulario(): void {
    if (this.pagoDeDerechosForm && this.seccionState) {
      this.pagoDeDerechosForm.patchValue({
        claveDeReferencia: this.seccionState.claveDeReferencia || '',
        cadenaPagoDependencia: this.seccionState.cadenaPagoDependencia || '',
        clave: this.seccionState.clave || '',
        llaveDePago: this.seccionState.llaveDePago || '',
        fecPago: this.seccionState.fecPago || '',
        impPago: this.seccionState.impPago || '',
        manifiestoDeclaracion: this.seccionState.manifiestoDeclaracion || ''
      }, { emitEvent: false });
    }
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
   * inicializa el formulario o guarda los datos del formulario.
   */
inicializarEstadoFormulario(): void {
       if (!this.pagoDeDerechosForm) {
      this.crearForm();
    }
    this.aplicarEstadoFormulario();
  }
    /**
   * @method
   * @name guardarDatosFormulario
   * @description
   * Inicializa los formularios y obtiene los datos de la tabla.
   * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
   * deshabilita o habilita todos los formularios del componente.
   * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
   * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
   *
   * @returns {void}
   */
  guardarDatosFormulario(): void {
   if (!this.pagoDeDerechosForm) {
      this.crearForm();
    }
    this.aplicarEstadoFormulario();
  }
    /**
   * Aplica el estado de solo lectura al formulario sin recrearlo
   */
  private aplicarEstadoFormulario(): void {
    if (this.pagoDeDerechosForm) {
      if (this.esFormularioSoloLectura) {
        this.pagoDeDerechosForm.disable();
      } else {
        this.pagoDeDerechosForm.enable();
      }
    }
  }
  /**
   * Método para validar que el campo de un formulario no contenga comas.
   * Actualiza el estado de validez del campo especificado sin emitir eventos adicionales.
   *
   * @param {string} compo - El nombre del campo de formulario que se validará.
   */
  public validarSinComas(compo: string): void {
    this.pagoDeDerechosForm
      .get(compo)
      ?.updateValueAndValidity({ emitEvent: false });
  }

  /**
 * Maneja la transformación a mayúsculas de los valores de los campos de entrada.
 *
 * @param {string} field - Nombre del campo de control del formulario.
 * @param {Event} event - Evento activado por el cambio en el campo de entrada.
 *
 * @description
 * Este método captura el evento de entrada y convierte el valor ingresado
 * a mayúsculas antes de actualizar el control de formulario especificado. 
 * Se evita la emisión del evento para prevenir actualizaciones innecesarias del formulario.
 */

  public manejarEntradaMayusculas(field: string, event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT && INPUT.value) {
      this.pagoDeDerechosForm.get(field)?.setValue(INPUT.value.toUpperCase(), { emitEvent: false });
    }
  }
  /**
   * Método para validar cambios en un campo de formulario relacionado con fechas futuras.
   * Monitorea los cambios de valor del campo especificado y actualiza su estado de validación sin emitir eventos adicionales.
   * Utiliza operadores de RxJS como distinctUntilChanged y takeUntil para manejar suscripciones de forma eficiente y evitar fugas de memoria.
   *
   * @param {string} compo - El nombre del campo de formulario que se validará.
   */
  public validarFechaFutura(compo: string): void {
    this.pagoDeDerechosForm
      .get(compo)
      ?.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Validador para asegurar que la fecha seleccionada no sea en el futuro.
   */
  public static fechaLimValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const LIM = control.value;
      if (LIM) {
        const [YEAR, MONTH, DAY] = LIM.split('-');
        const FECHA = new Date(+Number(YEAR), +Number(MONTH) - 1, +Number(DAY));
        const TODAY = new Date();
        if (FECHA.getTime() > TODAY.getTime()) {
          return { fechaLim: true }; // Retorna error si la fecha está en el futuro
        }
      }
      return null; // Fecha válida
    };
  }

  /**
   * Validador para asegurar que la entrada no contenga comas.
   */
  public static noComaValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const VALUE = control.value;
      if (VALUE && VALUE.includes(',')) {
        return { noComa: true }; // Retorna error si el valor contiene comas
      }
      return null; // Entrada válida
    };
  }

  /**
   * Obtiene la lista de bancos del servicio y la asigna a `obtenerBancoList`.
   */
  obtenerBancoList(): void {
    this.Servicio.onBancoList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        this.bancoList = data;
      });
  }

  /**
   * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite30401Store.establecerDatos({ [campo]: CONTROL.value });
    }
  }

  /**
   * Actualiza el formulario con datos obtenidos desde la tienda.
   */
  public enPatchStoredFormData(): void {
    this.tramite30401Query.selectTramite30401$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Tramites30401State) => {
        this.seccionState = datos;
      });
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.pagoDeDerechosForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
 * Restablece el formulario de pago de derechos.
 *
 * @description
 * Este método reinicia todos los valores del formulario `pagoDeDerechosForm`,
 * eliminando cualquier dato ingresado previamente.
 */
  public borrarDatosDelPago(): void {
    this.pagoDeDerechosForm.reset();
  }
  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}