/**
 * @component
 * @name InternaPagoDeDerechosComponent
 * @description
 * Componente para gestionar el pago de derechos en el trámite 220701.
 * Permite capturar, validar y almacenar la información relacionada con el pago de derechos en trámites de importación de acuicultura.
 * Incluye lógica para la gestión de catálogos, validaciones, estado de la sección y comunicación con el store y servicios.
 * Utiliza formularios reactivos y consume múltiples servicios para obtener catálogos y datos relacionados.
 * Implementa la lógica de inicialización, carga de catálogos, manejo de estado y sincronización con el store de Akita.
 * 
 * @example
 * <interna-pago-de-derechos [esFormularioSoloLectura]="true"></interna-pago-de-derechos>
 */
import { CommonModule } from '@angular/common';

import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Subject, delay, map, takeUntil, tap } from 'rxjs';

import {
  Catalogo,
  CatalogoSelectComponent,
  ConsultaioQuery,
  InputFecha,
  InputFechaComponent,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
 

  InputRadioComponent,
} from '@libs/shared/data-access-user/src';

import {
  EXPEDICION_FACTURA_FECHA,
  TIPO_RADIO,
} from '../../constantes/inspeccion-fisica-zoosanitario.enums';

import {
  FormularioPago,
  OpcionDeRadio,
} from '../../modelos/importacion-de-acuicultura.module';
import {
  FormularioPagoInt,
} from '../../modelos/datos-de-interfaz.model';

import { ImportacionDeAcuiculturaService } from '../../servicios/importacion-de-agricultura.service';

import {
  TramiteState,
  TramiteStore,
} from '../../estados/tramite220701.store';
import { TramiteStoreQuery } from '../../estados/tramite220701.query';

/**
 * @component
 * @name InternaPagoDeDerechosComponent
 * @description
 * Componente para gestionar el pago de derechos en el trámite 220701.
 * Permite capturar, validar y almacenar la información relacionada con el pago de derechos en trámites de importación de acuicultura.
 * Incluye lógica para la gestión de catálogos, validaciones, estado de la sección y comunicación con el store y servicios.
 * Utiliza formularios reactivos y consume múltiples servicios para obtener catálogos y datos relacionados.
 * Implementa la lógica de inicialización, carga de catálogos, manejo de estado y sincronización con el store de Akita.
 * 
 * @example
 * <interna-pago-de-derechos [esFormularioSoloLectura]="true"></interna-pago-de-derechos>
 */
@Component({
  selector: 'interna-pago-de-derechos',
  standalone: true,
  imports: [CommonModule, TituloComponent, CatalogoSelectComponent, InputRadioComponent, InputFechaComponent, ReactiveFormsModule],

  templateUrl: './interna-pago-de-derechos.component.html',
  styleUrl: './interna-pago-de-derechos.component.scss'
})
/**
 * Componente para gestionar el pago de derechos.
 * Este componente permite capturar y validar la información relacionada con el pago de derechos.
 */
export class InternaPagoDeDerechosComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar el pago de derechos.
   * Contiene los campos y validaciones necesarias.
   * @type {FormGroup}
   */
  formularioPago!: FormGroup;

  /**
   * Estado del formulario de pago.
   * Contiene la información manejada dentro del componente.
   * @type {FormularioPagoInt}
   */
  formularioPagoState!: FormularioPagoInt;

  /**
   * Opciones de radio para la exención de pago.
   * Contiene las opciones disponibles para seleccionar si el pago está exento.
   * @type {OpcionDeRadio[]}
   */
  exentoPagoRadio: OpcionDeRadio[] = TIPO_RADIO;

  /**
   * Valor seleccionado para la exención de pago.
   * Indica si el pago está exento o no.
   * @type {string}
   * @default 'Si'
   */
  exentoPagoValor: string = 'Si';
  /**
   * Catálogo de justificaciones para la exención de pago.
   * Contiene las opciones disponibles para justificar la exención de pago.
   * @type {Catalogo[]}
   */
  justificacionCatalogo: Catalogo[] = [];

  /**
   * Catálogo de bancos disponibles para el pago.
   * Contiene las opciones disponibles para seleccionar un banco.
   * @type {Catalogo[]}
   */
  bancoCatalogo: Catalogo[] = [];

  /**
   * Configuración para el input de fecha de salida.
   * Proporciona un valor inicial para el campo de fecha.
   * @type {InputFecha}
   */
  fechaFinalInput: InputFecha = EXPEDICION_FACTURA_FECHA;

  /**
   * Fecha seleccionada para el pago.
   * Contiene el valor actual de la fecha de pago.
   * @type {string}
   * @default ''
   */
  fechaPagoDate: string = '';

  
    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = true;

  /**
   * Subject para manejar la desuscripción de observables.
   * Utilizado para evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Estado de la sección actual en la tienda.
   * Contiene información sobre el estado de la sección.
   * @type {SeccionLibState}
   */
  private seccion!: SeccionLibState;


    /**
   * Valor seleccionado del radio.
   */
  valorSeleccionado!: string|null;

  /**
   * Estado del formulario de pago almacenado en el store.
   * Contiene los datos iniciales del formulario.
   * @type {FormularioPago}
   */
  formularioPagoStore: FormularioPago = {} as FormularioPago;

  /**
   * Constructor del componente.
   * Inicializa servicios y dependencias necesarias para el funcionamiento del componente.
   * @param fb Servicio para la creación de formularios reactivos.
   * @param importacionAcuiculturaServicio Servicio para obtener datos de importación de acuicultura.
   * @param tramiteStoreQuery Consulta del estado de la tienda Akita para trámites.
   * @param tramiteStore Tienda Akita para manejar el estado del trámite.
   * @param seccionQuery Consulta del estado de la tienda Akita para secciones.
   * @param seccionStore Tienda Akita para manejar el estado de la sección.
   * @param consultaioQuery Consulta Akita para manejar y actualizar el estado de una sección.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly importacionAcuiculturaServicio: ImportacionDeAcuiculturaService,
    private tramiteStoreQuery: TramiteStoreQuery, 
    private tramiteStore: TramiteStore, 
    private seccionQuery: SeccionLibQuery, 
    private seccionStore: SeccionLibStore, 
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.importacionAcuiculturaServicio.obtenerDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((datos) => {
      this.formularioPagoStore = datos.formularioPago
    })
        this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
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
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    
    // En modo consulta (readonly), asegurar que exentoPago esté en 'Si' y actualizar el store
    if (this.esFormularioSoloLectura) {
      this.formularioPago.disable();
      this.formularioPago.get('exentoPago')?.disable();
      
      // Asegurar que el store tenga el valor por defecto en modo consulta
      const CURRENT_STORE_VALUE = this.tramiteStoreQuery.getValue().FormularioPagoState;
      if (!CURRENT_STORE_VALUE.exentoPago || CURRENT_STORE_VALUE.exentoPago !== 'Si') {
        this.tramiteStore.setInternaPagoDeDerechosTramite({
          ...CURRENT_STORE_VALUE,
          exentoPago: 'Si'
        });
      }
    } else {
      // En modo edición, habilitar solo el campo exentoPago, los demás siguen deshabilitados
      this.formularioPago.get('exentoPago')?.enable();
    }
  }
  /**
   * Inicializa el formulario reactivo con los campos requeridos.
   * Configura validaciones y deshabilita ciertos campos según sea necesario.
   */
    inicializarFormulario(): void {
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.formularioPagoState = seccionState.FormularioPagoState;
        })
      )
      .subscribe()

    // Establecer exentoPagoValor a 'Si' si no está ya establecido desde el estado
    if (!this.formularioPagoState?.exentoPago) {
      this.exentoPagoValor = 'Si';
    } else {
      this.exentoPagoValor = this.formularioPagoState.exentoPago;
    }

    this.formularioPago = this.fb.group({
      exentoPago: [
        {value: this.formularioPagoState?.exentoPago || 'Si', disabled: true}, 
        Validators.required,
      ],
      justificacion: [{ value: this.formularioPagoStore?.justificacion, disabled: true }, Validators.required],
      claveReferencia: [{ value: this.formularioPagoStore?.claveReferencia, disabled: true }, Validators.required],
      cadenaDependencia: [{ value: this.formularioPagoStore?.cadenaDependencia, disabled: true }, Validators.required],
      banco: [{ value: this.formularioPagoStore.banco, disabled: true }, Validators.required],
      llavePago: [{ value: this.formularioPagoStore.llavePago, disabled: true }, Validators.required],
      fechaPago: [{ value: this.formularioPagoStore.fechaPago, disabled: true }, Validators.required],
      importePago: [{ value: this.formularioPagoStore.importePago, disabled: true }, Validators.required],
      fechaFactura: [this.formularioPagoStore?.fechaFactura, Validators.required],
    });
    
    // Configurar la suscripción a los cambios de estado del formulario
    this.formularioPago.statusChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: () => this.verificarEstadoDelBoton(),
        error: (e) => console.error('Error durante los cambios de estado del formulario:', e),
      });
  }
  /**
   * Actualiza el estado de la sección en la tienda Akita.
   * Este método se utiliza para establecer el estado de validación de la sección actual.
   * @method actualizarEstadoSeccion
   */
  actualizarEstadoSeccion(): void {
    const SECCION: number = 1;
    const SECCION_STATE = this.seccionQuery.getValue();
    const FORMAS_VALIDADAS = [...SECCION_STATE.formaValida];
    FORMAS_VALIDADAS[SECCION] = this.formularioPago.valid;

    this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
  }
  /**
   * Inicializa el componente y obtiene los datos necesarios para el formulario de pago.
   * Configura las suscripciones y el formulario reactivo.
   * @method ngOnInit
   */
  ngOnInit(): void {
    // Asegurar que exentoPago se inicialice con 'Si' por defecto
    this.exentoPagoValor = 'Si';
         
    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.formularioPagoState = seccionState.FormularioPagoState;
      })
    ).subscribe();

    this.obtenerListaJustificacion();
    this.obtenerListaBanco();
    this.inicializarEstadoFormulario();

        this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: TramiteState) => {
            if (seccionState) {
              this.formularioPagoState = seccionState.FormularioPagoState;
              
              // Crear una copia de los datos para patchear
              const PATCH_DATA = { ...this.formularioPagoState };
              
              // Asegurar que exentoPago permanezca 'Si' y mantener la variable de control
              if (!PATCH_DATA.exentoPago || PATCH_DATA.exentoPago !== 'Si') {
                PATCH_DATA.exentoPago = 'Si';
                this.exentoPagoValor = 'Si';
                
                // Actualizar el store con el valor por defecto
                this.tramiteStore.setInternaPagoDeDerechosTramite({
                  ...PATCH_DATA,
                  exentoPago: 'Si'
                });
              } else {
                this.exentoPagoValor = PATCH_DATA.exentoPago;
              }
              
              this.formularioPago.patchValue(PATCH_DATA);
              
              // Volver a deshabilitar el control después del parcheo en modo consulta
              if (this.esFormularioSoloLectura) {
                this.formularioPago.get('exentoPago')?.disable();
              }
            }
          })
        ).subscribe();

        this.formularioPago.statusChanges
        .pipe(
          takeUntil(this.destroyNotifier$),
          delay(10),
          tap(() => {
            const ACTIVE_STATE = { ...this.formularioPago.value };
            this.tramiteStore.setInternaPagoDeDerechosTramite(ACTIVE_STATE); 
          })
        )
        .subscribe();
  
      // Para el botón de validación Continuar
      this.seccionQuery.selectSeccionState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.seccion = seccionState;
          })
        )
        .subscribe();
  
    /**
     * Observa los cambios en el estado del formulario y actualiza la validación de la sección correspondiente.
     *
     * @description
     * - Se suscribe a los cambios en el estado del formulario.
     * - Cancela la suscripción cuando `destroyNotifier$` emite un valor.
     * - Aplica un retraso de 10ms antes de ejecutar la lógica.
     * - Obtiene el estado actual de la sección desde `seccionQuery`.
     * - Actualiza la validación en `seccionStore` basándose en el estado del formulario.
     *
     * @see {@link seccionQuery} para obtener el estado de la sección.
     * @see {@link seccionStore} para actualizar la validación de la sección.
     */
      this.formularioPago.statusChanges
        .pipe(
          takeUntil(this.destroyNotifier$),
          delay(10),
          tap(() => {
            const SECCION: number = 1;
            const SECCION_STATE = this.seccionQuery.getValue();
            const FORMAS_VALIDADAS = [...SECCION_STATE.formaValida];
            const CONTROL_PATH = 'formularioPago';
            const CONTROL = this.formularioPago.get(CONTROL_PATH)?.status;
  
            FORMAS_VALIDADAS[SECCION] = this.formularioPago.valid || CONTROL === 'VALID';
  
            this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
          })
        )
        .subscribe();
  }


  /**
   * Cambia el valor de un campo del formulario.
   * Actualiza el formulario y recrea su estructura si es necesario.
   * @method cambioValorRadio
   * @param {string} nombreControl - Nombre del campo del formulario.
   * @param {string} valor - Nuevo valor a asignar.
   */
  cambioValorRadio(value: string | number, valor: string): void {

    this.valorSeleccionado = value as string;
    // Actualiza el valor de exentoPago en el store de trámite
    this.tramiteStore.setInternaPagoDeDerechosTramite({
      ...this.tramiteStoreQuery.getValue().FormularioPagoState,
      exentoPago: this.valorSeleccionado
    });
    this.formularioPago.patchValue({
      [value]: valor,
    });
    this.exentoPagoValor = valor;
  }

  /**
   * Actualiza la fecha de pago en el formulario.
   * @method cambioFechaFinal
   * @param {string} nuevoValor - Nueva fecha de pago.
   */
  cambioFechaFinal(nuevoValor: string): void {
    this.formularioPago.patchValue({
      fechaPago: nuevoValor,
    });
    this.fechaPagoDate = nuevoValor;
  }

  /**
   * Obtiene la lista de bancos desde el servicio.
   * Actualiza el catálogo de bancos disponibles.
   * @method obtenerListaBanco
   */
