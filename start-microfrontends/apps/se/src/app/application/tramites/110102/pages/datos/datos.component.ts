import { AVISO, FIRMAR_SOLICITUD } from '@libs/shared/data-access-user/src/core/enums/constantes-alertas.enum';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CategoriaMensaje, DatosPasos, ListaPasosWizard, LoginQuery, Notificacion, WizardComponent } from '@libs/shared/data-access-user/src';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { ComercializadoresProductosResponse } from '../../models/response/comercializadores-productos-response.model';
import { DatosMercanciaComponent } from '../datos-mercancia/datos-mercancia.component';
import { PASOS } from '../../constants/exportador-autorizado.enum';
import { SolicitudService } from '../../service/solicitud.service';
import { ValidarRequest } from '../../models/request/validar-solicitud-request.model';

import { Subject, map, takeUntil } from 'rxjs';
import { ERROR_FORMA_ALERT } from '../../constants/constante110102.enums';
import { MercanciaStateService } from '../../service/mercancia-state.service';

import { EmpaqueMercancia, InsumoMercancia, SolicitudCompletaRequest } from '../../models/request/guardado-solicitud-request.model';
import { Tramite110102State, Tramite110102Store } from '../../estados/store/tramite110102.store';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';


/**
 * Interface representing an action button.
 */
export interface AccionBoton {
  /**
   * The action to be performed by the button.
   */
  accion: string;

