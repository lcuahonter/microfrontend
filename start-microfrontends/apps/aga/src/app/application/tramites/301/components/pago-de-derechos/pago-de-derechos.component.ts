/* eslint-disable @nx/enforce-module-boundaries */
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, GENERAR_LINEA_CAPTURA_URL, MSG_ALERTA_ELIMINAR_ELEMENTO, MSG_SELECCIONA_REGISTRO, Notificacion, NotificacionesComponent, REGEX_LINEA_CAPTURA, TEXTO_ACEPTAR, TEXTO_CANCELAR, TablaDinamicaComponent, TablaSeleccion, TablePaginationComponent } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud301State,
  Tramite301Store,
} from '../../../../core/estados/tramites/tramite301.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PAGO_DE_DERECHOS_TABLA } from '../../constantes/301.enum';
import { PagoDeDerechosTabla } from '../../models/301.models';
import { TITULO_MODAL_AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/terceros.enums';
import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { Tramite301Query } from '../../../../core/queries/tramite301.query';

/**
 * Componente `PagoDeDerechosComponent`
 *
 * Este componente se encarga de gestionar un formulario para la solicitud de pago de derechos.
 * El formulario contiene campos como la línea y el monto del pago. Al inicializarse, se configura el formulario
 * y se establece un valor predeterminado para el campo 'monto', deshabilitándolo.
 *
 * @component
 * @example
 * <app-pago-de-derechos></app-pago-de-derechos>
 */
@Component({
  selector: 'app-pago-de-derechos',
  templateUrl: './pago-de-derechos.component.html',
  styleUrls: ['./pago-de-derechos.component.scss'],
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, TablaDinamicaComponent, TablePaginationComponent, NotificacionesComponent],
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {
  /**
   * Referencia a la clase o enumeración `TablaSeleccion`.
   *
   * Esta propiedad se utiliza para acceder a las funcionalidades
   * o valores definidos en `TablaSeleccion` dentro del componente.
   */
  public TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de las columnas de la tabla.
   */
  public encabezadoDeTabla: ConfiguracionColumna<PagoDeDerechosTabla>[]= PAGO_DE_DERECHOS_TABLA;

  /**
   * Define los datos que se mostrarán en la tabla dinámica.
   */
  public datosTabla: PagoDeDerechosTabla[] = [];

   /**
   * @property listaSeleccionadas
   * @type {PagoDeDerechosTabla[]}
   * @private
   * @description
   * Arreglo privado que almacena las filas seleccionadas en la tabla de pago de derechos.
   * Se utiliza para realizar operaciones como la eliminación de registros seleccionados por el usuario.
   */
  private listaSeleccionadas: PagoDeDerechosTabla[] = [];

  /**
   * Referencia al elemento del modal de confirmación en la plantilla.
   * Se utiliza para mostrar mensajes de advertencia o confirmación al usuario,
   * por ejemplo, cuando se intenta agregar una línea de captura duplicada.
   *
   * @type {ElementRef}
   * @memberof PagoDeDerechosComponent
   */
  @ViewChild('modalConfirmacionRef') modalConfirmacionRef!: ElementRef;

  /**
   * Formulario reactivo que contiene los campos de datos del importador/exportador.
   * El formulario incluye un campo 'linea' y un campo 'monto' con validaciones de 'required'.
   *
   * @type {FormGroup}
   */
  FormSolicitud!: FormGroup;

  /**
   * Estado de la solicitud de la sección 301.
   */
  public solicitudState!: Solicitud301State;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * URL utilizada para generar la línea de captura.
   * Esta constante apunta al endpoint definido por GENERAR_LINEA_CAPTURA_URL.
   */
  public generarLineaCapturaURL: string = GENERAR_LINEA_CAPTURA_URL;

  /**
   * Objeto que almacena la notificación actual que se mostrará al usuario.
   * Puede ser de tipo alerta, confirmación, etc., o null si no hay notificación activa.
   */
  public nuevaNotificacion!: Notificacion | null;

  /**
   * Constructor del componente `PagoDeDerechosComponent`.
   *
   * Inicializa la instancia de `FormBuilder` para crear formularios reactivos.
   *
   * @param {FormBuilder} fb - Instancia de FormBuilder utilizada para construir formularios reactivos.
   */
  constructor(
    private fb: FormBuilder,
    private tramite301Store: Tramite301Store,
    private tramite301Query: Tramite301Query,
    private consultaioQuery: ConsultaioQuery,
    private changeDetectorRef: ChangeDetectorRef
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
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al iniciar el componente.
   * Llama a la función para inicializar el estado del formulario.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    // Inicializa el formulario con validaciones requeridas
    this.tramite301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          if (
          this.solicitudState &&
          typeof this.solicitudState === 'object' &&
          this.solicitudState !== null &&
          'pagoDerechosTabla' in this.solicitudState
        ) {
          const PAGO_DERECHOS = this.solicitudState['pagoDerechosTabla'] as Array<{ lineaDeCaptura: string; monto?: number }>;
          PAGO_DERECHOS.forEach((productoItem: { lineaDeCaptura: string; monto?: number }) => {
            const IS_ALREADY_ADDED = this.datosTabla.some(
            (item: { lineaDeCaptura: string }) => item.lineaDeCaptura === productoItem.lineaDeCaptura
          );

          if (!IS_ALREADY_ADDED) {
            this.datosTabla.push({
              lineaDeCaptura: productoItem.lineaDeCaptura,
              monto: 4845
            });
          }
          });
        }
        })
      )
      .subscribe();

    this.FormSolicitud = this.fb.group({
      pagodederechos: this.fb.group({
        linea: [this.solicitudState?.linea, [Validators.required, Validators.maxLength(20), Validators.pattern(REGEX_LINEA_CAPTURA)]],
        monto: ['', Validators.required]
      }),
    });
    // Llama al método para actualizar el campo 'monto'
    this.updateformfied();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.FormSolicitud.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.FormSolicitud.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
}

  /**
   * Método `updateformfied()`.
   * Este método se encarga de actualizar el campo 'monto' dentro del formulario:
   * - Deshabilita el campo 'monto'.
   * - Establece el valor predeterminado de 'monto' a '4845'.
   *
   * @memberof PagoDeDerechosComponent
   */
  updateformfied(): void {
    // Deshabilita el campo 'monto' y asigna el valor '4845'
    this.FormSolicitud.get('pagodederechos.monto')?.disable();
    this.FormSolicitud.get('pagodederechos.monto')?.setValue('4845');
  }

  /**
   * Método `onSubmit()`.
   * Este método se ejecuta cuando se envía el formulario y realiza las siguientes acciones:
   * - Valida si el formulario es válido.
   * - Llama al método `setValoresStore()` para guardar los valores del formulario en el estado.
   *
   * @param {FormGroup} form - Formulario reactivo que contiene los campos de datos del importador/exportador.
   * @memberof PagoDeDerechosComponent
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite301Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @returns {boolean | null} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(): boolean | null {
    const CONTROL = this.lineaControl;
    return CONTROL ? CONTROL.invalid && CONTROL.touched : null;
  }

  /**
   * Getter para el control del campo 'linea' dentro del formulario reactivo.
   *
   * @returns {AbstractControl | null} Retorna el control del campo 'linea' si existe, de lo contrario retorna null.
   */
  get lineaControl(): import('@angular/forms').AbstractControl | null {
    return this.FormSolicitud.get('pagodederechos.linea');
  }

  /**
   * @method agregar
   * @description
   * Agrega una nueva línea de captura a la tabla de pago de derechos.
   * Primero valida que la línea de captura no exista previamente en la tabla.
   * Si ya existe, muestra un modal de advertencia. Si el formulario es válido,
   * agrega la nueva línea y el monto a la tabla, actualiza el store y limpia el campo.
   * Si el formulario no es válido, marca los campos como tocados y actualiza la vista.
   * @example
   * this.agregar();
   * // Agrega una nueva línea de captura si no existe y el formulario es válido.
   */
  agregar(): void {
    const LINEA = this.lineaControl?.value ?? '';
    const YA_EXISTE = this.datosTabla.some(d => d.lineaDeCaptura === LINEA);
    if (YA_EXISTE) {
      const MODAL = new bootstrap.Modal(this.modalConfirmacionRef.nativeElement);
      MODAL.show();
      return;
    }

    if (this.FormSolicitud.get('pagodederechos')?.valid) {
      const DATOS = {
        lineaDeCaptura: this.lineaControl?.value ?? '',
        monto: this.FormSolicitud.get('pagodederechos.monto')?.value ?? ''
      };
      this.datosTabla = [...this.datosTabla,DATOS];
      this.tramite301Store.setPagoDerechosTabla('pagoDerechosTabla', this.datosTabla);
      this.limpiar();
    } else {
      this.FormSolicitud.get('pagodederechos')?.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * @method limpiar
   * @description
   * Limpia el campo 'linea' del formulario reactivo, restableciendo su valor.
   * Este método se utiliza después de agregar una nueva línea de captura para dejar el campo listo para una nueva entrada.
   */
  limpiar(): void {
    this.lineaControl?.reset();
  }

  /**
   * @method eliminar
   * @description
   * Muestra una notificación de confirmación antes de eliminar las filas seleccionadas de la tabla de pago de derechos (`datosTabla`).
   * Si no hay filas seleccionadas, muestra una alerta informando al usuario que debe seleccionar al menos un registro.
   * Si hay filas seleccionadas, muestra una notificación de confirmación para proceder con la eliminación.
   */
  eliminar(): void {
    if (this.listaSeleccionadas.length === 0) {
      // Si no hay filas seleccionadas, muestra una alerta informando al usuario.
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_SELECCIONA_REGISTRO,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    // Si hay filas seleccionadas, muestra una notificación de confirmación para eliminar.
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: MSG_ALERTA_ELIMINAR_ELEMENTO,
      cerrar: false,
      txtBtnAceptar: TEXTO_ACEPTAR,
      txtBtnCancelar: TEXTO_CANCELAR,
    };
  }


  /**
   * Maneja la confirmación del modal para eliminar filas seleccionadas de la tabla.
   * Si el usuario confirma la acción (`accion` es true), elimina las filas seleccionadas
   * de `datosTabla` y actualiza el store correspondiente.
   *
   * @param {boolean} accion - Indica si el usuario confirmó la acción de eliminación.
   */
  confirmacionModal(accion: boolean): void {
    if (accion) {
      if (this.listaSeleccionadas.length) {
        this.listaSeleccionadas.forEach((ele: PagoDeDerechosTabla) => {
          const INDICE = this.datosTabla.findIndex((item) => item.lineaDeCaptura === ele.lineaDeCaptura);
          if (INDICE !== -1) {
            this.datosTabla.splice(INDICE, 1);
            this.tramite301Store.setPagoDerechosTabla('pagoDerechosTabla', this.datosTabla);
          }
        });
      }
    }
  }
  /**
   * @method listaDeFilaSeleccionada
   * @description
   * Actualiza el arreglo de filas seleccionadas en la tabla de pago de derechos.
   * Este método se utiliza para almacenar las filas seleccionadas por el usuario,
   * permitiendo realizar operaciones como la eliminación de registros.
   *
   * @param {PagoDeDerechosTabla[]} event - Arreglo de filas seleccionadas.
   */
  listaDeFilaSeleccionada(event: PagoDeDerechosTabla[]): void {
    this.listaSeleccionadas = [];
    this.listaSeleccionadas = event;
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

  public manejarEntradaMayusculas(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT && INPUT.value) {
      this.FormSolicitud.get('pagodederechos.linea')?.setValue(INPUT.value.toUpperCase(), { emitEvent: false });
    }
  }
  /**
   * Valida el estado del formulario y la tabla antes de permitir una acción (por ejemplo, envío).
   *
   * Reglas:
   * - Si el formulario reactivo no ha sido inicializado, retorna false.
   * - Si no hay filas en `datosTabla`, marca todo el formulario como tocado (para mostrar errores)
   *   y retorna false.
   * - En cualquier otro caso, retorna true indicando que la validación es satisfactoria.
   *
   * @returns {boolean} true si el formulario y la tabla son válidos; false en caso contrario.
   */
  validarFormulario(): boolean {
    if (!this.FormSolicitud) {
      // El formulario aún no está inicializado
      return false;
    }

    // Requiere al menos una línea de captura en la tabla
    if (this.datosTabla.length === 0) {
      // Marca todo el formulario como tocado para mostrar mensajes de validación
      this.FormSolicitud.markAllAsTouched();
      return false;
    }

    return true;
  }

  /**
   * Método `ngOnDestroy()`.
   * Este método se ejecuta cuando el componente se destruye y realiza las siguientes acciones:
   * - Desuscribe la suscripción a los cambios en el formulario reactivo.
   *
   * @memberof PagoDeDerechosComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}