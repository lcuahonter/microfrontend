
/**
 * Componente encargado de gestionar los datos del trámite.
 */
import { Catalogo,CatalogoSelectComponent,TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { ID_PROCEDIMIENTO } from '../../constants/aviso-importacion-maquinas.enum';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
import { Tramite130119Store } from '../../estados/store/tramite130119.store';
/**
 * Componente encargado de gestionar los datos del trámite.
 */
@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, CatalogoSelectComponent],
  templateUrl: './datos-del-tramite.component.html',
  styleUrl: './datos-del-tramite.component.scss',
})
/**
 * Componente encargado de gestionar los datos del trámite.
 */
export class DatosDelTramiteComponent implements OnInit, OnDestroy {
  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  esSoloLectura!: boolean;
  /**
   * Opciones de régimen.
   * @type {Catalogo[]}
   */
  opcionesDeRegimen!: Catalogo[];

  /**
   * Opciones de clasificación de régimen.
   * @type {Catalogo[]}
   */
  opcionesDeClasificacionDeRegimen!: Catalogo[];

  /**
   * Formulario para los datos del trámite.
   * @type {FormGroup}
   */
  datosDelTramiteForm!: FormGroup;

  /**
   * Subject que emite un evento cuando el componente es destruido,
   * permitiendo la desuscripción de observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente DatosDelTramiteComponent.
   */
  constructor(private fb: FormBuilder, 
    private service: DatosDeLaSolicitudService, 
    private tramite130119Store: Tramite130119Store, 
    private tramite130119Query: Tramite130119Query,
    private consultaQuery: ConsultaioQuery) {
    
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene las opciones de régimen y clasificación de régimen, y los valores del store.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.getRegimenOptions();
    this.getValoresStore();
      this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoConsulta: ConsultaioState) => {
        this.esSoloLectura = estadoConsulta.readonly;
      });
  }

  /**
   * Inicializa el formulario con los controles necesarios.
   */
  inicializarFormulario(): void {
    this.datosDelTramiteForm = this.fb.group({
      regimen: [''],
      clasificacionDeRegimen: ['']
    });
  }
  /**
   * Obtiene las opciones de régimen desde el servicio.
   */
  getRegimenOptions(): void {
    this.service.getRegimen(this.idProcedimiento.toString()).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.opcionesDeRegimen = data;
    });
  }

  /**
   * Obtiene las opciones de clasificación de régimen desde el servicio.
   */
  getClasificacionDeRegimen(idRegmain: string): void {
    this.service.getClasificacionDeRegimen(this.idProcedimiento.toString(), idRegmain).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data) => {
      this.opcionesDeClasificacionDeRegimen = data;
    });
  }

  /**
   * Establece los valores en el store.
   * @param {FormGroup} form - El formulario del cual se obtienen los valores.
   * @param {string} campo - El nombre del campo del formulario.
   * @param {keyof Tramite130119Store} metodoNombre - El nombre del método del store.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite130119Store.establecerDatos({[campo]: VALOR});
    if(campo === 'regimen'){
      this.getClasificacionDeRegimen(VALOR);
    }
  }
  /**
   * Obtiene los valores del store y los asigna al formulario.
   */
  getValoresStore(): void {
    this.tramite130119Query.selectTramite130119$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.datosDelTramiteForm.patchValue({
            regimen: seccionState.regimen,
            clasificacionDeRegimen: seccionState.clasificacionDeRegimen
          });
        })
      )
      .subscribe();
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}