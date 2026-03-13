/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FECHA_FACTURA, PagoDerechosState } from '../../models/tramies230401.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputFecha, REGEX_IMPORTE_PAGO, REGEX_LLAVE_DE_PAGO, SeccionLibQuery, dateLessThanOrEqualToday } from '@libs/shared/data-access-user/src';
import {
  delay,
  map,
  takeUntil,
  tap,
} from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PantallasActionService } from '../../services/pantallas-action.service';
import { SeccionLibState } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { Solicitud230401Query } from '../../estados/queries/solicitud230401.query';
import { Subject } from 'rxjs';
import { Tramite230401Store } from '../../estados/tramite230401.store';

/**
 * Componente `PagoDeDerechosComponent` que gestiona el proceso de pago de derechos.
 * 
 * Este componente incluye un formulario reactivo para capturar información relacionada
 * con el pago de derechos, como el banco, la fecha y el importe del pago. También maneja
 * el estado del formulario y sincroniza los datos con el estado global de la aplicación.
 * 
 * Además, utiliza observables para suscribirse a cambios en el estado de diferentes
 * secciones y consultas, permitiendo una gestión dinámica del flujo de trabajo.
 * 
 * Propiedades:
 * - `pagoDerechos`: Formulario reactivo que contiene los campos relacionados con el pago de derechos.
 * - `clasificacion`: Clasificación seleccionada basada en el valor del campo 'banco'.
 * - `destroyNotifier$`: Notificador para gestionar la destrucción de suscripciones y evitar fugas de memoria.
 * - `pagoDerechosState`: Estado actual del pago de derechos dentro del componente.
 * - `seccion`: Estado de la sección en el componente.
 * - `esFormularioSoloLectura`: Indica si el formulario está en modo de solo lectura.
 * - `fechaDeLaFacturaInput`: Representa la fecha de la factura como una entrada de tipo `InputFecha`.
 * 
 * Métodos:
 * - `ngOnInit`: Inicializa el componente y configura las suscripciones necesarias.
 * - `inicializarEstadoFormulario`: Configura el formulario de pago de derechos y lo desactiva si está en modo de solo lectura.
 * - `createPagoDerechos`: Inicializa el formulario `pagoDerechos` con campos predefinidos y validaciones.
 * - `clasificacionSeleccione`: Actualiza la clasificación seleccionada basada en el valor del campo 'banco'.
 * - `onFechaCambiada`: Maneja el evento cuando la fecha es cambiada y actualiza el formulario.
 * - `ngOnDestroy`: Notifica la destrucción del componente y libera recursos.
 * 
 * Constructor:
 * - Inicializa los servicios y dependencias necesarias para el componente.
 * - Invoca la inicialización del catálogo de pago de derechos a través del servicio `PantallasActionService`.
 */
@Component({
  selector: 'app-pago-de-derechos',
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss'
})
export class PagoDeDerechosComponent implements OnInit , OnDestroy {
  /**
   * Formulario reactivo que contiene los campos de datos del importador/exportador.
   * El formulario incluye un campo 'linea' y un campo 'monto' con validaciones de 'required'.
   *
   * @type {FormGroup}
   */
  public pagoDerechos!: FormGroup;

  /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  public clasificacion: string = '';


  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * Este Subject emite un valor cuando el componente se destruye, lo que permite cancelar 
   * observables o realizar tareas de limpieza relacionadas con el ciclo de vida del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * Representa el estado actual del pago de derechos dentro del componente.
   * 
   * Esta propiedad se utiliza para gestionar y almacenar información relacionada
   * con el estado del proceso de pago de derechos. Puede incluir datos como el 
   * progreso del pago, validaciones, y cualquier otra información relevante para 
   * el flujo de trabajo de este componente.
   * 
   * @type {PagoDerechosState} 
   */
  public pagoDerechosState!: PagoDerechosState;


  /**
   * Propiedad privada que representa el estado de la sección en el componente.
   * 
   * Esta propiedad utiliza el tipo `SeccionLibState` para almacenar información 
   * relacionada con el estado de la sección actual en el flujo de trabajo del componente.
   * 
   * @public
   * @type {SeccionLibState}
   */
  public seccion!: SeccionLibState;


