import { Component, ViewChild,} from '@angular/core';
import { ALERTA_COM } from '@libs/shared/data-access-user/src/tramites/constantes/110208/certificado.enum';
import{AccionBoton} from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { PASOS} from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { ZoosanitarioService } from '../../service/zoosanitario.service';

@Component({
  selector: 'app-zoosanitario-para-importacion', 
  templateUrl: './zoosanitario-para-importacion.component.html',
 
})

export class ZoosanitarioParaImportacionComponent{
    /**
   * @property {ListaPasosWizard[]} pantallasPasos - Array para almacenar los pasos del wizard.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS;
/**
 * Constante que asigna el texto de alerta definido en `ALERTA_COM`.
 */
  TEXTOS= ALERTA_COM;

  /**
   * @property {number} indice - El índice actual del paso.
   */
   indice: number = 1;
   /**
 * Referencia al componente hijo `WizardComponent`, 
 * utilizada para controlar el asistente desde este componente padre.
 */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
 /**
 * Objeto que contiene los datos de configuración de los pasos del asistente.
 * - `nroPasos`: número total de pasos, basado en la longitud del arreglo `pantallasPasos`.
 * - `indice`: índice actual del paso (inicializado desde `this.indice`).
 * - `txtBtnAnt`: texto para el botón "Anterior".
 * - `txtBtnSig`: texto para el botón "Continuar".
 */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
 * Constructor del componente. Inyecta el servicio `ZoosanitarioService`
 * para manejar la lógica relacionada con trámites zoosanitarios.
 *
 * @param zoosanitarioService Instancia del servicio `ZoosanitarioService`.
 */
  constructor(private zoosanitarioService: ZoosanitarioService) { }
/**
 * Procesa la acción del botón del wizard y navega al paso correspondiente.
 *
 * @param e Objeto `AccionBoton` con `valor` (paso destino) y `accion` ('cont' o 'prev').
 */
  getValorIndice(e: AccionBoton): void {
   
    this.zoosanitarioService.getPayload().subscribe()
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
}