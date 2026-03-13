import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ConfiguracionColumna,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_ALFANUMERICO_ACENTOS,
  TablaDinamicaComponent,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite130401State,
  Tramite130401Store,
} from '../../../../estados/tramites/tramite130401.store';
import { CommonModule } from '@angular/common';
import { MERCANCIA_TABLA_ENCABEZADOS } from '../../constants/modificacion-descripcion.enum';
import { MercanciaTablaDatos } from '../../models/modificacion-descripcion.model';
import { Modal } from 'bootstrap';
import { ModificacionDescripcionService } from '../../services/modificacion-descripcion.service';
import { ModificacionMercanciaModeloComponent } from '../modificacion-mercancia-modelo/modificacion-mercancia-modelo.component';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Tramite130401Query } from '../../../../estados/queries/tramite130401.query';

/**
 * Componente para gestionar la modificación de mercancías en el trámite 130401.
 *
 * Este componente permite al usuario visualizar, modificar y seleccionar mercancías
 * relacionadas con el trámite. También incluye funcionalidades para inicializar el formulario,
 * cargar datos desde el servicio y validar los campos del formulario.
 */
@Component({
  selector: 'app-modificacion-mercancia',
  templateUrl: './modificacion-mercancia.component.html',
  styleUrl: './modificacion-mercancia.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    ModificacionMercanciaModeloComponent,
    NotificacionesComponent,
  ],
})
export class ModificacionMercanciaComponent implements OnInit, OnDestroy {
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   *
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   *
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite130401State;

  /**
   * Formulario reactivo para capturar los datos de la mercancía.
   *
   * Este formulario incluye campos como el número de folio, cantidad libre, descripción, entre otros.
   */
  mercanciaFormulario!: FormGroup;

  /**
   * Configuración de las columnas de la tabla de mercancías.
   *
   * Define los encabezados y claves para mostrar los datos de las mercancías.
   */
  public mercanciaTablaEncabezados: ConfiguracionColumna<MercanciaTablaDatos>[] =
    MERCANCIA_TABLA_ENCABEZADOS;

  /**
   * Datos de la tabla de mercancías.
   *
   * Contiene las mercancías obtenidas desde el servicio.
   */
  mercanciaTablaDatos: MercanciaTablaDatos[] = [];

  /**
   * Filas seleccionadas en la tabla de mercancías.
   *
   * Contiene las mercancías seleccionadas por el usuario.
   */
  mercanciaSeleccionadasFila: MercanciaTablaDatos[] = [];
  /**
   * Propiedad que define la configuración de selección de filas en la tabla de mercancías.
   *
   * Esta propiedad utiliza la constante `TablaSeleccion` para habilitar la funcionalidad
   * de selección de filas en la tabla dinámica de mercancías.
   */
  tablaSeleccion = TablaSeleccion;
  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Arreglo que contiene los identificadores (IDs) de las filas seleccionadas
   * en la tabla de mercancías.
   *
   * Se utiliza para controlar qué elementos han sido elegidos por el usuario
   * y aplicarlos en operaciones como modificación o eliminación.
   *
   * @type {number[]}
   */
  filasSeleccionadas!: number[];

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * Referencia al elemento del DOM asociado al modal de modificación de mercancía.
   *
   * Se utiliza para inicializar y mostrar el modal mediante la API de Bootstrap u otra librería.
   *
   * @type {ElementRef}
   */
  @ViewChild('modificacionMercancia', { static: false })
  modificacionMercanciaElement!: ElementRef;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Array con los datos de los pedimentos.
   * Se utiliza para almacenar los pedimentos ingresados por el usuario.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Elemento a eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * Constructor del componente.
   *
   * @param {Tramite130401Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite130401Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   * @param {ModificacionDescripcionService} modificacionDescripcionService - Servicio para obtener datos relacionados con la mercancía.
   */
  constructor(
    public store: Tramite130401Store,
    public tramiteQuery: Tramite130401Query,
    public fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private modificacionDescripcionService: ModificacionDescripcionService,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Constructor del componente
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Este método suscribe al estado del trámite, inicializa el formulario y
   * carga los datos de la mercancía y la tabla de mercancías.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.actualizarFormularioConDatos();
          this.cargarDatosModificacionDescripcion();
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
   * Inicializa el formulario reactivo para capturar los datos de la mercancía.
   */
  inicializarFormulario(): void {
    const MODIFICATION_DATA = this.tramiteState?.datosSolicitud?.modificationDescripcion;

    this.mercanciaFormulario = this.fb.group({
      numeroFolioResolucion: [
        {
          value: this.tramiteState?.datosSolicitud?.numeroFolioResolucion || '',
          disabled: true,
        },
        [],
      ],
      cantidadLibreMercancia: [
        {
          value: MODIFICATION_DATA?.cantidadLibreMercancia || '',
          disabled: true,
        },
        [],
      ],
      descripcion: [
        { value: MODIFICATION_DATA?.descripcion || '', disabled: true },
        [],
      ],
      descripcionNuevaMercanciaPexim: [
        MODIFICATION_DATA?.descripcionNuevaMercanciaPexim || '',
        [
          Validators.required,
          Validators.pattern(REGEX_ALFANUMERICO_ACENTOS)
        ]
      ],
    });
    this.inicializarEstadoFormulario();
  }
  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   *
   * Este método deshabilita el formulario `mercanciaFormulario` si la propiedad `soloLectura` es `true`.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.mercanciaFormulario.get('descripcionNuevaMercanciaPexim')?.disable();
    } else {
      this.mercanciaFormulario.get('descripcionNuevaMercanciaPexim')?.enable();
    }
  }

