import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DatosPasos, Notificacion, SECCIONES_TRAMITE_303, SeccionLibQuery, SeccionLibState, SeccionLibStore } from '@ng-mf/data-access-user';
import { DespachoMercanciasSolicitudComponent } from '../../components/despacho-mercancias-solicitud/despacho-mercancias-solicitud.component';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../../../303/pages/paso-uno/paso-uno.component';
import { WizardComponent } from '@ng-mf/data-access-user';

interface AccionBoton {
  /**
   * Nombre o identificador de la acción del botón.
   */
  accion: string;
  /**
   * Valor numérico relacionado con la acción del botón.
   */
  valor: number;
}
@Component({
  templateUrl: './registro-page.component.html',
  styles: '',
})
export class RegistroPageComponent implements OnInit {
  /** Lista de pasos para el componente wizard */
  pasos: ListaPasosWizard[] = PASOS;
  /** Indice del paso actual */
  indice: number = 1;
  /** Estado de la sección actual */
  public seccion!: SeccionLibState;
  /** Evento para cargar archivos */
  @Output() cargarArchivosEvento = new EventEmitter<void>();
  /** Evento para regresar a la sección de cargar documentos */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
  /** Indica si el botón de carga de archivos está activado */
  activarBotonCargaArchivos: boolean = false;
  /** Indica si la sección de cargar documentos está activa */
  seccionCargarDocumentos: boolean = true;
  /** Referencia al componente wizard */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /** Notificación para mostrar mensajes al usuario. */
  public nuevaNotificacion!: Notificacion;
  /** Datos de los pasos del wizard */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /** Referencia al componente hijo PasoUnoComponent */
  @ViewChild(PasoUnoComponent) SolicitudPasoComponent!: PasoUnoComponent;

  constructor(
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
  ) {
    // You can add initialization logic here if needed
  }

  ngOnInit(): void {
    // Example usage of 'this' to avoid empty lifecycle method error
    this.indice = 1;
    this.asignarSecciones()
  }

  /**
     * Método para asignar las secciones existentes al stored
     */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    for (const LLAVE_SECCION in SECCIONES_TRAMITE_303.PASO_1) {
      if (
        Object.prototype.hasOwnProperty.call(
          SECCIONES_TRAMITE_303.PASO_1,
          LLAVE_SECCION
        )
      ) {
        // @ts-expect-error - fix this
        SECCIONES.push(SECCIONES_TRAMITE_303.PASO_1[LLAVE_SECCION]);
        FORMA_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }

  /**
   * Selecciona una pestaña en el wizard
   * @param i Indice de la pestaña a seleccionar
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice del paso actual
   * @param e Evento de acción del botón
   */
  getValorIndice(e: AccionBoton): void {
    const VALIDAR_TRAMITE = this.SolicitudPasoComponent.validarFormularioPadre();
    if (!VALIDAR_TRAMITE) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Por favor complete todos los campos requeridos.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (e.valor > 0 && e.valor < 3) {
      this.indice = e.valor;
      this.wizardComponent.indiceActual = this.indice;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Maneja el evento de clic en el botón de carga de archivos
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Maneja el evento de clic en el botón de regresar a la sección de cargar documentos
   */
  anteriorSeccionCargarDocumento(): void {
    this.regresarSeccionCargarDocumentoEvento.emit();
  }

  /**
   * Maneja el evento de carga de documentos
   * @param carga Indica si se debe activar el botón de carga de archivos
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Maneja el evento de carga de documentos
   * @param cargaRealizada Indica si la carga de documentos se realizó con éxito
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }
}
