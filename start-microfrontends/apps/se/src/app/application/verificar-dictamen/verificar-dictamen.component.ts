import { AccuseComponentes, ListaComponentes, Tabulaciones } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { Catalogo, CatalogoSelectComponent, ConsultaioState, FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';
import { Router } from '@angular/router';

import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';
import { VerificaDictamenService } from '@libs/shared/data-access-user/src/core/services/verificaDictamen/verifica-dictamen.service';
import { VerificarDictamenModel } from '@libs/shared/data-access-user/src/core/models/shared/verificar-dictamen.models';


@Component({
  selector: 'app-verificar-dictamen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    ReviewersTabsComponent,
    FirmaElectronicaComponent
],
  templateUrl: './verificar-dictamen.component.html',
  styleUrl: './verificar-dictamen.component.scss',
})
export class VerificarDictamenComponent implements OnInit, OnDestroy {

  /** 
   * Subject para destruir las suscripciones.
   */
  private destruirSuscripcion$: Subject<void> = new Subject();
  /** 
   * Formulario de tramite 
   */
  public FormTramite!: FormGroup;

  /**
   * La variable `requisitosCombo` en la clase `VerificarDictamenComponent` es un arreglo de objetos `Catalogo`.
   * Se utiliza para almacenar los requisitos obtenidos del objeto `VerificarDictamenModel` que se obtiene
   * a través del servicio `verificaDictamenService`. 
   */
  requisitosCombo: Catalogo[] = [];

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de objetos de tipo Catalogo que representa las opciones disponibles
   * para asignar un autorizador en el componente. Se utiliza para poblar el
   * combo o selector de autorizadores en la interfaz de usuario.
   */
  asignarAutorizadorCombo: Catalogo[] = [];

  /**
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  tramite: number = 0;

  /**
   * @property {Type<unknown>} viewChild
   * @description Referencia dinámica al componente hijo que se carga según la pestaña seleccionada.
   */
  viewChild!: Type<unknown>;
  /**
   * @property {AccuseComponentes | undefined} slectTramite
   * @description Objeto que representa el trámite seleccionado actualmente.
   */
  slectTramite!: AccuseComponentes | undefined;

  /**
   * Esta variable se utiliza para almacenar el estado de la consulta.
   */
  public consultaState!:ConsultaioState;

  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
   */
  guardarDatos!: ConsultaioState;

  /**
   * @property {AccuseComponentes[] } listaTrimites
   * @description Lista de trámites disponibles para evaluación, obtenida de la constante LISTA_TRIMITES.
   */
  listaTrimites = LISTA_TRIMITES;

  /**
   * Indica si el panel de verificación y firma está visible.
   */
  panelVerFirmar: boolean = false;

