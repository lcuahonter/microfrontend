import { AlertComponent, BtnContinuarComponent, DatosPasos } from '@ng-mf/data-access-user';
import { Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { CargarDocumentoService, UploadDocumentResponse, Usuario } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { EntregaActaService } from '../../services/entrega-acta.service';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import {
  ALERT_TEXTO,
  ALERTA_FIRMA,
  ALERTA_PASO_UNO,
  MSG_REGISTRO_EXITOSO,
  PASOS,
  WARN_CARGA_DOCUMENTOS,
} from '../../constants/avios-procesos.enum';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { Tramite32507Query } from '../../../../estados/queries/tramite32507.query';
import { Tramite32507State } from '../../../../estados/tramites/tramite32507.store';
import { Tramite32507Store } from '../../../../estados/tramites/tramite32507.store';
import { WizardComponent } from '@ng-mf/data-access-user';
import { catchError, EMPTY, switchMap, take } from 'rxjs';
import {
  GuardarSolicitudRequest, MercanciaSTDTO,
  RepresentacionFederalRequest,
  SolicitanteRequest,
} from '../../models/aviso-traslado.model';
import { DocumentosQuery } from '@ng-mf/data-access-user';

interface AccionBoton {
  accion: string;
  valor: number;
}
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    BtnContinuarComponent,
    PasoDosComponent,
    PasoTresComponent,
    NotificacionesComponent,
    AvisoComponent,
    AlertComponent,
  ],
})
export class SolicitantePageComponent implements OnDestroy {
  /**
   * Lista de pasos del wizard.
   *
   * Esta propiedad contiene un array de objetos `ListaPasosWizard` que representan los pasos del wizard.
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * Índice del paso actual en el wizard.
   *
   * Esta propiedad indica el índice del paso actual en el wizard, comenzando desde 1.
   */
  indice: number = 1;

  /**
   * Referencia al componente del wizard.
   *
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente `WizardComponent`.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente PasoUnoComponent para acceder a sus métodos y al componente aviso.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Referencia al componente PasoDosComponent para acceder a sus métodos de carga de documentos.
   */
  @ViewChild(PasoDosComponent) pasoDosComponent!: PasoDosComponent;

  /**
   * Datos de los pasos del wizard.
   *
   * Esta propiedad contiene un objeto `DatosPasos` que almacena información sobre el número de pasos,
   * el índice actual, y los textos de los botones "Anterior" y "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Indica si el botón Guardar debe mostrarse o estar habilitado en el formulario. */
  public btnGuardar: boolean = true;

  /** Indica la visibilidad del botón Guardar. */
  public btnGuardarVisible: string = 'visible';

  public nuevaNotificacion!: Notificacion;

  /** Indica si la sección de carga de documentos está activa */
  seccionCargarDocumentos: boolean = true;

  /** Indica si el botón de carga de archivos está habilitado */
  activarBotonCargaArchivos: boolean = false;

  /** Indica si hay una carga de documentos en progreso */
  cargaEnProgreso: boolean = false;

  /** Indica si hay documentos opcionales seleccionados */
  hayDocumentosOpcionales: boolean = false;

  /** Texto de alerta para paso uno.
   * @type {string}
   */
  TEXTO_PASO_UNO: string = ALERTA_PASO_UNO;

  /**
   * @description Texto que se muestra en la alerta del formulario.
   * Este texto es utilizado para proporcionar información al usuario sobre el propósito del formulario.
   * @type {string}
   */
  protected readonly alertText = ALERT_TEXTO;

  /**
   * ID de la solicitud guardada.
   * Se obtiene del store después de guardar exitosamente.
   */
  idSolicitud: string = '';

  /**
   * @description mensaje de registro de solicitud exitoso.
   * @type {string}
   * @protected
   */
  protected readonly MSG_REGISTRO_EXITOSO = MSG_REGISTRO_EXITOSO;

  /**
   * @description mensaje de advertencia para la carga de documentos
   * @type {string}
   * @protected
   */
  protected readonly WARN_CARGA_DOCUMENTOS = WARN_CARGA_DOCUMENTOS;

