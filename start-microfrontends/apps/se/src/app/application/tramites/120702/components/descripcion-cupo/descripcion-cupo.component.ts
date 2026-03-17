import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Solicitud120702State,
  Tramite120702Store,
} from '../../estados/tramite120702.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AsignacionResponse } from '../../models/expedicion-certificados-frontera.models';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import {
  INFORMACION_DESCRIPCION_CUPO,
} from '../../constantes/expedicion-certificados-frontera.enum';
import { Tramite120702Query } from '../../estados/tramite120702.query';
/**
 * Componente encargado de mostrar y administrar el formulario de descripción del cupo
 * dentro del trámite 120702.
 *
 * Este componente utiliza formularios reactivos para la captura de información
 * dinámica y se integra con el store de Akita para actualizar el estado global.
 */
@Component({
  selector: 'app-descripcion-cupo',
  standalone: true,
  imports: [ReactiveFormsModule, FormasDinamicasComponent, CommonModule, DatePipe],
  templateUrl: './descripcion-cupo.component.html',
  styleUrl: './descripcion-cupo.component.scss',
})
export class DescripcionCupoComponent implements OnInit, OnDestroy {

  /**
   * Estado de la consulta recibido como entrada desde el componente padre.
   */
  @Input({ required: true }) consultaState!: ConsultaioState;

  /**
   * Establece los valores predeterminados de los campos definidos en `INFORMACION_DESCRIPCION_CUPO`
   * utilizando los datos proporcionados en el objeto `formDatos`.
   * 
   * @param value - Objeto que contiene la información relevante para asignar los valores predeterminados
   *                de los campos del formulario de descripción de cupo. Debe incluir propiedades como
   *                `añoAutorizacion`, `cantidadAprobada`, `idAsignacion`, `impTotalAprobado`, y un objeto
   *                `participante.licitacionPublica` con las propiedades `cantidadMaxima`, `idMecanismoAsignacion`,
   *                `ideTipoConstancia` e `ideTipoLicitacion`.
   * 
   * @remarks
   * Este método recorre la constante `INFORMACION_DESCRIPCION_CUPO` y asigna el valor correspondiente
   * a cada campo según la información recibida en `formDatos`. Es importante que la estructura de
   * `formDatos` cumpla con los requisitos esperados para evitar errores de acceso a propiedades.
   */
  private _formDatos!: AsignacionResponse;

  /**
   * Identificador único del cupo seleccionado.
   * 
   * Esta propiedad almacena el valor del identificador asociado al cupo actual en el contexto del componente.
   */
  idCupo: string = '';

  @Input()
  /**
   * Obtiene los datos del formulario de asignación.
   *
   * @returns {AsignacionResponse} Los datos actuales del formulario.
   */
  get formDatos(): AsignacionResponse {
    return this._formDatos;
  }
  /**
   * Establece el valor de `formDatos` y actualiza los campos de la constante `INFORMACION_DESCRIPCION_CUPO`
   * con los valores correspondientes del objeto proporcionado.
   * 
   * Por cada campo en `INFORMACION_DESCRIPCION_CUPO`, asigna el valor predeterminado según la propiedad
   * específica de `value`. Para los campos relacionados con el participante y licitación pública, accede
   * a las propiedades anidadas dentro de `value.participante.licitacionPublica`.
   * 
   * @param value - Objeto que contiene los datos del formulario, utilizado para actualizar los valores predeterminados
   *                de los campos en la descripción del cupo.
   */
  set formDatos(value: any) {
    this._formDatos = value;
    let CUPO ={} as any;
    if (value?.asignacion) {
       CUPO = value?.asignacion?.mecanismoAsignacion?.cupo;
    }else{
      CUPO = value?.mecanismoAsignacion?.cupo;
    }

    if (value) {
      this.idCupo = CUPO?.idCupo || '';
      INFORMACION_DESCRIPCION_CUPO.forEach(field => {
        if (field.campo === 'regimenAduanero') {
          field.valorPredeterminado = CUPO?.regimen;
        }
        if (field.campo === 'descripcionProducto') {
          field.valorPredeterminado = CUPO?.producto?.descripcion;
        }
        if (field.campo === 'clasificacionSubProducto') {
          field.valorPredeterminado = CUPO?.ideClasifSubproducto;
        }
        if (field.campo === 'unidadMedida') {
          field.valorPredeterminado = CUPO?.cveUnidadMedidaOficialCupo;
        }
        if (field.campo === 'cantidadDisponibleCupo') {
          field.valorPredeterminado = CUPO?.saldoDisponible;
        }
        if (field.campo === 'fechaFinCupo') {
          field.valorPredeterminado = this.formatDate(CUPO?.fechaFinVigencia);
        }
        if (field.campo === 'fechaInicioCupo') {
          field.valorPredeterminado = this.formatDate(CUPO?.fechaInicioVigencia);
        }
        if (field.campo === 'mecanismoAsignacion') {
          field.valorPredeterminado = CUPO?.mecanismosAsignacion;
        }
        if (field.campo === 'observaciones') {
          field.valorPredeterminado = value?.mecanismoAsignacion?.observaciones || value?.asignacion?.mecanismoAsignacion?.observaciones;
        }
        if (field.campo === 'paises') {
          field.valorPredeterminado = CUPO?.paises;
        }
        if (field.campo === 'fundamento') {
          field.valorPredeterminado = CUPO?.fundamentos;
        }
        if (field.campo === 'tratadoAcuerdo') {
          field.valorPredeterminado = CUPO?.idTratadoAcuerdo;
        }
        if (field.campo === 'fraccionesArancelarias') {
          field.valorPredeterminado = CUPO?.fraccionesCupo[0]?.fraccionArancelaria?.descripcion;
        }
        if (field.campo === 'paises') {
          field.valorPredeterminado = value?.solicitud?.unidadAdministrativaRepresentacionFederal?.entidadFederativa?.pais?.nombre;
        }
      }
      );
    }
    const EXTRA_DATOS = {
      idMecanismoAsignacion: value?.mecanismoAsignacion?.idMecanismoAsignacion || '',
      idAsignacion: value?.idAsignacion || '',
      idCupo: CUPO?.idCupo || ''
    }
    this.cambioEnValoresStore("extraDatos", EXTRA_DATOS);
    INFORMACION_DESCRIPCION_CUPO.forEach(field => {
      this.cambioEnValoresStore(field.campo, field.valorPredeterminado);
    });
  }

