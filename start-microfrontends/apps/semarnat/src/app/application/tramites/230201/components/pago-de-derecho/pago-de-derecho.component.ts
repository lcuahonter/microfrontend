import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { 
  Catalogo, 
  CatalogoSelectComponent, 
  CatalogosSelect,
  REGEX_CARACTERES_ESPECIALES,
  TituloComponent,
  ValidacionesFormularioService,
  dateLessThanOrEqualToday
} from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { Solicitud230201State, Tramite230201Store } from '../../estados/tramite230201.store';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DESTINATARIO_BANCO } from '../../enum/destinatario-tabla.enum';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PageDeDerechosData } from '../../models/datos-tramite.model';
import { PhytosanitaryExportacionService } from '../../services/phytosanitary-exportacion.service';
import { Subject } from 'rxjs';
import { Tramite230201Query } from '../../estados/tramite230201.query';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';


@Component({
  selector: 'app-pago-de-derecho',
  templateUrl: './pago-de-derecho.component.html',
  styleUrl: './pago-de-derecho.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent
  ],
})
export class PagoDeDerechoComponent implements OnInit, OnDestroy {

  /**
   * @property {Solicitud230201State} derechoState
   * @description Estado actual del trámite 230201, que contiene información relevante
   * para la sección de pago de derechos.
   */
  public derechoState!: Solicitud230201State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Sujeto utilizado para notificar la destrucción del componente.
   * Se emplea para limpiar suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {FormGroup} FormSolicitud
   * @description Grupo de formularios principal que contiene los controles de formulario
   * relacionados con el pago de derechos. Este formulario incluye validaciones y se utiliza
   * para capturar y gestionar los datos del usuario en esta sección.
   */
  FormSolicitud!: FormGroup;

  /**
   * @property {string} respuesta
   * @description Almacena la respuesta obtenida de alguna operación o servicio.
   * Este campo puede ser utilizado para mostrar mensajes o resultados en la interfaz de usuario.
   */
  respuesta: string = '';

  /**
   * @property {Catalogo} bancoSeleccionado
   * @description Representa el banco seleccionado por el usuario en el formulario de pago de derechos.
   * Este campo se utiliza para almacenar y gestionar la información del banco seleccionado.
   */
  bancoSeleccionado!: Catalogo;

