import { Chofer40102Store, Choferesnacionales40102State } from '../../estados/chofer40102.store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Chofer40102Query } from '../../estados/chofer40102.query';
import { Chofer40102Service } from '../../estados/chofer40102.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-director-general',
  templateUrl: './director-general.component.html',
  styleUrls: ['./director-general.component.scss']
})
export class DirectorGeneralComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo que contiene los datos del director general.
   *
   * @type {FormGroup}
   */
  directorGeneralForm!: FormGroup;

  /**
   * Observable utilizado para manejar la limpieza de recursos al destruir el componente.
   * Se emite un valor cuando el componente se destruye, completando todas las suscripciones activas.
   *
   * @type {Subject<void>}
   */
  private destroy$ = new Subject<void>();

  /**
   * Observable para notificar la destrucción del componente.
   * Se utiliza para cancelar suscripciones activas y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   * Contiene los datos relacionados con la modificación del trámite.
   */
  public derechoState: Choferesnacionales40102State = {} as Choferesnacionales40102State;

    /**
   * Estado de la solicitud.
   */
  public solicitud40102State!: Choferesnacionales40102State;

  constructor(
    private fb: FormBuilder,
    private chofer40102Store: Chofer40102Store,
    private chofer40102Service: Chofer40102Service,
    private chofer40102Query: Chofer40102Query,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Método del ciclo de vida de Angular que se llama después de que las propiedades enlazadas a datos se inicializan.
   * Inicializa el formulario del director general y establece los valores del formulario.
   */
  ngOnInit(): void {
    this.chofer40102Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.derechoState = {
            ...this.derechoState,
            ...seccionState,
          };
        })
      ).subscribe();
    this.crearFormularioDirectorGeneral();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if(seccionState.readonly) {
            this.directorGeneralForm.disable();
          } 
        })
      ).subscribe();
  }

  /**
   * Crea el formulario para el director general.
   */
  crearFormularioDirectorGeneral(): void {
    const STATE = this.chofer40102Store?.getValue();

    this.directorGeneralForm = this.fb.group({
      nombre: [{ value: STATE.nombre, disabled: true }, [Validators.required]],
      primerApellido: [{ value: STATE.primerApellido, disabled: true }, [Validators.required]],
      segundoApellido: [{ value: STATE.segundoApellido, disabled: true }, [Validators.required]],
    });
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Libera la suscripción a los cambios del formulario.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Establecer valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Chofer40102Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.chofer40102Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }
}
