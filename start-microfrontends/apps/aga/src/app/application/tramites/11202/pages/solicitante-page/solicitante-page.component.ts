import { Component, ViewChild, EventEmitter } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard,Notificacion } from '@ng-mf/data-access-user';
import { PASOS } from '../../constantes/retorno-contenedores.enum';
import { WizardComponent, Usuario } from '@ng-mf/data-access-user';
import { MSG_REGISTRO_EXITOSO, USUARIO_INFO } from '../../enum/enum-11202';
import { Solicitud11202State,Solicitud11202Store } from '../../estados/solicitud11202.store';
import { Solicitud11202Query } from '../../estados/solicitud11202.query';
import { Subject, map, takeUntil ,tap } from 'rxjs';


interface AccionBoton {
  accion: string;
  valor: number;
}
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent {
  /**
   * Lista de pasos del wizard.
   * 
   * Esta propiedad contiene un array de objetos `ListaPasosWizard` que representan los pasos del wizard.
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /** Información del usuario utilizada en el componente. */
  datosUsuario: Usuario = USUARIO_INFO;

    /**
   * @property {Subject<void>} destroyNotifier$
   * Emits a signal to clean up subscriptions when the component is destroyed.
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
* Indica si el botón para cargar archivos está habilitado.
*/
  activarBotonCargaArchivos: boolean = false;

   /**
 * Representa el identificador único para la solicitud.
 * Esta propiedad se utiliza para almacenar y gestionar el número de solicitud
 * asociado con el proceso zoosanitario actual.
 */
  numeroSolicitud: number | null = null


  /**
* Indica si la sección de carga de documentos está activa.
* Se inicializa en true para mostrar la sección de carga de documentos al inicio.
*/
  seccionCargarDocumentos: boolean = true;

  /**
   * Índice del paso actual en el wizard.
   * 
   * Esta propiedad indica el índice del paso actual en el wizard, comenzando desde 1.
   */
  indice: number = 1;

  /**
   * Objeto que contiene el estado de la solicitud del trámite.
   * Este objeto es utilizado para gestionar el estado del trámite en la aplicación.
   */
  public solicitudState!: Solicitud11202State;


  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;


  /**
  * Evento que se emite para cargar archivos.
  * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
  */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
 * Método para manejar el evento de carga de documentos.
 * Actualiza el estado de la sección de carga de documentos.
 *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
 * {void} No retorna ningún valor.
 */
cargaRealizada(cargaRealizada: boolean): void {
  this.seccionCargarDocumentos = cargaRealizada ? false : true;
}

constructor(private tramite11202Query: Solicitud11202Query) {}

ngOnInit(): void {
  this.tramite11202Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
}

  /**
   * Referencia al componente del wizard.
   * 
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente `WizardComponent`.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

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

  /**
  * Método para seleccionar una pestaña específica en el wizard.
  * 
  * @param {number} i - El índice de la pestaña a seleccionar.
  */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

/**
* Método para manejar el evento de carga de documentos.
* Actualiza el estado del botón de carga de archivos.
*  carga - Indica si la carga de documentos está activa o no.
* {void} No retorna ningún valor.
*/
 manejaEventoCargaDocumentos(carga: boolean): void {
    this.seccionCargarDocumentos = carga ? true : false;
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método para obtener el valor del índice y actualizar el wizard.
   * 
   * @param {AccionBoton} e - El objeto que contiene la acción y el valor del índice.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 6) {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Método para continuar al siguiente paso en el wizard.
   */
  continuar(): void {
    this.getValorIndice({ accion: 'cont', valor: this.indice + 1 });
     this.alertaNotificacion = {
                tipoNotificacion: 'banner',
                categoria: 'success',
                modo: 'action',
                titulo: '',
                mensaje: MSG_REGISTRO_EXITOSO(String(this.solicitudState.idSolicitud)),
                cerrar: true,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
  }

  /**
 * Método para navegar a la sección anterior del wizard.
 * Actualiza el índice y el estado de los pasos.
 * {void} No retorna ningún valor.
 */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

}
