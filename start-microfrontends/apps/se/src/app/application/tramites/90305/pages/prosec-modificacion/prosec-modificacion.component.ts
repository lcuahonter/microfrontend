/**
 * compo doc
 * @component ProsecModificacionComponent
 * @description
 * Componente que gestiona el proceso de modificación PROSEC dentro de un asistente (wizard).
 * Contiene la lista de pasos del proceso y controla el índice del paso actual.
 */

import { Component, OnInit, ViewChild } from '@angular/core';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosPasos, ListaPasosWizard, PASOS, WizardComponent } from '@libs/shared/data-access-user/src';
import { PROSEC_MODIFICACION } from '../../constantes/prosec-modificacion.enum';

import { Subject ,map,takeUntil } from 'rxjs';

import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

interface AccionBoton {
  accion: string;
  valor: number;
}
/**
 * compo doc
 * @selector app-prosec-modificacion
 */
@Component({
  selector: 'app-prosec-modificacion',
  templateUrl: './prosec-modificacion.component.html',
  
})

export class ProsecModificacionComponent implements OnInit {
    /*
    * @description Notificador para destruir el componente y cancelar suscripciones.
    */
    private destroyNotifier$: Subject<void> = new Subject();
  

   /*
    * @description Estado actual de la consulta, obtenido desde el store.
    */
    public consultaState!: ConsultaioState;
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
   * 
   * Lista de pasos del asistente (wizard) para la modificación PROSEC.
   * Se obtiene a partir de la enumeración `PROSEC_MODIFICACION`.
   * 
   * @type {ListaPasosWizard[]}
   */
  pantallasPasos: ListaPasosWizard[] = PROSEC_MODIFICACION;
  /**
   * @description Constructor del componente.
   * Inyecta los servicios necesarios para la consulta y la modificación de domicilios.
   */
  constructor(private consultaQuery: ConsultaioQuery,
    private listaDomicilios: ProsecModificacionServiceTsService,
  ){

  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la consulta para obtener el estado actual y asignarlo a
   */
 ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
      this.consultaState = seccionState;
      }
    )).subscribe();
  }
  /**
   * Índice del paso actual dentro del asistente.
   * 
   * @type {number}
   * @default 1
   */
  indice: number = 1;
  pasos: ListaPasosWizard[] = PASOS;
    /**
   * Bandera que indica si se deben mostrar los errores del formulario.
   */
  mostrarErrorFormularios: boolean = false;
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
 getValorIndice(e: AccionBoton): void {
  if (!this.consultaState.readonly) {
    const TODOS_VALIDOS = this.listaDomicilios.validarTodosFormularios();

    if (!TODOS_VALIDOS) {
      this.mostrarErrorFormularios = true;
      return;
    }
    this.mostrarErrorFormularios = false;
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      this.datosPasos.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  } else {
    if (e.valor > 0 && this.pantallasPasos.length) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
}
}