  /**
   * @property {CatalogosSelect} bancoCatalogo - Representa la configuración del catálogo de bancos.
   * 
   * @description
   * Este objeto define las propiedades necesarias para configurar un catálogo de selección
   * relacionado con los bancos. Incluye el nombre del campo, si es obligatorio, la primera opción
   * que se muestra al usuario y una lista de catálogos disponibles.
   * 
   * @property {string} labelNombre - Etiqueta que describe el nombre del campo (en este caso, "Banco").
   * @property {boolean} required - Indica si este campo es obligatorio.
   * @property {string} primerOpcion - Texto que se muestra como la primera opción en el selector.
   * @property {Array<any>} catalogos - Lista de opciones disponibles en el catálogo.
   */
  public bancoCatalogo: CatalogosSelect = DESTINATARIO_BANCO;

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * Constructor de la clase PagoDeDerechoComponent.
   * 
   * @param fb - Servicio `FormBuilder` para la creación y gestión de formularios reactivos.
   * @param captuaservice - Servicio `CapturaSolicitudeService` para manejar la captura de solicitudes.
   * @param solicitud230201Store - Almacén `Tramite230201Store` para gestionar el estado de la solicitud 230201.
   * @param solicitud230201Query - Consulta `Solicitud230201Query` para obtener datos del estado de la solicitud 230201.
   * @param validacionesService - Servicio `ValidacionesFormularioService` para realizar validaciones personalizadas en formularios.
   * @param mediodetransporteService - Servicio `MediodetransporteService` para gestionar datos relacionados con medios de transporte.
   */
  constructor(
    private fb: FormBuilder,
    private solicitud230201Store: Tramite230201Store,
    private solicitud230201Query: Tramite230201Query,
        private consultaioQuery: ConsultaioQuery,
    private validacionesService: ValidacionesFormularioService,
    private mediodetransporteService: MediodetransporteService,
    private phytosanitaryExportacionService: PhytosanitaryExportacionService
  ) {
    this.solicitud230201Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.derechoState = seccionState;
          if (this.FormSolicitud) {
            this.pagodeDerechos.patchValue({
              claveDeReferencia: this.derechoState.claveDeReferencia,
              cadenaPagoDependencia: this.derechoState.cadenaPagoDependencia,
              impPago: this.derechoState.impPago
            });
          }
        })
      )
      .subscribe();
    
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
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
    this.fetchBancoData();
    this.cargarDatosPagoDerecho();
  }

  /**
   * @method fetchBancoData
   * @description Obtiene los datos del catálogo de bancos desde el servicio de medio de transporte
   * y los asigna al catálogo de bancos en el componente.
   * 
   * @returns {void}
   * 
   * @example
   * this.fetchBancoData();
   * 
   * @remarks
   * Este método utiliza el servicio `mediodetransporteService` para obtener los datos
   * y se asegura de limpiar las suscripciones utilizando el operador `takeUntil` con `destroyNotifier$`.
   */
  fetchBancoData(): void {
    this.mediodetransporteService
      .getMedioDeTransporte()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((request): void => {
        this.bancoCatalogo.catalogos = request?.data ;
      });
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.updateEstadoFormulario();
    } else {
      this.inicializarFormulario();
    }  
  }

  /**
   * Actualiza el estado de los formularios del componente según el modo de solo lectura.
   *
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los formularios asociados
   * (`solicitudForm`, `agregarMercanciasForm`, `exportacionForm`, y `datosMercancia`).
   * Si es falsa, habilita dichos formularios para permitir la edición.
   */
  updateEstadoFormulario(): void {
    this.inicializarFormulario();
    if (this.soloLectura) {
      this.FormSolicitud?.disable();
    } else {
      this.FormSolicitud?.enable();
    }
  }

  /**
   * Obtiene el grupo de formulario de datos de mercancía.
   */
  inicializarFormulario(): void {
    this.FormSolicitud = this.fb.group({
      pagodeDerechos: this.fb.group({
        claveDeReferencia: [{ value: this.derechoState?.claveDeReferencia, disabled: true }, [Validators.required, Validators.maxLength(50)]],
        cadenaPagoDependencia: [{ value: this.derechoState?.cadenaPagoDependencia, disabled: true }, [Validators.required, Validators.maxLength(50)]],
        banco: [this.derechoState?.banco, Validators.required],
        llaveDePago: [this.derechoState?.llaveDePago, [Validators.required, Validators.maxLength(8), PagoDeDerechoComponent.llaveDePagoValidator]],
        fecPago: [this.derechoState?.fecPago, [Validators.required, dateLessThanOrEqualToday]],
        impPago: [{ value: this.derechoState?.impPago, disabled: true }, [Validators.required, Validators.maxLength(16)]]
      }),
    });
  }

  /**
   * Este método se utiliza para validar la forma del transporte. - 230201
   * @param form: Forma del transporte
   * @param field: campo del formulario
   * @returns Validaciones del formulario
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite230201Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud230201Store[metodoNombre] as (value: string | number | boolean) => void)(VALOR);
  }

  /**
   * Maneja el input de la llave de pago, convirtiendo automáticamente a mayúsculas
   * y actualizando el store.
   */
  onLlaveDePagoInput(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const VALOR = INPUT.value;
    
    // Convertir a mayúsculas automáticamente
    const VALOR_EN_MAYUSCULAS = VALOR.toUpperCase();
    
    // Si el valor cambió al convertir a mayúsculas, actualizar el input
    if (VALOR !== VALOR_EN_MAYUSCULAS) {
      INPUT.value = VALOR_EN_MAYUSCULAS;
      // Actualizar el FormControl
      this.pagodeDerechos.get('llaveDePago')?.setValue(VALOR_EN_MAYUSCULAS);
    }
    
    // Actualizar el store
    this.setValoresStore(this.pagodeDerechos, 'llaveDePago', 'setllaveDePago');
  }

  /**
   * Validador para el campo llaveDePago que verifica el formato correcto.
   * - Si contiene caracteres especiales, retorna error 'caracteresInvalidos'
   */
  static llaveDePagoValidator(control: AbstractControl): ValidationErrors | null {
    const VALOR = control.value;
    
    if (!VALOR || VALOR === '') {
      return null; // Si está vacío, que maneje el required validator
    }

    const VALOR_LIMPIO = VALOR.toString().trim();
    
    // PRIMERO verificar caracteres especiales - "Existen datos incorrectos que no cumplen con el formato esperado"
    const CONTIENE_ESPECIALES = REGEX_CARACTERES_ESPECIALES.test(VALOR_LIMPIO);
    if (CONTIENE_ESPECIALES) {
      return { caracteresInvalidos: true };
    }

    // SEGUNDO verificar longitud - si es menor a 8, mostrar error
    if (VALOR_LIMPIO.length < 8) {
      return { formatoIncorrecto: true };
    }

    // Si llegó hasta aquí y tiene 8 caracteres sin especiales, es válido
    return null;
  }

  /**
  * Obtiene el grupo de formulario 'pagodeDerechos' del formulario principal 'FormSolicitud'.
  *
  * @returns {FormGroup} El grupo de formulario 'pagodeDerechos'.
  */
  get pagodeDerechos(): FormGroup {
    return this.FormSolicitud.get('pagodeDerechos') as FormGroup;
  }

  /**
   * Carga los datos del pago de derechos desde el servicio JSON.
   */
  cargarDatosPagoDerecho(): void {
    this.phytosanitaryExportacionService
      .getPagoDeDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response: PageDeDerechosData) => {
        if (response && this.FormSolicitud) {
          this.pagodeDerechos.patchValue({
            claveDeReferencia: response.claveDeReferencia || '',
            cadenaPagoDependencia: response.cadenaPagoDependencia || '',
            impPago: response.impPago || ''
          });
        }
      });
  }

  /**
   * @override
   * @method
   * @name ngOnDestroy
   * @description Este método se ejecuta automáticamente cuando el componente se destruye. 
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   * 
   * @example
   * // Ejemplo de uso:
   * ngOnDestroy(): void {
   *   this.destroyNotifier$.next();
   *   this.destroyNotifier$.complete();
   * }
   * 
   * @remarks
   * Este método envía notificaciones a los observables `destroyNotifier$` 
   * para indicar que el componente está siendo destruido, y luego completa ambos observables.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
