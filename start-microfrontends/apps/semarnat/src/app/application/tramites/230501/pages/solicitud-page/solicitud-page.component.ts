import { AccionBoton, BtnContinuarComponent, DatosPasos, ListaPasosWizard, SeccionLibStore, WizardComponent } from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PASOS } from '../../constantes/materiales-peligrosos.enum';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';

/**
 * @component SolicitudPageComponent
 * @description Componente principal de la página de solicitud. Controla la navegación
 * entre pasos de un wizard, muestra el título correspondiente y permite avanzar o retroceder
 * según la interacción del usuario. Utiliza un componente wizard para encapsular la lógica de pasos.
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
  ],
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
export class SolicitudPageComponent {
  /**
   * @property {string | null} tituloMensaje
   * Título principal mostrado en la parte superior según el paso actual.
   */
  tituloMensaje: string | null =
    'Permiso sanitario de importación de medicamentos y materias primas destinados a maquila';

  /**
   * @property {ListaPasosWizard[]} pasos
   * Lista de pasos del wizard obtenidos desde una constante externa.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * Índice actual del paso seleccionado (empieza en 1).
   */
  indice: number = 1;

  /**
   * @property {WizardComponent} wizardComponent
   * Referencia al componente Wizard para controlar navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {DatosPasos} datosPasos
   * Objeto de configuración utilizado por el componente wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();


  /**
   * Constructor de la clase `SolicitudPageComponent`.
   * 
   * Este constructor inicializa las dependencias necesarias para el componente y configura
   * una suscripción al observable `FormaValida$` del servicio `Tramite230501Query`.
   * 
   * @param seccionStore - Servicio `SeccionLibStore` utilizado para gestionar el estado de las secciones.
   * @param tramiteQuery - Servicio `Tramite230501Query` utilizado para consultar y observar el estado de la forma.
   * 
   * La suscripción al observable `FormaValida$` realiza las siguientes acciones:
   * - Escucha los cambios en la validez del formulario.
   * - Utiliza el método `establecerSeccion` del servicio `SeccionLibStore` para actualizar el estado de la sección.
   * - Utiliza el método `establecerFormaValida` del servicio `SeccionLibStore` para actualizar la validez del formulario.
   * 
   * La suscripción se gestiona utilizando el operador `takeUntil` para garantizar que se cancele
   * cuando el componente sea destruido, evitando fugas de memoria.
   */
  constructor(private seccionStore: SeccionLibStore, private tramiteQuery: Tramite230501Query,
  ) {
    this.tramiteQuery.FormaValida$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((res) => {
      this.seccionStore.establecerSeccion([true]);
      this.seccionStore.establecerFormaValida([res]);
    });
  }
  /**
   * @method seleccionaTab
   * @description Cambia el índice actual del wizard manualmente.
   * @param {number} i - Índice del paso al que se desea cambiar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * @description Controla la navegación del wizard según el botón presionado (anterior o continuar).
   * También actualiza el título correspondiente al paso actual.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor y la acción del botón presionado.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      this.tituloMensaje = SolicitudPageComponent.obtenerNombreDelTítulo(
        e.valor
      );

      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description Devuelve el título a mostrar según el número de paso.
   *
   * @param {number} valor - Índice del paso actual.
   * @returns {string} - Título correspondiente.
   */
  static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return 'Permiso sanitario de importación de medicamentos con registro sanitario';
      case 2:
        return 'Anexar requisitos';
      case 3:
        return 'Firmar solicitud';

      default:
        return 'Permiso sanitario de importación de medicamentos con registro sanitario';
    }
  }
}
