import {
  AccuseComponentes,
  ListaComponentes,
  Tabulaciones,
} from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { Component, OnDestroy, Type } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LISTA_TRIMITES } from '../shared/constants/lista-trimites.enums';
import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-v-dictamen',
  standalone: true,
  imports: [ReviewersTabsComponent, ReactiveFormsModule, CommonModule, FormsModule, NotificacionesComponent],
  templateUrl: './detalle-v-dictamen.component.html',
  styleUrls: ['./detalle-v-dictamen.component.scss'],
})
export class DetalleVDictamenComponent implements OnDestroy {
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
   * Formulario de tramite
   */
  public FormObservacion!: FormGroup;

  /**
   * Esta variable se utiliza para almacenar el estado de la consulta.
   */
  public consultaState!:ConsultaioState;

  /** 
   * Subject para destruir las suscripciones.
   */
  private destruirSuscripcion$: Subject<void> = new Subject();
  /**
   * @property {AccuseComponentes[] } listaTrimites
   * @description Lista de trámites disponibles para evaluación, obtenida de la constante LISTA_TRIMITES.
   */
  listaTrimites = LISTA_TRIMITES;

  /**
   * Formulario reactivo para gestionar las observaciones en el componente.
   */
  frmObservacion: FormGroup;

  /**
   * Nombre del identificador para el modal de guardar.
   * Se utiliza para referenciar y controlar la visibilidad del modal de guardado en la interfaz de usuario.
   */
  modalGuardar: string = 'modalGuardar';

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  nuevaNotificacion!: Notificacion | null;
  /**
   * Constructor del componente `DetalleVDictamenComponent`.
   * @param {FormBuilder} fbOb - Servicio para construir formularios reactivos.
   * @param {Router} router - Servicio de enrutamiento de Angular para navegar entre rutas.
   */
  constructor(private fbOb: FormBuilder, private router: Router, private consultaQuery: ConsultaioQuery) {
    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destruirSuscripcion$),
      map((seccionState) => {
        this.consultaState = seccionState;
        this.tramite = Number (seccionState.procedureId)
        if (this.tramite) {
            this.selectTramite(this.tramite);
        }
      })
    ).subscribe()
    /**
     * @property {FormGroup} frmObservacion
     * @description Formulario reactivo que contiene un campo para la observación del dictamen
     */
    this.frmObservacion = this.fbOb.group({
      observacion: ['', [Validators.required]]
    });
  }

  /**
   * @method viewChildcambioDePestana
   * @description Cambia el componente hijo mostrado según la pestaña seleccionada.
   * @param {Tabulaciones} id - Identificador de la pestaña seleccionada.
   * @returns {void}
   */
  viewChildcambioDePestana(id: Tabulaciones): void {
    const LI = this.slectTramite?.listaComponentes.find(
      (v: ListaComponentes) => v.id === id.id
    );
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
    this.viewChild = (await li.componentPath()) as Type<unknown>;
  }

  /**
   * Navega al usuario de regreso a la ruta 'verificar-dictamen'.
   * Este método utiliza el Router de Angular para redirigir al usuario a la
   * página de verificación de dictamen. Normalmente se llama cuando el usuario
   * desea regresar a la vista anterior.
   * @method regresar
   * @description Redirige al usuario a la página de verificación de dictamen.
   * @returns {void}
   */
  regresar(): void {
    this.router.navigate([this.consultaState.department+'/verificar-dictamen']);
  }

  /**
   * El método `guardarObservacion` en la clase `DetalleVDictamenComponent` es responsable de
   * navegar a la ruta 'bandeja-de-tareas-pendientes' cuando es llamado. Este método se activa cuando
   * ocurre una acción o evento específico en el componente, como guardar una observación o completar
   * una tarea. Al llamar a `this.router.navigate(['bandeja-de-tareas-pendientes']);`, el método redirige
   * al usuario a la ruta 'bandeja-de-tareas-pendientes' dentro de la aplicación.
   * @method guardarObservacion
   * @description Navega a la bandeja de tareas pendientes.
   * @returns {void}
   * @memberof DetalleVDictamenComponent
   */
  guardarObservacion(): void {
    this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: "Aviso",
        mensaje: "Se ha generado una Observación al Dictamen exitosamente.",
        cerrar: false,
        txtBtnAceptar: "Aceptar",
        txtBtnCancelar: "",
      };
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
     * Maneja la confirmación de un modal.
     * Si el evento es verdadero, navega a la bandeja de tareas pendientes.
     * @param evento Indica si se confirmó la acción.
     */
    confirmacionModal(evento:boolean): void {
      if(evento === true) {
        this.router.navigate(['bandeja-de-tareas-pendientes']);
      }
      
    }
}