  /**
   * Indica si el formulario está en modo de solo lectura.
   * 
   * Cuando esta propiedad es `true`, el formulario no permite la edición
   * de sus campos y solo se puede visualizar la información. Si es `false`,
   * los campos del formulario son editables.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Representa la fecha de la factura como una entrada de tipo `InputFecha`.
   * Este valor se inicializa con la constante `FECHA_FACTURA`.
   * 
   * @type {InputFecha}
   */
  public fechaDeLaFacturaInput: InputFecha = FECHA_FACTURA;

  /**
   * Constructor de la clase `PagoDeDerechosComponent`.
   * 
   * Este constructor inicializa los servicios y dependencias necesarias para el componente
   * de pago de derechos. Además, invoca la inicialización del catálogo de pago de derechos
   * a través del servicio `PantallasActionService`.
   * 
   * @param pantallasService Servicio para gestionar acciones relacionadas con las pantallas.
   * @param fb Constructor de formularios reactivos (`FormBuilder`) para manejar formularios en el componente.
   * @param tramite230401Store Almacén para gestionar el estado del trámite 230401.
   * @param solicitud230401Query Consulta para obtener información relacionada con la solicitud 230401.
   * @param seccionQuery Consulta para obtener información de las secciones.
   * @param seccionStore Almacén para gestionar el estado de las secciones.
   * @param consultaQuery Consulta para obtener información adicional relacionada con el componente.
   */
  constructor(public pantallasService: PantallasActionService,
    private fb: FormBuilder,
    public tramite230401Store:Tramite230401Store, 
    public solicitud230401Query: Solicitud230401Query,
    public seccionQuery: SeccionLibQuery,
    public seccionStore: SeccionLibStore,
    public consultaQuery: ConsultaioQuery,
  ) {
    this.pantallasService.inicializaPagoDerechosCatalogo();
  }

