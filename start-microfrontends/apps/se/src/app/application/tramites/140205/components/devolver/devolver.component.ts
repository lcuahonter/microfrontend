import { Component,EventEmitter,Input,OnDestroy, OnInit , Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud140205State,
  Solicitud140205Store,
} from '../../estados/store/solicitud140205.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Facturas } from '../../models/detalle';
import { Facturase } from '../../models/detalle';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';

import { Solicitud140205Query } from '../../estados/query/solicitud140205.query';

/**
 * Componente para gestionar el proceso de devolución de facturas.
 * Este componente utiliza un formulario reactivo para capturar y mostrar información relacionada con
 * la devolución de facturas, incluyendo datos como el folio, la cantidad y el saldo disponible.
 *
 * @component
 * @example
 * <app-devolver></app-devolver>
 *
 * @imports
 * - `TituloComponent`: Componente que muestra un título.
 * - `TablaDinamicaComponent`: Componente que gestiona la visualización de datos en una tabla dinámica.
 * - `FormsModule`: Módulo necesario para trabajar con formularios basados en plantillas.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 */

/**
 * Interfaz que representa una factura con su número, importe inicial y saldo a devolver opcional.
 */
interface Factura {
  /** Número único que identifica la factura */
  numeroDeFactura: string;
  /** Importe inicial registrado en la factura */
  importeInicial: string;
  /** Saldo pendiente a devolver (opcional) */
  saldoaDevolver?: string; 
}

