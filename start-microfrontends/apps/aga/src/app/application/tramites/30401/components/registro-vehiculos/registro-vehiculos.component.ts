import {
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NOTA, OPCIONES_DE_BOTON_DE_RADIO, REGISTRO_VEHICULOS } from '../../enums/registro-empresas-transporte.enum';
import { Subject, forkJoin, map, takeUntil} from 'rxjs';
import { Tramite30401Store, Tramites30401State } from '../../estados/tramites30401.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { RegistroEmpresasTransporteService } from '../../services/registro-empresas-transporte.service';
import { RegistroVehiculos } from '../../modelos/registro-empresas-transporte.model';
import { Tramite30401Query } from '../../estados/tramites30401.query';
/**
 * REGEX_SOLO_NUMEROS
 * Expresión regular para validar que una cadena contenga únicamente dígitos (0-9).
 * 
 * Ejemplo de uso:
 *   REGEX_SOLO_NUMEROS.test('1234'); // true
 *   REGEX_SOLO_NUMEROS.test('12a4'); // false
 * 
 * - ^ y $ aseguran que toda la cadena sea evaluada.
 * - [0-9]+ requiere al menos un dígito.
 */
const REGEX_SOLO_NUMEROS = /^[0-9]+$/;

/**
 * Componente RegistroVehiculosComponent para la gestión de vehículos dentro del sistema.
 * 
 * Este componente independiente (`standalone`) se encarga de la interacción con la tabla dinámica,
 * el manejo de formularios reactivos, y la visualización de notificaciones. Proporciona una interfaz
 * intuitiva para la gestión de vehículos registrados.
 * 
 * @component
 * @selector app-registro-vehiculos
 * @standalone true
 * @imports CommonModule, TablaDinamicaComponent, TituloComponent, ReactiveFormsModule, NotificacionesComponent, CatalogoSelectComponent
 * @templateUrl ./Vehiculos.component.html
 * @styleUrl ./registro-vehiculos.css
 */
@Component({
  selector: 'app-registro-vehiculos',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    TituloComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
    CatalogoSelectComponent,
  ],
  templateUrl: './registro-vehiculos.component.html',
  styleUrl: './registro-vehiculos.component.css',
})
export class RegistroVehiculosComponent implements OnInit {
    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  
  /**
   * Define si el diálogo exitoso está habilitado.
   *
   * @property esHabilitarElDialogo
   * @type {boolean}
   * @default false
   */
  esHabilitarElDialogo: boolean = false;

   /**
   * Formulario reactivo para el registro de vehículos.
   */
  registroVehiculosForm!: FormGroup;

  /**
   * Formulario para gestionar los archivos adjuntos.
   *
   * Permite capturar y validar los datos relacionados con los archivos adjuntos.
   */
  formularioArchivo!: FormGroup;

  /**
   * Referencia al elemento del modal para gestionar archivos.
   *
   * Se utiliza para abrir o cerrar el modal de archivos.
   */
  @ViewChild('modalArchivo') modalArchivo!: ElementRef;

  /**
   * Tipo de selección de tabla (CHECKBOX).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Lista de vehículos registrados.
   */
  registroVehiculosInfoList: RegistroVehiculos[] = [] as RegistroVehiculos[];

  /**
   * Nombre de la pestaña activa.
   */
  activeTab: string = 'parquevehicular';

  /**
   * Referencia al elemento modal para el registro de vehículos.
   */
  @ViewChild('registroDeVehiculos') registroDeVehiculosElemento!: ElementRef;

  /**
   * Referencia al elemento modal de confirmación.
   */
  @ViewChild('modalDeConfirmacion') confirmacionElemento!: ElementRef;

  /**
   * Constante para la nota de confirmación del vehículo.
   */
  CONFIRMACION_VEHICULO = NOTA.CONFIRMACION_VEHICULO;

  /**
   * Configuración para las columnas de la tabla de vehículos.
   */
  ParqueVehicular = REGISTRO_VEHICULOS;

  /**
   * Subject utilizado para rastrear la destrucción del componente.
   * Ayuda a cancelar la suscripción de observables para evitar fugas de memoria.
   */
  destroyed$: Subject<void> = new Subject();

