import {
  Catalogo,
  ConfiguracionColumna,
  ConsultaioQuery,
  Notificacion,
  TablaSeleccion,
} from '@ng-mf/data-access-user';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormularioDatos,
  Plantas,
} from '../../modelos/registro-solicitud-immex.model';
import { Subject, Subscription, map, takeUntil, tap } from 'rxjs';
import {
  Tramite80210Store,
  Tramites80210State,
} from '../../estados/tramites80210.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CONFIGURACION_TABLA_PLANTAS } from '../../enums/registro-solicitud-immex.enum';
import { CatalogoServices } from '@libs/shared/data-access-user/src/core/services/shared/catalogo.service';
import { PlantasDisponiblesResponse } from '../../../../shared/models/modelo-interface.model';
import { REGEX_RFC } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { Tramite80210Query } from '../../estados/tramites80210.query';
import { registroSolicitudImmexService } from '../../services/registro-solicitud-immex.service';

/**
 * Componente para gestionar las empresas terciarizadas.
 *
 * @remarks
 * Este componente permite la gestión de plantas disponibles y seleccionadas,
 * así como la interacción con el formulario de empresas y el estado global.
 */
@Component({
  selector: 'app-empresas-terciarizadas',
  templateUrl: './empresas-terciarizadas.component.html',
  styleUrl: './empresas-terciarizadas.component.scss',
})
export class EmpresasTerciarizadasComponent implements OnInit, OnDestroy {
  /**
   * Identificador del trámite.
   */
  tramiteID = '80210';

  /**
   * Lista de estados disponibles para selección.
   *
   * @type {Catalogo[]}
   * @memberof EmpresasTerciarizadasComponent
   */
  estado!: Catalogo[];

  /**
   * Formulario reactivo para gestionar los datos de las empresas.
   */
  empresasForm!: FormGroup;

  /**
   * Estado global del trámite 80210.
   */
  tramites80210State!: Tramites80210State;

  /**
   * Lista de plantas disponibles para selección.
   */
  plantasDisponibles: Plantas[] = [];

  /**
   * Lista de plantas seleccionadas.
   */
  plantasSeleccionadas: Plantas[] = [];

  /**
   * Lista temporal de filas seleccionadas en la tabla.
   */
  listaFilaSeleccionada: Plantas[] = [];

  /**
   * Indica si se deben mostrar las plantas en la interfaz.
   */
  showPlantas!: boolean;

  /**
   * Configuración de las columnas de la tabla dinámica.
   */
  tablaConfiguration: ConfiguracionColumna<Plantas>[] =
    CONFIGURACION_TABLA_PLANTAS;

  /**
   * Tipo de selección para la tabla dinámica.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Suscripción para manejar observables.
   * @property {Subscription} subscription
   */
  private subscription: Subscription = new Subscription();

