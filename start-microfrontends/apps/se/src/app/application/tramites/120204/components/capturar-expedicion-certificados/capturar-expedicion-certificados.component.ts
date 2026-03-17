import { CONFIGURACION_ACCIONISTAS_TABLA, DetalledelaLicitacion, DistribucionSaldo, LicitacionesDisponibles } from '../../../../shared/models/expedicion-certificado.model';
import { Catalogo, CatalogosSelect, CategoriaMensaje, IDSOLICITUD, LoginQuery, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TableData, TipoNotificacionEnum, TituloComponent } from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Expedicion120204State, Expedicion120204Store } from '../../estados/tramites/expedicion120204.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { ApiLicitacionesResponse } from '../../models/expedicion-certificados-asignacion.model';
import { CONFIGURACION_PARA_ENCABEZADO_DE_EXPEDIR_MONTO_TABLA } from '../../constantes/expedicion-certificado.enum';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Expedicion120204Query } from '../../estados/queries/expedicion120204.query';
import { ExpedicionCertificadoService } from '../../services/expedicion-certificado.service';
import { ExpedirMonto } from '../../models/expedicion-certificados-asignacion.model';
import { InputCheckComponent } from "@libs/shared/data-access-user/src/tramites/components/input-check/input-check.component";
import { REGEX_ALTO } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
/**
 * Componente para mostrar las licitaciones vigentes.
 *
 * Este componente maneja la visualización y la lógica de las licitaciones vigentes,
 * incluyendo la interacción con un formulario, tablas de datos y un asistente (wizard).
 */
@Component({
  selector: 'app-capturar-expedicion',
  standalone: true,
  imports: [
    CatalogoSelectComponent, 
    CommonModule, 
    InputCheckComponent, 
    ReactiveFormsModule, 
    NotificacionesComponent,
    TablaDinamicaComponent, 
    TituloComponent,
  ],
  templateUrl: './capturar-expedicion-certificados.component.html',
  styleUrls: ['./capturar-expedicion-certificados.component.scss'],
})
export class CapturarExpedicionCertificadosComponent implements OnInit, OnDestroy {

  /**
   * Configuración para la tabla de accionistas.
   */
  public configTableArray = CONFIGURACION_ACCIONISTAS_TABLA;
  /**
   * Arreglo que contiene los datos de licitaciones disponibles para mostrar en la tabla.
   * Estos datos se obtienen del servicio y representan las licitaciones vigentes.
   * @type {LicitacionesDisponibles[]}
   */
  public datos: LicitacionesDisponibles[] = [];

  /**
   * Formulario principal.
   */
  public formulario!: FormGroup;
  /**
   * Formulario para el detalle de la licitación.
   */
  public detalledelaLicitacionForm!: FormGroup;
  /**
   * Formulario para el adquiriente.
   */
  public distribucionSaldoForm!: FormGroup;
  /**
   * Catálogo de entidades federativas.
   */
  public entidadFederativaOptions: CatalogosSelect = {
      labelNombre: 'Tratado / Acuerdo:',
      required: false,
      primerOpcion: 'Selecciona un VALOR',
      catalogos: [],
    };
  /**
   * Catálogo de representaciones federales.
   */
  public representacionFederalOptions: CatalogosSelect = {
    labelNombre: 'Representación federal',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  }
  /**
   * Configuración y datos para el componente de tabla dinámica.
   * Contiene la estructura de datos necesaria para renderizar la tabla de licitaciones.
   * @type {TableData}
   */
  public tableData!: TableData;

  /**
   * Subject para la destrucción del componente.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;


  /**
   * Estado de la solicitud para el componente.
   * Este estado se utiliza para gestionar la lógica del formulario y las interacciones del usuario.
   */
  public solicitudState!: Expedicion120204State;

  /**
   * Indica si el componente es de solo lectura.
   * Cuando es `true`, los campos del componente no pueden ser editados.
   */
  @Input() public readonly: boolean = false;

  /**
   * Identificador único del trámite de expedición de certificados.
   * Este ID se utiliza para las consultas de catálogos y servicios específicos del trámite.
   * @type {string}
   */
  tramitesID: string = '120204';

