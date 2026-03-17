import {
  AccionBoton,
  AcuseComponent,
  AlertComponent,
  BtnContinuarComponent,
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  DatosPasos,
  PasoFirmaComponent,
  SolicitanteQuery,
  Usuario,
  WizardComponent,
  formatearFechaSolicitudSinHora,
} from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subject, catchError, map, switchMap, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src/core/models/shared/datos-generales.model';
import { PASOS } from '../../shared/enums/manifestacion-valor.enums';
import { PasoUnoComponent } from "../paso-uno/paso-uno.component";


@Component({
  selector: 'app-manifestacion-valor',
  standalone: true,
imports: [
    WizardComponent,
    CommonModule,
    BtnContinuarComponent,
    AlertComponent,
    PasoUnoComponent
],  templateUrl: './manifestacion-valor.component.html',
  styleUrl: './manifestacion-valor.component.css',
})
export class ManifestacionValorComponent implements OnInit {

    /**
   * @description Texto que se muestra en la alerta del formulario.
   * Este texto es utilizado para proporcionar información al usuario sobre el propósito del formulario.
   * @type {string}
   */
  public readonly alertText: string = '';

    /**
   * @description Referencia al componente Wizard.
   * Esta referencia permite acceder a los métodos y propiedades del componente Wizard,
   * como `siguiente()` y `atras()`, para controlar la navegación entre los pasos.
   *
   * @type {WizardComponent}
   * @viewChild WizardComponent
   */
  @ViewChild(WizardComponent) componenteWizard!: WizardComponent;

    /**
   * @description Índice actual del paso en el que se encuentra el usuario.
   * Este índice se utiliza para determinar qué paso se muestra en cada momento.
   * Los valores posibles de `indice` corresponden a los pasos definidos en el arreglo `pasos`.
   *
   * @type {number}
   * @default 1
   */
  indice: number = 1;

    /**
   * @description Array de objetos que definen los pasos del formulario.
   * Cada objeto contiene información sobre un paso específico,
   * incluyendo su número, título y si está completado.
   * Este array permite la gestión de las secciones o pasos dentro del formulario.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;

    /**
   * @description Objeto que contiene los datos de los pasos del formulario.
   * Este objeto se utiliza para comunicar información entre el componente Agricultura
   * y el componente Wizard, como el número total de pasos, el índice del paso actual
   * y los textos de los botones de navegación (anterior y siguiente).
   *
   * @type {DatosPasos}
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

    /**
   * Constructor del componente.
   * Este constructor inicializa el componente y establece el estado inicial de la validación
   * y de las secciones del formulario utilizando el servicio `SeccionLibStore`.
   * @constructor
   * @param consultaQuery
   */
  constructor() {}
  ngOnInit(): void {
   
  }

    /**
   * @description Maneja la acción del botón y determina la navegación (siguiente o anterior).
   * Este método se llama cuando el usuario hace clic en uno de los botones de navegación
   * del formulario.
   *
   * Recibe un objeto `AccionBoton` que contiene la acción a realizar (`cont` o `atras`)
   * y el valor del índice del paso al que se debe navegar.
   *
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor a manejar.
   *   El `valor` representa el índice del paso al que ir. La `accion` determina si avanzar
   *   (valor `cont`) o retroceder (valor `atras`).
   *
   * @returns {void}
   */
  async getValorIndice(e: AccionBoton): Promise<void> {
   
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.componenteWizard.siguiente();
      } else {
        this.componenteWizard.atras();
      }
    }
  }

    /**
   * Guarda los datos del formulario.
   */
  guardarDatosFormulario(): void {
    // Lógica para guardar los datos del formulario
  }
}
