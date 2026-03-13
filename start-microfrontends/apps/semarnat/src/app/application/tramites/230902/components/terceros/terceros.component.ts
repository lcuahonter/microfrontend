/**
 * Componente para gestionar los terceros.
 * Este componente permite la gestión de formularios y tablas relacionadas con los terceros.
 * 
 * Métodos:
 * - ngOnInit: Inicializa el componente y configura las suscripciones necesarias.
 * - onFilaSeleccionada: Maneja la selección de filas en la tabla.
 * - openPopup: Abre el popup si la modificación está habilitada.
 * - closePopup: Cierra el popup y actualiza el estado correspondiente.
 * - createDestinatarioForm: Crea y configura el formulario para el destinatario.
 * - onEntidadFederativaChange: Maneja los cambios en la entidad federativa y actualiza los datos de la tabla.
 * - ngOnDestroy: Limpia las suscripciones cuando el componente se destruye.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategoriaMensaje, ConfiguracionColumna, Notificacion, TablaSeleccion, TipoNotificacionEnum } from '@libs/shared/data-access-user/src';

import { map,takeUntil } from 'rxjs';

import { CatalogoEstado, CatalogoPais, DESTINARIO_TABLE_ENTRY, TERCEROS_CONFIGURACION_TABLA, TereceorsConfiguracionItem } from '../../enum/tereceors.enum';
import { Solicitud230902State, Tramite230902Store } from '../../estados/tramite230902.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PermisoCitesService } from '../../services/permiso-cites.service';

import { Subject } from 'rxjs';
import { Subscription, } from 'rxjs';

import { Tramite230902Query } from '../../estados/tramite230902.query';

/**
 * Componente para gestionar los terceros.
 * Permite la creación y edición de datos relacionados con terceros.
 */
@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrl: './terceros.component.scss',
})
export class TercerosComponent implements OnInit, OnDestroy {

  /**
   * Formulario para el destinatario.
   * Contiene los datos y validaciones del formulario de destinatarios.
   * {FormGroup}
   */
  destinatarioForm!: FormGroup;

  /**
   * Indica si el popup está abierto.
   * Controla la visibilidad del popup.
   * {boolean}
   */
  popupAbierto = false;

  /**
   * Indica si el popup está cerrado.
   * Controla el estado del cierre del popup.
   * {boolean}
   */
  popupCerrado = true;

  /**
   * Estado de la solicitud 230902.
   * Contiene el estado actual de la solicitud.
   * {Solicitud230902State}
   */
  solicitud230902State!: Solicitud230902State;

  /**
   * Notificador para destruir las suscripciones.
   * Se utiliza para cancelar suscripciones activas al destruir el componente.
   * {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Configuración de la tabla.
   * Define las columnas y configuraciones de la tabla de terceros.
   * {ConfiguracionColumna<TereceorsConfiguracionItem>[]}
   */
  configuracionTabla: ConfiguracionColumna<TereceorsConfiguracionItem>[] = TERCEROS_CONFIGURACION_TABLA;

  /**
   * Tipo de selección de la tabla.
   * Define el tipo de selección que se puede realizar en la tabla.
   * {TablaSeleccion}
   */
  TablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Datos de la tabla.
   * Contiene las filas de datos que se muestran en la tabla de terceros.
   * {TereceorsConfiguracionItem[]}
   */
  tablaDatos: TereceorsConfiguracionItem[] = [];

  /**
   * Indica si la opción de modificar está habilitada.
   * Se activa cuando hay filas seleccionadas en la tabla.
   * {boolean}
   */
  isModificarEnabled: boolean = false;

  /**
   * Identificador del modal.
   * Define el tipo de modal que se está mostrando.
   * {string}
   */
  modal: string = '';

  /**
   * Título del modal.
   * Contiene el texto que se muestra como título en el modal.
   * {string}
   */
  tituloModal!: string;

  /**
   * Mensaje del modal.
   * Contiene el texto que se muestra como mensaje en el modal.
   * {string}
   */
  mensajeModal!: string;

  /**
   * Notificación actual.
   * Configura los datos de la notificación que se muestra en el popup.
   * {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   * {boolean}
   */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Suscripción general para manejar y limpiar las suscripciones del componente.
   * Se utiliza para evitar fugas de memoria.
   * {Subscription}
   */
  private subscription: Subscription = new Subscription();