  /**
   * Controla la visibilidad de la sección de detalle de la licitación.
   * Se activa cuando el usuario selecciona una licitación de la tabla.
   * @type {boolean}
   */
  mostrarSeccionDetalle: boolean = false;

  /**
   * Configuración para el encabezado de la tabla de expedición de monto.
   */
  configuracionParaEncabezadoDeTabla = CONFIGURACION_PARA_ENCABEZADO_DE_EXPEDIR_MONTO_TABLA;

  /**
   * Configuración de la tabla dinámica.
   */
  cuerpoTabla: ExpedirMonto[] = [];

  /**
   * Configuración de la tabla dinámica.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Montos seleccionados en la tabla de expedición de monto.
   * @type {ExpedirMonto[]}
   */
  public selectedMonto: ExpedirMonto[] = [];

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;
  /**
   * Indica si la tabla de montos a expedir es inválida.
   * @type {boolean}
   */
  tablaInvalidoError!: boolean;

  /**
   * Indica si el monto a expedir excede el monto disponible.
   * @type {boolean}
   */
  montoExcedeDisponibleError: boolean = false;

  /**
   * Indica si se ha intentado validar el formulario.
   * Se utiliza para mostrar errores de validación en los campos.
   * @type {boolean}
   */
  validationAttempted: boolean = false;

  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Identificador numérico del elemento que se desea eliminar.
   * 
   * Esta propiedad almacena el ID del elemento seleccionado para su eliminación
   * dentro del componente. Se debe asignar antes de realizar la operación de borrado.
   */
  public elementoParaEliminar!: number;

  /**
   * RFC del usuario autenticado obtenido del estado de login.
   * Se utiliza para las consultas de datos específicas del usuario.
   * @type {string}
   */
  loginRfc: string = '';

  /**
   * Constructor del componente CapturarExpedicionCertificados.
   *
   * @param service Servicio para la gestión de expedición de certificados.
   * @param fb Constructor de formularios reactivos.
   * @param expedicion120204Store Almacén para el manejo del estado de expedición.
   * @param expedicion120204Query Consulta el estado de expedición.
   *
   * Inicializa la suscripción al estado de la sección de IO para determinar si el formulario debe estar en modo solo lectura.
   */
  constructor(
    private service: ExpedicionCertificadoService,
    private fb: FormBuilder,
    private expedicion120204Store: Expedicion120204Store,
    private expedicion120204Query: Expedicion120204Query,
    private catalogoService: CatalogoServices,
    private toastr: ToastrService,
    private loginQuery: LoginQuery
  ) {
    this.expedicion120204Query.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((solicitud) => {
              this.solicitudState = solicitud;
            });
          this.loginQuery.selectLoginState$.pipe(takeUntil(this.destroyed$),
          map((seccionState) => {
            this.loginRfc = seccionState.rfc;
          })).subscribe();
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Este método se encarga de realizar las siguientes acciones:
   * - Obtener la lista de entidades federativas.
   * - Obtener la lista de representaciones federales.
   * - Obtener los detalles de la licitación.
   * - Obtener la distribución del saldo.
   * - Inicializar el formulario.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.esFormularioSoloLectura = this.readonly;
    this.getEntidadFederativa();
    this.obtenerDatosTabla();
    this.inicializarFormulario();
  }