  /**
   * Notificación para destruir observables al destruir el componente.
   */
  destoryNotification$: Subject<void> = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

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
   * @property {Notificacion} nuevaNotificacion
   * @description
   * Objeto que contiene la información de la notificación a mostrar en el componente de notificaciones.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {FilaPlantas[]} listSelectedView
   * @description
   * Arreglo que contiene las plantas seleccionadas en la tabla dinámica para realizar acciones como eliminar.
   */
  listSelectedView: Plantas[] = [];
  /**
   * Constructor del componente.
   *
   * @param catalogoServices - Servicio para obtener catálogos.
   * @param formBuilder - Constructor de formularios reactivos.
   * @param registroSolicitudService - Servicio para gestionar solicitudes Immex.
   * @param tramite80210Store - Estado global del trámite 80210.
   * @param tramite80210Query - Consulta del estado global del trámite 80210.
   */
  constructor(
    private catalogoServices: CatalogoServices,
    private formBuilder: FormBuilder,
    @Inject(registroSolicitudImmexService)
    public registroSolicitudService: registroSolicitudImmexService,
    private tramite80210Store: Tramite80210Store,
    private tramite80210Query: Tramite80210Query,
    private consultaQuery: ConsultaioQuery,
    private serviciosService: ServiciosService
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destoryNotification$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.obtenerEstadoSelectList(this.tramiteID);
  }

  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
    }
  }

  /**
   * Inicializa el formulario de empresas terciarizadas.
   *
   * - Inicializa el estado global del trámite 80210.
   * - Asigna el valor de `showPlantas` según el estado actual.
   * - Solicita los estados disponibles a través del servicio.
   * - Obtiene los datos del formulario y actualiza los valores del formulario reactivo.
   * - Si se deben mostrar plantas, segrega los datos de plantas disponibles y seleccionadas.
   * - Si no, limpia las listas de plantas.
   * - Finalmente, crea la estructura del formulario reactivo.
   *
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.initializeTramite80210State();
    this.showPlantas = this.tramites80210State.showPlantas;
    this.registroSolicitudService
      .obtenerFormularioDatos()
      .pipe(takeUntil(this.destoryNotification$))
      .subscribe((datos) => {
        this.actualizarFormulario(datos);
        if (this.showPlantas) {
          this.aegregatePlantasDatos();
        } else {
          this.plantasDisponibles = [];
          this.plantasSeleccionadas = [];
        }
      });
  }
  /**
   * Obtiene la lista de estados disponibles para el select.
   *
   * @param tramite - Identificador del trámite para filtrar los estados.
   * @returns {void}
   *
   * @remarks
   * Utiliza el servicio de catálogo para obtener los estados y los asigna a la propiedad `estado`.
   */
  obtenerEstadoSelectList(tramite: string): void {
    this.subscription.add(
      this.catalogoServices.estadosCatalogo(tramite).subscribe((data) => {
        const DATOS = data.datos as Catalogo[];
        this.estado = DATOS;
      })
    );
  }

  /**
   * Guarda el estado del formulario y ajusta la habilitación de los campos según el modo de solo lectura.
   *
   */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.empresasForm.disable();
    } else {
      this.empresasForm.enable();
    }
  }

  /**
   * Crea el formulario reactivo para las empresas.
   */
  crearFormulario(): void {
    this.inicializarFormulario();
    this.empresasForm = this.formBuilder.group({
      modalidad: [{ value: '', disabled: true }],
      folio: [{ value: '', disabled: true }],
      ano: [{ value: '', disabled: true }],
      rfc: [
        this.tramites80210State.rfc,
        [Validators.required, Validators.pattern(REGEX_RFC)],
      ],
      estado: [this.tramites80210State.estado, [Validators.required]],
    });
  }

  /**
   * Actualiza los valores del formulario con los datos proporcionados.
   *
   * @param datos - Datos del formulario a actualizar.
   */
  actualizarFormulario(datos: FormularioDatos): void {
    this.empresasForm.get('modalidad')?.setValue(datos.modalidad);
    this.empresasForm.get('folio')?.setValue(datos.folio);
    this.empresasForm.get('ano')?.setValue(datos.ano);
  }

  /**
   * Busca las empresas controladoras y actualiza el estado de las plantas.
   */
  buscarControladoras(): void {
    const ESTADO_VALUE = this.empresasForm.get('estado')?.value;
    const RFC_VALUE = this.empresasForm.get('rfc')?.value;

    if (!ESTADO_VALUE || ESTADO_VALUE.length === 0) {
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
      return;
    }

    if (!RFC_VALUE) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe introducir el RFC.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.esFormularioValido()) {
      this.obtenerPlantaDisponibles();
      this.empresasForm.get('rfc')?.reset();
      this.empresasForm.get('estado')?.reset();
    }
  }

  /**
   * Verifica si el formulario de empresas es válido.
   *
   * @returns {boolean} Retorna `true` si el formulario es válido y el campo 'estado' tiene un valor distinto de '-1'; de lo contrario, retorna `false`.
   */
  esFormularioValido(): boolean {
    return this.empresasForm.valid && this.empresasForm.get('estado')?.value;
  }

  /**
   * Inicializa el estado global del trámite 80210.
   */
  initializeTramite80210State(): void {
    this.tramite80210Query.selectTramite80210$
      .pipe(takeUntil(this.destoryNotification$))
      .subscribe((datos) => {
        this.tramites80210State = datos;
      });
  }

  /**
   * Segrega los datos de las plantas en disponibles y seleccionadas.
   */
  aegregatePlantasDatos(): void {
    if (this.tramites80210State.plantasDisponibles.length > 0) {
      this.plantasDisponibles = this.tramites80210State.plantasDisponibles;
    } else {
      if (this.empresasForm.valid) {
        this.registroSolicitudService
          .obtenerPlantasDatos()
          .pipe(
            takeUntil(this.destoryNotification$),
            tap((plantas) => {
              this.tramite80210Store.establecerDatos({
                plantasDisponibles: plantas?.datos,
              });
            })
          )
          .subscribe((plantas) => {
            this.plantasDisponibles = plantas?.datos;
          });
      } else {
        this.plantasDisponibles = [];
      }
    }

    if (this.tramites80210State.plantasSeleccionadas.length > 0) {
      this.plantasSeleccionadas = this.tramites80210State.plantasSeleccionadas;
    } else {
      this.plantasSeleccionadas = [];
    }
  }

  /**
   * Maneja las filas seleccionadas en la tabla de disponibles.
   *
   * @param fila - Lista de filas seleccionadas.
   */
  manejarFilaDisponibles(fila: Plantas[]): void {
    this.listaFilaSeleccionada = fila;
    this.tramite80210Store.update((state) => ({
      ...state,
      selectedDatos: fila,
    }));
  }

  /**
   * Maneja las filas seleccionadas en la tabla de seleccionadas.
   *
   * @param fila - Lista de filas seleccionadas.
   */
  manejarFilaSeleccionada(fila: Plantas[]): void {
    this.listaFilaSeleccionada = fila;
    this.tramite80210Store.update((state) => ({
      ...state,
      selectedDatos: event,
    }));
  }

  /**
   * Agrega plantas seleccionadas a la lista de seleccionadas, evitando duplicados.
   */
  agregarPlantas(): void {
    if (!this.listaFilaSeleccionada?.length) {
      this.espectaculoAlertaAgregar = true;
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
      return;
    }

    if (this.listaFilaSeleccionada.length > 1) {
      // Move all plantasSeleccionadas to plantasDisponibles and empty plantasSeleccionadas
      this.plantasDisponibles = [
        ...this.plantasDisponibles,
        ...this.plantasSeleccionadas,
      ];
      this.plantasSeleccionadas = [];
      this.updateStoreForPlantas();
      this.listaFilaSeleccionada = [];
      return;
    }

    // Default behavior: add selected to plantasSeleccionadas, remove from disponibles
    const SELECTED_IDS = this.listaFilaSeleccionada.map((p) => p.id);
    const NUEVAS_SELECCIONADAS = [
      ...this.plantasSeleccionadas,
      ...this.listaFilaSeleccionada.filter(
        (planta) => !this.plantasSeleccionadas.some((p) => p.id === planta.id)
      ),
    ];
    const NUEVAS_DISPONIBLES = this.plantasDisponibles.filter(
      (planta) => !SELECTED_IDS.includes(planta.id)
    );

    this.plantasSeleccionadas = NUEVAS_SELECCIONADAS;
    this.plantasDisponibles = NUEVAS_DISPONIBLES;
    this.updateStoreForPlantas();
    this.listaFilaSeleccionada = [];
  }

  /**
   * Actualiza el estado global con las plantas disponibles y seleccionadas.
   */
  public updateStoreForPlantas(): void {
    this.tramite80210Store.establecerDatos({
      plantasDisponibles: [...this.plantasDisponibles],
      plantasSeleccionadas: [...this.plantasSeleccionadas],
    });

    this.plantasDisponibles = [...this.plantasDisponibles];
    this.plantasSeleccionadas = [...this.plantasSeleccionadas];
  }

  /**
   * @method eliminarPlantas
   * @description
   * Muestra una alerta si no hay plantas seleccionadas para eliminar.
   * Si hay plantas seleccionadas, muestra una confirmación antes de eliminarlas.
   */
  eliminarPlantas(): void {
    if (this.listaFilaSeleccionada.length === 0) {
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
    } else {
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
      // Guardar las seleccionadas para eliminar
      this.listSelectedView = [...this.listaFilaSeleccionada];
    }
  }

  /**
   * Procesa los datos enviados desde el componente hijo.
   * Actualiza el estado global con el valor seleccionado.
   */
  procesarDatosDelHijo(): void {
    const VALUE = this.empresasForm.get('estado')?.value;
    this.tramite80210Store.establecerDatos({ estado: VALUE });
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
      // Filtra las plantas seleccionadas para eliminar
      const PLANTAS_A_ELIMINAR = this.listSelectedView.map(
        (planta) => planta.id
      );
      // Elimina las plantas seleccionadas de la lista de plantasSeleccionadas
      const PLANTAS_SELECCIONADAS_ACTUALIZADAS =
        this.plantasSeleccionadas.filter(
          (planta) => !PLANTAS_A_ELIMINAR.includes(planta.id)
        );
      // Actualiza el store y la lista local
      this.tramite80210Store.establecerDatos({
        plantasSeleccionadas: PLANTAS_SELECCIONADAS_ACTUALIZADAS,
      });
      this.plantasSeleccionadas = PLANTAS_SELECCIONADAS_ACTUALIZADAS;
      this.listSelectedView = [];
    } else {
      this.eliminarPlantasConfirmacion = false;
    }
  }

  mostrarDomicilios(): void {
    if (this.empresasForm.get('Estado')?.value.length === 0) {
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
      return;
    }
    if (this.empresasForm.get('rfc')?.value.length === 0) {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe introducir el RFC.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.espectaculoAlerta = false;
    this.recuperarDatos();
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
    this.registroSolicitudService
      .obtenerPlantasDatos()
      .subscribe((response) => {
        if (response && Array.isArray(response)) {
          this.plantasDisponibles = response as Plantas[];
          this.tramite80210Store.establecerDatos({
            plantasDisponibles: this.plantasDisponibles,
          });
        }
      });
  }

  /**
   * @method agregarPlantasconfirmar
   * @description
   * Oculta la alerta relacionada con la acción de agregar plantas seleccionadas a la lista PROSEC.
   * Se utiliza para cerrar el mensaje de advertencia cuando el usuario confirma la acción.
   */
  agregarPlantasconfirmar(): void {
    this.espectaculoAlertaAgregar = false;
  }

  obtenerPlantaDisponibles(): void {
    const PAYLOAD = {
      rfcEmpresaSubManufacturera: this.empresasForm.get('rfc')?.value,
      entidadFederativa: this.empresasForm.get('estado')?.value,
      idPrograma: null,
    };

    this.serviciosService
      .postPlantasDisponiblesTabla(this.tramiteID, PAYLOAD)
      .pipe(
      map((data: BaseResponse<PlantasDisponiblesResponse[]>) => {
        const RESPONSE = (data.datos ?? []).map((item: PlantasDisponiblesResponse) => {
        const DOMICILIO = item.domicilioDto || {};
        return {
          id: String(item.recintoSolicitudPK?.idRecinto ?? ''),
          calle: DOMICILIO.calle ?? '',
          numExterior: DOMICILIO.numExterior ?? '', 
          numInterior: DOMICILIO.numInterior ?? '', 
          codigoPostal: DOMICILIO.codigoPostal ?? '',
          colonia: DOMICILIO.colonia ?? '',
          municipio: DOMICILIO.municipio ?? '',
          entidadFederativa: DOMICILIO.entidadFederativa?.nombre ?? '',
          pais: DOMICILIO.pais?.nombre ?? '',
          registroFederal: item.empresaDto?.rfc ?? '',
          domicilio: DOMICILIO.descUbicacion ?? '',
          razon: item.empresaDto?.razonSocial ?? '',
        } as Plantas;
        });
        this.tramite80210Store.setPlantasBuscadas(RESPONSE);
        return RESPONSE;
      })
      )
      .subscribe({
        next: (plantas: Plantas[]) => {
          this.plantasDisponibles = plantas;
          this.tramite80210Store.establecerDatos({
            plantasDisponibles: plantas,
          });
        },
        error: (err) => {
          console.error('Error al obtener plantas disponibles:', err);
        }
      });
  }

  /**
   * @description
   * Actualiza el valor en el store basado en el formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite80210Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Método de limpieza al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destoryNotification$.next();
    this.destoryNotification$.complete();
  }
}