  /**
   * Crea y configura el formulario de pago de derechos.
   * Los campos 'clave', 'dependencia', 'llavePago' e 'importePago' están deshabilitados por defecto.
   * Los campos 'banco' y 'fecha' son obligatorios.
   */
  ngOnInit(): void {
    this.solicitud230401Query.seletPagoDerechosState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.pagoDerechosState = seccionState;
        })
      ).subscribe();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if(!seccionState.create && seccionState.procedureId === '230401') {
            this.esFormularioSoloLectura = seccionState.readonly;
            this.fechaDeLaFacturaInput.habilitado = !this.esFormularioSoloLectura;
          }
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
    this.pagoDerechos.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_value) => {
          const SECCION: number = 2;
          const FORMAS_VALIDADAS = this.seccion.formaValida;
          const ES_VALIDO_EL_BANCO = this.pagoDerechos.get('banco')?.status;
          const ES_VALIDO_EL_FECHO = this.pagoDerechos.get('fecha')?.status;
          if (this.pagoDerechos.valid ||
            (ES_VALIDO_EL_BANCO === 'VALID' && ES_VALIDO_EL_FECHO === 'VALID')) {
            FORMAS_VALIDADAS[SECCION] = true;
            this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
          } else {
            FORMAS_VALIDADAS[SECCION] = false;
            this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
          }
        })
      )
      .subscribe();
  }


    /**
     * Inicializa el estado del formulario de pago de derechos.
     * 
     * Este método configura el formulario de pago de derechos llamando a la función `createPagoDerechos`.
     * Además, verifica si el formulario debe estar en modo de solo lectura y, en ese caso, desactiva el formulario
     * utilizando el método `disable` en el objeto `pagoDerechos`.
     * 
     * @returns {void} No retorna ningún valor.
     */
    inicializarEstadoFormulario(): void {
      this.createPagoDerechos();
      if (this.esFormularioSoloLectura) {
        this.pagoDerechos.disable();
      }
    }

  /**
   * Este método inicializa el formulario `pagoDerechos` con varios campos predefinidos
   * y sus respectivas validaciones. Algunos campos están deshabilitados y tienen valores
   * predeterminados.
   * Campos del formulario:
   * - clave: Clave del trámite, deshabilitado y con valor predeterminado.
   * - dependencia: Dependencia correspondiente, deshabilitado y con valor predeterminado.
   * - banco: Banco donde se realizará el pago, requerido.
   * - llavePago: Llave de pago, deshabilitado y con valor predeterminado.
   * - importePago: Importe del pago, deshabilitado y con valor predeterminado.
    */
  createPagoDerechos(): void {
    this.pagoDerechos = this.fb.group({
      clave:  [this.pagoDerechosState.clave, [Validators.required, Validators.maxLength(50)]],
      dependencia: [this.pagoDerechosState.dependencia, [Validators.required, Validators.maxLength(50)]],
      banco: [this.pagoDerechosState.banco, [Validators.required]],
      llavePago: [ this.pagoDerechosState.llavePago, [Validators.required, Validators.pattern(REGEX_LLAVE_DE_PAGO)]],
      fecha: [this.pagoDerechosState.fecha, [Validators.required, dateLessThanOrEqualToday]],
      importePago: [ this.pagoDerechosState.importePago, [Validators.required, Validators.maxLength(16), Validators.pattern(REGEX_IMPORTE_PAGO)]],
    });

    this.pagoDerechos.get('clave')?.disable();
    this.pagoDerechos.get('dependencia')?.disable();
    this.pagoDerechos.get('importePago')?.disable();
    const FETCHA_CONTROL = this.pagoDerechos.get('fecha');
    if (FETCHA_CONTROL) {
      FETCHA_CONTROL.valueChanges.subscribe((value) => {
        this.tramite230401Store.setPagoDerechosStateProperty('fecha', value);
      });
    }
  }

  
  /**
   * Método que actualiza la clasificación seleccionada basada en el valor del campo 'banco' 
   * del formulario de pago de derechos. Además, sincroniza este valor con el estado global 
   * de la aplicación utilizando el store correspondiente.
   *
   * @returns {void} No retorna ningún valor.
   */
  clasificacionSeleccione(): void {
    this.clasificacion = this.pagoDerechos.get('banco')?.value;
    this.tramite230401Store.setPagoDerechosStateProperty('banco', this.clasificacion);
  }
 /**
   * Maneja el evento cuando la fecha es cambiada.
   * 
   * @param fecha - La nueva fecha seleccionada en formato de cadena.
   * Si se proporciona una fecha válida, actualiza el formulario `pagoDerechos`
   * con el valor de la fecha de exportación y valida si es una fecha futura.
   */
 onFechaCambiada(fecha: string): void {
  if (fecha) {
    this.pagoDerechos.patchValue({ fecha: fecha });
    this.tramite230401Store.setPagoDerechosStateProperty('fecha', fecha);
    
    // Validar si es fecha futura
    let seleccionada: Date | null = null;
    if (fecha && fecha.includes('/')) {
      const [DAY, MONTH, YEAR] = fecha.split('/').map(Number);
      seleccionada = new Date(YEAR, MONTH - 1, DAY);
    } else {
      seleccionada = new Date(fecha); 
    }

    const HOY = new Date();
    HOY.setHours(0, 0, 0, 0);

    if (seleccionada && seleccionada > HOY) {
      this.fechaFuturaSeleccionada = true;
      this.pagoDerechos.get('fecha')?.setErrors({ futureDate: true });
    } else {
      this.fechaFuturaSeleccionada = false;
      
      const FETCHA_CONTROL = this.pagoDerechos.get('fecha');
      if (FETCHA_CONTROL?.errors?.['futureDate']) {
        delete FETCHA_CONTROL.errors['futureDate'];
        if (Object.keys(FETCHA_CONTROL.errors).length === 0) {
          FETCHA_CONTROL.setErrors(null);
        }
      }
    }
  }
}


/**

 * Método para cambiar la fecha final.

 * @param nuevo_valor Nuevo valor de la fecha final.

 */
fechaFuturaSeleccionada = false;
  cambioFechaFinal(nuevo_valor: string): void {
    this.pagoDerechos.patchValue({
      fecha: nuevo_valor,
    });
   // Convert string to Date before passing to setFecha
   let fechaDate: Date;
   if (nuevo_valor && nuevo_valor.includes('/')) {
     const [DAY, MONTH, YEAR] = nuevo_valor.split('/').map(Number);
     fechaDate = new Date(YEAR, MONTH - 1, DAY);
   } else {
     fechaDate = new Date(nuevo_valor);
   }
   this.tramite230401Store.setFecha(fechaDate);
  this.pagoDerechos.get('fecha')?.setValue(nuevo_valor);

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
    this.pagoDerechos.get('fecha')?.setErrors({ futureDate: true });
  } else {
    this.fechaFuturaSeleccionada = false;
    this.pagoDerechos.get('fecha')?.setErrors(null);
  }
  }

    /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