  /**
   * @property {boolean} abrirGeneralOriginal
   * @description
   * Controla la visibilidad del formulario modal para agregar datos generales originales.
   * Se establece a `true` cuando se abre el modal y a `false` cuando se cierra.
   */
  abrirGeneralOriginal: boolean = false;

  /**
   * @property {FormGroup} generalOriginalForm
   * @description
   * Formulario reactivo para capturar los datos generales originales del destinatario.
   * Incluye campos como código postal, país, estado y nombre del domicilio.
   */
  generalOriginalForm!: FormGroup;

  /**
   * @property {Array<{label: string, value: string}>} radioPatentes
   * @description
   * Opciones para el componente de radio buttons que permite seleccionar entre patentes nacionales o extranjeras.
   * Define las etiquetas y valores disponibles para la selección.
   */
  radioPatentes = [
    { label: 'Nacional', value: 'nacional' },
    { label: 'Extranjero', value: 'extranjero' }
  ];

  /**
   * @property {TereceorsConfiguracionItem[]} listaseleccionadaDestinatario
   * @description
   * Array que almacena los elementos seleccionados en la tabla de destinatarios.
   * Se utiliza para identificar qué registros han sido marcados para operaciones como modificar o eliminar.
   */
  listaseleccionadaDestinatario: TereceorsConfiguracionItem[]|null =null;

  /**
   * @property {boolean} mostrarError
   * @description
   * Indica si se debe mostrar un mensaje de error cuando no hay registros seleccionados para eliminar.
   * Se establece a `true` para mostrar la notificación de error correspondiente.
   */
  mostrarError: boolean = false;

  /**
   * @property {boolean} mostrarErrorModificar
   * @description
   * Indica si se debe mostrar un mensaje de error cuando no hay registros seleccionados para modificar.
   * Se establece a `true` para mostrar la notificación de error de modificación.
   */
  mostrarErrorModificar: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacionEliminar
   * @description
   * Objeto que contiene la configuración de la notificación que se muestra cuando hay errores
   * al intentar eliminar registros (por ejemplo, cuando no se ha seleccionado ningún registro).
   */
  public nuevaNotificacionEliminar!: Notificacion;

  /**
   * @property {Notificacion} nuevaNotificacionModificar
   * @description
   * Objeto que contiene la configuración de la notificación que se muestra cuando hay errores
   * al intentar modificar registros (por ejemplo, cuando no se ha seleccionado ningún registro).
   */
  public nuevaNotificacionModificar!: Notificacion;