  /**
   * @description mensaje de alerta antes de la firma de la solicitud.
   * @type {string}
   * @protected
   */
  protected readonly ALERTA_FIRMA = ALERTA_FIRMA;

  /**
   * Controla la visibilidad del alert de firma.
   * Se oculta cuando el acuse es visible.
   */
  mostrarAlertaFirma: boolean = true;

  constructor(
    private tramiteQuery: Tramite32507Query,
    private entregaActaService: EntregaActaService,
    public store: Tramite32507Store
  ) {}

  /**
   * Método para seleccionar una pestaña específica en el wizard.
   *
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Método para obtener el valor del índice y actualizar el wizard.
   *
   * @param {AccionBoton} e - El objeto que contiene la acción y el valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 6) {
      if (e.accion === 'cont') {
        this.indice = e.valor;
        this.datosPasos.indice = this.indice;
        this.wizardComponent.siguiente();
      } else {
        // Para la acción 'anterior', restar 1 al índice
        this.indice = e.valor - 1;
        this.datosPasos.indice = this.indice;
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Método para continuar al siguiente paso en el wizard.
   */
  continuar(): void {
    this.getValorIndice({ accion: 'cont', valor: this.indice + 1 });
  }

  getBtnGuardarAction(e: AccionBoton): void {
    switch (this.indice) {
      case 1:
        // Validar formulario de aviso antes de guardar
        if (!this.validarAvisoFormulario()) {
          return; // No continuar si hay errores
        }
        this.guardarSolicitud()
        break
      case 3:
        console.log('[SolicitantePage] Paso 3: Firma electrónica (manejada en paso-tres)');
        break
      default:
        console.log("accion sin implementar, indice: ", this.indice)
        break
    }
  }

  /**
   * Valida el formulario de aviso antes de continuar.
   *
   * Si el componente aviso no está disponible (usuario no ha visitado la pestaña),
   * activa programáticamente la pestaña de Aviso para que el usuario complete los campos.
   *
   * @returns {boolean} true si es válido, false en caso contrario
   */
  private validarAvisoFormulario(): boolean {
    // Obtener referencia al componente aviso a través de paso-uno
    const avisoComponent = this.pasoUnoComponent?.obtenerComponenteAviso();

    // Si no hay referencia al componente aviso, significa que el usuario
    // no ha visitado la pestaña de Aviso (paso-uno.indice=1)
    if (!avisoComponent) {
      // Activar pestaña de Aviso en paso-uno
      if (this.pasoUnoComponent) {
        this.pasoUnoComponent.activarPestañaAviso();
      }

      // Mostrar notificación al usuario
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: 'warning',
        modo: '',
        titulo: 'Formulario incompleto',
        mensaje: 'Por favor complete el formulario de Aviso antes de continuar',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };

      return false; // ✅ NO permitir guardar
    }

    // Validar formulario
    const esValido = avisoComponent.validarFormularioCompleto();

    if (!esValido) {
      // Marcar todos los campos como touched para mostrar errores
      avisoComponent.marcarFormularioComoTouched();

      // Obtener mensajes de error específicos
      const errores = avisoComponent.obtenerMensajesError();

      // Mostrar notificación con errores
      const mensajeError = errores.join('\n- ');
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: 'error',
        modo: '',
        titulo: 'Formulario incompleto',
        mensaje: `Por favor complete los siguientes campos:\n- ${mensajeError}`,
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };

