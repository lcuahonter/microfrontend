import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { Tramite240321State } from '../../estados/tramite240321Store.store';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';

@Component({
  selector: 'app-folio',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TituloComponent,
  ],
  templateUrl: './folio.component.html',
  styleUrl: './folio.component.scss',
})

export class FolioComponent implements OnInit, OnDestroy {

  /**
   * @property {FormGroup} formularioInfoRegistro
   * Formulario reactivo que contiene la información del registro.
   */
  formularioInfoRegistro!: FormGroup;
  /**
   * @property {Tramite240321State} tramiteState
   * Estado actual del trámite, obtenido del store.
   */

  tramiteState: Tramite240321State = this.tramiteStore.getValue();
  /**
   * @property {Subject<void>} destroyNotifier$
   * Subject utilizado para limpiar las suscripciones activas al destruir el componente.
   */

  private destroyNotifier$: Subject<void> = new Subject();
  /**
* Indica si el formulario debe mostrarse en modo solo lectura.
*
* @type {boolean}
* @memberof AgregarDestinatarioFinalContenedoraComponent
* @see https://compodoc.app/
*/
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   * @param {Tramite240321Store} tramiteStore - Store que gestiona el estado del trámite.
   * @param {Tramite240321Query} tramiteQuery - Query para acceder a los datos del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder al estado de la consulta.
   * @returns {void}
   */

  constructor(
    private fb: FormBuilder,
    private tramiteStore: Tramite240321Store,
    private tramiteQuery: Tramite240321Query,
    private readonly consultaioQuery: ConsultaioQuery
  ) { }

  /**
   * Método de inicialización del componente.
   * @method ngOnInit
   */
  ngOnInit(): void {

    this.inicializarFormularioInfoRegistro();
    this.initializeFormFromStore();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.esFormularioSoloLectura) {
            this.formularioInfoRegistro.disable();
          } else {
            this.formularioInfoRegistro.enable();
          }
        })
      )
      .subscribe();

  }
  /**
   * Inicializa el formulario con los valores del store.
   * @method initializeFormFromStore
   */

  initializeFormFromStore(): void {
    this.tramiteQuery.getFolio$.pipe(
      takeUntil(this.destroyNotifier$),
      map(() => {
        this.formularioInfoRegistro.patchValue({
          folio: this.tramiteState.folio,
        });
      })
    ).subscribe();

  }

  /**
   * Inicializa el formulario de información de registro.
   * @method inicializarFormularioInfoRegistro
   */

  inicializarFormularioInfoRegistro(): void {
    this.formularioInfoRegistro = this.fb.group({
      folio: [{ value: '', disabled: true }],
    })
  }

  /*
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();

  }
}