  /**
 * Formatea una cadena de fecha a formato 'dd/MM/yyyy'.
 *
 * @param dateString - La fecha en formato de cadena que se desea formatear.
 * @returns La fecha formateada como 'dd/MM/yyyy', o una cadena vacía si la transformación falla.
 */
  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || '';
  }

  /**
   * Formulario principal del componente.
   * Contiene un subgrupo llamado `ninoFormGroup` donde se almacena la forma dinámica.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
  });

  /**
   * Arreglo con los metadatos para construir dinámicamente el formulario de descripción del cupo.
   */
  public informacionFormData = INFORMACION_DESCRIPCION_CUPO;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Subject usado para destruir las suscripciones activas al destruir el componente.
   */
  private destroy$ = new Subject<void>();

  /**
   * Estado actual del trámite 120702, obtenido desde Akita Store.
   */
  public solicitudState!: Solicitud120702State;

  /**
   * Acceso directo al grupo de formulario hijo `ninoFormGroup`.
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
   * Constructor del componente.
   * @param tramite120702Store Store de Akita para modificar el estado del trámite.
   * @param tramite120702Query Query de Akita para obtener el estado actual del trámite.
   */
  constructor(
    private tramite120702Store: Tramite120702Store,
    private tramite120702Query: Tramite120702Query,
    private consultaioQuery: ConsultaioQuery,
    private datePipe: DatePipe
  ) { }

  /**
   * Inicializa el componente y suscribe al estado del trámite desde el store.
   */
  ngOnInit(): void {
    this.tramite120702Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((state) => {
          this.solicitudState = state;
        })
      )
      .subscribe();

    this.consultaioQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
        if (this.esFormularioSoloLectura) {
          this.informacionFormData.unshift({
            id: 'clavecupo',
            labelNombre: 'Clave del cupo',
            campo: 'clavecupo',
            clase: 'col-md-4',
            tipoInput: 'text',
            desactivado: true,
            soloLectura: false,
            validadores: [],
            marcadorDePosicion: '',
            valorPredeterminado: '',
            marginTop: 0,
          });
        }
        INFORMACION_DESCRIPCION_CUPO.forEach(field => {
        if (field.campo === 'clavecupo') {
          field.valorPredeterminado = this.idCupo;
        } });
      });
  }

  /**
   * Método invocado al detectar un cambio en los valores del formulario.
   * @param event Objeto con el nombre del campo y su nuevo valor.
   */
  establecerCambioDeValor(event: { campo: string; valor: unknown }): void {
    if (event) {
      this.cambioEnValoresStore(event.campo, event.valor);
    }
  }

  /**
   * Actualiza un campo específico del estado global en el store.
   * @param campo Nombre del campo a actualizar.
   * @param valor Nuevo valor del campo.
   */
  cambioEnValoresStore(campo: string, valor: unknown): void {
    this.tramite120702Store.setDynamicFieldValue(campo, valor);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