  /**
   * Actualiza el formulario con los datos de modificación descripción.
   */
  actualizarFormularioConDatos(): void {
    if (!this.mercanciaFormulario || !this.tramiteState?.datosSolicitud) {
      return;
    }

    const DATOS = this.tramiteState.datosSolicitud.modificationDescripcion;

    // Habilitar campos temporalmente
    this.mercanciaFormulario.get('numeroFolioResolucion')?.enable();
    this.mercanciaFormulario.get('cantidadLibreMercancia')?.enable();
    this.mercanciaFormulario.get('descripcion')?.enable();

    // Actualizar valores
    this.mercanciaFormulario.patchValue({
      numeroFolioResolucion: this.tramiteState.datosSolicitud.numeroFolioResolucion || '',
      cantidadLibreMercancia: DATOS?.cantidadLibreMercancia || '',
      descripcion: DATOS?.descripcion || '',
      descripcionNuevaMercanciaPexim: DATOS?.descripcionNuevaMercanciaPexim || ''
    });

    // Deshabilitar campos
    this.mercanciaFormulario.get('numeroFolioResolucion')?.disable();
    this.mercanciaFormulario.get('cantidadLibreMercancia')?.disable();
    this.mercanciaFormulario.get('descripcion')?.disable();
  }

  /**
   * Carga los datos de la tabla de modificación descripción.
   */
  cargarDatosModificacionDescripcion(): void {
    if (this.tramiteState?.datosSolicitud?.partidasModificationDescripcion) {
      this.mercanciaTablaDatos = this.tramiteState.datosSolicitud.partidasModificationDescripcion;
    }
  }


  /**
   * Carga los datos de la tabla de mercancías desde el servicio
   * y abre el modal de modificación si hay elementos seleccionados.
   *
   * - Si existen mercancías seleccionadas, se inicializa y muestra el modal.
   * - Si no hay selección, se agrega un objeto de pedimento por defecto
   *   y se notifica al usuario mediante un modal de advertencia.
   */
  cargarMercanciaTabla(): void {
    if (this.mercanciaSeleccionadasFila.length > 0) {
      if (this.modificacionMercanciaElement) {
        this.filasSeleccionadas = this.mercanciaSeleccionadasFila.map(
          (mercancia) => mercancia.idPartidaSol
        );
        const MODAL_INSTANCE = new Modal(
          this.modificacionMercanciaElement.nativeElement
        );
        MODAL_INSTANCE.show();
      }
    } else {
      const PEDIMENTO = {
        patente: 0,
        pedimento: 0,
        aduana: 0,
        idTipoPedimento: 0,
        descTipoPedimento: 'Por evaluar',
        numero: '',
        comprobanteValor: '',
        pedimentoValidado: false,
      };
      this.abrirModal('Debe seleccionar un elemento');
      this.pedimentos.push(PEDIMENTO);
    }
  }

  /**
   * Actualiza la descripción de una mercancía seleccionada y sincroniza los cambios en el store.
   *
   * - Busca la mercancía que coincide con el ID recibido en el evento.
   * - Actualiza su descripción solicitada.
   * - Limpia las filas seleccionadas y reinicia la selección de mercancías.
   * - Finalmente, guarda los cambios en el store.
   *
   * @param event - Lista de mercancías seleccionadas con sus descripciones modificadas.
   */
  emitMercanciaSeleccionadas(event: MercanciaTablaDatos[]): void {
    if (this.mercanciaTablaDatos.length > 0) {
      this.mercanciaTablaDatos.forEach((mercancia) => {
        if (mercancia.idPartidaSol === event[0].idPartidaSol) {
          mercancia.descripcionSolicitada = event[0].descripcionSolicitada;
        }
      });
      this.filasSeleccionadas = [];
      this.mercanciaSeleccionadasFila = [];
      this.store.setMercanciaTablaDatos(this.mercanciaTablaDatos);
    }
  }

  /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   *
   * @param {number} i - El índice del elemento a eliminar.
   *
   * @remarks
   * Después de eliminar el elemento, se actualiza el título y mensaje del modal,
   * y se abre el modal para mostrar un aviso al usuario.
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }


  /**
   * Verifica si un campo del formulario es válido.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    if (!form || !form.get(field)) {
      // Devuelve verdadero si el formulario o campo no existe para evitar errores de validación
      return true; 
    }
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Maneja la selección de filas en la tabla de mercancías.
   *
   * @param {MercanciaTablaDatos[]} evento - Las filas seleccionadas.
   */
  seleccionDeFilas(evento: MercanciaTablaDatos[]): void {
    this.mercanciaSeleccionadasFila = evento;
  }

  /**
   * Establece valores en el store desde el formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El nombre del campo en el formulario.
   * @param {keyof Tramite130401Store} metodoNombre - El método del store que se debe invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite130401Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Elimina un elemento de la tabla de pedimento, si se confirma la acción.
   * @param borrar Indica si se debe proceder con la eliminación.
   * @returns {void}
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
 * Valida todos los formularios y la selección de filas.
 * @returns {boolean} Indica si todos los formularios y la selección son válidos.
 */
  validarFormulario(): boolean {
    let isValid = true;
    if (this.mercanciaFormulario.invalid) {
      this.mercanciaFormulario.markAllAsTouched();
      isValid = false;
    }
    return isValid;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Este método completa el `Subject` `destroyNotifier$` para cancelar todas las suscripciones activas
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