private obtenerListaBanco(): void {
  this.importacionAcuiculturaServicio.obtenerDetallesDelCatalogo('banco.json')
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (data) => {
        this.justificacionCatalogo = data.data as Catalogo[];
        this.bancoCatalogo = data.data as Catalogo[];
      },
      error: (error) => {
        console.error(error);
      }
    });
}


  /**
   * Verifica si el formulario es válido y actualiza el estado del botón.
   * @method verificarEstadoDelBoton
   */
  verificarEstadoDelBoton(): void {
    const DATOS = {
      pagoDeformaValida: false,
    }
    if (this.formularioPago.valid) {
      DATOS.pagoDeformaValida = true
    }
    this.importacionAcuiculturaServicio.actualizarFormaValida(DATOS);
  }

  /**
   * Obtiene la lista de justificaciones desde el servicio.
   * Actualiza el catálogo de justificaciones disponibles.
   * @method obtenerListaJustificacion
   */
  private obtenerListaJustificacion(): void {
    this.importacionAcuiculturaServicio.obtenerDetallesDelCatalogo('justificacion.json')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (data) => {
           this.justificacionCatalogo = data.data as Catalogo[];
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
  

  /**
   * Actualiza el valor de un campo en el formulario y lo guarda en el servicio de importación de acuicultura.
   * @method setValoresStore
   * @param {FormGroup} formulario - El formulario con el campo que se está actualizando.
   * @param {string} campo - El nombre del campo que se actualizará.
   */
  setValoresStore(
    _formulario: FormGroup,
    _campo: string,
  ): void {
    this.actualizarValorAleatorio();
    const VALOR = this.formularioPago.value;
    (this.importacionAcuiculturaServicio.actualizarFormularioPago as (value: FormularioPago) => void)(VALOR);
  }

  /**
   * Actualiza ciertos valores en el formulario basados en condiciones.
   * Si se cumplen las condiciones, se actualizan los valores del formulario.
   * @method actualizarValorAleatorio
   */
  actualizarValorAleatorio(): void {
    const HOY = InternaPagoDeDerechosComponent.formatearFecha(new Date());

    // Si la justificación no está vacía y el campo exentoPago es 'Si'
    if (this.formularioPago.value.justificacion !== '' && this.formularioPagoStore.exentoPago === 'Si') {
      this.formularioPago.patchValue({
        claveReferencia: 'valor',
        cadenaDependencia: 'valor',
        banco: '170',
        fechaPago: HOY,
        importePago: 'valor',
      });
      this.fechaPagoDate = HOY;
    }

    // Si el banco no está vacío y el campo exentoPago es 'No'
    else if (this.formularioPago.value.banco !== '' && this.formularioPagoStore.exentoPago === 'No') {
      this.formularioPago.patchValue({
        justificacion: '170',
        claveReferencia: 'valor',
        cadenaDependencia: 'valor',
        fechaPago: HOY,
        llavePago: 'valor',
        importePago: 'valor',
      });

    }
    this.fechaPagoDate = HOY;
  }

  /**
   * Formatea la fecha en el formato 'dd/mm/yyyy'.
   * @method formatearFecha
   * @param {Date} fecha - La fecha a formatear.
   * @returns {string} La fecha formateada como un string.
   */
  static formatearFecha(fecha: Date): string {
    const DIA = fecha.getDate().toString().padStart(2, '0');
    const MES = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const ANO = fecha.getFullYear();

    return `${DIA}/${MES}/${ANO}`;
  }


    /**
   * Maneja la limpieza de recursos antes de destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   * @method ngOnDestroy
   */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
