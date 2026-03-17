import { AVISO, AccionBoton, Catalogo, CategoriaMensaje, DatosPasos, ListaPasosWizard, Notificacion, Usuario, formatearFechaYyyyMmDd } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ID_PROCEDIMIENTO, PASOS, TITULOMENSAJE } from '../../constants/importacion-sustancias-quimicas.enum';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Tramite240106Query } from '../../estados/tramite240106Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { Tramite240106State, Tramite240106Store } from '../../estados/tramite240106Store.store';
import { USUARIO_INFO } from '../../../../shared/enum/datos-usuario-documentos';
import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { ValidarGuardar } from '../../../../shared/models/guardar-payload.model';

/**
 * @title Página de Solicitud
 * @description Componente principal que contiene el flujo del trámite a través de un wizard dividido en pasos.
 * @summary Administra la navegación entre pasos del trámite y organiza los componentes visuales del flujo.
 */
@Component({
  selector: 'app-solicitud-page',
  standalone: false,
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
export class SolicitudPageComponent {
  /**
  * Indica si la carga del archivo se encuentra en progreso.
  * Se utiliza para mostrar indicadores visuales de carga.
  */
  cargaEnProgreso: boolean = true;

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en `true` para mostrar la sección al cargar el componente.
   */
  seccionCargarDocumentos: boolean = true;

  /**
 * Catalog of available countries.
 */
  public paisesDatos: Catalogo[] = [];

  /**
   * Información del usuario actual.
   * Se inicializa con los datos constantes definidos en `USUARIO_INFO`.
   */
  datosUsuario: Usuario = USUARIO_INFO;

  /**
   * Estado actual del trámite en la página.
   * Contiene la información necesaria para el flujo del trámite.
   */
  public solicitudState!: Tramite240106State;

  /**
    * Evento que se emite para cargar archivos.
    * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
    */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
  * Evento que emite los datos actualizados del formulario hacia el componente padre.
  * @event updateDatosDelTramiteFormulario
  */
  @Output() updateDatosDelTramiteFormulario =
    new EventEmitter<DatosDelTramiteFormState>();

  /**
     * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
     * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
     */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * @property tituloMensaje
   * @description Título que se muestra en la parte superior del wizard.
   * Se actualiza dependiendo del paso seleccionado.
   * @type {string | null}
   */
  public tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * @property pasos
   * @description Listado de pasos definidos para el wizard, incluyendo
   * información y componentes asociados.
   * @type {ListaPasosWizard[]}
   */
  public pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property indice
   * @description Índice del paso actual en el wizard.
   * @type {number}
   */
  public indice = 1;

  /**
    * @property {Subject<void>} destroyNotifier$
    * Subject utilizado para gestionar las desuscripciones automáticas y evitar fugas de memoria.
    * Se completa manualmente cuando el componente se destruye.
    * @private
    */
  private destroyNotifier$ = new Subject<void>();

  /**
  * @property subIndice
  * @description Índice del paso actual en el tab.
  * @type {number}
  */
  public subIndice = 1;

  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTOS = AVISO.Aviso;
  /**
   * @property wizardComponent
   * @description Referencia al componente `WizardComponent`, utilizada
   * para invocar métodos de navegación interna como `siguiente()` y `atras()`.
   * @type {WizardComponent}
   */

  /**
     * Identificador del procedimiento.
     * @property {number} idProcedimiento
     */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * @property datosPasos
   * @description Configuración de la barra de navegación del wizard:
   * número de pasos, índice actual y textos de los botones.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @method seleccionaTab
   * @description Permite cambiar el paso actual de forma manual
   * al hacer clic en las pestañas (tabs) del wizard.
   * @param {number} i - Índice del paso seleccionado.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Inyecta los servicios necesarios para la gestión del estado del trámite
   * y el acceso a los datos de la solicitud.
   */
  constructor(
    private tramiteQuery: Tramite240106Query,
    private datosSolicitudService: DatosSolicitudService,
    private tramiteStore: Tramite240106Store
  ) { }

  /**
   * Inicializa el componente.
   *
   * - Suscribe al observable del tab seleccionado del trámite.
   * - Asigna el índice correspondiente a `subIndice`.
   * - Garantiza la liberación de la suscripción al destruir el componente.
   */
  ngOnInit(): void {
    this.tramiteQuery.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(i => {
        this.subIndice = i ?? 1;
      });
  }

  /**
   * Gestiona el avance o retroceso del flujo del formulario según la acción recibida.
   * 
   * - Si la acción es "cont" (continuar), valida la información requerida en cada paso:
   *   - Verifica que exista al menos un registro de mercancía.
   *   - Valida el formulario de datos del trámite.
   *   - Verifica que exista al menos un destinatario final.
   *   - Verifica que exista al menos un proveedor.
   *   - Valida los datos de pago de derechos.
   *   - Construye el payload final y ejecuta la validación previa al guardado.
   *   Si todas las validaciones son correctas, avanza al siguiente paso del wizard.
   * 
   * - Si la acción es "ant" (anterior), retrocede un paso en el wizard.
   *
   * @param e - Objeto de tipo `AccionBoton` que indica la acción realizada
   *            (continuar o retroceder) y el valor de índice asociado.
   */
  async getValorIndice(e: AccionBoton): Promise<void> {
    if (e.accion === 'cont') {
      if (this.subIndice === 3) {
        const MercanciaTablaDatos = await firstValueFrom(this.tramiteQuery.getMercanciaTablaDatos$);
        if (!MercanciaTablaDatos || MercanciaTablaDatos.length === 0) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: 'Debe agregar al menos un dato de mercancía',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          return;
        }
        const DatosDelTramite = await firstValueFrom(this.tramiteQuery.getDatosDelTramite$);
        const DatosDelTramiteIsValid = await this.validarFormulario(DatosDelTramite);
        if (!DatosDelTramiteIsValid) return;
        const DestinatarioFinalTablaDatos = await firstValueFrom(this.tramiteQuery.getDestinatarioFinalTablaDatos$);
        const ProveedorTablaDatos = await firstValueFrom(this.tramiteQuery.getProveedorTablaDatos$);
        if (!DestinatarioFinalTablaDatos || DestinatarioFinalTablaDatos.length === 0) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: 'Debe agregar al menos un dato de destinatario final',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          return;
        }
        if (!ProveedorTablaDatos || ProveedorTablaDatos.length === 0) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: 'Debe agregar al menos un dato de mercancía',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          return;
        }

        const payload = this.buildFinalPayload(
          DatosDelTramite,
          DestinatarioFinalTablaDatos,
          ProveedorTablaDatos,
          MercanciaTablaDatos
        );
        const isValidGuardar = await this.validarGuardar(payload);
        if (!isValidGuardar) return;

        this.indice = e.valor;
        this.wizardComponent.siguiente();
      } else {
        this.indice = e.valor;
        this.wizardComponent.siguiente();
      }
    }
    if (e.accion === 'ant') {
      this.indice--;
      this.wizardComponent.atras();
    }
  }

  /**
 * Valida los datos del formulario de "Datos del Trámite" mediante el servicio correspondiente.
 * 
 * Envía al backend un payload con la información clave (aduanas, permiso, uso final,
 * semestre, año en curso). Si la validación es exitosa, emite los datos normalizados al
 * componente padre mediante `updateDatosDelTramiteFormulario`.
 * 
 * - Retorna `true` si la validación es correcta.
 * - Retorna `false` y muestra una notificación de error en caso contrario.
 *
 * @param data - Información del formulario que será validada.
 * @returns Promise<boolean> - Resultado de la validación.
 */
  validarFormulario(data: DatosDelTramiteFormState): Promise<boolean> {
    return new Promise((resolve) => {
      const aduanas = data.aduanasSeleccionadas;
      const permiso = data.permisoGeneral;
      const usoFinal = data.usoFinal;
      const semestre = data.unoSemestre;
      const anioCurso = data.anoEnCurso;
      const fechaUnicaEntrada = data.fechaPago
      const payload = {
        aduanas_entrada: aduanas,
        permiso_general: permiso,
        uso_final_mercancia: usoFinal,
        semestre: semestre,
        anio_curso: anioCurso,
        fecha_unica_entrada: `${formatearFechaYyyyMmDd(String(fechaUnicaEntrada))} 12:00:00`
      };
      this.datosSolicitudService.validarDatos(payload, this.idProcedimiento)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (res) => {
            if (res?.codigo === '00') {
              const DATOS_DEL_TRAMITE: DatosDelTramiteFormState = {
                permisoGeneral: data.permisoGeneral,
                paisDestino: data.paisDestino,
                usoFinal: data.usoFinal,
                aduanasSeleccionadas: data.aduanasSeleccionadas,
                anoEnCurso: data.anoEnCurso,
                fechaPago: data.fechaPago,
                fechaSalida: data.fechaSalida,
                dosSemestre: data.dosSemestre,
                informacionConfidencial: data.informacionConfidencial,
              };
              this.updateDatosDelTramiteFormulario.emit(DATOS_DEL_TRAMITE);
              resolve(true);
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: '',
                mensaje: res.error || 'Error al generar la cadena original.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              resolve(false);
              return;
            }
          },
          error: (err) => {
            const MENSAJE = err?.error?.error || 'Error inesperado al iniciar trámite.';
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            resolve(false);
          },
        });
    });
  }

  /**
  * Construye el payload final para enviar al API.
  *
  * @param DatosDelTramite - Información general del trámite
  * @param PagoDerechos - Información de pago
  * @param DestinatarioFinalTablaDatos - Lista de destinatarios finales
  * @param ProveedorTablaDatos - Lista de proveedores
  * @param MercanciaTablaDatos - Lista de mercancías
  */
  private buildFinalPayload(
    DatosDelTramiteFormState: DatosDelTramiteFormState,
    DestinatarioFinalTablaDatos: DestinoFinal[],
    ProveedorTablaDatos: Proveedor[],
    MercanciaTablaDatos: MercanciaDetalle[]
  ) {
    return {
      justificacion: "string",
      cve_regimen: "01",
      cve_clasificacion_regimen: "01",

      solicitante: {
        certificado_serial_number: "string",
        rfc: "AAL0409235E6",
        nombre: "Juan Pérez",
        es_persona_moral: true
      },

      representacion_federal: {
        cve_entidad_federativa: "DGO",
        cve_unidad_administrativa: "1016"
      },

      permiso_general: DatosDelTramiteFormState.permisoGeneral || "",
      cve_pais_destino: DatosDelTramiteFormState.paisDestino || "",
      aduanas_entrada: DatosDelTramiteFormState.aduanasSeleccionadas || [],
      uso_final_mercancia: DatosDelTramiteFormState.usoFinal || "",
      semestre: DatosDelTramiteFormState.unoSemestre,
      anio_curso: DatosDelTramiteFormState.anoEnCurso ?? null,
      fecha_unica_entrada: `${formatearFechaYyyyMmDd(String(DatosDelTramiteFormState.fechaPago))}T12:00:00Z` || "",

      mercancias: MercanciaTablaDatos.map(m => this.mapMercanciaToApiFormat(m)),

      destinatarios: DestinatarioFinalTablaDatos.map(m => this.mapDestinatarioToApiFormat(m)),

      proveedores: ProveedorTablaDatos.map(m => this.mapProveedorToApiFormat(m)),

    };
  }

  /**
 * Maps a single MercanciaDetalle record into the API's expected
 * payload structure for mercancías.
 */
  private mapMercanciaToApiFormat(item: MercanciaDetalle) {
    return {
      fraccion_arancelaria: item.fraccionArancelaria,
      descripcion_fraccion: item.descripcionFraccion,
      descripcion_mercancia: item.descripcion,
      umt: item.cve_umt ?? '',
      umc: item.umc ?? null,
      cantidad_umt: item.cantidadUMT,
      valor_comercial: item.valorComercial,
      tipo_moneda: item.tipo_moneda,
      pais_origen:
        item.cve_paisOrigen && item.cve_paisOrigen.trim() !== ''
          ? JSON.parse(item.cve_paisOrigen)
          : null,
    };
  }

  /**
   * Maps a Destinatario Final row from the form/table
   * into the standardized API format required for submission.
   */
  private mapDestinatarioToApiFormat(item: DestinoFinal) {
    const telefonoCompleto = item.telefono?.trim() ?? null;

    const partesTelefono = telefonoCompleto
      ? telefonoCompleto.split(/\s+/)
      : [];
    return {
      rfc: item.rfc ?? null,
      curp: item.curp ?? null,
      nombre: item.nombres ?? null,
      cve_pais: item.cve_pais ?? null,
      cve_estado: item.cve_estado ?? null,
      cve_municipio: item.cve_municipio ?? null,
      cve_localidad: item.cve_localidad ?? null,
      cve_colonia: item.cve_colonia ?? null,
      calle: item.calle ?? null,
      lada: partesTelefono[0] ?? null,
      telefono: partesTelefono[1] ?? null,
      nacionalidad: item.nacionalidad ?? null,
      tipo_persona: item.tipoPersona ?? null,
      primer_apellido: item.primerApellido ?? null,
      segundo_apellido: item.segundoApellido ?? null,
      denominacion_razon_social: item.denominacionRazon ?? null,
      cve_entidad_federativa: item.entidadFederativa ?? null,
      codigo_postal: item.codigoPostal ?? null,
      numero_exterior: item.numeroExterior ?? null,
      numero_interior: item.numeroInterior ?? null,
      correo_electronico: item.correoElectronico ?? null
    };
  }

  /**
   * Maps a Proveedor row into the format required by the API
   * for provider information when submitting the trámite.
   */
  private mapProveedorToApiFormat(item: Proveedor) {
    const telefonoCompleto = item.telefono?.trim() ?? null;

    const partesTelefono = telefonoCompleto
      ? telefonoCompleto.split(/\s+/)
      : [];
    return {
      nombre: item.nombres ?? null,
      cve_pais: item.cve_pais ?? null,
      estado: item.estado ?? null,
      cve_estado: item.estado ?? null,
      calle: item.calle ?? null,
      lada: partesTelefono[0] ?? null,
      telefono: partesTelefono[1] ?? null,
      tipo_persona: item.tipoPersona ?? null,
      primer_apellido: item.primerApellido ?? null,
      segundo_apellido: item.segundoApellido ?? null,
      denominacion_razon_social: item.denominacionRazon ?? null,
      colonia: item.colonia,
      codigo_postal: item.codigoPostal ?? null,
      numero_exterior: item.numeroExterior ?? null,
      numero_interior: item.numeroInterior ?? null,
      correo_electronico: item.correoElectronico ?? null
    };
  }

  /**
  * Valida el payload final antes de proceder con el guardado del trámite.
  * Envía los datos al servicio de validación y muestra notificaciones
  * de error en caso de respuesta inválida o fallos inesperados.
  *
  * @param payload - Objeto completo a validar previo al guardado.
  * @returns Promise<boolean> - `true` si la validación es exitosa, `false` en cualquier error.
  */
  validarGuardar(payload: ValidarGuardar): Promise<boolean> {
    return new Promise((resolve) => {
      this.datosSolicitudService.validarGuardar(payload, this.idProcedimiento)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (resp) => {
            if (resp.codigo !== '00') {
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: '',
                mensaje: resp.error || 'Error al generar la cadena original.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              resolve(false);
              return;
            }
            this.tramiteStore.updateState({
              idSolicitud: resp.datos.id_solicitud,
            });
            resolve(true);
          },
          error: (error) => {
            const MENSAJE = error?.error?.error || 'Error inesperado al iniciar trámite.';
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            resolve(false);
          }
        });
    });
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description Método estático que determina el título
   * a mostrar de acuerdo al índice del paso actual.
   * @param {number} valor - Índice del paso.
   * @returns {string} Título correspondiente al paso.
   */
  public static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULOMENSAJE;
      case 2:
        return 'Anexar requisitos';
      case 3:
        return 'Firmar';
      default:
        return TITULOMENSAJE;
    }
  }

  /**
* Método para manejar el evento de carga de documentos.
* Actualiza el estado del botón de carga de archivos.
*  carga - Indica si la carga de documentos está activa o no.
* {void} No retorna ningún valor.
*/
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
    * Maneja el evento de carga en progreso emitido por un componente hijo.
    * Actualiza el estado de cargaEnProgreso según el valor recibido.
    * @param cargando Valor booleano que indica si la carga está en progreso.
    */
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }

  /*
 * @method ngOnDestroy
 * @description Hook del ciclo de vida que se ejecuta al destruir el componente.
  * Libera las suscripciones activas para evitar fugas de memoria.
  *
  * @returns {void}
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