      console.error('Validación de formulario falló:', errores);
      return false;
    }

    return true;
  }

  guardarSolicitud(): void {
    this.tramiteQuery.selectSolicitud$.pipe(take(1)).subscribe({
      next: (tramiteState: Tramite32507State) => {
        const SOLICITANTE: SolicitanteRequest = {
          rfc: tramiteState.datosSolicitante.rfc,
          nombre: tramiteState.datosSolicitante.denominacion,
          es_persona_moral: tramiteState.datosSolicitante.tipoPersona === 'M',
        };

        const REP: RepresentacionFederalRequest = {
          cve_entidad_federativa: tramiteState.datosSolicitante.cveEntidadFederativa,
          cve_unidad_administrativa: tramiteState.avisoFormulario.cveUnidadAdministrativa,
        };

        const MERCANCIAS: MercanciaSTDTO[] = [];

        for (const DATO of tramiteState.tablaDeDatos) {
          const MERCA: MercanciaSTDTO = {
            numero_serie: DATO.idTransaccionVUCEM,
            cantidad: Number(DATO.cantidad),
            peso: Number(DATO.pesoKg),
            cve_unidad_medida: DATO.cveUnidadMedida,
            desc_unidad_medida: DATO.descripcionUnidadMedida,
            descripcion_mercancia: DATO.descripcion,
            activo_id_transaccion: DATO.siIdTransaccion,
          };
          MERCANCIAS.push(MERCA);
        }

        const DATOS_GUARDAR: GuardarSolicitudRequest = {
          solicitante: SOLICITANTE,
          representacion_federal: REP,
          num_immex: tramiteState.avisoFormulario.valorProgramaImmex,
          anio_immex: tramiteState.avisoFormulario.valorAnioProgramaImmex,
          adace_solicitante: tramiteState.avisoFormulario.levantaActa,
          acudio_adace: tramiteState.avisoFormulario.tipoBusqueda === 'Si',
          lista_mercancias_entrada: MERCANCIAS,
        };

        // Llamar al servicio para guardar
        this.entregaActaService
          .guardarSolicitud(DATOS_GUARDAR)
          .pipe(take(1))
          .subscribe({
            next: (respuesta) => {
              if (respuesta.codigo === '00') {
                const ID_SOLICITUD = String(respuesta.datos?.id_solicitud);
                this.store.setAvisoFormularioIdSolicitud(ID_SOLICITUD);
                this.idSolicitud = ID_SOLICITUD;
                this.continuar();
              } else {
                console.error('Error al guardar la solicitud: ', respuesta.codigo, respuesta.error);
              }
            },
            error: (error) => {
              console.error('Error al guardar solicitud:', error);
            },
          });
      },
      error: (error) => {
        console.error('Error al obtener el estado:', error);
      },
    });
  }

  /**
   * Maneja el evento cuando se completa la carga de documentos.
   * @param cargaRealizada Indica si la carga fue exitosa
   */
  onCargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
    if (cargaRealizada) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: 'success',
        modo: '',
        titulo: 'Carga exitosa',
        mensaje: 'Los documentos se cargaron correctamente',
        cerrar: false,
        txtBtnAceptar: '',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Maneja el evento de habilitación del botón de carga de archivos.
   * @param activar Indica si se debe activar el botón
   */
  onActivarBotonCargaArchivos(activar: boolean): void {
    this.activarBotonCargaArchivos = activar;
  }

  /**
   * Maneja el evento de carga en progreso.
   * @param enProgreso Indica si la carga está en progreso
   */
  onCargaEnProgreso(enProgreso: boolean): void {
    this.cargaEnProgreso = enProgreso;
  }

  /**
   * Maneja el evento cuando cambia el estado de documentos opcionales seleccionados.
   * @param hayDocumentos Indica si hay documentos opcionales seleccionados
   */
  onHayDocumentosOpcionales(hayDocumentos: boolean): void {
    this.hayDocumentosOpcionales = hayDocumentos;
  }

  /**
   * Dispara el evento de carga de archivos desde el componente paso-dos.
   */
  onClickCargaArchivos(): void {
    if (this.pasoDosComponent) {
      this.pasoDosComponent.dispararCargaArchivos();
    }
  }

  /**
   * Avanza al siguiente paso del wizard.
   */
  siguiente(): void {
    this.continuar();
  }

  /**
   * Maneja el evento cuando el acuse se hace visible en paso-tres.
   * Oculta el alert de firma cuando el acuse es mostrado.
   * @param esAcuse Indica si el acuse está visible
   */
  onEsAcuseChange(esAcuse: boolean): void {
    this.mostrarAlertaFirma = !esAcuse;
  }

  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Resetea el store del trámite para limpiar el estado cuando el usuario sale del flujo.
   */
  ngOnDestroy(): void {
    this.store.reset();
  }
}
