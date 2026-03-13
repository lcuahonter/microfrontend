import { CategoriaMensaje,Notificacion,NotificacionesComponent, TipoNotificacionEnum } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FORMULARIO_CERTIFICACION_DETALLES, MENSAJE_MODAL, TITULO_MODAL } from '../../constantes/tramite5601.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite5601State, Tramite5601Store } from '../../estados/stores/tramite5601.store';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite5601Query } from '../../estados/queries/tramite5601.query';
/**
 * Componente para gestionar las certificaciones, incluyendo su visualización y edición.
 * Se utiliza en un módulo independiente con los componentes necesarios importados.
 */
@Component({
  selector: 'app-certificaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent,NotificacionesComponent],
  templateUrl: './certificaciones.component.html',
  styleUrl: './certificaciones.component.scss',
})
export class CertificacionesComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para gestionar los datos de certificación.
   */
  formularioCertificacion!: FormGroup;

  /**
   * Variable para controlar la visibilidad del modal.
   * Puede ser 'show' para mostrar el modal o una cadena vacía para ocultarlo.
   */
  modal: string = '';

  /**
   * Título del modal que se muestra al usuario.
   */
  tituloModal!: string;

  /**
   * Mensaje del modal que se muestra al usuario.
   */
  mensajeModal!: string;

  /**
   * Estado actual de la certificación, obtenido desde el store.
   */
  public certificacionState!: Tramite5601State;

  /**
 * Un Subject que emite un valor `void` cuando el componente es destruido.
 * Se utiliza para gestionar y limpiar suscripciones, evitando fugas de memoria.
 */
  private destroyed$: Subject<void> = new Subject();

  /**
   * Detalles del formulario de certificación de la empresa.
   */
  public certificacionEmpresa = FORMULARIO_CERTIFICACION_DETALLES;

  /**
   * Controla si el popup de confirmación para eliminar está abierto.
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Almacena la notificación que se mostrará en el modal.
   */
  nuevaNotificacion!: Notificacion;

  /**
   * Estado actual de la consulta IO, obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite5601Store - Store para gestionar el estado del trámite 5601.
   * @param tramite5601Query - Query para obtener datos del estado del trámite 5601.
   */
  constructor(private fb: FormBuilder, private tramite5601Store: Tramite5601Store,
    private tramite5601Query: Tramite5601Query,private consultaioQuery: ConsultaioQuery) {
    // Inicializa el formulario de certificación
  }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializar el componente.
   * Configura el formulario reactivo y suscribe al estado de certificación.
   */
  ngOnInit(): void {

    this.tramite5601Query.selectCertificacion$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.certificacionState = seccionState;
        })
      )
      .subscribe();

       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

  }

  /**
   * Abre el popup de confirmación para eliminar, mostrando una notificación modal.
   * Configura la notificación con los textos y tipo apropiados.
   */
  abrirEliminarConfirmationPopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: TITULO_MODAL,
      mensaje: MENSAJE_MODAL,
      cerrar: false,
      txtBtnAceptar: 'Sí',
      txtBtnCancelar: 'No',
    };
    this.confirmEliminarPopupAbierto = true;
  }

  /**
   * Cierra el modal de confirmación de eliminación.
   */
  cerrarModal(): void {
    this.confirmEliminarPopupAbierto = false;
  }


  /**
   * Actualiza un valor en el store basado en el formulario.
   * @param form - Formulario reactivo.
   * @param campo - Nombre del campo en el formulario.
   * @param metodoNombre - Nombre del método en el store para actualizar el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite5601Store): void {
    const VALOR = form.get(campo)?.value; // Obtiene el valor del campo.
    (this.tramite5601Store[metodoNombre] as (value: unknown) => void)(VALOR); // Llama al método del store con el valor.
  }


  /**
   * Formulario principal que contiene un grupo de formularios anidados.
   * En este caso, incluye un grupo de formulario llamado 'ninoFormGroup'.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
  });

  /**
   * Obtiene el grupo de formulario 'ninoFormGroup' del formulario principal.
   * Este método devuelve el grupo de formulario anidado como un FormGroup.
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
   * Establece un cambio de valor en el store basado en un evento recibido.
   * @param event - Objeto que contiene el nombre del campo y el valor a actualizar.
   * Si el campo es 'tieneCertificacion', se muestra un modal al usuario.
   */
  establecerCambioDeValor(event: { campo: string; valor: object | string | boolean }): void {
    if (event) {
      // Actualiza el valor dinámico en el store.
      this.tramite5601Store.setDynamicFieldValue(event.campo, event.valor);

      // Si el campo es 'tieneCertificacion', muestra un modal.
      if (event.campo === 'tieneCertificacion' && event.valor=== true) {
        this.abrirEliminarConfirmationPopup();
      }
    }
  }


  /**
 * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
 * Este método completa el observable destroyed$ para cancelar las suscripciones activas.
 */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
