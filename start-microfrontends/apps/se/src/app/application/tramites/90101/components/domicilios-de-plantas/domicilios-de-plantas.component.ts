/**
 * @component DomiciliosDePlantasComponent
 * @description Este componente es responsable de manejar los domicilios de plantas.
 * Incluye la lógica para obtener y gestionar los datos de las plantas, así como los catálogos relacionados.
 * 
 * @import { Component } from '@angular/core';
 * @import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 * @import { TEXTO } from '../../../../shared/constantes/prosec/prosec.module';
 * @import { Catalogo } from '../../../../core/models/shared/catalogos.model';
 * @import { ProsecService } from '../../../../core/services/90101/prosec.module';
 * @import { PLANTACOLUMNS } from '../../../../shared/constantes/prosec/prosec.module';
 */

import { AlertComponent, Catalogo, CatalogoServices, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TituloComponent, doDeepCopy } from '@ng-mf/data-access-user';
import { AutorizacionProsecStore, ProsecState } from '../../estados/autorizacion-prosec.store';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, delay, map, takeUntil, tap } from 'rxjs';
import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FilaPlantas } from '../../models/prosec.model'
import { HttpErrorResponse } from '@angular/common/http';
import { ProsecService } from '../../services/prosec.service';
import { SeccionLibQuery } from '@ng-mf/data-access-user';
import { SeccionLibState } from '@ng-mf/data-access-user';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { TEXTO } from '../../constantes/prosec.module';
import { TablaSeleccion } from '@ng-mf/data-access-user';

/**
 * @class DomiciliosDePlantasComponent
 * @description
 * Componente que permite la gestión de domicilios de plantas como parte del formulario PROSEC.
 * Maneja formularios, selección de catálogos y carga dinámica de información desde archivos JSON.
 */
