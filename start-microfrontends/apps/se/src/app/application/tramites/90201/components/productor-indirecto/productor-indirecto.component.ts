import { AutorizacionProsecStore, ProsecState } from '../../estados/autorizacion-prosec.store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, Notificacion, NotificacionesComponent, doDeepCopy } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, delay, map, takeUntil, tap } from 'rxjs';
import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilaProductos } from '../../../90101/models/prosec.model';
import { ProsecService } from '../../services/prosec.service';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';

/**
 * Componente ProductorIndirecto que se utiliza para mostrar y gestionar los ProductorIndirecto.
 *
 * Este componente utiliza varios subcomponentes como TituloComponent, TablaDinamicaComponent, CommonModule,
 * FormsModule y AlertComponent para mostrar información y permitir al usuario seleccionar y agregar tratados.
 *
 * @component
 */
@Component({
  selector: 'app-productor-indirecto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './productor-indirecto.component.html',
  styleUrl: './productor-indirecto.component.scss',
})
export class ProductorIndirectoComponent implements OnInit, OnDestroy {

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
   * Contiene la instancia de una nueva notificación que será creada o gestionada.
   * 
   * @type {Notificacion}
   * @public
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Un arreglo de objetos `ProductorIndirectoTabla` que representa los datos para la tabla de productor indirecto.
   * Se inicializa con los valores de `ProductorTabla`.
   */
  public tablaDatos: FilaProductos[] = [];
  /**
   * Representa el tipo de selección de checkbox utilizado en el componente.
   * Esto se establece al valor de `TablaSeleccion.CHECKBOX`.
   */
  public checkbox = TablaSeleccion.CHECKBOX;


  /**
   * Estado actual de la solicitud para el trámite 90201.
   * 
   * Esta propiedad almacena toda la información relevante del estado de la solicitud,
   * permitiendo su consulta y manipulación dentro del componente.
   * 
   * @type {Solicitud90201State} - Tipo que define la estructura del estado de la solicitud.
   */
  public solicitudState!: ProsecState;

/**
   * @property {FilaProductos[]} listSelectedView
   * @description
   * Arreglo que contiene los productos seleccionados en la tabla dinámica para realizar acciones como eliminar.
   */
  listSelectedView: FilaProductos[] = [];


  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * 
   * Este Subject emite un valor cuando el componente se destruye, permitiendo cancelar 
   * suscripciones a observables y evitar fugas de memoria.
   * 
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa el formulario reactivo para el productor indirecto.
   * Utilizado para gestionar y validar los datos ingresados por el usuario
   * en el componente de productor indirecto.
   */
  public formProductorIndirecto!: FormGroup;

  /**
   * Representa el RFC (Registro Federal de Contribuyentes) de un usuario.
   * Este es un identificador único utilizado para fines fiscales en México.
   */
  public rfc: string = '';

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;
  /**
   * Arreglo que almacena los productores indirectos selectedProductorDatos por el usuario.
   * Este arreglo se utiliza para realizar operaciones como eliminar o procesar los productores seleccionados.
   */
  public selectedProductorDatos: FilaProductos[] = [];

/**
   * @property {boolean} espectaculoConfirmarAlerta
   * @description
   * Indica si se debe mostrar el modal de confirmación para eliminar productos seleccionados.
   */
  espectaculoConfirmarAlerta: boolean = false;

 /**
   * @property {boolean} espectaculoAlerta
   * @description
   * Indica si se debe mostrar una alerta relacionada con la validación o acciones sobre el productor indirecto.
   */
  espectaculoAlerta: boolean = false;

  /**
   * Constructor de la clase ProductorIndirectoComponent.
   * 
   * @param tramite90201Store - Servicio para manejar el estado de los trámites 90201.
   * @param tramite90201Query - Servicio para consultar el estado de los trámites 90201.
   * @param consultaioQuery - Servicio para consultar el estado de la sección de consulta IO.
   * @param fb - FormBuilder para la creación y manejo de formularios reactivos.
   * 
   * Al inicializar el componente, se suscribe al estado de consultaioQuery para actualizar
   * la propiedad de solo lectura del formulario y reinicializar el formulario del productor
   * cada vez que cambia el estado.
   */
  constructor(
    private tramite90201Store: AutorizacionProsecStore,
    private tramite90201Query: AUtorizacionProsecQuery,
    private consultaioQuery: ConsultaioQuery,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private prosecService: ProsecService,
    
  ) {

  }

  /**
   * Inicializa el componente ProductorIndirecto.
   * Se suscribe al estado de la solicitud y actualiza el RFC con el valor del estado.
   */
  ngOnInit(): void {

    this.tramite90201Query.selectProsec$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((state) => {
      this.solicitudState = state as ProsecState;
      this.tablaDatos = state.productorDatos as FilaProductos[];
      this.inicializarProductorFormulario();      
      })
    )
    .subscribe();
      this.inicializarProductorFormulario();

      this.formProductorIndirecto.statusChanges
            .pipe(
              takeUntil(this.destroyNotifier$),
              delay(10),
              tap((_value) => {
                if (this.formProductorIndirecto.valid) {
                  this.tramite90201Store.setProductorFromValida(true);
                  
                }
              })
            )
            .subscribe();