  /**
   * Indica si el popup está abierto.
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el popup está abierto.
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Notificación que se muestra al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Fila seleccionada en la tabla de mercancías.
   */
  filaSeleccionadaVehiculos!: RegistroVehiculos;

  /**
   * Lista de filas seleccionadas en la tabla de mercancías.
   */
  listaFilaSeleccionadaVehiculos: RegistroVehiculos[] =
    [] as RegistroVehiculos[];

  /**
   * Indica si el botón de eliminar está habilitado.
   */
  enableEliminarBoton: boolean = false;

  /**
   * Indica si un archivo está seleccionado.
   */
  enableModficarBoton: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * Indica si se debe mostrar el modal de datos de mercancía.
   */
  mostrarModalDatosVehiculos: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * @property {Tramites30401State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Tramites30401State;

  /**
 * Representa los estados disponibles en el sistema.
 */
  estados: Catalogo[] = [];

/**
 * Representa los municipios asociados a un estado.
 */
  municipios: Catalogo[] = [];

/**
 * Representa las colonias asociadas a un municipio.
 */
  colonias: Catalogo[] = [];

/**
 * Representa las aduanas disponibles.
 */
  aduanas: Catalogo[] = [];

  /**
   * Indicates whether the entity is consolidated in ET.
   *
   * @type {boolean}
   * @default false
   */
  esConsolidatedET: boolean = false;

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Constructor para inyectar los servicios y las tiendas necesarias.
   * @param fb - FormBuilder para formularios reactivos.
   * @param tramite30401Store - Tienda para gestionar el estado del formulario.
   * @param tramite30401Query - servicio de consulta para acceder a los datos del store.
   * @param servicio - servicio para obtener la lista de bancos.
   */
  constructor(
    public fb: FormBuilder,
    private tramite30401Store: Tramite30401Store,
    private tramite30401Query: Tramite30401Query,
    private servicio: RegistroEmpresasTransporteService,
    private consultaioQuery: ConsultaioQuery
  ) {
     this.consultaioQuery.selectConsultaioState$
                .pipe(
                  takeUntil(this.destroyed$),
                  map((seccionState) => {
                   this.esFormularioSoloLectura = seccionState.readonly;
        
                  })
                )
                .subscribe();
    this.crearFormulario();
    this.inicializarFormularioArchivo();
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se inicializa.
   * - Se suscribe a `selectTramite30401$` para obtener datos del estado.
   * - Actualiza `seccionState` con la información más reciente del estado.
   * - Asigna `RegistroVehiculosDatos` a `registroVehiculosInfoList`.
   *
   * La suscripción está gestionada con `takeUntil(this.destroyed$)`
   * para garantizar la limpieza cuando el componente se destruye.
   */
  ngOnInit(): void {
    this.obtenerDatosCatalogo();
    this.tramite30401Query.selectTramite30401$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Tramites30401State) => {
        this.seccionState = datos;
      });

    this.registroVehiculosInfoList = this.seccionState.registroTablaDatos;
  }