@Component({
  selector: 'app-domicilios-de-plantas',
  templateUrl: './domicilios-de-plantas.component.html',
  styleUrls: ['./domicilios-de-plantas.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, CommonModule, TablaDinamicaComponent, AlertComponent, NotificacionesComponent]
})
export class DomiciliosDePlantasComponent implements OnInit, OnDestroy {

  /**
   * @property {string} loginRfc - RFC del usuario que ha iniciado sesión.
   */
  @Input() loginRfc!: string;

    /**
   * @input
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario debe estar deshabilitado (modo solo lectura).
   * Cuando es `true`, todos los controles del formulario estarán deshabilitados y no permitirán edición.
   * Este valor puede ser establecido desde el componente padre.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * @property {FormGroup} forma - El grupo de formularios para capturar los datos de las plantas.
   */
  forma!: FormGroup;

  /**
   * @property {string} TEXTO - Constante de texto utilizada en el componente.
   */
  TEXTO: string = TEXTO;

  /**
   * @property {Catalogo[]} estadoSeleccionar - Array de catálogos de estados.
   */
  estadoSeleccionar: Catalogo[] = [];

  /**
   * @property {Catalogo[]} RepresentacionFederal - Array de catálogos de representación federal.
   */
  RepresentacionFederal: Catalogo[] = [];

  /**
   * @property {Catalogo[]} ActividadProductiva - Array de catálogos de actividad productiva.
   */
  ActividadProductiva: Catalogo[] = [];

  /**
   * @descripcion
   * Arreglo que contiene los datos de las plantas obtenidos del servicio.
   */
  plantasDatos: FilaPlantas[] = [];

  prosecDatos: FilaPlantas[] = [];

  /**
   * @descripcion
   * Referencia a la enumeración o clase utilizada para la selección en la tabla dinámica.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * @descripcion
   * Subject utilizado como notificador para destruir suscripciones y evitar fugas de memoria.
   * Se utiliza junto con el operador `takeUntil` para cancelar las suscripciones al destruir el componente.
   * @public
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @descripcion
   * Estado actual de los domicilios, obtenido del store de Prosec.
   * @public
   */
  public domiciliosState!: ProsecState;

  /**
   * @descripcion
   * Estado actual de la sección, obtenido del store de la sección.
   * @public
   */
  public seccionState!: SeccionLibState;

  @Input() tramiteId!: string;

  /**
   * @descripcion
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los controles del formulario estarán deshabilitados.
   */
  esFormularioSoloLectura: boolean = false;

    /**
   * @property {FilaPlantas[]} listSelectedView
   * @description
   * Arreglo que contiene las plantas seleccionadas en la tabla dinámica para realizar acciones como eliminar.
   */
  listSelectedView: FilaPlantas[] = [];

  /**
   * @property {boolean} eliminarPlantasConfirmacion
   * @description
   * Indica si se debe mostrar el modal de confirmación para eliminar plantas seleccionadas.
   */
  eliminarPlantasConfirmacion: boolean = false;

  /**
   * @property {boolean} eliminarPlantasAlerta
   * @description
   * Indica si se debe mostrar una alerta cuando no se ha seleccionado ninguna planta para eliminar.
   */
  eliminarPlantasAlerta: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacion
   * @description
   * Objeto que contiene la información de la notificación a mostrar en el componente de notificaciones.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {boolean} espectaculoAlerta
   * @description
   * Indica si se debe mostrar una alerta relacionada con la selección de entidad federativa o plantas.
   */
  espectaculoAlerta: boolean = false;

  /**
   * @property {boolean} espectaculoAlertaAgregar
   * @description
   * Indica si se debe mostrar una alerta relacionada con la acción de agregar plantas seleccionadas a la lista PROSEC.
   * Se utiliza para advertir al usuario cuando no ha seleccionado ninguna planta para agregar.
   */
  espectaculoAlertaAgregar: boolean = false;

  /**
   * @property {ProsecState} storeData
   * @description
   * Copia profunda del estado actual del store de Prosec.
   * Se utiliza para mantener una referencia inmutable del estado y evitar modificaciones directas.
   * @public
   * */
  storeData: ProsecState = {} as ProsecState;

  /**
   * @descripcion
   * Configuración de las columnas que se mostrarán en la tabla de plantas.
   */
  plantaColumnsConfiguracion: ConfiguracionColumna<FilaPlantas>[] = [
    { encabezado: 'Calle', 
      clave: (fila) => fila.domicilioDto.calle, 
      orden: 1 },
    {
      encabezado: 'Número exterior',
      clave: (fila) => fila.domicilioDto.numExterior,
      orden: 2,
    },
    {
      encabezado: 'Número interior',
      clave: (fila) => fila.domicilioDto.numInterior,
      orden: 3,
    },
    {
      encabezado: 'Código postal',
      clave: (fila) => fila.domicilioDto.codigoPostal,
      orden: 4,
    },
    {
      encabezado: 'Colonia',
      clave: (fila) => fila.domicilioDto.colonia?.nombre,
      orden: 5,
    },
    {
      encabezado: 'Municipio o alcaldía',
      clave: (fila) => fila.domicilioDto.delegacionMunicipio?.nombre,
      orden: 6,
    },
    {
      encabezado: 'Estado',
      clave: (fila) => fila.domicilioDto.entidadFederativa?.nombre,
      orden: 7,
    },
    {
      encabezado: 'País',
      clave: (fila) => fila.domicilioDto.pais?.nombre,
      orden: 8,
    },
    {
      encabezado: 'Registro federal de contribuyentes',
      clave: (fila) => fila.empresaDto.rfc,
      orden: 9,
    },
    {
      encabezado: 'Razón social',
      clave: (fila) => fila.empresaDto.razonSocial,
      orden: 10,
    },
    {
      encabezado: 'Domicilio fiscal del solicitante',
      clave: (fila) => fila.empresaDto.domicilioCompleto,
      orden: 11,
    }
  ];

  /**
   * @constructor
   * @param {FormBuilder} fb - Servicio para la construcción de formularios reactivos.
   * @param {ProsecService} ProsecService - Servicio para operaciones relacionadas con Prosec.
   * @param {AutorizacionProsecStore} AutorizacionProsecStore - Store para manejar el estado de autorización Prosec.
   * @param {AUtorizacionProsecQuery} AUtorizacionProsecQuery - Query para consultar el estado de autorización Prosec.
   * @param {SeccionLibStore} seccionStore - Store para manejar el estado de la sección.
   * @param {SeccionLibQuery} seccionQuery - Query para consultar el estado de la sección.
   */
  constructor(
    public fb: FormBuilder, 
    public ProsecService: ProsecService, 
    public AutorizacionProsecStore: AutorizacionProsecStore,
    public AUtorizacionProsecQuery: AUtorizacionProsecQuery,
    public seccionStore: SeccionLibStore,
    public seccionQuery: SeccionLibQuery,
    private consultaQuery: ConsultaioQuery,
    private catalogoServices: CatalogoServices,
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe a los observables de estado de sección y de autorización PROSEC para mantener el estado local actualizado.
   * - Inicializa el formulario de acciones y obtiene la lista de domicilios.
   * - Establece el estado de validez de la sección en falso al inicio.
   * - Escucha los cambios de estado del formulario y, si es válido, actualiza el estado de validez en el store correspondiente.
   * - Si el formulario está deshabilitado, inicializa su estado.
   * - Si la forma es válida (con descripción 'AllValida'), actualiza el estado de la sección y su validez; en caso contrario, la marca como no válida.
   *
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    this.AUtorizacionProsecQuery.selectProsec$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.domiciliosState = state as ProsecState;
          this.plantasDatos = state.plantasDatos;
          this.prosecDatos = state.prosecDatos;
          this.storeData = state;
          this.initActionFormBuild()
        })
      )
      .subscribe();
    this.initActionFormBuild();
    this.obtenerLista();

    this.forma.statusChanges
          .pipe(
            takeUntil(this.destroyNotifier$),
            delay(10),
            tap((_value) => {
              if (this.forma.valid) {
                this.AutorizacionProsecStore.setDomiciliosFormaValida(true);
                
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
    this.prosecDatos = Array.isArray(this.domiciliosState.plantasDatos) ? this.domiciliosState.plantasDatos : [] as FilaPlantas[];
    this.nuevaNotificacion = {} as Notificacion;
  }

  /**
   * @method setValoresStore
   * @description
   * Actualiza un valor en el store de AutorizacionProsec utilizando el método especificado.
   * 
   * @param form El formulario reactivo (`FormGroup`) del cual se obtiene el valor.
   * @param campo El nombre del campo dentro del formulario cuyo valor se va a extraer.
   * @param metodoNombre El nombre del método del store (`AutorizacionProsecStore`) que se va a invocar para actualizar el valor.
   * 
   * @returns {void}
   * 
   * @memberof DomiciliosDePlantasComponent
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof AutorizacionProsecStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.AutorizacionProsecStore[metodoNombre] as (value: unknown) => void)(
      VALOR
    );
  }

  /**
   * @method inicializarEstadoFormulario
   * @description
   * Inicializa el estado del formulario según el modo de solo lectura.
   * Si el formulario está en modo solo lectura, lo deshabilita; de lo contrario, lo habilita.
   *
   * @memberof DomiciliosDePlantasComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.forma.disable();
    }
    else {
      this.forma.enable();
      this.forma.get('modalidad')?.disable();
    } 
  }

  /**
   * @method initActionFormBuild
   * @description
   * Inicializa el formulario reactivo para capturar los datos de las plantas.
   * Define los controles y sus validaciones, utilizando los valores actuales del estado.
   *
   * @memberof DomiciliosDePlantasComponent
   */
  initActionFormBuild(): void {
    this.forma = this.fb.group({
      modalidad: [
        { value: this.domiciliosState.modalidad, disabled: true },
      ],
      Estado: [
        this.domiciliosState.Estado,
        Validators.required
      ],
      RepresentacionFederal: [
        this.domiciliosState.RepresentacionFederal,
        Validators.required
      ],
      ActividadProductiva: [
        this.domiciliosState.ActividadProductiva,
        Validators.required
      ]
    })
  }

    /**
   * @method obtenerListaEstado
   * @description
   * Obtiene la lista de estados desde el servicio llamando al archivo `estado.json`.
   * Si la petición es exitosa, asigna los datos recibidos a la propiedad `estadoSeleccionar`.
   * En caso de error, muestra el error en consola y asigna un arreglo vacío.
   * 
   * @returns {void}
   */
  obtenerListaEstado(): void {
    this.catalogoServices.estadosCatalogo(this.tramiteId).subscribe({
      next: (data) => {
        this.estadoSeleccionar = data.datos as Catalogo[];
        if(this.storeData.RepresentacionFederal.length > 0){
          this.obtenerListaFederal();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener los datos:', error);
        this.estadoSeleccionar = [];
      }
  });
  }

  /**
   * @method obtenerListaFederal
   * @description
   * Obtiene la lista de representación federal desde el servicio llamando al archivo `federal.json`.
   * Si la petición es exitosa, asigna los datos recibidos a la propiedad `RepresentacionFederal`.
   * En caso de error, muestra el error en consola y asigna un arreglo vacío.
   * 
   * @returns {void}
   */
  obtenerListaFederal(): void {
    this.catalogoServices.getRepresentacionFederalMexCatalogo(this.tramiteId.toString(), this.forma.get('Estado')?.value).subscribe({
      next: (data) => {
        this.RepresentacionFederal = data.datos as Catalogo[];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener los datos:', error);
        this.RepresentacionFederal = [];
      }
  });

    // this.ProsecService.obtenerMenuDesplegable('federal.json').subscribe({
    //   next: (data) => {
    //     this.RepresentacionFederal = data as Catalogo[];
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     console.error('Error al obtener los datos:', error);
    //     this.RepresentacionFederal = [];
    //   }
    // });
  }

    /**
   * @method obtenerListaActividad
   * @description
   * Obtiene la lista de actividades productivas desde el servicio llamando al archivo `actividad_productiva.json`.
   * Si la petición es exitosa, asigna los datos recibidos a la propiedad `ActividadProductiva`.
   * En caso de error, muestra el error en consola y asigna un arreglo vacío.
   * 
   * @returns {void}
   */
  obtenerListaActividad(): void {
    this.catalogoServices.getActividadProductivaProsecCatalogo(this.tramiteId.toString()).subscribe((data) => {
        const DATOS = data.datos as Catalogo[];
        this.ActividadProductiva = DATOS;
    });
    // this.ProsecService.obtenerMenuDesplegable('actividad_productiva.json').subscribe({
    //   next: (data) => {
    //     this.ActividadProductiva = data as Catalogo[];
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     console.error('Error al obtener los datos:', error);
    //     this.ActividadProductiva = [];
    //   }
    // });
  }

  /**
   * @method obtenerLista
   * @description
   * Obtiene todas las listas necesarias para el formulario de domicilios de plantas.
   * Llama a los métodos para obtener la lista de estados, representación federal, actividad productiva y los datos de plantas.
   * Este método centraliza la carga de catálogos y datos requeridos para el correcto funcionamiento del formulario.
   * 
   * @returns {void}
   */
  obtenerLista(): void {
    this.obtenerListaEstado();
    this.obtenerListaActividad();
    
  }

  /**
   * @method estadoSeleccion
   * @description
   * Método que selecciona un estado del catálogo y lo establece en el store de autorización PROSEC.
   * 
   * @param {Catalogo} Estado - Objeto que representa el estado seleccionado del catálogo.
   * 
   * @memberof DomiciliosDePlantasComponent
   */
  estadoSeleccion(Estado: Catalogo): void {
    this.AutorizacionProsecStore.setEstado([Estado]);
  }

  /**
   * @method fedralSeleccion
   * @description
   * Selecciona una representación federal y la establece en el store de autorización PROSEC.
   *
   * @param {Catalogo} RepresentacionFederal - Objeto que representa la representación federal seleccionada.
   *
   * @returns {void}
   *
   * @memberof DomiciliosDePlantasComponent
   */
  fedralSeleccion(RepresentacionFederal: string): void {
    this.AutorizacionProsecStore.setRepresentacionFederal(RepresentacionFederal);
  }

  /**
   * @method productivaSeleccion
   * @description
   * Selecciona una actividad productiva y la establece en el store de autorización PROSEC.
   *
   * @param {Catalogo} ActividadProductiva - Objeto que representa la actividad productiva seleccionada.
   *
   * @memberof DomiciliosDePlantasComponent
   */
  productivaSeleccion(ActividadProductiva: Catalogo): void {
    this.AutorizacionProsecStore.setActividadProductiva([ActividadProductiva]);
  }

  /**
   * @method recuperarDatos
   * @description Recupera los datos de las plantas desde un archivo JSON utilizando el servicio ProsecService.
   * Llama al método `obtenerTablaDatos` con el nombre del archivo y suscribe a la respuesta.
   * Si la respuesta es un arreglo, asigna los datos a la propiedad `plantasDatos`.
   *
   * @memberof DomiciliosDePlantasComponent
   * @returns {void}
   */
  recuperarDatos(): void {
    const PAYLOAD = {
      rfc_solicitante: this.loginRfc,
      enitdad_federativa: this.forma.get('Estado')?.value,
      planta_idc: "1"
    }
    this.ProsecService.obtenerPlantasDatosProsec(PAYLOAD).subscribe(
      (response) => {
        const API_DATOS = doDeepCopy(response);
        if(API_DATOS.codigo === '00'){
          if(this.plantasDatos.some(planta => planta?.domicilioDto?.entidadFederativa.nombre === API_DATOS.datos.plantas[0]?.domicilioDto?.entidadFederativa.nombre)){
            return;
          }
          if (API_DATOS && API_DATOS.datos && Array.isArray(API_DATOS.datos.plantas)) {
            this.plantasDatos = [...this.plantasDatos, ...API_DATOS.datos.plantas];
            this.AutorizacionProsecStore.setPlantasDatos(this.plantasDatos);
          }
        }
      }
    );
  }

  /**
   * @method mostrarDomicilios
   * @description
   * Método que recupera los datos de las plantas y los asigna a la propiedad correspondiente.
   * Utiliza el servicio ProsecService para obtener los datos desde el archivo 'plantasDatos.json'.
   * 
   * @returns {void}
   * 
   * @memberof DomiciliosDePlantasComponent
   */
  mostrarDomicilios(): void {
    const ESTADO = this.forma.get('Estado')?.value;
    if(ESTADO.length === 0){
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona la Entidad Federativa.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
    else {
      this.espectaculoAlerta = false;
      this.recuperarDatos();
    }
  }

    /**
   * @method agregarPlantas
   * @description
   * Limpia el arreglo de plantas y recupera los datos actualizados de plantas desde el servicio.
   * Llama a `recuperarProsecDatos()` para obtener la información más reciente de las plantas.
   * 
   * @returns {void}
   */
  agregarPlantas(): void {
    if ( this.listSelectedView.length > 0) {
      const VALOR = this.AutorizacionProsecStore.getValue().plantasDatos;
      if (VALOR.length === 0) {
        return;
      }
      const FILTERED_VALOR = VALOR.filter(
        (item) => !this.AutorizacionProsecStore.getValue().selectedDatos?.includes(item)
      );
      this.AutorizacionProsecStore.update(
        (state) => ({
          ...state,
          plantasDatos: FILTERED_VALOR,
          prosecDatos: this.AutorizacionProsecStore.getValue().selectedDatos,
          selectedDatos: [],
        })
      );
      this.listSelectedView = [];
    }
    else {
      this.espectaculoAlertaAgregar = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona al menos una planta donde se realizarán las operaciones PROSEC.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * @method agregarPlantasconfirmar
   * @description
   * Oculta la alerta relacionada con la acción de agregar plantas seleccionadas a la lista PROSEC.
   * Se utiliza para cerrar el mensaje de advertencia cuando el usuario confirma la acción.
   */
  agregarPlantasconfirmar(): void {
    this.espectaculoAlertaAgregar = false
  }

  /**
   * @method recuperarProsecDatos
   * @description
   * Recupera los datos de plantas desde el archivo 'plantasDatos.json' utilizando el servicio ProsecService.
   * Si la respuesta es un arreglo, asigna los datos a la propiedad `prosecDatos`.
   * 
   * @returns {void}
   */
  recuperarProsecDatos(): void {
    this.ProsecService.obtenerTablaDatos('plantasDatos.json').subscribe(
      (response) => {
        if (response && Array.isArray(response)) {
          this.prosecDatos = response as FilaPlantas[];
          this.AutorizacionProsecStore.setProsecDatos(this.prosecDatos);
        }
      }
    );
  }

  /**
   * @method seleccionTabla
   * @description
   * Actualiza la lista de plantas seleccionadas en la tabla dinámica y sincroniza el estado en el store.
   * @param {FilaPlantas[]} event - Arreglo de plantas seleccionadas.
   */
  seleccionTabla(event: FilaPlantas[]): void {
    this.listSelectedView = event;
    this.AutorizacionProsecStore.update(
      (state) => ({
        ...state,
        selectedDatos: event
      })
    )
  }

  /**
   * @method eliminarPlantas
   * @description
   * Muestra una alerta si no hay plantas seleccionadas para eliminar.
   * Si hay plantas seleccionadas, muestra una confirmación antes de eliminarlas.
   */
  eliminarPlantas(): void {
    if (this.listSelectedView.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona la planta que desea eliminar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.eliminarPlantasAlerta = true;
    }
    else if (this.listSelectedView.length > 0) {
      this.eliminarPlantasConfirmacion = true;
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
    if (event === true) {
      this.eliminarPlantasAlerta = !event;
    }
  }

  /**
   * @method eliminarPedimentoDatos
   * @description
   * Elimina las plantas seleccionadas del estado y actualiza la lista en el store.
   * @param {boolean} event - Indica si se debe proceder con la eliminación.
   */
  eliminarPedimentoDatos(event: boolean): void {
    if (event === true) {
      this.eliminarPlantasConfirmacion = false;
      const VALOR = this.AutorizacionProsecStore.getValue().prosecDatos;
      if (VALOR.length === 0) {
        return;
      }
      const FILTERED_VALOR = VALOR.filter(
        (item) => !this.AutorizacionProsecStore.getValue().selectedDatos?.includes(item)
      );
      this.AutorizacionProsecStore.update(
        (state) => ({
          ...state,
          prosecDatos: FILTERED_VALOR,
          selectedDatos: [],
        })
      );
      this.listSelectedView = [];
    }
    else {
      this.eliminarPlantasConfirmacion = false;
    }
  }

    /**
   * @method validarFormulario
   * @description
   * Valida el formulario de domicilios de plantas. Si el formulario es válido, retorna `true`.
   * Si no es válido, marca todos los controles como tocados para mostrar los errores y retorna `false`.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    if (this.forma.valid) {
      return true;
    }
    this.forma.markAllAsTouched();
    return false
  }

  onCambioEstado(): void {
    this.obtenerListaFederal();
  }

  /**
   * Cierra el modal de confirmación de eliminación.
   */
  cerrarEspectaculoAlertaModal(): void {
    this.espectaculoAlerta = false;
  }

  /**
   * @method ngOnDestroy
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se encarga de emitir y completar el notificador destroyNotifier$ para cancelar todas las suscripciones activas y evitar fugas de memoria.
   *
   * @memberof DomiciliosDePlantasComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  
}