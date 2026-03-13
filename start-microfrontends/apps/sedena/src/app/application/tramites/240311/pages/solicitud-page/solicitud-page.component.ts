import { AccionBoton, Catalogo, CategoriaMensaje, Notificacion, Usuario } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO, TITULOMENSAJE } from '../../constants/solicitude-de-artificios-pirotecnicos.enum';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';
import { firstValueFrom, map, Subject, takeUntil } from 'rxjs';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240311Query } from '../../estados/tramite240311Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { Tramite240311State, Tramite240311Store } from '../../estados/tramite240311Store.store';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { ValidarGuardar } from '../../../../shared/models/guardar-payload.model';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';

/**
 * Componente principal que contiene el flujo del trámite a través de un wizard dividido en pasos.
 * Administra la navegación entre pasos del trámite y organiza los componentes visuales del flujo.
 */
@Component({
  selector: 'app-solicitud-page',
  standalone: false,
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
/**
 * Clase que representa la página de solicitud del trámite de artificios pirotécnicos.
 * Contiene la lógica para gestionar el wizard de pasos, incluyendo la navegación y el título mostrado.
 */
export class SolicitudPageComponent implements OnInit {

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
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en `true` para mostrar la sección al cargar el componente.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Información del usuario actual.
   * Se inicializa con los datos constantes definidos en `USUARIO_INFO`.
   */
  datosUsuario: Usuario = USUARIO_INFO;

  /**
   * Título que se muestra en la parte superior del wizard.
   * Se actualiza dependiendo del paso seleccionado.
   */
  public tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * Estado actual del trámite en la página.
   * Contiene la información necesaria para el flujo del trámite.
   */
  public solicitudState!: Tramite240311State;

  /**
    * Lista de bancos obtenidos desde el servicio SAGAR.
    * Contiene el catálogo en formato { id, descripcion } para
    * poblar los selectores relacionados con información bancaria.
    */
  public bancos: Catalogo[] = [];

  /**
     * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
     * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
     */
  public nuevaNotificacion: Notificacion | null = null;

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
    * Identificador del procedimiento.
    * @property {number} idProcedimiento
    */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Listado de pasos definidos para el wizard, incluyendo información y componentes asociados.
   */
  public pasos: ListaPasosWizard[] = PASOS;

  /**
  * Evento que emite los datos actualizados del formulario hacia el componente padre.
  * @event updateDatosDelTramiteFormulario
  */
  @Output() updateDatosDelTramiteFormulario =
    new EventEmitter<DatosDelTramiteFormState>();

  /**
   * Índice del paso actual en el wizard.
   */
  public indice: number = 1;

  /**
   * Referencia al componente `WizardComponent`, utilizada para invocar métodos de navegación interna como `siguiente()` y `atras()`.
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * Configuración de la barra de navegación del wizard:
   * número de pasos, índice actual y textos de los botones.
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
 * Constructor del componente.
 * Inyecta los servicios necesarios para consultar,
 * actualizar el estado del trámite y obtener los datos de la solicitud.
 */
  constructor(private tramiteQuery: Tramite240311Query,
    private datosSolicitudService: DatosSolicitudService,
    private tramiteStore: Tramite240311Store) { }

  /**
   * Permite cambiar el paso actual de forma manual al hacer clic en las pestañas (tabs) del wizard.
   * Recibe el índice del paso seleccionado y lo asigna a la propiedad `indice`.
   * @param i índice del paso seleccionado
   */
  public seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
 * Inicializa el componente y se suscribe al índice
 * de la pestaña seleccionada para mantener actualizado el subíndice.
 */
  ngOnInit(): void {
    this.tramiteQuery.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(i => {
        this.subIndice = i ?? 1;
      });
  }

  /**
 * @method cargarBancos
 * @description Obtiene la lista de bancos desde el servicio `DatosSolicitudService`
 * y la asigna a la propiedad `bancoDatossagar`.
 */
  cargarBancos(): void {
    this.datosSolicitudService
      .obtenerBancos(this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.bancos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * Actualiza el índice de la subpestaña seleccionada.
   *
   * @param i Índice de la subpestaña.
   */
  public updateIndice(i: number): void {
    this.subIndice = i;
  }

  /**
   * Controla la navegación del wizard en función de la acción recibida (`cont` o `atras`).
   * Actualiza el paso actual y el título mostrado, y llama a los métodos de navegación del `WizardComponent`.
   * @param e Objeto que contiene el índice del paso y la acción a realizar.
   */
  async getValorIndice(e: AccionBoton): Promise<void> {
    if (e.accion === 'cont') {
      if (this.subIndice === 4) {
        this.cargarBancos();
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
        const payload = this.buildFinalPayload(
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
    const banco = this.bancos.find(
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
    const banco = this.bancos.find(
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
            cve_entidad_federativa: "DGO",
            cve_unidad_administrativa: "1016"
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
          umc: item.cve_umc ?? null,
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
      denominacion_razon_social: item.nombreRazonSocial ?? null,
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
      denominacion_razon_social: item.nombreRazonSocial ?? null,
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

  /**
   * Método estático que determina el título a mostrar de acuerdo al índice del paso actual.
   * Devuelve el título correspondiente según el valor recibido.
   * @param valor Índice del paso.
   * @returns Título correspondiente al paso.
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
}