  /**
   * Obtiene la lista de entidades federativas.
   */
  getEntidadFederativa(): void {
    this.catalogoService.entidadesFederativasCatalogo(this.tramitesID)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (resp) => {
        this.entidadFederativaOptions.catalogos = resp.datos as Catalogo[];
      }
    );
  }

  /** Maneja el evento de cambio cuando se selecciona una nueva entidad federativa.
   * Actualiza la lista de representaciones federales basándose en la entidad seleccionada.
   * @param event - Objeto Catalogo que representa la entidad seleccionada.
   */
  onChangeEntidad(event: Catalogo): void {
    const SELECTED_ENTIDAD = event;
    this.getRepresentacionDatos({
      clave: SELECTED_ENTIDAD.clave ?? '',
      descripcion: SELECTED_ENTIDAD.descripcion ?? ''
    });
    this.expedicion120204Store.setEntidadFederativa(SELECTED_ENTIDAD.descripcion ?? '');
  }

  /** Obtiene los datos del catálogo de representaciones federales basado en la clave de entidad proporcionada.
   * Los datos recuperados se asignan a la propiedad `optionsRepresentacion.catalogos`.
   * La suscripción al observable se cancela automáticamente cuando el componente se destruye.
   * @param cveEntidad - Clave de la entidad para filtrar las representaciones federales.
   */
  getRepresentacionDatos(cveEntidad: { clave: string; descripcion: string }): void {
    this.catalogoService
      .representacionFederalCatalogo(this.tramitesID, cveEntidad.clave)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        const DESCRIPCION_ENTIDAD: string = (cveEntidad.descripcion ?? '')
          .toString()
          .trim()
          .toLowerCase();

        const CATALOGOS = res.datos ?? [];

        const MATCHED = CATALOGOS.find(
          (item) =>
          ((item.descripcion ?? '').toString().trim().toLowerCase() ===
            DESCRIPCION_ENTIDAD)
        );

        const OTHERS = CATALOGOS.filter(
          (items) =>
          ((items.descripcion ?? '').toString().trim().toLowerCase() !==
            DESCRIPCION_ENTIDAD)
        );


        this.formulario
          .get('representacion')
          ?.setValue(MATCHED ? MATCHED.clave : null);

        this.setValoresStore(this.formulario, 'representacion', 'setRepresentacionFederal');

        this.representacionFederalOptions.catalogos = MATCHED
          ? [MATCHED, ...OTHERS]
          : OTHERS;
      });
  }

  /**
   * Establece valores en el store del trámite utilizando un método dinámico.
   * 
   * Este método genérico permite actualizar el estado del store llamando dinámicamente
   * a métodos específicos basados en el nombre proporcionado.
   * 
   * @param form - Formulario reactivo del cual obtener el valor del campo.
   * @param campo - Nombre del campo del formulario cuyo valor se desea establecer.
   * @param metodoNombre - Nombre del método del store que se debe invocar para actualizar el estado.
   * @returns {void} No retorna ningún valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Expedicion120204Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.expedicion120204Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Maneja la selección de filas en la tabla de montos a expedir.
   * 
   * Este método se ejecuta cuando el usuario selecciona una o más filas en la tabla
   * de montos a expedir. Almacena las filas seleccionadas para operaciones posteriores
   * como eliminación o modificación.
   * 
   * @param row - Arreglo de elementos ExpedirMonto que representan las filas seleccionadas.
   * @returns {void} No retorna ningún valor.
   */
  valorDeAlternancia(row: ExpedirMonto[]): void {
    this.selectedMonto = row;
  }

  /**
   * Agrega un nuevo monto a la tabla de expedición y actualiza los cálculos.
   * 
   * Este método valida el monto ingresado, verifica que no exceda el monto disponible,
   * crea un nuevo registro en la tabla, actualiza el monto disponible y recalcula el total.
   * 
   * @param valor - Monto a agregar como cadena de texto que se convertirá a número.
   * @returns {void} No retorna ningún valor.
   */
  agregar(valor: string): void {
    if (!valor || isNaN(Number(valor))) {
      return;
    }

    const MONTO_A_AGREGAR = Number(valor);
    const MONTO_DISPONIBLE_ACTUAL = Number(this.distribucionSaldoForm.get('montoDisponible')?.value || 0);

    // Verificar si hay suficiente monto disponible
    if (MONTO_A_AGREGAR > MONTO_DISPONIBLE_ACTUAL) {
      this.montoExcedeDisponibleError = true;
      return;
    }

    this.montoExcedeDisponibleError = false;

    const NUEVO_MONTO: ExpedirMonto = {
      montoExpedir: MONTO_A_AGREGAR
    };

    this.cuerpoTabla = [...this.cuerpoTabla, NUEVO_MONTO];
    
    // Restar el monto del monto disponible
    const NUEVO_MONTO_DISPONIBLE = MONTO_DISPONIBLE_ACTUAL - MONTO_A_AGREGAR;
    
    // Temporarily enable the field to update it, then disable it again
    this.distribucionSaldoForm.get('montoDisponible')?.enable();
    this.distribucionSaldoForm.patchValue({ 
      montoDisponible: NUEVO_MONTO_DISPONIBLE.toString()
    });
    if (!this.esFormularioSoloLectura) {
      this.distribucionSaldoForm.get('montoDisponible')?.disable();
    }
    
    // Calcular el total
    this.calcularTotal();
    
    // Limpiar el campo y resetear su estado de validación
    const MONTO_A_EXPEDIR_CONTROL = this.distribucionSaldoForm.get('montoAExpedir');
  }

  /**
   * Elimina el monto seleccionado de la tabla.
   * @returns {void}
   */
  eliminar(): void {
    if (this.selectedMonto.length === 0) {
      this.mostrarNotificacionError('Debe seleccionar al menos un elemento para eliminar');
      return;
    }

    // Mostrar modal de confirmación antes de eliminar
    this.mostrarNotificacionConfirmacion();
  }

  /**
   * Ejecuta la eliminación de los montos seleccionados después de la confirmación.
   * @returns {void}
   */
  private ejecutarEliminacion(): void {
    // Calcular el total de los montos a eliminar para restaurar al monto disponible
    const TOTAL_MONTOS_ELIMINADOS = this.selectedMonto.reduce((sum, item) => sum + item.montoExpedir, 0);
    const MONTO_DISPONIBLE_ACTUAL = Number(this.distribucionSaldoForm.get('montoDisponible')?.value || 0);

    // Filtrar los elementos seleccionados
    this.cuerpoTabla = this.cuerpoTabla.filter(item => 
      !this.selectedMonto.some(selected => selected.montoExpedir === item.montoExpedir)
    );

    // Restaurar el monto al monto disponible
    const NUEVO_MONTO_DISPONIBLE = MONTO_DISPONIBLE_ACTUAL + TOTAL_MONTOS_ELIMINADOS;
    
    // Temporarily enable the field to update it, then disable it again
    this.distribucionSaldoForm.get('montoDisponible')?.enable();
    this.distribucionSaldoForm.patchValue({ 
      montoDisponible: NUEVO_MONTO_DISPONIBLE.toString()
    });
    if (!this.esFormularioSoloLectura) {
      this.distribucionSaldoForm.get('montoDisponible')?.disable();
    }

    // Recalcular el total
    this.calcularTotal();
    
    // Limpiar la selección
    this.selectedMonto = [];

    // Mostrar notificación de éxito
    this.mostrarNotificacionExito('Los elementos seleccionados han sido eliminados correctamente');
  }

  /**
   * Calcula el total de los montos a expedir.
   */
  private calcularTotal(): void {
    const TOTAL = this.cuerpoTabla.reduce((sum, item) => sum + item.montoExpedir, 0);
    this.distribucionSaldoForm.patchValue({ totalAExpedir: TOTAL.toString() });
  }

  /**
   * Verifica si un control de formulario es inválido y ha sido interactuado por el usuario.
   * 
   * Este método es útil para mostrar mensajes de validación solo después de que
   * el usuario haya interactuado con el campo correspondiente.
   * 
   * @param id - Identificador del control dentro del formulario `distribucionSaldoForm`.
   * @returns {boolean | null} `true` si el control es inválido y ha sido tocado, 
   *                          `false` si es válido o no ha sido tocado,
   *                          `null` si el control no existe.
   */
  isInvalid(id: string): boolean | null {
    const CONTROL = this.distribucionSaldoForm.get(id);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : null;
  }

  /**
   * Maneja el evento de selección de una fila en la tabla de licitaciones.
   * 
   * Este método se ejecuta cuando el usuario hace clic en una licitación de la tabla.
   * Actualiza los formularios de detalle con la información de la licitación seleccionada,
   * actualiza el estado del store y obtiene información adicional del servicio.
   * 
   * @param event - Objeto LicitacionesDisponibles que representa la licitación seleccionada.
   * @returns {void} No retorna ningún valor.
   */
  onRowClick(event: LicitacionesDisponibles): void {
    const SELECTED_ROW = event;
    this.validationAttempted = false;
    
    this.detalledelaLicitacionForm.patchValue({
      numeraDelicitacion: SELECTED_ROW.participante?.licitacionPublica?.numeroLicitacion,
      fechaDelEventoDelicitacion: SELECTED_ROW.participante?.licitacionPublica?.fechaConcurso,
      fechaInicioVigenciaCupo: SELECTED_ROW.fechaInicioVigencia,
      descripcionDelProducto: SELECTED_ROW.participante.licitacionPublica?.fundamento,
      montoAdjudicado: SELECTED_ROW.participante.montoAdjudicado,
      observaciones: SELECTED_ROW.participante.licitacionPublica?.observaciones,
      bloqueComercial: SELECTED_ROW.participante.licitacionPublica?.bloqueComercial,
      paises: SELECTED_ROW.participante.licitacionPublica?.paises,
    });

    this.expedicion120204Store.setNumeraDelicitacion(String(SELECTED_ROW.participante?.licitacionPublica?.numeroLicitacion || ''));
    this.expedicion120204Store.setFechaDelEventoDelicitacion(String(SELECTED_ROW.participante?.licitacionPublica?.fechaConcurso || ''));
    this.expedicion120204Store.setFechaInicioVigenciaCupo(String(SELECTED_ROW.fechaInicioVigencia || ''));
    this.expedicion120204Store.setDescripcionDelProducto(String(SELECTED_ROW.participante.licitacionPublica?.fundamento || ''));
    this.expedicion120204Store.setMontoAdjudicado(String(SELECTED_ROW.participante.montoAdjudicado || ''));
    this.expedicion120204Store.setObservaciones(String(SELECTED_ROW.participante.licitacionPublica?.observaciones || ''));
    this.expedicion120204Store.setBloqueComercial(String(SELECTED_ROW.participante.licitacionPublica?.bloqueComercial || ''));
    this.expedicion120204Store.setPaises(String(SELECTED_ROW.participante.licitacionPublica?.paises || ''));

    const CACHED_ROW = this.datos.find(item => item.idAsignacion === SELECTED_ROW.idAsignacion);
    
    if (CACHED_ROW) {
      this.detalledelaLicitacionForm.patchValue({
        unidadMedidaTarifaria: CACHED_ROW.participante.licitacionPublica?.unidadMedidaTarifaria || '',
        regimenAduanero: CACHED_ROW.participante.licitacionPublica?.regimenAduanero || '',
        montoDisponible: CACHED_ROW.participante.montoDisponible,
      });
      
      this.expedicion120204Store.setUnidadMedidaTarifaria(String(CACHED_ROW.participante.licitacionPublica?.unidadMedidaTarifaria || ''));
      this.expedicion120204Store.setRegimenAduanero(String(CACHED_ROW.participante.licitacionPublica?.regimenAduanero || ''));
      this.expedicion120204Store.setMontoDisponsible(String(CACHED_ROW.participante.montoDisponible || ''));
      
      this.mostrarSeccionDetalle = true;
    }
      const PAYLOAD = {
        "id_asignacion": SELECTED_ROW.idAsignacion,
        "rfc": this.loginRfc,
      }
      
      this.service.licitacionDatosPost(PAYLOAD).pipe(
        takeUntil(this.destroyed$)
      ).subscribe(
        (response: any) => {
          
          if (response && response.datos && response.datos.length > 0) {
            const DATA = response.datos[0];
            
            this.detalledelaLicitacionForm.patchValue({
              unidadMedidaTarifaria: DATA.participante?.licitacionPublica?.unidadMedidaTarifaria || '',
              fechaFinVigenciaCupo: DATA.fechaFinVigenciaAprobada || '',
              regimenAduanero: DATA.participante?.licitacionPublica?.regimenAduanero || '',
              fraccionArancelaria: DATA.fraccionArancelaria || '',
              bloqueComercial: DATA.participante?.licitacionPublica?.bloqueComercial || '',
              paises: DATA.participante?.licitacionPublica?.paises || '',
              fechaInicioVigenciaCupo: DATA.fechaInicioVigencia || '',
              observaciones: DATA.mecanismoAsignacion?.observaciones || '',
              montoExpedido: DATA.montoExpedido
            });
            
            this.expedicion120204Store.setUnidadMedidaTarifaria(String(DATA.participante?.licitacionPublica?.unidadMedidaTarifaria || ''));
            this.expedicion120204Store.setFechaFinVigenciaCupo(String(DATA.fechaFinVigenciaAprobada || ''));
            this.expedicion120204Store.setRegimenAduanero(String(DATA.participante?.licitacionPublica?.regimenAduanero || ''));
            this.expedicion120204Store.setFraccionArancelaria(String(DATA.fraccionArancelaria || ''));
            this.expedicion120204Store.setBloqueComercial(String(DATA.participante?.licitacionPublica?.bloqueComercial || ''));
            this.expedicion120204Store.setPaises(String(DATA.participante?.licitacionPublica?.paises || ''));
            this.expedicion120204Store.setFechaInicioVigenciaCupo(String(DATA.fechaInicioVigencia || ''));
            this.expedicion120204Store.setObservaciones(String(DATA.mecanismoAsignacion?.observaciones || ''));
          }
          
          this.getDistribucionSaldo();
          this.mostrarSeccionDetalle = true;
        },
        (error) => {
          console.error('Error al obtener datos de licitación:', error);
          this.toastr.error('Error al obtener detalles adicionales', 'Error');
          this.getDistribucionSaldo();
          this.mostrarSeccionDetalle = true;
        }
      );
    
  }

  /**
   * Método de destrucción del componente.
   *
   * Limpia las suscripciones al Subject `destroyed$`.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Obtiene los datos de la tabla desde el servicio y los asigna a la propiedad `datos`.
   *
   * @remarks
   * Este método realiza una suscripción al servicio `obtenerDatosTabla` para obtener los datos
   * correspondientes y los almacena en un arreglo con un único elemento.
   *
   * @returns {void} No retorna ningún valor.
   */
  obtenerDatosTabla(): void {
    this.service.getObtenerLicitaciones("KIL110112K90").pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      (response: ApiLicitacionesResponse) => {
        if (response.datos && response.datos.licitaciones && Array.isArray(response.datos.licitaciones)) {
          this.datos = response.datos.licitaciones;
        } else {
          this.toastr.error('Data not present in the response', 'Error');
        }
      },
      (error) => {
        console.error('Error al obtener licitaciones:', error);
        this.datos = [];
      }
    );
  }


  /**
   * Obtiene la distribución del saldo desde el servicio y actualiza el formulario
   * `distribucionSaldoForm` con los valores recibidos.
   *
   * @remarks
   * Este método realiza una suscripción al servicio `getDistribucionSaldo` para
   * obtener los datos de distribución del saldo. Una vez obtenidos, se actualizan
   * los campos del formulario con los valores correspondientes.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  getDistribucionSaldo(): void {
    const PAYLOAD = {
      IDSOLICITUD: "20737862" 
    }
    this.service.obtenerCertificado(PAYLOAD.IDSOLICITUD).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      (data: ApiLicitacionesResponse) => {
        this.distribucionSaldoForm.patchValue({
        })
      })
  }

  /**
   * Maneja el evento de cambio en el campo de "entidad federativa" del formulario.
   * Obtiene el valor actual del campo "entidadFederativa" del formulario y lo
   * establece en el estado de la tienda `expedicion120204Store`.
   *
   * @returns {void} No retorna ningún valor.
   */
  onCambiarEntiadFederative(): void {
    const ENTITAD_FEDERATIVA = this.formulario.get('entidadFederativa')?.value;
    this.expedicion120204Store.setEntidadFederativa(ENTITAD_FEDERATIVA);
  }


  /**
   * Maneja el evento de cambio para el campo "representacionFederal".
   * Obtiene el valor actual del formulario y lo establece en el estado
   * de la tienda `expedicion120204Store`.
   *
   * @returns {void} Esta función no retorna ningún valor.
   */
  onCambiarRepresentacionFederal(): void {
    const REPRESENTACION_FEDERAL = this.formulario.get('representacionFederal')?.value;
    this.expedicion120204Store.setRepresentacionFederal(REPRESENTACION_FEDERAL);
  }

  /**
   * Maneja el evento de cambio en el campo "montoAExpedir".
   * Obtiene el valor actual del formulario asociado y lo establece en el store correspondiente.
   *
   * @returns {void} No retorna ningún valor.
   */
  onCambiarMontoAExpedir(): void {
    const MONTOAEXPEDIR = this.distribucionSaldoForm.get('montoAExpedir')?.value;
    this.expedicion120204Store.setMontoExpedir(MONTOAEXPEDIR);
    this.montoExcedeDisponibleError = false;
  }

  /**
   * Maneja el evento de cambio para el checkbox "montoAExpedirCheck".
   * Obtiene el valor actual del formulario asociado y lo establece en el estado
   * de la tienda `expedicion120204Store`.
   *
   * @returns {void} No retorna ningún valor.
   */
  onCambiarMontoAExpedirCheck(): void {
    const MONTOAEXPEDIRCHECK = this.distribucionSaldoForm.get('montoAExpedirCheck')?.value;
    this.expedicion120204Store.setMontoExpedirCheck(MONTOAEXPEDIRCHECK);
  }


  /**
   * Agrega un monto al total a expedir en el formulario de distribución de saldo.
   *
   * Este método toma el valor del campo 'montoAExpedir' del formulario, lo suma al valor
   * actual del campo 'totalAExpedir' y actualiza ambos el formulario y el estado de la tienda
   * con el nuevo total calculado.
   *
   * @returns {void} No retorna ningún valor.
   */
  AgregarMontoExpedir(): void {
    const MONTOAEXPEDIR = this.distribucionSaldoForm.get('montoAExpedir')?.value;
    this.agregar(MONTOAEXPEDIR);
  }

  /**
   * Inicializa el formulario y sus valores a partir del estado de la solicitud.
   *
   * Este método se suscribe al observable `selectSolicitud$` del `expedicion120204Query`
   * para obtener el estado actual de la solicitud y luego inicializa el formulario
   * con los valores correspondientes.
   *
   * @returns {void} No retorna ningún valor.
   */
  inicializarFormulario(): void {
    this.expedicion120204Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;

        })

      ).subscribe()
    this.inicializarExpedicionCertificadoFormulario();
  }

  /**
   * Inicializa los formularios reactivos utilizados en el componente para la expedición de certificados.
   *
   * - `formulario`: Contiene los campos de entidad federativa y representación federal, ambos requeridos.
   * - `detalledelaLicitacionForm`: Incluye información detallada de la licitación como número, fecha del evento y descripción del producto, todos en modo solo lectura y requeridos.
   * - `distribucionSaldoForm`: Maneja los montos disponibles y a expedir, con validaciones de requerimiento y patrón, algunos campos en solo lectura.
   *
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), todos los formularios se deshabilitan para evitar modificaciones.
   */
  inicializarExpedicionCertificadoFormulario(): void {
    this.formulario = this.fb.group({
      entidadFederativa: [this.solicitudState?.entidadFederativa, Validators.required],
      representacionFederal: [this.solicitudState?.representacionFederal, Validators.required],
    });
    
    this.detalledelaLicitacionForm = this.fb.group({
      numeraDelicitacion: [{ value: this.solicitudState?.numeraDelicitacion, disabled: true }, Validators.required],
      fechaDelEventoDelicitacion: [{ value: this.solicitudState?.fechaDelEventoDelicitacion, disabled: true }, Validators.required],
      descripcionDelProducto: [{ value: this.solicitudState?.descripcionDelProducto, disabled: true }, Validators.required],
      unidadMedidaTarifaria: [{ value: '', disabled: true }],
      montoAdjudicado: [{ value: '', disabled: true }],
      regimenAduanero: [{ value: '', disabled: true }],
      fraccionArancelaria: [{ value: '', disabled: true }],
      fechaInicioVigenciaCupo: [{ value: '', disabled: true }],
      fechaFinVigenciaCupo: [{ value: '', disabled: true }],
      observaciones: [{ value: '', disabled: true }],
      bloqueComercial: [{ value: '', disabled: true }],
      paises: [{ value: '', disabled: true }]
    });
    
    this.distribucionSaldoForm = this.fb.group({
      montoDisponible: [this.solicitudState?.montoDisponible, Validators.required],
      montoAExpedir: [this.solicitudState?.montoAExpedir, [Validators.required, Validators.pattern(REGEX_ALTO)]],
      montoAExpedirCheck: [this.solicitudState?.montoAExpedirCheck, Validators.required],
      totalAExpedir: [{ value: this.solicitudState?.totalAExpedir, disabled: true }, [Validators.required, Validators.pattern(REGEX_ALTO)]]
    });

    if (this.esFormularioSoloLectura) {
      this.formulario.disable();
      this.detalledelaLicitacionForm.disable();
      this.distribucionSaldoForm.disable();
    } else {
      // En modo edición, solo deshabilitar campos específicos que no deben ser editables manualmente
      this.distribucionSaldoForm.get('montoDisponible')?.disable();
      this.distribucionSaldoForm.get('totalAExpedir')?.disable();
    }
  }

