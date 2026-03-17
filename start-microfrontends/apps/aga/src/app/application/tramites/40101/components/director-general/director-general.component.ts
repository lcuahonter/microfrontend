import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DirectorGeneralQuery } from '../../estado/director-general.query';
import { DirectorGeneralService } from '../../estado/director-general.service';
import { DirectorGeneralStore } from '../../estado/director-general.store';

@Component({
  selector: 'app-director-general',
  templateUrl: './director-general.component.html',
  styleUrls: ['./director-general.component.scss'],
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

  constructor(
    private fb: FormBuilder,
    private directorGeneralStore: DirectorGeneralStore,
    private directorGeneralService: DirectorGeneralService,
    private directorGeneralQuery: DirectorGeneralQuery,
    private consultaioQuery: ConsultaioQuery
  ) { }

  /**
   * Método del ciclo de vida de Angular que se llama después de que las propiedades enlazadas a datos se inicializan.
   * Inicializa el formulario del director general y establece los valores del formulario.
   */
  ngOnInit(): void {
    this.crearFormularioDirectorGeneral();

    this.directorGeneralQuery.selectDirectorGeneral$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state) {
          this.directorGeneralForm?.patchValue(state, { emitEvent: false });
        }
      });

    this.consultaioQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(seccionState => {
        if (seccionState.readonly) {
          this.directorGeneralForm.disable();
        }
      });

    this.directorGeneralForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValues => {
        this.directorGeneralService.updateStateDirectorGeneralData(formValues);
      });
  }

  /**
  * Crea el formulario para el director general.
  */
  crearFormularioDirectorGeneral(): void {
    const STATE = this.directorGeneralQuery.getValue();
    this.directorGeneralForm = this.fb.group({
      nombre: [STATE.nombre, [Validators.required]],
      primerApellido: [STATE.primerApellido, [Validators.required]],
      segundoApellido: [STATE.segundoApellido],
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
}