/**
 * Componente Angular que gestiona la selección de la representación federal.
 * Permite al usuario seleccionar un estado y su correspondiente representación federal.
 * Utiliza formularios reactivos y se integra con un servicio para obtener los datos necesarios.
 * Además, gestiona el estado del trámite utilizando un store y una query.
 */
import { Catalogo,CatalogoSelectComponent,TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { ID_PROCEDIMIENTO } from '../../constants/aviso-importacion-maquinas.enum';
import { Subject } from 'rxjs';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
import { Tramite130119Store } from '../../estados/store/tramite130119.store';
/**
 * Componente RepresentacionFederalComponent.
 */
@Component({
  selector: 'app-representacion-federal',
  standalone: true,
  imports: [CommonModule, TituloComponent, CatalogoSelectComponent, ReactiveFormsModule],
  templateUrl: './representacion-federal.component.html',
  styleUrl: './representacion-federal.component.scss',
})
export class RepresentacionFederalComponent implements OnInit, OnDestroy {
   /**
     * jest.spyOnIdentificador del procedimiento actual.
     * @type {number}
     */
    idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Se obtiene del estado de la consulta.
   */
  esSoloLectura!: boolean;
  /**
   * FormGroup que define la estructura del formulario de representación federal.
   * Incluye campos para el estado y la representación federal, ambos requeridos.
   */
  formularioRepresentacionFederalForm!: FormGroup;

  /**
   * Arreglo de catálogos que contiene las opciones para el estado.
   * Se obtiene del servicio DatosDeLaSolicitudService.
   */
  opcionesEstado: Catalogo[] = [];

  /**
   * Arreglo de catálogos que contiene las opciones para la representación federal.
   * Se obtiene del servicio DatosDeLaSolicitudService.
   */
  opcionesRepresentacionFederal: Catalogo[] = [];

  /**
   * Subject utilizado para gestionar la desuscripción de observables al destruir el componente.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   * @param fb Servicio para la creación de formularios reactivos.
   * @param service Servicio para obtener datos de la solicitud (estados y representaciones federales).
   * @param tramite130119Store Store que gestiona el estado del trámite 130119.
   * @param tramite130119Query Query para consultar el estado del trámite 130119.
   */
  constructor(private fb: FormBuilder, 
    private service: DatosDeLaSolicitudService, 
    private tramite130119Store: Tramite130119Store, 
    private tramite130119Query: Tramite130119Query,
    private consultaQuery: ConsultaioQuery) {
   
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Carga las opciones de estado y representación federal, y obtiene los valores del store.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
      this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
      });
  }


  /**
   * Inicializa el formulario de representación federal con validaciones.
   * El campo 'estado' es requerido y el campo 'representacionFederal' es requerido.
   */

  inicializarFormulario(): void {
     this.formularioRepresentacionFederalForm = this.fb.group({
      estado: ['', Validators.required],
      representacionFederal: ['', Validators.required],
    });
    this.cargarEstado();
    this.getValoresStore();
  }
  /**
   * Carga las opciones de estado desde el servicio y las asigna a estadoOptions.
   */
  cargarEstado(): void {
    this.service.getEstado(this.idProcedimiento.toString()).pipe(takeUntil(this.destroyed$)).subscribe(
      (data) => {
        this.opcionesEstado = data;
      }
    );
  }

  /**
   * Carga las opciones de representación federal desde el servicio y las asigna a representacionFederalOptions.
   */
  cargarRepresentacionFederal(idEstado: string): void {
    this.service.getRepresentacionfederal(this.idProcedimiento.toString(), idEstado).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      (data) => {
        this.opcionesRepresentacionFederal = data;
      }
    );
  }

  /**
   * Establece los valores del formulario en el store del trámite.
   * @param form FormGroup que contiene los valores a establecer.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Nombre del método del store que se utilizará para establecer el valor.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite130119Store.establecerDatos({[campo]: VALOR});
    if(campo === 'estado'){
      this.cargarRepresentacionFederal(VALOR);
    }
  }

  /**
   * Obtiene los valores del store del trámite y los asigna al formulario.
   */
  getValoresStore(): void {
    this.tramite130119Query.selectTramite130119$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.formularioRepresentacionFederalForm.patchValue({
            estado: seccionState.estado,
            representacionFederal: seccionState.representacionFederal
          });
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Completa el Subject destroyed$ para desuscribir los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}