  /**
   * The value associated with the action.
   */
  valor: number;
}
/**
 * Componente DatosComponent.
 *
 * Este componente gestiona la selección de pestañas (tabs) y muestra contenido diferente
 * basado en el índice de la pestaña seleccionada.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  standalone: false, // Indica que este componente no es un componente independiente (standalone).
})
export class DatosComponent implements OnInit, OnDestroy{

  /**
    * Reference to the WizardComponent.
    */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
   * Lista de pasos para el asistente (wizard) de asignación directa.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice actual del paso en el asistente.
   */
  indice: number = 1;

  /**
   * Texto del aviso de privacidad simplificado.
   */
  TEXTOS = AVISO.Alerta;

  /**
   * Clase CSS para mostrar una alerta de información.
   */
  public infoAlert = 'alert-info';

  /**
   * @property pasoTabsInternos - Referencia al componente `DatosMercanciaComponent` que representa
   *                              las pestañas internas del paso uno del trámite.
   *                              Permite acceder a sus métodos de validación y control de formularios.
   * @command El decorador `@ViewChild` se utiliza para interactuar con el componente hijo desde este componente padre.
   */
    @ViewChild('pasosTabInternos') pasoTabsInternos!: DatosMercanciaComponent;

  /**
   * Respuesta del registro de productos del comercializador.
   */
  public respuestaRegistroProductos: ComercializadoresProductosResponse = {} as ComercializadoresProductosResponse;

  /**
   * Indica si se debe mostrar un mensaje en la interfaz de usuario de servicio validar.
   * 
   * Cuando es `true`, el mensaje se muestra; cuando es `false`, el mensaje permanece oculto.
  */
  mostrarMensajeServicio: boolean = false;

  /**
 * Datos de error en validacion
*/
  mensajeErrores: string[] = [];

  /**
   * Indica si el formulario actual es válido o no.
   *
   * @property esFormaValido
   * @type {boolean}
   * @default false
  */
  esFormaValido: boolean = false;

  /**
   * Clase CSS para aplicar estilos específicos a los elementos de la interfaz.
   */
  class: string = 'alert-danger';

  /**
 * Mensaje estándar mostrado cuando existen campos obligatorios sin completar.
 * @constant
 * @readonly
 * @type {string}
 */
  private readonly MENSAJE_FALTAN_CAMPOS = 'Faltan campos por capturar.';

  /**
   * Título del mensaje principal.
   * @property {string | null} tituloMensaje - Título que se muestra en la parte superior del formulario.
   */
 tituloMensaje: string | null = this.MENSAJE_FALTAN_CAMPOS;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
    public formErrorAlert = ERROR_FORMA_ALERT;

  /**
 * The data for the steps in the wizard.
 */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * **Subject para manejar la destrucción del componente**
   * 
   * Este `Subject` se utiliza para cancelar suscripciones y evitar 
   * fugas de memoria cuando el componente es destruido.
   * Se usa comúnmente en el operador `takeUntil` dentro de los observables.
  */
  private destroy$ = new Subject<void>();

  /**
   * Notificación actual que se muestra en el componente.
    *
    * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
    * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion;

  /*Valor del RFC obtenido del estado de login.*/
  public rfcValor: string = '';

  /**
   * Mensaje para firmar la solicitud con el número de solicitud.
   */
  mensajeFirmarSolicitud: string = '';

  /**
   * Indica si se debe mostrar un mensaje en la interfaz de usuario.
   * 
   * Cuando es `true`, el mensaje se muestra; cuando es `false`, el mensaje permanece oculto.
  */
  mostrarMensaje: boolean = false;

    /**
      * Estado actual del trámite.
    */
    estadoTramite!: Tramite110102State;

  constructor(
    private solicitudService: SolicitudService,
    private mercanciaState: MercanciaStateService,
    private tramiteStore: Tramite110102Store,
    private consultaTramite: Tramite110102Query,
    private loginQuery: LoginQuery
  ) {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.mercanciaState.mercancia$
      .subscribe(data => {
        if (data) {
          this.respuestaRegistroProductos = data;
        }
      });

       this.consultaTramite.selectTramite110102$
      .pipe(takeUntil(this.destroy$))
      .subscribe((estado) => {
        this.estadoTramite = estado;
      });
  }

  /**
   * Updates the index value based on the action button event.
   * @param e The action button event containing the action and value.
   */
  public getValorIndice(e: AccionBoton): void {
   this.esFormaValido = false;
  if (this.indice === 1 && e.accion === 'cont') {
      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (ISVALID === undefined) {
        return;
      }
      if (!ISVALID) {
        this.esFormaValido = true;
        return; 
      }
      this.validarSolicitudCompleta(() => {
        this.guardarSolicitudCompleta(() => {
          this.indice++;
          this.datosPasos.indice = this.indice;
          this.wizardComponent.siguiente();
        });
      });
    }
   
  }

  /**
   * Retrocede al paso anterior del asistente (wizard) cuando el usuario
   * presiona el botón de acción correspondiente.
   * 
   * @param e El evento del botón que indica la acción realizada.
   */
  public getPasoDosRegreso(e: AccionBoton): void{
    if (e.accion === 'ant') {
      this.indice--;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }

    /**
   * Valida todos los formularios del primer paso antes de permitir continuar al siguiente paso.
   */
  private validarTodosFormulariosPasoUno(): boolean | undefined {
    if (!this.pasoTabsInternos) {
    return undefined;
   }
    this.pasoTabsInternos.validarFormularios()
     const ISFORM_VALID_TOUCHED = this.pasoTabsInternos.validarFormularios();

  // Si devuelve undefined desde dentro, se respeta
  if (ISFORM_VALID_TOUCHED === undefined) {
    return undefined;
  }

  // Si devuelve false o true, se regresa tal cual
  return ISFORM_VALID_TOUCHED;
  }

  /**
  * @method validarSolicitudCompleta
  * @description
  * Envía una solicitud al servicio para validar si la solicitud está completa.
  */
  validarSolicitudCompleta(onSuccessCallBack?: () => void): void {
    const TRATADOS: string[] = this.respuestaRegistroProductos.criterios_tratado
      ?.map(c => c.tratado_acuerdo?.cve_tratado_acuerdo)
      .filter((cve): cve is string => cve !== null && cve !== undefined)
      ?? [];
    const PAYLOAD: ValidarRequest = {
      rfc: this.rfcValor,
      id_solicitud: this.estadoTramite.id_solcitud,
      id_solicitud_productor: this.respuestaRegistroProductos.id_solicitud_productor,
      clave_entidad: this.estadoTramite.claveEntidadFederativa,
      clave_entidad_solicitante: "DGO",
      clave_unidad_admin: this.estadoTramite.claveUnidadAdministrativa,
      tratados: TRATADOS,
      registro_cuestionario: {
        separacion_contable:this.estadoTramite.metodoSeparacion ?? this.respuestaRegistroProductos.registro_cuestionario.separacion_contable,
        solicita_exportador_autorizado: this.estadoTramite.exportadorAutorizado ?? this.respuestaRegistroProductos.registro_cuestionario.solicita_exportador_aut,
        ide_condicion_exportador_autorizado:this.estadoTramite.informacionRadios ?? this.respuestaRegistroProductos.registro_cuestionario.ide_condicion_exportador_aut,
        solicita_exportador_autorizado_jpn: this.estadoTramite.exportadorAutorizadoJPN ?? this.respuestaRegistroProductos.registro_cuestionario.solicita_exp_aut_jpn,
        ide_condicion_exportador_autorizado_jpn: this.estadoTramite.informacionRadiosJPN ?? this.respuestaRegistroProductos.registro_cuestionario.ide_condicion_exp_aut_jpn
      }
    }
    this.solicitudService.postValidarSolicitudCompleta(PAYLOAD)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {

            if (response.datos?.errores?.length && response.datos.errores.length > 0) {
              this.mostrarMensajeServicio = true;
              this.mensajeErrores = response.datos.errores;
              return;
            }
            if (onSuccessCallBack) {
              onSuccessCallBack();
            }

          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error para validar la solicitud.',
              mensaje: response.causa || response.mensaje || 'Error para validar la solicitud.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = error?.error?.error || 'Error para generar la cadena original.';
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
        }
      });
  }

  /**
   * @method guardarSolicitudCompleta
   * @description
   * Construye el payload completo de la solicitud a partir de los datos capturados en los formularios,
   * incluyendo la información general, representante legal, cuestionario, mercancía asociada,
   * criterios de tratados, declaraciones y procesos. 
   * 
   * Envía la solicitud al servicio correspondiente para su registro o actualización.
   * Maneja la respuesta del backend mostrando notificaciones al usuario en caso de éxito o error,
   * y actualiza el estado interno de la aplicación según corresponda.
   * 
   * @returns {void}
  */
  guardarSolicitudCompleta(onSuccessCallback?: () => void): void {
    const PAYLOAD: SolicitudCompletaRequest = {
      id_solicitud: this.estadoTramite.id_solcitud,
      id_tipo_tramite: null,
      rfc: this.rfcValor,
      rol_capturista: "PersonaFisica",
      cve_unidad_administrativa: this.estadoTramite.claveUnidadAdministrativa,
      costo_total: null,
      certificado_serial_number: null,
      numero_folio_tramite_original: null,
      representante_legal: {
        nombre: "Juan",
        ap_paterno: "Pérez",
        ap_materno: "García",
        telefono: "5551234567",
      },
      registro_cuestionario_sol: {
        id_solicitud: this.estadoTramite.id_solcitud,
        ide_tipo_exportador: this.respuestaRegistroProductos.registro_cuestionario.ide_tipo_exportador,
        solicita_exportador_aut:this.estadoTramite.exportadorAutorizado ?? this.respuestaRegistroProductos.registro_cuestionario.solicita_exportador_aut,
        solicita_exportador_aut_jpn:  this.estadoTramite.exportadorAutorizadoJPN ?? this.respuestaRegistroProductos.registro_cuestionario.solicita_exp_aut_jpn,
        ide_condicion_exportador_aut_jpn: this.estadoTramite.informacionRadiosJPN ?? this.respuestaRegistroProductos.registro_cuestionario.ide_condicion_exp_aut_jpn,
        separacion_contable: this.estadoTramite.metodoSeparacion ?? this.respuestaRegistroProductos.registro_cuestionario.separacion_contable,
        ide_condicion_exportador_aut: this.estadoTramite.informacionRadios ?? this.respuestaRegistroProductos.registro_cuestionario.ide_condicion_exportador_aut,
        mercancia_asociada: {
          id_solicitud: this.estadoTramite.id_solcitud,
          id_descripcion_alterna_ue: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.id_descripcion_alterna_ue,
          id_descripcion_alterna_aelc: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.id_descripcion_alterna_aelc,
          id_descripcion_alterna_sgp: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.id_descripcion_alterna_sgp,
          id_descripcion_alterna_ace: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.id_descripcion_alterna_ace,
          nombre_comercial: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.nombre_comercial,
          nombre_ingles: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.nombre_ingles,
          fraccion_arancelaria: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.cve_fraccion,
          precio_franco_fabrica: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.precio_franco_fabrica,
          valor_transaccional: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.valor_transaccion,
          costo_neto: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.costo_neto,
          valor_transaccional_fob: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.valor_transaccion_fob,
          costo_neto_ap: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.costo_neto_ap,
          unidad_medida_comercial: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.unidad_medida_comercial,
          unidad_medida_tarifaria: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.unidad_medida_tarifaria,
          peso_acumulado_textil: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.peso_acumulado_mercancia,
          peso_insumos_no_originarios: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.peso_acumulado,
          peso_es_requerido: null,
          volumen_es_requerido: null,
          acumulacion_uruguay: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.acumulacion_uruguay,
          materiales_fungibles_uruguay: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.materiales_fungibles_uruguay,
          materiales_intermedios_uruguay: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.materiales_intermedios_uruguay,
          criterio_origen_uruguay: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.clave_criterio_origen_uruguay,
          acumulacion_peru: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.acumulacion_peru,
          materiales_fungibles_peru: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.materiales_fungibles_peru,
          materiales_intermedios_peru: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.materiales_intermedios_peru,
          criterio_origen_peru: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.clave_criterio_origen_peru,

          acumulacion: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.acumulacion,
          materiales_fungibles: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.materiales_fungibles ? "S" : "N",
          materiales_intermedios: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.materiales_intermedios ? "S" : "N",
          acumulacion_ap: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.acumulacion_ap,
          requiere_juegos_o_surtidos: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.requiere_juegos_o_surtidos ? "S" : "N",

          insumos: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.insumos.map(item => ({
            id_solicitud: item.id_solicitud,
            nombre: item.nombre,
            desc_fabricante_productor: item.desc_fabricante_productor,
            desc_proveedor: item.desc_proveedor,
            cve_fraccion: item.cve_fraccion,
            importe_valor: item.imp_valor,
            ide_tipo_insumo: item.ide_tipo_insumo,
            peso: item.peso,
            volumen: item.volumen,
            cve_pais: item.cve_pais,
            cve_unidad_medida: null,
            rfc_fabricante_productor: item.rfc_fabricante_productor,
            descripcion: null,
            criterios_tratados: item.tratados_originarios.map(criterio => ({
              id_criterio_tratado: criterio.id_criterio_tratado,
              id_solicitud: null,
              cve_grupo_criterio: criterio.cve_grupo_criterio,
              id_bloque: criterio.id_bloque,
              id_tratado_acuerdo: criterio.id_tratado_acuerdo,
              cve_pais: criterio.cve_pais,
              cve_tratado_acuerdo: criterio.cve_tratado_acuerdo,
              cve_tratado_acuerdo_bloque: criterio.cve_tratado_acuerdo_bloque,
            })

            ),
          } as InsumoMercancia)
          ),
          empaques: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.empaques.map(item => ({
            id_solicitud: item.id_solicitud,
            nombre: item.nombre,
            desc_fabricante_productor: item.desc_fabricante_productor,
            desc_proveedor: item.desc_proveedor,
            cve_fraccion: item.cve_fraccion,
            importe_valor: item.imp_valor,
            ide_tipo_insumo: item.ide_tipo_insumo,
            peso: item.peso,
            volumen: item.volumen,
            cve_pais: item.cve_pais,
            cve_unidad_medida: null,
            rfc_fabricante_productor: item.rfc_fabricante_productor,
            descripcion: null,
            criterios_tratados: item.tratados_originarios.map(criterio => ({
              id_criterio_tratado: criterio.id_criterio_tratado,
              id_solicitud: null,
              cve_grupo_criterio: criterio.cve_grupo_criterio,
              id_bloque: criterio.id_bloque,
              id_tratado_acuerdo: criterio.id_tratado_acuerdo,
              cve_pais: criterio.cve_pais,
              cve_tratado_acuerdo: criterio.tratado_acuerdo,
              cve_tratado_acuerdo_bloque: criterio.cve_tratado_acuerdo_bloque,
            })
            ),
          } as EmpaqueMercancia)
          ),
          id_fraccion_naladi: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.fraccion_naladi?.id_fraccion_aladi,
          cve_fraccion_naladi: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.fraccion_naladi?.cve_fraccion,
          id_fraccion_naladisa93: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.fraccion_naladisa93?.id_fraccion_aladi,
          cve_fraccion_naladisa93: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.fraccion_naladisa93?.cve_fraccion,
          id_fraccion_naladisa96: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.fraccion_naladisa96?.id_fraccion_aladi,
          cve_fraccion_naladisa96: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.fraccion_naladisa96?.cve_fraccion,
          id_fraccion_naladisa02: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.fraccion_naladisa02?.id_fraccion_aladi,
          cve_fraccion_naladisa02: this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada.fraccion_naladisa02?.cve_fraccion,
        },
      },
      criterios_tratados: this.respuestaRegistroProductos.criterios_tratado.map(item => ({
        id_criterio_tratado: item.id_criterio_tratado,
        id_solicitud: this.estadoTramite.id_solcitud,
        cve_grupo_criterio: item.cve_grupo_criterio,
        id_bloque: item.id_bloque,
        id_tratado_acuerdo: item.id_tratado_acuerdo,
        cve_pais: item.cve_pais,
        cve_tratado_acuerdo: item.tratado_acuerdo.cve_tratado_acuerdo,
        cve_tratado_acuerdo_bloque: item.cve_tratado_acuerdo_bloque
      })),
      
      entidad_federativa: {
        id_solicitud: this.estadoTramite.id_solcitud,
        cve_entidad: this.estadoTramite.claveEntidadFederativa,
      },
      declaraciones_solicitud: this.estadoTramite.declaracion_solicitud.map(item => ({
          id_solicitud: this.estadoTramite.id_solcitud,
          cve_declaracion: item.clave,
          aceptado: this.estadoTramite.protestoDecirVerdad ? 1 : 0,
      })),
      procesos: this.respuestaRegistroProductos
      .registro_cuestionario
      .mercancia_asociada
      .procesos_solicitados === null
      ? null
      : this.respuestaRegistroProductos.registro_cuestionario.mercancia_asociada
          .procesos_solicitados.map(proceso => ({
            id_proceso_ceror: proceso.id_proceso_ceror
              ? proceso.id_proceso_ceror.toString()
              : null,
            aprobado: proceso.cumple_proceso,
          })),

      id_solicitud_productor: this.respuestaRegistroProductos.id_solicitud_productor,
    };

    this.solicitudService.postSolicitudGuardar(PAYLOAD)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.tramiteStore.setId_solicitud(response.datos ?? 0);
            const NUM_SOLICITUD = this.estadoTramite.id_solcitud;
            this.mensajeFirmarSolicitud = FIRMAR_SOLICITUD.MENSAJE.replace("{NUMERO}", String(NUM_SOLICITUD));
            this.mostrarMensaje = false;
            this.mostrarMensajeServicio = false;
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response?.error || 'Error.',
              mensaje: response?.causa || response?.mensaje || 'Error',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }

        }
      });      
  }
  /**
  * Cambia el título del mensaje según la pestaña seleccionada.
  * @method enTabChange
  * @param {number} selectedTab - El índice de la pestaña seleccionada.
  */
  enTabChange(selectedTab: number): void {
    switch (selectedTab) {
      case 1:
        this.tituloMensaje = this.MENSAJE_FALTAN_CAMPOS;
        break;
      case 2:
       this.tituloMensaje = this.MENSAJE_FALTAN_CAMPOS;
        break;
      default:
        this.tituloMensaje = this.MENSAJE_FALTAN_CAMPOS;
        break;
    }
  }

  /**
  * @method ngOnDestroy
  * @description Método que se ejecuta cuando el componente es destruido.
  * Implementa la limpieza necesaria para evitar fugas de memoria cancelando
  * todas las suscripciones activas mediante el subject destroyNotifier$.
  * Es una implementación estándar del patrón de limpieza en Angular que asegura
  * que todas las suscripciones del componente sean correctamente finalizadas
  * cuando el componente se destruye, liberando recursos del sistema.
  * @returns {void} No retorna ningún valor.
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tramiteStore.reset();
  }
}
