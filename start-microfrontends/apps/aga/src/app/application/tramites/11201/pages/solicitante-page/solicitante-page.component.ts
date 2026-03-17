import { Component, ViewChild } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard ,Notificacion} from '@ng-mf/data-access-user';
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/11201/pasos.enums';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { Tramite11201Store } from '../../estados/tramites/tramite11201.store';
import { MSG_REGISTRO_EXITOSO } from '../../enum/solicitante.enum';


/**
 * Interfaz que define las propiedades para las acciones de los botones del wizard.
 * 
 * @interface AccionBoton
 */
interface AccionBoton {
  /**
   * Tipo de acción a realizar (ej: 'cont' para continuar, 'ant' para anterior).
   * 
   * @type {string}
   */
  accion: string;


  /**
   * Valor numérico que indica el índice del paso al cual navegar.
   * 
   * @type {number}
   */
  valor: number;
}

/**
 * Componente principal para la gestión de solicitudes con navegación por pasos.
 * 
 * Este componente actúa como contenedor principal para un wizard de múltiples pasos,
 * proporcionando navegación entre diferentes secciones del formulario de solicitud
 * y gestionando el estado general del proceso.
 * 
 * @component
 */
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
 * Representa el identificador único para la solicitud.
 * Esta propiedad se utiliza para almacenar y gestionar el número de solicitud
 * asociado con el proceso zoosanitario actual.
 */
  numeroSolicitud: number | null = null


    /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;


  /**
* @param Tramite11201Store Store that handles state management for Trámite 11201
*/
  constructor(private Tramite11201Store: Tramite11201Store) { }

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
    this.numeroSolicitud = this.Tramite11201Store.getIdSolicitud();
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
   * Método para continuar al siguiente paso en el wizard.
   */
  continuar(): void {
    this.getValorIndice({ accion: 'cont', valor: this.indice + 1 });

     this.alertaNotificacion = {
                tipoNotificacion: 'banner',
                categoria: 'success',
                modo: 'action',
                titulo: '',
                mensaje: MSG_REGISTRO_EXITOSO(this.numeroSolicitud?.toString() ?? ''),
                cerrar: true,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
  }

  /**
   * Cancela la operación actual del formulario de solicitud.
   *
   * Si el formulario de solicitud (`solicitudForm`) existe en el componente contenedor,
   * restablece todos sus campos a los valores iniciales. Luego, establece el índice
   * de la página o paso actual a 1, lo que puede implicar regresar al primer paso
   * del proceso o formulario.
   */
  cancelar(): void {
    this.indice = 1;
  }
}
