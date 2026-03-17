import { Component, OnInit, computed, effect, inject, input, signal, untracked } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { SHARED_MODULES } from "../../shared-imports";

import { Catalogo, InputFecha } from '@ng-mf/data-access-user';

import { FECHA } from "../../enum/autorizaciones.enum";

import { Pago, Tramite230901Store } from "../../estados/store/tramite230901.store";

import { DatosTramite230902Service } from "../../services/datos-tramite-230901.service";
import { UtilidadesService } from "../../services/utilidades.service";
import { DefaultValidacionFormularios } from "../../interfaces/catalogos.response";
import { ValidacionFormularios } from "../../interfaces/catalogos.interface";


/**
 * Componente que gestiona los datos relacionados con el pago de derechos en el trámite "230901".
 * Incluye la configuración de formularios, la interacción con servicios relacionados con autorizaciones
 * de vida silvestre y la gestión del estado del trámite.
 */
// eslint-disable-next-line no-console
@Component({
  selector: 'pago-de-derechos',
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
  standalone: true,
  imports: [SHARED_MODULES]
})
export class PagoDeDerechosComponent implements OnInit {
  /** 
   * Inyección de dependencia para construir formularios reactivos. 
  */
  private formBuilder = inject(FormBuilder)
  /**
   * Inyección de dependencia de servicio para invocar el storage.
   */
  public store = inject(Tramite230901Store)
  /** 
   * Inyección de dependencia de servicio para invocar los servicios de catlogos a necesitar.
  */
  public datosService = inject(DatosTramite230902Service)
  /**
   * Utilidades a reutilizar dentro del tramite
   */
  public utils = inject(UtilidadesService);

  /** 
   * Inicializa el estado del formulario 
  */
  public solicitudState = this.utils.solicitud;

  /** 
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`. 
  */
  public consultaState = this.utils.consultaState;

  /** 
   * Formulario reactivo para capturar los datos del pago de derechos.
  */
  formularioPagoDerechos!: FormGroup;

  /** 
   * Configuración de la fecha final para el campo "Fecha de Pago". 
  */
  configuracionFechaFinal: InputFecha = FECHA;

  /** 
   * Indica si el formulario está en modo solo lectura. 
  */
  esFormularioSoloLectura = signal<boolean>(this.consultaState().readonly);

  /**
   * Valida si el formulario esta validado par continuar el proceso caso contrario habilita el formulario requerido
   */
  esGuardarDatos = input<ValidacionFormularios>(DefaultValidacionFormularios);

  /**
   * Servico que muestra el listado de Bancos
   */
  bancos: Catalogo[] = this.datosService.listaBancos();

  /** 
* Computed para obtener los valores del formulario
*/
  get formControls(): { [key: string]: AbstractControl } { return this.formularioPagoDerechos.controls; }

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      const VALUE = this.esGuardarDatos();
      untracked(() => {
        const { isFormValid, isGuardForm } = VALUE;
        if (!isFormValid && isGuardForm) {
          this.formularioPagoDerechos.markAllAsTouched();
        }
      });

    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa los catálogos de datos de pago de derechos, se suscribe al estado de la solicitud
   * y crea el formulario de pago.
   */
  ngOnInit(): void {
    this.crearformularioPagoDerechos();
    this.cargaInicialDatos();
  }

  /**
   * Inicializa la carga de datos dependiento del status de la consulta;
   */
  cargaInicialDatos() {

    if (this.esFormularioSoloLectura()) {
      this.bancos = this.solicitudState().pago.banco!;
    }
    const DATOS_PAGO = { ...this.solicitudState().pago, ...this.datosService.datosPago() }
    this.utils.setFormValores<Pago>(this.formularioPagoDerechos, DATOS_PAGO)
  }

  /**
   * Crea el formulario reactivo para capturar los datos del pago de derechos.
   * Algunos campos, como `claveDeReferencia`, `cadenaPagoDependencia` y `impPago`,
   * están deshabilitados porque no deben ser editados por el usuario.
   */
  crearformularioPagoDerechos(): void {
    this.formularioPagoDerechos = this.formBuilder.group({
      cve_referencia_bancaria: [{ value: '', disabled: true }, Validators.required],
      cadena_pago_dependencia: [{ value: '', disabled: true }, [Validators.required]],
      llave_pago: [{ value: '', disabled: this.esFormularioSoloLectura() }, [Validators.required, Validators.maxLength(10), Validators.pattern('^[A-Za-z]{10}$')]],
      fec_pago: ['', [Validators.required]],
      cve_banco: ['', [Validators.required]],
      imp_pago: [{ value: '', disabled: true }, [Validators.required]],
    })
  }

  /**
   * Maneja los cambios en el campo "Fecha de Pago".
   * 
   * @param nuevo_valor Es el valor proporcionado por el componente fecha
   */
  cambioFechaFinal(nuevo_valor: string): void {
    this.utils.setFormValores<Pago>(this.formularioPagoDerechos, { 'fec_pago': nuevo_valor })
  }

  /** 
   * Valida el estatus del fromulario y setea valos en el store
  */
  esValidoFormulario(): void {
    this.store.setPagoDerechos(this.formularioPagoDerechos.getRawValue())
    this.store.setPasoUno({ paginaTab: 4, completado: this.formularioPagoDerechos.valid })
  }

}