@Component({
  selector: 'app-devolver',
  standalone: true,
  imports: [
    TituloComponent,
    TablaDinamicaComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './devolver.component.html',
  styleUrls: ['./devolver.component.scss'],
})
/**
 * Componente que gestiona la devolución de elementos o datos.
 * Implementa los hooks de ciclo de vida OnInit y OnDestroy para inicialización y limpieza.
 */
export class DevolverComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para gestionar los datos de devolución */

  @Input() showDevolverModal: boolean = false;
  @Output() showDevolverModalChange = new EventEmitter<boolean>();

  /**
   * Lista de facturas cargadas desde un archivo JSON, que contiene información relevante
   * sobre las facturas y su estado de devolución.
   */
  facturas: Facturas[] = [];

  /**
   * Lista de facturas adicionales que se utilizan en el proceso de cancelación.
   */
  facturase: Facturase[] = [];

  /**
   * Configuración de las columnas para mostrar las facturas en una tabla dinámica.
   * Contiene los encabezados y las claves para acceder a los datos de las facturas.
   */
  facturasDatas: ConfiguracionColumna<Factura>[] = [
    {
      encabezado: 'Numero de Factura',
      clave: (item: Factura) => item.numeroDeFactura,
      orden: 1,
    },
    {
      encabezado: 'Importe Inicial',
      clave: (item: Factura) => item.importeInicial,
      orden: 2,
    },
    {
      encabezado: 'Saldo a Devolver',
      clave: (item: Factura) => item.saldoaDevolver,
      orden: 3,
    },
  ];

  /**
   * Configuración de las columnas para mostrar las facturas principales en una tabla.
   * Esta configuración contiene solo los datos relevantes para mostrar en la tabla.
   */
  facturasData: ConfiguracionColumna<Factura>[] = [
    {
      encabezado: 'Numero de Factura',
      clave: (item: Factura) => item.numeroDeFactura,
      orden: 1,
    },
    {
      encabezado: 'Importe Inicial',
      clave: (item: Factura) => item.importeInicial,
      orden: 2,
    },
  ];

  /**
   * Enum que gestiona las opciones de selección de la tabla.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Formulario reactivo que captura los datos necesarios para realizar la devolución de facturas.
   * Contiene un grupo de controles para el folio, disponible, cantidad, total y cuadrados.
   */
  devolverForm!: FormGroup;

/**
 * @property {Solicitud140205State} solicitudState
 * Estado actual de la solicitud del trámite 140205.
 * 
 * Esta propiedad almacena los datos relacionados con el estado de la solicitud
 * y puede ser utilizada para mostrar información o realizar validaciones dentro del componente.
 */
  public solicitudState!: Solicitud140205State;

/**
 * @property {Subject<void>} destroyNotifier$
 * Sujeto utilizado para manejar la destrucción de suscripciones en los observables.
 *
 * Se usa comúnmente junto con el operador `takeUntil` en pipes de RxJS
 * para evitar fugas de memoria al destruir el componente.
 */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente. Inicializa el formulario reactivo utilizando el FormBuilder.
   *
   * @param fb - FormBuilder utilizado para crear y gestionar el formulario reactivo.
   */
  constructor(
    private fb: FormBuilder,
    private tramite140205Store: Solicitud140205Store,
    private tramite140205Query: Solicitud140205Query,
    private consultaioQuery: ConsultaioQuery
  ) {
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
 * @method ngOnInit
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 *
 * Inicializa el formulario reactivo mediante `inicializarFormulario()` y configura
 * su estado inicial llamando a `inicializarEstadoFormulario()`.
 */
  ngOnInit(): void {
    /** Inicializa el formulario reactivo con sus controles y valores predeterminados. */
    this.inicializarFormulario();

    /** Llama al método que configura el formulario según el estado de solo lectura. */
    this.inicializarEstadoFormulario();
  }

  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.devolverForm && this.esFormularioSoloLectura) {
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
    if (this.esFormularioSoloLectura) {
      this.devolverForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.devolverForm.enable();
    } 
  }

/**
 * @method setValoresStore
 * Asigna el valor de un campo del formulario al store correspondiente invocando un método específico.
 *
 * @param {FormGroup} form - El formulario reactivo que contiene los valores a establecer.
 * @param {string} campo - El nombre del campo dentro del formulario del cual se obtendrá el valor.
 * @param {keyof Tramite140205Store} metodoNombre - El nombre del método del store que se invocará para actualizar el estado.
 *
 * Se obtiene el valor del campo especificado del formulario y se llama dinámicamente
 * al método correspondiente del `Tramite140205Store` pasándole dicho valor.
 */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud140205Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite140205Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }


  /**
   * Método que se ejecuta al inicializar el componente. Este método crea el formulario reactivo
   * y configura los controles necesarios con las validaciones requeridas.
   */
  inicializarFormulario(): void {
    this.tramite140205Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Solicitud140205State;
        })
      )
      .subscribe();
      
    // Inicializa el formulario con los controles necesarios y las validaciones
    this.devolverForm = this.fb.group({
      folio: [''],
      disponible: [''],
      cantidad: [this.solicitudState.cantidad, Validators.required], // Campo obligatorio para la cantidad a devolver
      total: [''],
      cuadrados: [''],
    });

    // Llama al método para actualizar el campo 'monto' con los valores predeterminados
    this.updateformfied();
  }

  /**
   * Método que actualiza los valores del formulario con datos predeterminados.
   * También deshabilita los campos para que los usuarios no puedan modificarlos.
   */
  updateformfied(): void {
    this.devolverForm.get('folio')?.setValue('4MX216520');
    this.devolverForm.get('disponible')?.setValue('12');
    this.devolverForm.get('total')?.setValue('12');
    this.devolverForm.get('cuadrados')?.setValue('133');

    // Deshabilita los campos para que no se puedan editar
    this.devolverForm.get('folio')?.disable();
    this.devolverForm.get('disponible')?.disable();
    this.devolverForm.get('total')?.disable();
    this.devolverForm.get('cuadrados')?.disable();
  }

    /**
   * Método del ciclo de vida de Angular que se ejecuta justo antes de destruir el componente.
   * 
   * Este método se utiliza para limpiar recursos, específicamente para completar
   * el `Subject` `destroyNotifier$`, el cual es usado en combinación con el operador `takeUntil`
   * para cancelar automáticamente las suscripciones a observables y evitar fugas de memoria.
   * 
   */
  cerrarModal():void {
    this.showDevolverModal = false;
    this.showDevolverModalChange.emit(false);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia el estado relacionado con los datos del permiso en el servicio de mensajes
   * y completa el Subject `destroyNotifier$` para evitar fugas de memoria.
   */

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