  /**
   * Constructor del componente.
   * Inicializa los servicios y dependencias necesarias para la gestión de datos y formularios.
   * permisoCitesService Servicio de permisos CITES.
   * tramite230902Store Almacén de trámites 230902.
   * tramite230902Query Consulta de trámites 230902.
   * formBuilder Constructor de formularios.
   * consultaioQuery Consulta de IO.
   */
  constructor(
    public permisoCitesService: PermisoCitesService,
    private tramite230902Store: Tramite230902Store,
    private tramite230902Query: Tramite230902Query,
    private formBuilder: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
           this.esFormularioSoloLectura = seccionState.readonly;
           this.inicializarEstadoFormulario();
          })
        )
        .subscribe()
  }

  /**
   * Inicializa el estado del formulario dependiendo si es solo lectura o editable.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.crearFormularioDestinatario();
    }
    
    // Después de crear el formulario, intentar poblar la tabla si es necesario
    setTimeout(() => {
      this.onEntidadFederativaChange();
    }, 100);
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    this.crearFormularioDestinatario();
    if (this.esFormularioSoloLectura) {
      this.destinatarioForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.destinatarioForm.enable();
    }
  }

  /**
   * Inicializa el componente.
   * Configura los formularios, datos iniciales y suscripciones necesarias.
   */
  ngOnInit(): void {
    // Inicializar tablaDatos desde el estado del store
    const CURRENT_STATE = this.tramite230902Query.getValue();
    if (CURRENT_STATE.tercerosTablaDatos && CURRENT_STATE.tercerosTablaDatos.length > 0) {
      this.tablaDatos = [...CURRENT_STATE.tercerosTablaDatos];
    }
    
    this.inicializarEstadoFormulario()
    this.permisoCitesService.inicializaTercerosDatosCatalogos();
    this.permisoCitesService.inicializaUbicacionDatosCatalogos();
    
    // Llamar onEntidadFederativaChange después de que el formulario esté inicializado
    setTimeout(() => {
      this.onEntidadFederativaChange();
    });
  }

  /**
   * Maneja la selección de filas en la tabla.
   * Habilita o deshabilita la opción de modificar según las filas seleccionadas.
   * filaSeleccionada Las filas seleccionadas en la tabla.
   */
  onFilaSeleccionada(filaSeleccionada: TereceorsConfiguracionItem[]): void {
    if(filaSeleccionada.length > 0) {
      this.isModificarEnabled = true;
      this.listaseleccionadaDestinatario = filaSeleccionada;
    }
    else {
      this.isModificarEnabled = false;
    }
  }

  /**
   * Abre el popup de notificación.
   * Configura los datos de la notificación y muestra el componente lib-notificaciones.
   */
  openPopup(): void {
    if (this.isModificarEnabled) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ERROR,
        modo: 'modal',
        titulo: 'Aviso',
        mensaje: 'No se pueden modificar los datos agregados por el sistema agregada correctamente.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.popupAbierto = true; // Controla la visibilidad del popup
      this.tramite230902Store.setIsPopupOpen(this.popupAbierto);
    }
    else{
      this.mostrarErrorModificar = true;
      this.nuevaNotificacionModificar = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona sólo un registro para modificar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      }
    }
  }

  /**
   * Cierra el popup de notificación.
   * Cambia el estado del popup a cerrado.
   */
  closePopup(): void {
    this.popupAbierto = false; // Oculta el popup
    this.tramite230902Store.setIsPopupOpen(this.popupAbierto);
    this.tramite230902Store.setIsPopupClose(this.popupCerrado);
  }

  /**
   * Crea y configura el formulario para el destinatario.
   * Define los campos y validaciones necesarias.
   */
  crearFormularioDestinatario(): void {
    this.tramite230902Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => {
        this.solicitud230902State = state;
      });  
    this.subscription.add(
      this.tramite230902Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
            this.solicitud230902State = seccionState;
            this.tablaDatos = [...this.solicitud230902State.tercerosTablaDatos];
          })
        )
        .subscribe()
    );
    this.destinatarioForm = this.formBuilder.group({
      entidadFederativa: [
        this.solicitud230902State.entidadFederativa,
        Validators.required,
      ],
    });
    this.generalOriginalForm = this.formBuilder.group({
      codigoPostal: [this.solicitud230902State.codigoPostal, [Validators.required]],
      pais: [this.solicitud230902State.pais, [Validators.required]],
      estado: [this.solicitud230902State.estado, [Validators.required]],
      nombre: [this.solicitud230902State.nombre, [Validators.required, Validators.maxLength(1000)]],
    });

    // Suscribirse a los cambios del formulario para actualizar los datos de la tabla
    this.subscription.add(
      this.destinatarioForm.get('entidadFederativa')?.valueChanges
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.onEntidadFederativaChange();
        }) || new Subscription()
    );
  }

  /**
   * Maneja los cambios en la entidad federativa.
   * Actualiza el estado y los datos de la tabla relacionados con la entidad seleccionada.
   */
  onEntidadFederativaChange(): void {
    // Verificar si el formulario está inicializado primero
    if (!this.destinatarioForm) {
      return;
    }
    
    const ENTIDAD_FEDERATIVA = this.destinatarioForm.get('entidadFederativa')?.value;
    
    // Agregar entrada cuando la entidad federativa tiene un valor y la tabla está vacía
    if (ENTIDAD_FEDERATIVA && this.tablaDatos.length === 0) {
      this.tramite230902Store.establecerDatos({ entidadFederativa: ENTIDAD_FEDERATIVA });
      
      // Crear nuevo array con actualización inmutable para activar la detección de cambios
      this.tablaDatos = [...this.tablaDatos, DESTINARIO_TABLE_ENTRY];
      
      // Persistir en el store
      this.tramite230902Store.setTercerosTablaDatos(this.tablaDatos);
    }
    // Si la entidad federativa se limpia, limpiar la tabla
    else if (!ENTIDAD_FEDERATIVA && this.tablaDatos.length > 0) {
      this.tablaDatos = [];
      this.tramite230902Store.setTercerosTablaDatos(this.tablaDatos);
    }
  }

    /**
   * @method generalOriginal
   * @description
   * Abre el modal de datos generales originales estableciendo la propiedad `abrirGeneralOriginal` a `true`.
   * Permite al usuario capturar información adicional como código postal, país, estado y nombre del domicilio.
   * 
   * @returns {void}
   */
  generalOriginal(): void {
    this.abrirGeneralOriginal = true;
  }

  /**
   * @method setValoresStore
   * @description
   * Actualiza el store con el valor de un campo específico del formulario.
   * Obtiene el valor del campo indicado y lo almacena en el estado utilizando el método `establecerDatos`.
   * 
   * @param {FormGroup} form - El formulario del cual se obtiene el valor del campo.
   * @param {string} campo - El nombre del campo cuyo valor se desea almacenar en el store.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite230902Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * @method anadirValores
   * @description
   * Procesa y agrega los valores del formulario de datos generales a la tabla de terceros.
   * Si el formulario es válido:
   * - Cierra el modal de datos generales.
   * - Busca las descripciones del país y estado en los catálogos correspondientes.
   * - Si la tabla está vacía, crea un nuevo elemento.
   * - Si la tabla tiene datos, actualiza el elemento existente.
   * - Actualiza el store con los nuevos datos de la tabla.
   * 
   * @returns {void}
   */
  anadirValores(): void {
    if (this.generalOriginalForm.valid) {
      this.abrirGeneralOriginal = false;
      const NUEVOSVALOR = { ...this.generalOriginalForm.value };

      const PAISCATALGO = this.permisoCitesService.pais?.find(
        (p: CatalogoPais) => p.id === Number(NUEVOSVALOR.pais)
      );

      const ESTADO = this.permisoCitesService.estado?.find(
        (e: CatalogoEstado) => e.id === Number(NUEVOSVALOR.estado)
      );

      const PAISDESC = PAISCATALGO ? PAISCATALGO.descripcion : '';
      const ESTADODESC = ESTADO ? ESTADO.descripcion : '';

      if (this.tablaDatos.length === 0) {
        const NUEVO_ITEM: TereceorsConfiguracionItem = {
          codigoPostal: NUEVOSVALOR.codigoPostal,
          ciudad: '---',
          pais: PAISDESC,
          entidadFederativa: ESTADODESC,
          domicilio: NUEVOSVALOR.nombre,
        };
        this.tablaDatos = [NUEVO_ITEM];
      } else {
        this.tablaDatos = this.tablaDatos.map(item => {
          const ACTUALIZADO: TereceorsConfiguracionItem = {
            codigoPostal: NUEVOSVALOR.codigoPostal ?? item.codigoPostal,
            ciudad: '---',
            pais: PAISDESC ?? item.pais,
            entidadFederativa: ESTADODESC ?? item.entidadFederativa,
            domicilio: NUEVOSVALOR.nombre ?? item.domicilio,
          };
          return ACTUALIZADO;
        });
      }
      this.tramite230902Store.setTercerosTablaDatos(this.tablaDatos);
    }
  }

  /**
   * @method cancelar
   * @description
   * Cancela la operación de agregar datos generales y cierra el modal correspondiente.
   * Establece la propiedad `abrirGeneralOriginal` a `false` para ocultar el formulario modal.
   * 
   * @returns {void}
   */
  cancelar(): void {
    this.abrirGeneralOriginal = false;
  }

  /**
   * @method eliminarSeleccionados
   * @description
   * Elimina los registros seleccionados de la tabla de terceros.
   * Si no hay registros seleccionados, muestra una notificación de error solicitando seleccionar un registro.
   * Si hay registros seleccionados, los filtra de la tabla, actualiza el store y deshabilita la opción de modificar.
   * 
   * @returns {void}
   */
  eliminarSeleccionados(): void {
    if(this.listaseleccionadaDestinatario === null){
      this.mostrarError = true;
      this.nuevaNotificacionEliminar = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione un registro.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      }
    }
    else{
      this.tablaDatos = this.tablaDatos.filter(
        item => !this.listaseleccionadaDestinatario?.some(
          seleccionado => seleccionado === item
        )
      );
      this.tramite230902Store.setTercerosTablaDatos(this.tablaDatos);
      this.isModificarEnabled = false;
    }
  }

  /**
   * @method eliminarNoSeleccionados
   * @description
   * Elimina todos los registros de la tabla de terceros sin verificar selecciones.
   * Vacía completamente la tabla de datos y actualiza el store con un arreglo vacío.
   * 
   * @returns {void}
   */
  eliminarNoSeleccionados(): void {
    this.tablaDatos = [];
    this.tramite230902Store.setTercerosTablaDatos(this.tablaDatos);
  }

  /**
   * Limpia las suscripciones cuando el componente se destruye.
   * Evita fugas de memoria al completar el Subject.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}