        this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();

        })
      )
      .subscribe();    

      this.tablaDatos = Array.isArray(this.solicitudState.productorDatos) 
        ? this.solicitudState.productorDatos 
        : [this.solicitudState.productorDatos] as FilaProductos[];

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
      this.formProductorIndirecto.disable();
      
    }
    else {
      this.formProductorIndirecto.enable();
    } 
  }
  /**
   * Maneja la destrucción del componente.
   * Limpia las suscripciones activas para evitar fugas de memoria.
   */
  onSeleccionChange(event: FilaProductos[]): void {
  this.selectedProductorDatos = event;
  this.tramite90201Store.update((state) => ({
    ...state,
    selectedProductorDatos: [...event]
  }));
}

   /**
   * @method seleccionTabla
   * @description
   * Actualiza la lista de productos seleccionados en la tabla dinámica y sincroniza el estado en el store.
   * @param {FilaProductos[]} event - Arreglo de productos seleccionados.
   */
  seleccionTabla(event: FilaProductos[]): void {
    this.listSelectedView = event;
    this.tramite90201Store.update((state) => ({
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
      const VALOR = this.tramite90201Store.getValue().productorDatos;
      if (VALOR.length === 0) {
        return;
      }
      const FILTERED_VALOR = VALOR.filter(
        (item) => !this.tramite90201Store.getValue().selectedProductorDatos?.includes(item)
      );
      this.tramite90201Store.update(
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
   * Agrega un nuevo productor indirecto al arreglo `tablaDatos`.
   * El método toma el valor del campo `rfc` del formulario `formProductorIndirecto`,
   * verifica si el formulario es válido y si el campo `rfc` tiene un valor.
   * Si ambas condiciones se cumplen, crea un nuevo objeto `ProductorIndirectoTabla`
   */
  agregarProductor(): void {
  const RFC_VALUE = this.formProductorIndirecto.get('rfc')?.value;
  if (!RFC_VALUE || RFC_VALUE === '') {
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
  else if(this.tablaDatos.some(productor => productor?.rfc === RFC_VALUE)){
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('El RFC del Productor Indirecto que intenta ingresar ya fue capturada.');
    }
    else {
      this.espectaculoAlerta = false
      this.recuperarDatos();
    }
}

  /**
   * @method recuperarDatos
   * @description
   * Recupera los datos de los productores indirectos desde el servicio ProsecService.
   * Realiza una petición para obtener los datos de la tabla 'productor.json' y los asigna al arreglo productorDato.
   * Si la respuesta es un arreglo, se castea como FilaProductos[].
   */
  recuperarDatos(): void {
    const BODY = {
     "rfc": this.formProductorIndirecto.get('rfc')?.value.toString(),
     "idSolicitud": null,
     "idProgramaAutorizado": "8646",
     "fechaProsec": Number(Date.now().toString()),
     "consulta": true
    };
    this.prosecService.obtenerProductorIndirectoDatos(BODY).subscribe(
      (response) => {
        
        const API_DATOS = doDeepCopy(response);
        if(API_DATOS.codigo === '00'){
          if (API_DATOS && API_DATOS.datos && Array.isArray(API_DATOS.datos)) {
           const NUEVOSPRODUCTORES = API_DATOS.datos.map((item: FilaProductos) => ({
           rfc: item.rfc ?? '',
           razonSocial: item.razonSocial ?? '',
           correoElectronico: item.correoElectronico ?? ''
      }));

      this.tablaDatos = [...this.tablaDatos, ...NUEVOSPRODUCTORES];
      this.tramite90201Store.setProductorDatos(this.tablaDatos);
      this.cdr.detectChanges();
          }
        }
      }
    );
  }

  /**
   * Inicializa el formulario reactivo para el productor indirecto.
   * 
   * Este método crea una nueva instancia del formulario `formProductorIndirecto`
   * utilizando el `FormBuilder` (`fb`). El formulario contiene un solo campo:
   * - `rfc`: Inicializado con el valor de `rfc` proveniente del estado de la solicitud (`solicitudState`).
   * 
   * @returns {void} No retorna ningún valor.
   */
  inicializarProductorFormulario(): void {
    this.formProductorIndirecto = this.fb.group({
      rfc: [
        { value:this.solicitudState.rfc, disabled: this.esFormularioSoloLectura }, Validators.required],
    });

    if (this.esFormularioSoloLectura) {
      this.formProductorIndirecto.disable();
    }
  }

  /**
   * Establece un valor en el store llamando al método especificado.
   *
   * @param campo - Nombre del campo a actualizar (actualmente no se utiliza en la función).
   * @param metodoNombre - Nombre del método del store `Tramite90201Store` que será invocado.
   *
   * Esta función toma el valor del RFC actual y lo pasa como argumento al método correspondiente del store.
   */
 setValoresStore(
     form: FormGroup,
     campo: string,
     metodoNombre: keyof AutorizacionProsecStore
   ): void {
     const VALOR = form.get(campo)?.value as unknown;
     (this.tramite90201Store[metodoNombre] as (value: unknown) => void)(
       VALOR
     );
   }

  /**
   * Muestra un mensaje de notificación basado en la acción de agregar o eliminar un productor indirecto.
   * @param agregar - Si es `true`, muestra un mensaje indicando que solo se pueden agregar personas morales.
   *                  Si es `false`, solicita al usuario seleccionar el productor indirecto que desea eliminar.
   */
  public productor(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Sólo puede ingresar personas morales',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
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
    if (this.formProductorIndirecto.valid) {
      return true;
    }
    this.formProductorIndirecto.markAllAsTouched();
    return false
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Notifica a los suscriptores para limpiar recursos y evitar fugas de memoria.
   * Completa el observable `destroyNotifier$` para finalizar todas las suscripciones dependientes.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