  /**
   * Crea el formulario reactivo para el registro de vehículos.
   */
  crearFormulario(): void {
    this.registroVehiculosForm = this.fb.group({
      id: [null],
      solicitud: this.fb.group({
        marca: ['', [Validators.required, Validators.maxLength(6),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)]],
        modelo: ['', [Validators.required, Validators.maxLength(80),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)]],
        idVehiculoSerie: ['', [Validators.required, Validators.maxLength(17),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)]],
        caja: ['', [Validators.required, Validators.maxLength(30)]],
      }),
      direccionVehiculo: this.fb.group({
        calleVehiculo: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)]],
        numExteriorVehiculo: [
          '',
          [Validators.required, Validators.maxLength(55),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)],
        ],
        numInteriorVehiculo: ['', [Validators.maxLength(55),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)]],
        comboEntidadVehiculo: ['', Validators.required],
        comboDelegacionVehiculo: ['', Validators.required],
        comboColoniaVehiculo: ['', Validators.required],
        localidadVehiculo: [
          '',
          [Validators.required, Validators.maxLength(250),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{2,100}$/)],
        ],
        codigoPostalVehiculo: [
          '',
          [Validators.required, Validators.maxLength(6), Validators.pattern(REGEX_SOLO_NUMEROS)],
        ],
        comboAduanaVehiculo: [''],
      }),
      persona: this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(200)]],
        apellidoPaterno: ['', [Validators.required, Validators.maxLength(200)]],
        apellidoMaterno: ['', [Validators.required, Validators.maxLength(200)]],
        correoElectronico: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(50)],
        ],
        telefonoContacto: ['', [Validators.required, Validators.maxLength(30)]],
      }),
    });
  }

  /**
   * Inicializa el formulario para gestionar archivos.
   *
   * Este método configura los campos y validaciones del formulario relacionado con los archivos adjuntos.
   */
  inicializarFormularioArchivo(): void {
    this.formularioArchivo = this.fb.group({
      archivo: ['', [Validators.required]],
    });
  }

  /**
   * Muestra el modal para cargar un archivo.
   *
   * Este método utiliza el modal de Bootstrap para mostrar el modal de carga de archivos.
   */
  cargaArchivo(): void {
    if (this.modalArchivo) {
      const MODAL_INSTANCE = new Modal(this.modalArchivo.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Abre el cuadro de diálogo modal para el registro de vehículos.
   */
  agregarDialogoDatos(): void {
    if (this.registroDeVehiculosElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.registroDeVehiculosElemento?.nativeElement
      );
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  enviarDialogData(): void {
    if (this.registroVehiculosForm.valid) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: this.CONFIRMACION_VEHICULO,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };

      this.esHabilitarElDialogo = true;
      this.vehiculosInfoDatos();
      this.limpiarFormulario();
      this.cambiarEstadoModal();
    } else {
      this.registroVehiculosForm.markAllAsTouched();
    }
  }

  /**
   * Cancela el cuadro de diálogo modal para el registro de vehículos.
   * Este método oculta el modal y restablece el formulario.
   */
  modalCancelar(): void {
    this.cambiarEstadoModal();
    this.limpiarFormulario();
  }

  /**
   * Restablece el formulario de registro de vehículos a su estado inicial.
   */
  limpiarFormulario(): void {
    this.registroVehiculosForm.reset();
  }

  /**
   * Alterna la visibilidad del cuadro de diálogo modal para el registro de vehículos.
   * Si el modal está visible actualmente, se ocultará.
   */
  cambiarEstadoModal(): void {
    const MODAL_INSTANCIA = Modal.getInstance(
      this.registroDeVehiculosElemento.nativeElement
    );
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }

  /**
   * Agrega los datos actuales del formulario a la lista de vehículos registrados.
   * Los datos del formulario se añaden al array `registroVehiculosInfoList`.
   */
  vehiculosInfoDatos(): void {
    const {
      solicitud: SOLICITUD,
      direccionVehiculo: DIRECCIONVEHICULO,
      persona: PERSONA,
    } = this.registroVehiculosForm.value;
    const OBTENER_DESCRIPCION = (array: Catalogo[], index: number): string =>
      array[index - 1]?.descripcion || '';
    const DIRECCIONVEHICULO_MODIFICADO = {
      ...DIRECCIONVEHICULO,
      comboEntidadVehiculo: OBTENER_DESCRIPCION(
        this.estados,
        DIRECCIONVEHICULO.comboEntidadVehiculo
      ),
      comboDelegacionVehiculo: OBTENER_DESCRIPCION(
        this.municipios,
        DIRECCIONVEHICULO.comboDelegacionVehiculo
      ),
      comboColoniaVehiculo: OBTENER_DESCRIPCION(
        this.colonias,
        DIRECCIONVEHICULO.comboColoniaVehiculo
      ),
      comboAduanaVehiculo: OBTENER_DESCRIPCION(
        this.aduanas,
        DIRECCIONVEHICULO.comboAduanaVehiculo
      ),
    };

    const NEW_VEHICULO = {
      id:
        this.filaSeleccionadaVehiculos?.id ??
        (this.registroVehiculosInfoList.length
          ? (this.registroVehiculosInfoList[
              this.registroVehiculosInfoList.length - 1
            ]?.id ?? 0) + 1
          : 1),
      solicitud: SOLICITUD,
      direccionVehiculo: DIRECCIONVEHICULO_MODIFICADO,
      persona: PERSONA,
    };

    if (
      !this.filaSeleccionadaVehiculos ||
      Object.keys(this.filaSeleccionadaVehiculos).length === 0
    ) {
      this.registroVehiculosInfoList = [
        ...this.registroVehiculosInfoList,
        NEW_VEHICULO,
      ];
      this.tramite30401Store.establecerDatos({registroTablaDatos:this.registroVehiculosInfoList});
    } else {
      this.registroVehiculosInfoList = this.registroVehiculosInfoList.map(
        (item) =>
          item.id === this.filaSeleccionadaVehiculos.id
            ? { ...item, ...NEW_VEHICULO }
            : item
      );

      this.tramite30401Store.establecerDatos({
        registroTablaDatos: this.registroVehiculosInfoList
      }
      );
      this.filaSeleccionadaVehiculos = {} as RegistroVehiculos;
    }
  }

  /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }

  /**
   * Maneja la fila seleccionada en la tabla de mercancías.
   * fila Fila seleccionada.
   */
  manejarFilaSeleccionada(fila: RegistroVehiculos[]): void {
    if (fila.length === 0) {
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
    this.listaFilaSeleccionadaVehiculos = fila;
    this.filaSeleccionadaVehiculos = fila[fila.length - 1];
    this.enableModficarBoton = true;
    this.enableEliminarBoton = true;
  }

  /**
   * Actualiza la fila seleccionada con los datos más recientes de la tabla.
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.registroVehiculosInfoList.find(
      (item) => item.id === this.filaSeleccionadaVehiculos.id
    );

    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaVehiculos = { ...DATOS_ACTUALIZADOS };
    }
  }

  /**
   * Filtra y elimina los elementos seleccionados de la tabla de mercancías.
   * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
   */
  eliminarVehiculosItem(evento:boolean): void {
    if(evento === true) {
      const IDS_TO_DELETE = this.listaFilaSeleccionadaVehiculos.map(
        (item) => item.id
      );

      this.registroVehiculosInfoList = this.registroVehiculosInfoList.filter(
        (item) => !IDS_TO_DELETE.includes(item.id)
      );

      this.listaFilaSeleccionadaVehiculos = [];
      this.filaSeleccionadaVehiculos = {} as RegistroVehiculos;
      this.tramite30401Store.establecerDatos(
        {registroTablaDatos: this.registroVehiculosInfoList}
      );
      this.cerrarEliminarConfirmationPopup();
    }
  }

  /**
   * Cierra el popup de confirmación de eliminación.
   */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
   * Obtiene los datos del catálogo de Entidades Federativas, Municipios, Colonias y Aduanas.
   *
   * Este método utiliza `forkJoin` de RxJS para ejecutar múltiples solicitudes API en paralelo.
   * Una vez que todas las respuestas se reciben, los datos se asignan a las variables del componente.
   *
   * @returns {void} No devuelve un valor; actualiza el estado del componente con los datos obtenidos.
   */
  obtenerDatosCatalogo(): void {
    forkJoin({
      estados: this.servicio.getEntidadesFederativas(),
      municipios: this.servicio.getMunicipiosAlcaldias(),
      colonias: this.servicio.getColonias(),
      aduanas: this.servicio.getAduanas(),
    })
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (respuesta) => {
          this.estados = respuesta.estados;
          this.municipios = respuesta.municipios;
          this.colonias = respuesta.colonias;
          this.aduanas = respuesta.aduanas;
        },
        (error) => {
          console.error('Error al obtener los datos del catálogo:', error);
        }
      );
  }

  /**
   * Modifica los datos de una fila seleccionada en la tabla de mercancías.
   * Actualiza el formulario de mercancía con los datos de la fila seleccionada
   * y abre el modal para editar los datos.
   */
  modificarItemVehiculos(): void {
    if (
      this.listaFilaSeleccionadaVehiculos &&
      this.listaFilaSeleccionadaVehiculos?.length === 1
    ) {
      this.actualizarFilaSeleccionada();
      this.agregarDialogoDatos();
      this.patchModifyiedData();
    } else {
      this.abrirMultipleSeleccionPopup();
    }
  }

  /**
   * @method patchModifyiedData
   * Rellena el formulario con los datos de la fila seleccionada para su modificación.
   * Este método utiliza `patchValue` para actualizar los valores del formulario.
   */
  patchModifyiedData(): void {
    const OBTENER_INDICE = (array: Catalogo[], value: string): number =>
      array.findIndex((item) => item.descripcion === value) + 1;
    this.registroVehiculosForm.patchValue({
      id: this.filaSeleccionadaVehiculos?.id,
      solicitud: {
        marca: this.filaSeleccionadaVehiculos?.solicitud.marca,
        modelo: this.filaSeleccionadaVehiculos?.solicitud.modelo,
        idVehiculoSerie:
          this.filaSeleccionadaVehiculos?.solicitud.idVehiculoSerie,
        caja: this.filaSeleccionadaVehiculos?.solicitud.caja,
      },
      direccionVehiculo: {
        calleVehiculo:
          this.filaSeleccionadaVehiculos?.direccionVehiculo.calleVehiculo,
        numExteriorVehiculo:
          this.filaSeleccionadaVehiculos?.direccionVehiculo.numExteriorVehiculo,
        numInteriorVehiculo:
          this.filaSeleccionadaVehiculos?.direccionVehiculo.numInteriorVehiculo,
        comboEntidadVehiculo: OBTENER_INDICE(
          this.estados,
          this.filaSeleccionadaVehiculos.direccionVehiculo.comboEntidadVehiculo
        ),
        comboDelegacionVehiculo: OBTENER_INDICE(
          this.municipios,
          this.filaSeleccionadaVehiculos.direccionVehiculo
            .comboDelegacionVehiculo
        ),
        comboColoniaVehiculo: OBTENER_INDICE(
          this.colonias,
          this.filaSeleccionadaVehiculos.direccionVehiculo.comboColoniaVehiculo
        ),
        localidadVehiculo:
          this.filaSeleccionadaVehiculos?.direccionVehiculo.localidadVehiculo,
        codigoPostalVehiculo:
          this.filaSeleccionadaVehiculos.direccionVehiculo.comboAduanaVehiculo,
        comboAduanaVehiculo: OBTENER_INDICE(
          this.aduanas,
          this.filaSeleccionadaVehiculos?.direccionVehiculo.comboAduanaVehiculo
        ),
      },
      persona: {
        nombre: this.filaSeleccionadaVehiculos?.persona.nombre,
        apellidoPaterno:
          this.filaSeleccionadaVehiculos?.persona.apellidoPaterno,
        apellidoMaterno:
          this.filaSeleccionadaVehiculos?.persona.apellidoMaterno,
        correoElectronico:
          this.filaSeleccionadaVehiculos?.persona.correoElectronico,
        telefonoContacto:
          this.filaSeleccionadaVehiculos?.persona.telefonoContacto,
      },
    });
  }

  /**
   * @method abrirMultipleSeleccionPopup
   * Muestra un popup de error si se seleccionan múltiples filas para modificar.
   * Este método se activa cuando el botón de modificar está habilitado.
   */
  abrirMultipleSeleccionPopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Selecciona sólo un registro para modificar.',
      cerrar: false,
      txtBtnAceptar: 'Cerca',
      txtBtnCancelar: '',
    };
    if (this.enableModficarBoton) {
      this.multipleSeleccionPopupAbierto = true;
    }
  }

  /**
   * Confirma la eliminación de los elementos seleccionados en la tabla de mercancías.
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   */
  confirmEliminarVehiculosItem(): void {
    if (this.listaFilaSeleccionadaVehiculos.length === 0) {
      return;
    }
    this.abrirElimninarConfirmationopup();
  }

  /**
   * @method abrirElimninarConfirmationopup
   * Abre un popup de confirmación para eliminar los registros seleccionados.
   * Si no hay registros seleccionados, no realiza ninguna acción.
   */
  abrirElimninarConfirmationopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.confirmEliminarPopupAbierto = true;
  }

  /**
   * Cierra el popup de selección múltiple.
   */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }

  /**
   * Verifica si un control de formulario es inválido, está tocado o ha sido modificado.
   * @param nombreControl - El nombre del control de formulario a verificar.
   * @returns Verdadero si el control es inválido, de lo contrario, falso.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.registroVehiculosForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }
}
