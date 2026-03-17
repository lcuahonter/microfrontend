import { AccionBoton, Catalogo, CategoriaMensaje, Notificacion, NotificacionesComponent, Usuario } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO, PASOS } from '../../constants/importacion-armas-municiones.enum';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { TITULOMENSAJE } from '../../constants/importacion-armas-municiones.enum';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { Tramite240111Query } from '../../estados/tramite240111Query.query';
import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { ValidarGuardar } from '../../../../shared/models/guardar-payload.model';
import { Tramite240111State, Tramite240111Store } from '../../estados/tramite240111Store.store';
import { USUARIO_INFO } from '../../../../shared/enum/datos-usuario-documentos';

/**
 * @title Página de Solicitud
 * @description Componente principal que administra el flujo del trámite mediante un wizard por pasos.
 */
@Component({
  selector: 'app-solicitud-page',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    NotificacionesComponent
  ],
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.css',
})
export class SolicitudPageComponent {
  /**
   * Emite los datos actualizados del formulario del trámite.
   */
  @Output()
  updateDatosDelTramiteFormulario =
    new EventEmitter<DatosDelTramiteFormState>();

  /**
   * Referencia al componente Wizard para navegación interna.
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * Identificador del procedimiento actual.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Estado actual del trámite.
   */
  public solicitudState!: Tramite240111State;

  /**
   * Información del usuario autenticado.
   */
  public datosUsuario: Usuario = USUARIO_INFO;

  /**
   * Notificación activa para mostrar mensajes al usuario.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Indica si la carga de archivos está en progreso.
   */
  public cargaEnProgreso: boolean = true;

  /**
   * Habilita o deshabilita el botón de carga de archivos.
   */
  public activarBotonCargaArchivos: boolean = false;

  /**
   * Controla la visibilidad de la sección de carga de documentos.
   */
  public seccionCargarDocumentos: boolean = true;

  /**
   * Título mostrado en la cabecera del wizard.
   */
  public tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * Lista de pasos definidos para el wizard.
   */
  public pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual del wizard.
   */
  public indice: number = 1;

  /**
   * Índice del subpaso o tab activo.
   */
  public subIndice: number = 1;

  /**
   * Configuración de navegación del wizard.
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Catálogo de bancos obtenido del servicio SAGAR.
   */
  public bancoDatossagar: Catalogo[] = [];

  /**
   * Evento para iniciar la carga de archivos.
   */
  public cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Subject para cancelar suscripciones al destruir el componente.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
 * Constructor del componente.
 * Inyecta los servicios necesarios para consultar el trámite,
 * obtener los datos de la solicitud y actualizar el estado.
 */
  constructor(
    private tramiteQuery: Tramite240111Query,
    private datosSolicitudService: DatosSolicitudService,
    private tramiteStore: Tramite240111Store
  ) { }

  /**
   * Cambia manualmente el paso activo del wizard.
   * @param i Índice del paso seleccionado
   */
  public seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
 * Inicializa el componente y sincroniza el subíndice
 * con la pestaña seleccionada en el estado del trámite.
 */
  ngOnInit(): void {
    this.tramiteQuery.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((i) => {
        this.subIndice = i ?? 1;
      });
  }

  /**
   * Avanza al siguiente paso del wizard.
   */
  async continuar(): Promise<void> {
    this.getValorIndice({ accion: 'cont', valor: this.indice + 1 });
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
      if (this.subIndice === 4) {
        this.getBancos();
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
        const PagoDerechos = await firstValueFrom(this.tramiteQuery.getPagoDerechos$);
        const PagoDerechosIsValid = await this.validarPagoDerechos(PagoDerechos);
        if (!PagoDerechosIsValid) return;
        const payload: ValidarGuardar = this.buildFinalPayload(
          DatosDelTramite,
          PagoDerechos,
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
   * Obtiene el catálogo de bancos desde el servicio
   * y actualiza la lista `bancoDatossagar`.
   *
   * @returns {void}
   */
  getBancos(): void {
    this.datosSolicitudService
      .obtenerBancos(this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.bancoDatossagar = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion,
        }));
      });
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
      const payload = {
        aduanas_entrada: aduanas,
        permiso_general: permiso,
        uso_final_mercancia: usoFinal,
        semestre: semestre,
        anio_curso: anioCurso
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
  * Valida la información del pago de derechos mediante el servicio correspondiente.
  * 
  * Construye un payload con los datos proporcionados por el usuario, incluyendo:
  * clave de referencia, cadena de dependencia, banco, fecha e importe del pago.
  * 
  * - Retorna `true` si la validación es correcta.
  * - Retorna `false` y muestra una notificación de error cuando la validación falla.
  *
  * @param data - Información capturada en el formulario de pago de derechos.
  * @returns Promise<boolean> - Resultado de la validación.
  */
  validarPagoDerechos(data: PagoDerechosFormState): Promise<boolean> {
    const banco = this.bancoDatossagar.find(
      (b: Catalogo) => String(b.id) === String(data.banco)
    );
    return new Promise((resolve) => {
      const payload = {
        clave_referencia: data.claveReferencia,
        cadena_dependencia: data.cadenaDependencia,
        banco: banco?.descripcion || '',
        cve_banco: data.banco,
        llave_pago: data.llavePago,
        fecha_pago: data.fechaPago,
        importe_pago: data.importePago
      };

      this.datosSolicitudService.validarPagoDerechos(payload, this.idProcedimiento)
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
            } else {
              resolve(true);
            }
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
    PagoDerechos: PagoDerechosFormState,
    DestinatarioFinalTablaDatos: DestinoFinal[],
    ProveedorTablaDatos: Proveedor[],
    MercanciaTablaDatos: MercanciaDetalle[]
  ) {
    const banco = this.bancoDatossagar.find(
      (b: Catalogo) => String(b.id) === String(PagoDerechos.banco)
    );
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
        cve_entidad_federativa:
          "DGO",
        cve_unidad_administrativa:
          "1016"
      },

      permiso_general: DatosDelTramiteFormState.permisoGeneral || "",
      cve_pais_destino: DatosDelTramiteFormState.paisDestino || "",
      aduanas_entrada: DatosDelTramiteFormState.aduanasSeleccionadas || [],
      uso_final_mercancia: DatosDelTramiteFormState.usoFinal || "",
      fecha_unica_entrada: DatosDelTramiteFormState.fechaPago || "",

      semestre: DatosDelTramiteFormState.unoSemestre,
      anio_curso: DatosDelTramiteFormState.anoEnCurso ?? null,

      mercancias: MercanciaTablaDatos.map(m => this.mapMercanciaToApiFormat(m)),

      destinatarios: DestinatarioFinalTablaDatos.map(m => this.mapDestinatarioToApiFormat(m)),

      proveedores: ProveedorTablaDatos.map(m => this.mapProveedorToApiFormat(m)),

      pago: {
        banco: banco?.descripcion ?? "",
        cve_banco: PagoDerechos.banco,
        clave_referencia: PagoDerechos.claveReferencia,
        cadena_dependencia: PagoDerechos.cadenaDependencia,
        llave_pago: PagoDerechos.llavePago,
        fecha_pago: PagoDerechos.fechaPago,
        importe_pago: PagoDerechos.importePago
      }
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
        return 'Cargar requisitos';
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