  /**
   * Cadena que almacena el valor original para verificación.
   */
  cadenaOriginal: string = '';
    
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private verificaDictamenService: VerificaDictamenService, 
    private consultaioQuery: ConsultaioQuery 
  ) 
  {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
        this.tramite = Number (seccionState.procedureId)
        if (this.tramite) {
            this.selectTramite(this.tramite);
        }
      })
    ).subscribe()
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario de tramite y consulta los datos generales del tramite.
   */
  ngOnInit(): void {
    this.inicializaFormTramite();
    
    this.verificaDictamenService.obtenerDictamen(this.consultaState.folioTramite ?? "")
      .pipe(takeUntil(this.destruirSuscripcion$))
      .subscribe((dictamen: VerificarDictamenModel) => {
      if (Array.isArray(dictamen.requisitos)) {
        this.requisitosCombo = dictamen.requisitos;
      } else {
        this.requisitosCombo = [];
      }
      if (Array.isArray(dictamen.asignarAutorizador)) {
        this.asignarAutorizadorCombo = dictamen.asignarAutorizador;
      } else {
        this.asignarAutorizadorCombo = [];
      }
    /**
     * Carga los datos del dictamen en el formulario.
     */        
    this.FormTramite.patchValue({
      numeroDeTramite: dictamen.numeroDeTramite,
      fundamento:dictamen.fundamento,
      justificacion: dictamen.justificacion,
      plazo: dictamen.plazo,
      tipoAnalisis: dictamen.tipoAnalisis,
      numeroDeMuestras: dictamen.numeroDeMuestras,
      requisito: this.requisitosCombo,
      siglasDictaminador: dictamen.siglasDictaminador,
      asignarAutorizador: this.asignarAutorizadorCombo
    });

    /**
     * Establece el valor del campo 'Requisito' en el formulario.
     */ 
    const REQUISITO_CONTROL = this.FormTramite.get('requisito');
    if (REQUISITO_CONTROL) {
      REQUISITO_CONTROL.setValue(6);
    }
    /**
     * Establece el valor del campo 'AsignarAutorizador' en el formulario.
     */ 
    const ASIGNA_AUT_CONTROL = this.FormTramite.get('asignarAutorizador');
    if (ASIGNA_AUT_CONTROL) {
      ASIGNA_AUT_CONTROL.setValue(1);
    }
      }, (error) => {
        console.error('Error al obtener los datos del dictamen:', error);
      });
  }

  /**
   * Inicializa el formulario de tramite
   * @returns {void}
   */
  inicializaFormTramite(): void {
    this.FormTramite = this.fb.group({
      numeroDeTramite: [{ value: '', disabled: true }],
      tipoDeSolicitud: [{ value: '', disabled: true }],     
      fundamento: [{ value: '', disabled: true }], 
      justificacion: [{ value: '', disabled: true }], 
      plazo: [{ value: '', disabled: true }],
      tipoAnalisis: [{ value: '', disabled: true }],
      numeroDeMuestras: [{ value: '', disabled: true }],
      requisito: [{ value: '', disabled: true }],
      siglasDictaminador: [{ value: '', disabled: true }],
      asignarAutorizador: [{ value: '', disabled: true }],
    });
  }

  /**
   * @method guardar
   * @description Emite un evento al hacer clic en el botón guardar.
   * @returns {void}
   */
  observacion(): void {
    this.router.navigate([this.consultaState.department+'/detalle-v-dictamen']);
  }

  /**
  * Se ejecuta al destruir el componente.
  * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
  */
  ngOnDestroy(): void {
    this.destruirSuscripcion$.next();
    this.destruirSuscripcion$.complete();
  }

  /**
   * @method viewChildcambioDePestana
   * @description Cambia el componente hijo mostrado según la pestaña seleccionada.
   * @param {Tabulaciones} id - Identificador de la pestaña seleccionada.
   * @returns {void}
   */
  viewChildcambioDePestana(id: Tabulaciones): void {
    const LI = this.slectTramite?.listaComponentes.find((v: ListaComponentes) => v.id === id.id);
      if (LI) {
        this.loadComponent(LI);
      }
  }

  /**
   * @method loadComponent
   * @description Carga dinámicamente un componente hijo según la ruta especificada en el objeto recibido.
   * @param {ListaComponentes} li - Objeto que contiene la información y la ruta del componente a cargar.
   * @returns {Promise<void>}
   */
  async loadComponent(li: ListaComponentes): Promise<void> {
    if (!li.componentPath) {
      return;
    }
    this.viewChild = await li.componentPath() as Type<unknown>;
  }

  /**
   * @method selectTramite
   * @description Selecciona el trámite a evaluar y actualiza la referencia del trámite seleccionado.
   * @param {number} i - Identificador del trámite.
   * @returns {void}
   */
  selectTramite(i: number): void {
    this.tramite = i;
    this.slectTramite = LISTA_TRIMITES.find((v) => v.tramite === i);
  }

  /**
   * Muestra el panel de verificación para firmar el dictamen.
   */
  firmar(): void {
    this.panelVerFirmar = true;
  }

  /**
   * Maneja el evento de obtención de firma.
   * Si se recibe una firma válida, navega a la bandeja de tareas pendientes.
   * @param ev Cadena que representa la firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA = ev;
    if (FIRMA) {
      this.router.navigate(['bandeja-de-tareas-pendientes']);
    }
  }
}