/**
 * Abre un modal de notificación para alertar al usuario que debe seleccionar un archivo CSV.
 * 
 * @param i - (Opcional) Índice del elemento a eliminar. Por defecto es 0.
 * 
 * Este método inicializa la notificación con un mensaje de alerta y configura el elemento a eliminar.
 */
abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'El archivo no tiene la extensión definida CSV, deberá de adjuntar el archivo correcto.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'OK',
        txtBtnCancelar: '',
    };
    this.elementoParaEliminar = i;
}

/**
 * Muestra una notificación de confirmación para eliminar elementos seleccionados.
 * @returns {void}
 */
private mostrarNotificacionConfirmacion(): void {
    this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: '',
        titulo: 'Confirmar eliminación',
        mensaje: `¿Está seguro que desea eliminar los registros marcados?`,
        cerrar: false,
        txtBtnAceptar: 'Sí, eliminar',
        txtBtnCancelar: 'Cancelar',
    };
}

/**
 * Muestra una notificación de error.
 * @param mensaje - Mensaje de error a mostrar.
 * @returns {void}
 */
private mostrarNotificacionError(mensaje: string): void {
    this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.TOASTR,
        categoria: CategoriaMensaje.ERROR,
        modo: '',
        titulo: 'Error',
        mensaje: mensaje,
        cerrar: false,
        txtBtnAceptar: 'OK',
        txtBtnCancelar: '',
    };
}

