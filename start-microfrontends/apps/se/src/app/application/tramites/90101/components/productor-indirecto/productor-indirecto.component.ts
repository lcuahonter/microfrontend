/**
 * @component ProductorIndirectoComponent
 * @description Este componente es responsable de manejar los datos del productor indirecto.
 * Incluye la lógica para obtener y gestionar los datos del productor, así como los catálogos relacionados.
 * 
 * @import { Component } from '@angular/core';
 * @import { FormBuilder, FormGroup } from '@angular/forms';
 * @import { PRODUCTORCOLUMNS } from 'libs/shared/data-access-user/src/tramites/constantes/prosec.module';
 * @import { ProsecService } from 'libs/shared/data-access-user/src/core/services/90101/prosec.module';
 */

import { AutorizacionProsecStore, ProsecState } from '../../estados/autorizacion-prosec.store';
import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ConfiguracionColumna, Notificacion, NotificacionesComponent, SeccionLibState, SeccionLibStore, SoloLetrasNumerosDirective, TablaDinamicaComponent, TituloComponent, doDeepCopy } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, delay, map, takeUntil, tap } from 'rxjs';
import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FilaProductos } from '../../models/prosec.model';
import { ProsecService } from '../../services/prosec.service';
import { TablaSeleccion } from '@ng-mf/data-access-user';

/**
 * @component ProductorIndirectoComponent
 * @description
 * Este componente es responsable de manejar los datos del productor indirecto.
 * Permite capturar, mostrar y validar la información relacionada a través de un formulario reactivo y una tabla dinámica.
 * Utiliza un servicio para obtener los datos desde archivos JSON y actualiza el estado mediante un store Akita.
 */

@Component({
  selector: 'app-productor-indirecto',
  templateUrl: './productor-indirecto.component.html',
  styleUrl: './productor-indirecto.component.scss',
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CommonModule,
    TituloComponent,
    NotificacionesComponent,
    forwardRef(() => SoloLetrasNumerosDirective)
  ]
})
export class ProductorIndirectoComponent implements OnInit, OnDestroy {

  /**
   * @property {string} loginRfc - RFC del usuario que ha iniciado sesión.
   */
  @Input() loginRfc!: string;

  @Input() formularioDeshabilitado: boolean = false;

  /**
   * @property {FormGroup} productorIndirecto - El grupo de formularios para capturar los datos del productor indirecto.
   */
  productorIndirecto!: FormGroup;

  /**
   * @descripcion
   * Referencia a la enumeración o clase utilizada para la selección en la tabla dinámica.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * @descripcion
   * Arreglo que contiene los datos de los productores indirectos obtenidos del servicio.
   */
  productorDato: FilaProductos[] = [];

  /**
   * @descripcion
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los controles del formulario estarán deshabilitados.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @descripcion
   * Configuración de las columnas que se mostrarán en la tabla de productores indirectos.
   */
  productorColumnsConfiguracion : ConfiguracionColumna<FilaProductos>[] = [
    { encabezado: 'Registro federal de contribuyentes', 
      clave: (fila) => fila.rfc, 
      orden: 1 },
    {
      encabezado: 'Denominación o razón social',
      clave: (fila) => fila.razonSocial,
      orden: 2,
    },
    {
      encabezado: 'Correo',
      clave: (fila) => fila.correoElectronico,
      orden: 3,
    },
  ];

  /**
   * @descripcion
   * Subject utilizado como notificador para destruir suscripciones y evitar fugas de memoria.
   * Se utiliza junto con el operador `takeUntil` para cancelar las suscripciones al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  public seccionState!: SeccionLibState;

  /**
   * @descripcion
   * Estado actual del productor, obtenido del store de Prosec.
   * @private
   */
  private productorState!: ProsecState

  /**
   * @property {FilaProductos[]} listSelectedView
   * @description
   * Arreglo que contiene los productos seleccionados en la tabla dinámica para realizar acciones como eliminar.
   */
  listSelectedView: FilaProductos[] = [];

  /**
   * @property {boolean} espectaculoAlerta
   * @description
   * Indica si se debe mostrar una alerta relacionada con la validación o acciones sobre el productor indirecto.
   */
  espectaculoAlerta: boolean = false;

