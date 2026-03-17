import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { Catalogo, CatalogoSelectComponent, CatalogosSelect } from '@libs/shared/data-access-user/src';
import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { Solicitud30505State, Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { AvisoAgente } from '../../../../core/models/30505/aviso-modificacion.model';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import productivo from '@libs/shared/theme/assets/json/30505/productivo.json';

import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';

/**
 * Componente para agregar un agente en el trámite 30505.
 *
 * Este componente permite gestionar el formulario y la lógica necesaria para agregar un agente,
 * mostrando u ocultando secciones según el tipo de figura seleccionada y manipulando el estado
 * mediante un store y query específicos del trámite.
 *
 * @remarks
 * Utiliza formularios reactivos para la captura y validación de datos, así como suscripciones
 * gestionadas para evitar fugas de memoria.
 */
@Component({
  selector: 'app-agregar-agente',
  templateUrl: './agregar-agente.component.html',
   styleUrl: './agregar-agente.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CatalogoSelectComponent]
})
export class AgregarAgenteComponent implements OnInit,OnDestroy {

  /**
   * Grupo de controles de formulario que contiene los datos relacionados con el trámite.
   * Utilizado para gestionar y validar la información ingresada por el usuario en el formulario.
   */
 datosTramite!: FormGroup;

  /**
   * Indica si el agente debe mostrarse en la interfaz de usuario.
   * 
   * Cuando es `true`, el agente es visible; cuando es `false`, el agente está oculto.
   */
  mostrarAgente: boolean = false;

  /**
   * Indica si se debe mostrar la sección de agencia en la interfaz de usuario.
   * 
   * Cuando es `true`, la agencia se muestra; cuando es `false`, permanece oculta.
   */
 mostrarAgencia: boolean = false;

  /**
   * Arreglo que contiene el catálogo de sectores productivos AGACE.
   * 
   * @type {Catalogo[]}
   * @remarks
   * Este arreglo se inicializa con los valores provenientes de la constante `productivo`.
   * Se utiliza para mostrar y seleccionar sectores productivos en el componente.
   */
  sectorProductivoAgace: Catalogo[] = productivo;

  /**
   * Estado actual de la solicitud para agregar un agente en el trámite 30505.
   * 
   * Esta propiedad almacena la información relevante sobre el estado de la solicitud
   * mientras se realiza el proceso de agregar un agente. Utiliza la interfaz
   * `Solicitud30505AgregarAgenteState` para definir la estructura de los datos.
   */
  private solicitudState!: Solicitud30505State;

  /**
   * Notificador utilizado para destruir suscripciones y evitar fugas de memoria.
   * Se debe emitir un valor y completar este Subject cuando el componente se destruya.
   * 
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Arreglo que almacena los datos de los agentes.
   * Cada elemento del arreglo es de tipo `AvisoAgente`.
   * 
   * @type {AvisoAgente[]}
   */
  agenteDatos: AvisoAgente[] = [];

/**
 * Objeto que representa los datos del catálogo para el tipo de movimiento.
 * 
 * Contiene las propiedades necesarias para configurar un componente de selección
 * de catálogo, incluyendo el nombre de la etiqueta, si es requerido, la primera
 * opción a mostrar y el arreglo de catálogos disponibles.
 */
public tipoMovimientoData: CatalogosSelect = {
  labelNombre: '*Tipo Movimiento',
  required: true,
  primerOpcion: 'Seleccione una estatus',
  catalogos: [],
};
  /**
   * Constructor de la clase AgregarAgenteComponent.
   * 
   * @param fb Instancia de FormBuilder para la creación y manejo de formularios reactivos.
   * @param tramite30505Store Store para gestionar el estado relacionado con la adición de agentes en el trámite 30505.
   * @param tramite30505Query Query para consultar el estado y datos relacionados con la adición de agentes en el trámite 30505.
   * @param ubicaccion Servicio Location para manejar la navegación y ubicación en la aplicación.
   */
  constructor(
    private fb: FormBuilder,
    private tramite30505Store: Solicitud30505Store,
    private tramite30505Query: Solicitud30505Query,
    private tercerosService: TercerosRelacionadosService,
    private ubicaccion : Location,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `selectSolicitud$` del query `tramite30505Query` para obtener el estado de la solicitud,
   *   actualizando la propiedad `solicitudState` cada vez que el estado cambia.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Llama al método `crearFormulario` para inicializar el formulario del componente.
   */
  ngOnInit(): void {
    this.tramite30505Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearFormulario();
    this.getTipoMovimientoData();
  }

  /**
   * Crea y configura el formulario reactivo para el trámite de agregar agente.
   * 
   * Este método inicializa el formulario `datosTramite` con los controles y validaciones necesarias,
   * utilizando el FormBuilder de Angular. Los campos incluyen información como tipo de figura, patente,
   * RFC, obligaciones fiscales, autorización de patente, nombre, apellidos, razón social y agencia.
   * Algunos campos se inicializan deshabilitados y otros toman valores iniciales del estado de la solicitud.
   * 
   * Validaciones aplicadas:
   * - Requerido en la mayoría de los campos.
   * - Longitud máxima en campos como número de patente, RFC y patente2.
   * - Validación de verdadero para campos booleanos obligatorios.
   */
  public crearFormulario():void{
    this.datosTramite = this.fb.group({
      tipoFigura: [this.solicitudState?.tipoFigura, Validators.required],
      numPatenteModal: [{ value: this.solicitudState?.numPatenteModal, disabled: true }, [Validators.required, Validators.maxLength(4)]],
      nombre: [{ value: this.solicitudState?.nombre, disabled: true }, Validators.required],
      apellidoPaterno: [{ value: this.solicitudState?.apellidoPaterno, disabled: true }, Validators.required],
      apellidoMaterno: [{ value: this.solicitudState?.apellidoMaterno, disabled: true }, Validators.required],
      razonSocial: [{ value: this.solicitudState?.razonSocial, disabled: true }, Validators.required],
      tipoMovimiento:[this.solicitudState?.tipoMovimiento, Validators.required]
    });
  }

  /**
   * Maneja el evento de selección de figura en el formulario.
   * 
   * Dependiendo del valor seleccionado, muestra u oculta los campos de agencia o agente.
   * Si el valor seleccionado es '1' o '2', se muestra el campo de agente y se oculta el de agencia.
   * En cualquier otro caso, se muestra el campo de agencia y se oculta el de agente.
   * 
   * @param event Evento del cambio de selección, que contiene el valor seleccionado.
   */
  public onSelectFigura(event: Event): void {
    const SELECTED_VALUE = (event.target as HTMLSelectElement).value;
    if (SELECTED_VALUE === '1' || SELECTED_VALUE === '2') {
      this.mostrarAgencia = false;
      this.mostrarAgente = true;
    } else {
      this.mostrarAgencia = true;
      this.mostrarAgente = false;
    }
  }
 /**
   * Limpia los datos relacionados con las sociedades SCC en el formulario.
   * 
   * Esta función reinicia el formulario `datosTramite` y oculta las secciones de agencia y agente.
   * 
   * @returns {void} No retorna ningún valor.
   */

  public limpiarSociedadesScc(): void {
    this.datosTramite.reset();
    this.mostrarAgencia = false;
    this.mostrarAgente = false;
  }

  /**
 * Obtiene los datos del catálogo para el tipo de movimiento desde el servicio `tercerosService`.
 * 
 * Este método realiza una solicitud al servicio `getTipoMovimientoData` y se suscribe al resultado,
 * asignando los datos obtenidos al arreglo `catalogos` dentro del objeto `tipoMovimientoData`.
 * 
 * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye,
 * evitando fugas de memoria.
 * 
 * @returns {void} No retorna ningún valor.
 */
  getTipoMovimientoData(): void {
    this.tercerosService
      .getTipoMovimientoData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.tipoMovimientoData.catalogos = data as unknown as Catalogo[];
      });
  }
  /**
   * Cierra el diálogo relacionado con las sociedades SCC.
   * 
   * Este método restablece el formulario de datos del trámite y navega de regreso a la ubicación anterior.
   * 
   * @returns {void} No retorna ningún valor.
   */
  public cerrarDialogoSociedadesScc(): void {
   this.datosTramite.reset();
    this.ubicaccion.back();
  }

  /**
   * Establece un valor en el store utilizando el valor de un campo de un formulario.
   *
   * @param form El formulario reactivo que contiene el campo.
   * @param campo El nombre del campo dentro del formulario cuyo valor se va a obtener.
   * @param metodoNombre El nombre del método del store que se debe invocar para establecer el valor.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud30505Store,
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite30505Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Acepta y agrega un nuevo agente a la lista de agentes asociados al trámite.
   *
   * Obtiene los valores actuales del formulario `datosTramite`, construye un objeto
   * con la información del agente y lo agrega al arreglo `AgenteDatos`. Posteriormente,
   * actualiza el estado del store con la nueva lista de agentes, reinicia el formulario
   * y navega a la vista anterior.
   *
   * @remarks
   * Este método se utiliza en el contexto de la gestión de sociedades SCC dentro del trámite 30505.
   */
  aceptarSociedadesScc():void{
    const VALOR_FORMULARIO = this.datosTramite.getRawValue();

     const NUEVO_AGENTE = {
      tipoFigura: VALOR_FORMULARIO.tipoFigura,
      numPatenteModal: VALOR_FORMULARIO.numPatenteModal,
      nombre: VALOR_FORMULARIO.nombre,
      apellidoPaterno: VALOR_FORMULARIO.apellidoPaterno,
      apellidoMaterno:VALOR_FORMULARIO.apellidoMaterno,
      razonSocial: VALOR_FORMULARIO.razonSocial,
      tipoMovimiento: VALOR_FORMULARIO.tipoMovimiento
    };

    this.agenteDatos.push(NUEVO_AGENTE);
    this.tramite30505Store.updateAgenteDatos(this.agenteDatos);
    this.datosTramite.reset();
    this.ubicaccion.back();
  }
}