/**
 * Muestra una notificación de éxito.
 * @param mensaje - Mensaje de éxito a mostrar.
 * @returns {void}
 */
private mostrarNotificacionExito(mensaje: string): void {
    this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.TOASTR,
        categoria: CategoriaMensaje.EXITO,
        modo: '',
        titulo: 'Éxito',
        mensaje: mensaje,
        cerrar: false,
        txtBtnAceptar: 'OK',
        txtBtnCancelar: '',
    };
}

/**
 * Maneja la respuesta del usuario al modal de confirmación de eliminación.
 * 
 * Este método procesa la confirmación del usuario para eliminar los montos seleccionados.
 * Si el usuario confirma, ejecuta la eliminación; de lo contrario, cancela la operación.
 * 
 * @param confirmado - Valor booleano que indica si el usuario confirmó la eliminación.
 * @returns {void} No retorna ningún valor.
 */
onConfirmacionEliminacion(confirmado: boolean): void {
    if (confirmado) {
        this.ejecutarEliminacion();
    }
    // Limpiar la notificación después de la acción
    this.nuevaNotificacion = {} as Notificacion;
}

/**
 * Valida todos los formularios del componente y marca los campos como tocados.
 * 
 * Este método verifica la validez de todos los formularios reactivos del componente,
 * marca todos los campos como tocados para mostrar los mensajes de error y
 * establece el flag de intento de validación.
 * 
 * @returns {boolean} `true` si todos los formularios son válidos, `false` si alguno contiene errores.
 */
validarFormulario(): boolean {
  this.validationAttempted = true;
  
  let isValid = true;
  
  if (this.formulario && this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    isValid = false;
  }
  
  if (this.distribucionSaldoForm && this.distribucionSaldoForm.invalid) {
    this.distribucionSaldoForm.markAllAsTouched();
    isValid = false;
  }
  
  return isValid;
}
}