  /**
   * @property {boolean} espectaculoConfirmarAlerta
   * @description
   * Indica si se debe mostrar el modal de confirmación para eliminar productos seleccionados.
   */
  espectaculoConfirmarAlerta: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacion
   * @description
   * Objeto que contiene la información de la notificación a mostrar en el componente de notificaciones.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @constructor
   * @param fb - Instancia de FormBuilder para crear y gestionar formularios reactivos.
   * @param ProsecService - Servicio para operaciones relacionadas con PROSEC.
   * @param AutorizacionProsecStore - Store para manejar el estado de autorizaciones PROSEC.
   * @param AUtorizacionProsecQuery - Query para consultar el estado de autorizaciones PROSEC.
   * 
   * @description
   * Constructor del componente ProductorIndirecto. Inicializa el formulario reactivo y
   * gestiona las dependencias necesarias para la funcionalidad del componente.
   * 
   */
  constructor(
    private readonly fb: FormBuilder, 
    private ProsecService: ProsecService,
    private AutorizacionProsecStore: AutorizacionProsecStore,
    private AUtorizacionProsecQuery: AUtorizacionProsecQuery,
    public seccionStore: SeccionLibStore,
    private consultaQuery: ConsultaioQuery
  ) {
    this.productorIndirecto = this.fb.group({
      contribuyentes: [''],
    });
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de Prosec, inicializa el formulario y recupera los datos necesarios.
   */
  ngOnInit(): void {
    this.AUtorizacionProsecQuery.selectProsec$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.productorState = state as ProsecState;
          this.productorDato = state.productorDatos as FilaProductos[];
          this.initActionFormBuild()
        })
      )
      .subscribe();
    this.initActionFormBuild();

    this.productorIndirecto.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_value) => {
          if (this.productorIndirecto.valid) {
            this.AutorizacionProsecStore.setProductorFromValida(true);
            
          }
        })
      )
      .subscribe();

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.productorDato = Array.isArray(this.productorState.productorDatos) 
        ? this.productorState.productorDatos 
        : [this.productorState.productorDatos] as FilaProductos[];

    this.nuevaNotificacion = {} as Notificacion;
  }

  /**
   * @method inicializarEstadoFormulario
   * @description
   * Inicializa el estado del formulario según la propiedad esFormularioSoloLectura.
   * Si es verdadero, deshabilita el formulario; de lo contrario, lo habilita.
   * 
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.productorIndirecto.disable();
      
    }
    else {
      this.productorIndirecto.enable();
    } 
  }

  /**
   * @method initActionFormBuild
   * @description
   * Inicializa el formulario del productor indirecto con los valores actuales del estado.
   * Este método se encarga de construir el formulario reactivo utilizando los datos almacenados en el estado de Prosec.
   * 
   */
  initActionFormBuild(): void {
    this.productorIndirecto = this.fb.group({
      contribuyentes: [
        { value: this.productorState.contribuyentes, disabled: this.esFormularioSoloLectura },
        Validators.required
      ]
    })
  }

  /**
   * @method setValoresStore
   * @description
   * Actualiza el store de autorizaciones PROSEC con el valor de un campo específico del formulario.
   * Utiliza el nombre del método proporcionado para actualizar el valor correspondiente en el store.
   * 
   * @param form - El formulario reactivo del cual se obtiene el valor.
   * @param campo - El nombre del campo cuyo valor se va a actualizar en el store.
   * @param metodoNombre - El nombre del método del store que se debe invocar para actualizar el valor.
   * 
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof AutorizacionProsecStore
  ): void {
    const VALOR = form.get(campo)?.value as unknown;
    (this.AutorizacionProsecStore[metodoNombre] as (value: unknown) => void)(
      VALOR
    );
  }

  /**
   * @method recuperarDatos
   * @description
   * Recupera los datos de los productores indirectos desde el servicio ProsecService.
   * Realiza una petición para obtener los datos de la tabla 'productor.json' y los asigna al arreglo productorDato.
   * Si la respuesta es un arreglo, se castea como FilaProductos[].
   */
  recuperarDatos(): void {
    const RFC = this.productorIndirecto.get('contribuyentes')?.value;
    this.ProsecService.obtenerProductorIndirectoDatos(RFC).subscribe(
      (response) => {
        const API_DATOS = doDeepCopy(response);
        if(API_DATOS.codigo === '00'){
          if (API_DATOS && API_DATOS.datos && Array.isArray(API_DATOS.datos.productorIndirecto)) {
            this.productorDato = [...this.productorDato, ...API_DATOS.datos.productorIndirecto];
            this.AutorizacionProsecStore.setProductorDatos(this.productorDato);
          }
        }
      }
    );
  }

   /**
   * @method agregarProductor
   * @description
   * Agrega un productor indirecto recuperando los datos actualizados desde el servicio.
   * Llama al método `recuperarDatos()` para obtener la información más reciente de los productores indirectos y actualizar la tabla.
   * 
   * @returns {void}
   */
  agregarProductor(): void {
    const CONTRIBUYENTES = this.productorIndirecto.get('contribuyentes')?.value;
    if(CONTRIBUYENTES === '') {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Se debe ingresa el RFC del productor indirecto.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
    else if(this.productorDato.some(productor => productor?.rfc === CONTRIBUYENTES)){
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('El RFC del Productor Indirecto que intenta ingresar ya fue capturada.');
    }
    else {
      this.espectaculoAlerta = false
      this.recuperarDatos();
    }
  }

    /**
   * @method seleccionTabla
   * @description
   * Actualiza la lista de productos seleccionados en la tabla dinámica y sincroniza el estado en el store.
   * @param {FilaProductos[]} event - Arreglo de productos seleccionados.
   */
  seleccionTabla(event: FilaProductos[]): void {
    this.listSelectedView = event;
    this.AutorizacionProsecStore.update((state) => ({
      ...state,
      selectedProductorDatos: [...event]
    }));
  }

  /**
   * @method eliminarProductor
   * @description
   * Muestra una alerta si no hay productos seleccionados para eliminar.
   * Si hay productos seleccionados, muestra una confirmación antes de eliminarlos.
   */
  eliminarProductor(): void {
    if (this.listSelectedView.length === 0) {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione el productor indirecto que desea eliminar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
    else if (this.listSelectedView.length > 0) {
      this.espectaculoConfirmarAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Estás seguro de eliminar la(s) planta(s)?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }
  }

  /**
   * @method eliminarPedimento
   * @description
   * Oculta la alerta de eliminación si el evento es verdadero.
   * @param {boolean} event - Indica si se debe ocultar la alerta.
   */
  eliminarPedimento(event: boolean): void {
    if (event) {
      this.espectaculoAlerta = !event;
    }
  }

  /**
   * @method eliminarPedimentoDatos
   * @description
   * Elimina los productos seleccionados del estado y actualiza la lista en el store.
   * @param {boolean} event - Indica si se debe proceder con la eliminación.
   */
  eliminarPedimentoDatos(event: boolean): void {
    if (event) {
      this.espectaculoConfirmarAlerta = false;
      const VALOR = this.AutorizacionProsecStore.getValue().productorDatos;
      if (VALOR.length === 0) {
        return;
      }
      const FILTERED_VALOR = VALOR.filter(
        (item) => !this.AutorizacionProsecStore.getValue().selectedProductorDatos?.includes(item)
      );
      this.AutorizacionProsecStore.update(
        (state) => ({
          ...state,
          productorDatos: FILTERED_VALOR,
          selectedProductorDatos: [],
        })
      );
    }
  }

  /**
   * @method obtenerConfiguracionDeNotificacion
   * @description Obtiene la configuración de notificación para mostrar mensajes al usuario.
   *
   * @param {string} mensaje - El mensaje a mostrar en la notificación.
   * @param {string} [titulo=''] - El título de la notificación.
   * @param {string} [categoria=''] - La categoría de la notificación (ej. 'success', 'error').
   * @param {string} [txtBtnCancelar=''] - El texto del botón de cancelar.
   * @returns {Notificacion} La configuración de la notificación.
   */
  obtenerConfiguracionDeNotificacion(mensaje: string, titulo: string = '', categoria: string = '', txtBtnCancelar: string = ''): Notificacion {
    return {
        tipoNotificacion: 'alert',
        categoria: categoria,
        modo: 'action',
        titulo: titulo,
        mensaje: mensaje,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: txtBtnCancelar,
      };
  }

    /**
   * @method validarFormulario
   * @description
   * Valida el formulario de productor indirecto. Si el formulario es válido, retorna `true`.
   * Si no es válido, marca todos los controles como tocados para mostrar los errores y retorna `false`.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    if (this.productorIndirecto.valid) {
      return true;
    }
    this.productorIndirecto.markAllAsTouched();
    return false
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}