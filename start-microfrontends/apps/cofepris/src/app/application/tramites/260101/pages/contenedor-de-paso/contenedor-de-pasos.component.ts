/**
 * Componente utilizado en el trámite 260101 para gestionar la navegación entre los pasos de un wizard.
 *
 * Este archivo contiene la definición del componente `ContenedorDePasosComponent`, que permite avanzar o retroceder
 * entre los pasos del wizard y actualiza el título del paso actual. También interactúa con los componentes de cada paso
 * para gestionar su funcionalidad específica.
 */

import {
  AVISO_CONTRNIDO,
  AccionBoton,
  AlertComponent,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
} from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import {
  MENSAJE_DE_VALIDACION,
  PASOS,
  TITULOMENSAJE,
} from '../../constants/medicos-uso.enum';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * @component
 * @name ContenedorDePasosComponent
 * @description
 * Componente contenedor que gestiona la navegación entre los pasos de un wizard.
 * Permite avanzar o retroceder entre los pasos y actualiza el título del paso actual.
 *
 * @selector app-contenedor-de-pasos
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./contenedor-de-pasos.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./contenedor-de-paso.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - WizardComponent: Componente para gestionar la navegación entre pasos.
 * - PasoUnoComponent: Componente para gestionar la funcionalidad del paso uno.
 * - PasoDosComponent: Componente para gestionar la funcionalidad del paso dos.
 * - PasoTresComponent: Componente para gestionar la funcionalidad del paso tres.
 * - BtnContinuarComponent: Componente para mostrar los botones de navegación.
 */
@Component({
  selector: 'app-contenedor-de-pasos',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    NotificacionesComponent,
    DatosDeLaSolicitudComponent,
    PagoDeDerechosComponent,
    AlertComponent,
  ],
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent {
  /**
   * Referencia al componente hijo `DatosDeLaSolicitudComponent`.
   *
   * Se obtiene mediante `@ViewChild` para acceder a sus métodos y propiedades
   * desde el componente padre.
   */
  @ViewChild(DatosDeLaSolicitudComponent, { static: false })
  datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

  /**
  * @property {PasoUnoComponent} pasoUnoComponent
  * @description
  * Referencia al componente hijo `PasoUnoComponent` mediante
  * `@ViewChild`. Permite acceder a sus métodos y propiedades
  * desde este componente padre.
  */
  @ViewChild(PasoUnoComponent)
  pasoUnoComponent!: PasoUnoComponent;

  /**
   * Referencia al componente hijo `PagoDeDerechosComponent`.
   *
   * Se obtiene mediante `@ViewChild` para poder interactuar con él de forma
   * programática desde el componente padre.
   */
  @ViewChild(PagoDeDerechosComponent, { static: false })
  pagoDeDerechosComponent!: PagoDeDerechosComponent;

  /**
   * Contenido del aviso que se mostrará en la interfaz.
   *
   * Se inicializa con el valor de la propiedad `aviso` del objeto constante `AVISO_CONTRNIDO`.
   */
  avisoContrnido = AVISO_CONTRNIDO.aviso;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
   * @property {string | null} tituloMensaje
   * Título del paso actual en el wizard.
   */
  tituloMensaje: string | null = TITULOMENSAJE;

  /**
   * @property {ListaPasosWizard[]} pasos
   * Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * Índice del paso actual en el wizard.
   */
  indice: number = 1;
  /**
 * @property {string} MENSAJE_DE_ERROR
 * @description
 * Propiedad usada para almacenar el mensaje de error actual.
 * Se inicializa como cadena vacía y se actualiza en función
 * de las validaciones o errores capturados en el flujo.
 */
  MENSAJE_DE_ERROR: string = '';
  /**
    * @property {string} infoAlert
    * Clase CSS usada para mostrar alertas informativas.
    */
  public infoAlert = 'alert-danger text-center';
  /**
   * @property {WizardComponent} wizardComponent
   * Referencia al componente del wizard para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {DatosPasos} datosPasos
   * Configuración de los datos del wizard, como el número de pasos y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @method seleccionaTab
   * Cambia el índice del paso actual al valor proporcionado.
   *
   * @param {number} i - Índice del paso seleccionado.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * Actualiza el índice del paso actual y controla la navegación en el wizard.
   *
   * @param {AccionBoton} e - Acción realizada en el botón (continuar o retroceder) y el índice del paso.
   */
  public getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarPasoUno();
      }

      if (!isValid) {
        this.mostrarAlerta = true;
        this.MENSAJE_DE_ERROR = MENSAJE_DE_VALIDACION;
        this.seleccionarFilaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE_DE_VALIDACION,
          cerrar: true,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'SI',
          txtBtnCancelar: 'NO',
        };

        this.datosPasos.indice = this.indice;
        return;
      }
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.siguiente();
      return;
    }

    this.indice = e.valor;
    this.datosPasos.indice = this.indice;
    this.wizardComponent.atras();
  }

  /**
   * @method obtenerNombreDelTítulo
   * Obtiene el título correspondiente al paso actual.
   *
   * @param {number} valor - Índice del paso actual.
   * @returns {string} Título del paso.
   */
  static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULOMENSAJE;
      case 2:
        return 'Cargar archivos';
      case 3:
        return 'Firmar';
      default:
        return TITULOMENSAJE;
    }
  }
}
