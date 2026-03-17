import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InformationGeneralSolicitanteState, Tramite32515Store } from '../../estados/tramite32515.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DATOS_DEL_SEGURO } from '../../constantes/modificacion-aviso-seguro-global.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite32515Query } from '../../estados/tramite32515.query';

@Component({
  selector: 'app-datos-del-seguro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent],
  templateUrl: './datos-del-seguro.component.html',
  styleUrls: ['./datos-del-seguro.component.scss'],
})
/**
 * El componente `DatosDelSeguroComponent` es responsable de gestionar el formulario
 * de datos del seguro dentro de la aplicación. Proporciona funcionalidad para manejar
 * el estado del formulario, actualizar el store con los cambios del formulario y
 * suscribirse a las actualizaciones del estado desde el query.
 * 
 * Este componente incluye un grupo de formularios anidado para datos específicos del niño
 * y asegura una limpieza adecuada de las suscripciones para evitar fugas de memoria.
 * 
 * Características clave:
 * - Gestiona el formulario principal y su grupo de formularios anidado.
 * - Actualiza el store con los cambios en los valores del formulario.
 * - Se suscribe a las actualizaciones del estado desde el query.
 * - Implementa hooks del ciclo de vida para inicialización y limpieza.
 * 
 * Dependencias:
 * - `Tramite32515Store`: Utilizado para actualizar los datos del formulario en el store.
 * - `Tramite32515Query`: Utilizado para suscribirse a las actualizaciones del estado.
 * 
 * Hooks del ciclo de vida:
 * - `ngOnInit`: Se suscribe al estado del query para inicializar los datos del componente.
 * - `ngOnDestroy`: Limpia las suscripciones para prevenir fugas de memoria.
 */
export class DatosDelSeguroComponent implements OnInit, OnDestroy {

  /** Datos que definen el formulario del seguro */
  public datosDelSolicitanteolFormData = DATOS_DEL_SEGURO;

  /** Estado general de la información del solicitante */
  public informationGeneralState!: InformationGeneralSolicitanteState;

  /** Subject utilizado para destruir el observable al destruir el componente */
  private destroy$ = new Subject<void>();
     /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;

  /** Formulario principal del componente */
  public forma: FormGroup = new FormGroup({
    /** Subformulario específico para los datos del niño */
    ninoFormGroup: new FormGroup({})
  });

  /** 
   * Constructor: inyecta el store y el query del trámite 32515
   * @param tramiteStore32515 Store para actualizar datos del formulario
   * @param tramiteQuery32515 Query para suscribirse a los datos del estado
   * @param consultaQuery Query para obtener el estado de la consulta
   */
  constructor(
    public tramiteStore32515: Tramite32515Store,
    private tramiteQuery32515: Tramite32515Query,
    public consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Getter para obtener el subformulario de los datos del niño
   * @returns FormGroup correspondiente al grupo del niño
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
   * Método que se ejecuta cuando hay un cambio de valor en un campo del formulario
   * @param event Objeto con el nombre del campo y el nuevo valor
   */
     establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (typeof $event.valor === 'object' && $event.valor !== null && 'id' in $event.valor) {
      this.tramiteStore32515.setTramite32515State($event.campo, String(($event.valor as { id: unknown }).id));
    } else {
      this.tramiteStore32515.setTramite32515State($event.campo, $event.valor);
    }
   
  }

  /**
   * Método que se ejecuta al inicializar el componente
   * Suscribe al estado del query para obtener los datos del solicitante
   */
  ngOnInit(): void {
    this.tramiteQuery32515.select$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.informationGeneralState = seccionState as InformationGeneralSolicitanteState;
        })
      )
      .subscribe();
        this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {          
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al destruir el componente
   * Finaliza el observable para evitar fugas de memoria
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
