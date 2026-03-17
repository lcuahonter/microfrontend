import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FORMULARIO_DETALLES,FORMULARIO_LOGISTICA_OPERACIONES,MERCANCIA_DETALLES, UBICACION_MERCANCIA } from '../../constantes/tramite5601.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite5601State, Tramite5601Store } from '../../estados/stores/tramite5601.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite5601Query } from '../../estados/queries/tramite5601.query';
import seleccionarOpciones from '@libs/shared/theme/assets/json/5601/selector-5601.json'
/**
 * Componente para gestionar los datos de solicitud, incluyendo su visualización y edición.
 * Se utiliza en un módulo independiente con los componentes necesarios importados.
 */
@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormasDinamicasComponent],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.scss',
})
export class DatosSolicitudComponent implements OnInit, OnDestroy {

  /**
   * Catálogo de aduanas disponibles.
   */
  aduanas!: Catalogo[];

  /**
   * Catálogo de secciones aduaneras disponibles.
   */
  seccionAduanera!: Catalogo[];

  /**
   * Catálogo de tipos de operación disponibles.
   */
  tipoOperacion!: Catalogo[];

  /**
   * Catálogo de tipos de moneda disponibles.
   */
  tipoMoneda!: Catalogo[];

  /**
   * Indicador para mostrar o no la fecha de operación.
   */
  mostrarFechaOperacion: boolean = false;

  /**
   * Estado actual de los datos de la solicitud.
   */
  public DatosSolicitudState!: Tramite5601State;

  /**
 * Un Subject que emite un valor `void` cuando el componente es destruido.
 * Se utiliza para gestionar y limpiar suscripciones, evitando fugas de memoria.
 */
  private destroyed$: Subject<void> = new Subject();

  /**
   * Formulario que contiene los detalles de la solicitud.
   */
  public formularioDatosSolicitud = FORMULARIO_DETALLES;

  /**
   * Formulario que contiene los detalles de la mercancía.
   */
  public formularioDatosMercancia = MERCANCIA_DETALLES;

  /**
   * Formulario que contiene los detalles de logística y operaciones.
   */
  public formularioLogisticaOperaciones = FORMULARIO_LOGISTICA_OPERACIONES;

  /**
   * Formulario que contiene la ubicación de la mercancía.
   */
  public formularioUbicacionMercancia = UBICACION_MERCANCIA;

  /**
   * Estado actual de la consulta IO.
   */
  public consultaState!: ConsultaioState;

  

  /**
   * Constructor del componente.
   * Inicializa los catálogos y servicios necesarios.
   * @param fb FormBuilder para la creación de formularios reactivos.
   * @param tramite5601Store Servicio para gestionar el estado del trámite 5601.
   * @param tramite5601Query Servicio para consultar el estado del trámite 5601.
   */
  constructor(private fb: FormBuilder, private tramite5601Store: Tramite5601Store, private tramite5601Query: Tramite5601Query, private consultaioQuery: ConsultaioQuery) {
    this.aduanas = seleccionarOpciones?.aduanas;
    this.seccionAduanera = seleccionarOpciones?.seccionAduanera;
    this.tipoOperacion = seleccionarOpciones?.tipoOperacion;
    this.tipoMoneda = seleccionarOpciones?.tipoMoneda;
  }


  /**
   * Formulario principal que contiene un grupo de formularios relacionados con "nino".
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
  });

  /**
   * Formulario que contiene un grupo de formularios relacionados con la mercancía.
   */
  public formularioMercancia: FormGroup = new FormGroup({
    mercanciaFormGroup: new FormGroup({}),
  });

  /**
   * Formulario que contiene un grupo de formularios relacionados con logística y operaciones.
   */
  public formularioLogistica: FormGroup = new FormGroup({
    logisticaFormGroup: new FormGroup({}),
  });

  /**
   * Formulario que contiene un grupo de formularios relacionados con la ubicación de la mercancía.
   */
  public formularioUbicacion: FormGroup = new FormGroup({
    ubicacionFormGroup: new FormGroup({}),
  });

  /**
   * Obtiene el grupo de formularios relacionado con "nino" del formulario principal.
   */
  get formularioFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
   * Obtiene el grupo de formularios relacionado con la mercancía del formulario correspondiente.
   */
  get datosMercanciaFormGroup(): FormGroup {
    return this.formularioMercancia.get('mercanciaFormGroup') as FormGroup;
  }

  /**
   * Obtiene el grupo de formularios relacionado con logística y operaciones
   * del formulario correspondiente.
   */
  get formularioLogisticaFormGroup(): FormGroup {
    return this.formularioLogistica.get('logisticaFormGroup') as FormGroup;
  }

  /**
   * Obtiene el grupo de formularios relacionado con la ubicación de la mercancía
   * del formulario correspondiente.
   */
  get formularioUbicacionFormGroup(): FormGroup {
    return this.formularioUbicacion.get('ubicacionFormGroup') as FormGroup;
  }


  /**
   * Método del ciclo de vida de Angular que se llama al inicializar el componente.
   * Configura los formularios y suscribe a los cambios en el estado del trámite.
   */
  ngOnInit(): void {
      this.tramite5601Query.selectCertificacion$
      .pipe(
        takeUntil(this.destroyed$),
        map((datosSolicitudState) => {
          this.DatosSolicitudState = datosSolicitudState;
        })
      )
      .subscribe();

      this.formularioDatosSolicitud = FORMULARIO_DETALLES.map(campo => {
        switch (campo.id) {
          case 'aduana':
            return { ...campo, opciones: this.aduanas };
          case 'seccionAduanera':
            return { ...campo, opciones: this.seccionAduanera };
          case 'tipoOperacion':
            return { ...campo, opciones: this.tipoOperacion };
          case 'tipoMoneda':
              return { ...campo, opciones: this.tipoMoneda };
          default:
            return campo;
        }
      });

      this.formularioDatosMercancia = MERCANCIA_DETALLES.map(campo => {
        switch (campo.id) {
          case 'tipoMoneda':
              return { ...campo, opciones: this.tipoMoneda };
          default:
            return campo;
        }
      });

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
   * Método que se ejecuta al cambiar el tipo de operación.
   * Actualiza la visibilidad de los campos de fecha según el tipo de operación seleccionado.
   */
  alCambiarTipoOperacion(valorSeleccionado?: Catalogo | number): void {
    
    const CAMPO_FECHA_OPERACION = this.formularioDatosSolicitud.find(f => f.campo === 'fechaOperacion');
    const CAMPO_FECHA_INICIO = this.formularioDatosSolicitud.find(f => f.campo === 'fechaInicio');
    const CAMPO_FECHA_FIN = this.formularioDatosSolicitud.find(f => f.campo === 'fechaFin');
    
    const CAMPO_TITULO_SEMANA = this.formularioDatosSolicitud.find(f => f.campo === 'tituloSemana');
    
    const CAMPO_EMPTY_COLUMN = this.formularioDatosSolicitud.find(f => f.campo === 'emptyColumn');
    
    const CAMPO_LUNES = this.formularioDatosSolicitud.find(f => f.campo === 'lunes');
    const CAMPO_MARTES = this.formularioDatosSolicitud.find(f => f.campo === 'martes');
    const CAMPO_MIERCOLES = this.formularioDatosSolicitud.find(f => f.campo === 'miercoles');
    const CAMPO_JUEVES = this.formularioDatosSolicitud.find(f => f.campo === 'jueves');
    const CAMPO_VIERNES = this.formularioDatosSolicitud.find(f => f.campo === 'viernes');
    const CAMPO_SABADO = this.formularioDatosSolicitud.find(f => f.campo === 'sabado');
    const CAMPO_DOMINGO = this.formularioDatosSolicitud.find(f => f.campo === 'domingo');
    
    const SELECTED_ID = typeof valorSeleccionado === 'object' ? valorSeleccionado?.id : valorSeleccionado;
    
    const SELECTED_ID_NUMBER = Number(SELECTED_ID);
    
    if (SELECTED_ID_NUMBER === 1) {
      if (CAMPO_FECHA_OPERACION) {
        CAMPO_FECHA_OPERACION.mostrar = true;
      }
      if (CAMPO_FECHA_INICIO) {
        CAMPO_FECHA_INICIO.mostrar = false;
      }
      if (CAMPO_FECHA_FIN) {
        CAMPO_FECHA_FIN.mostrar = false;
      }
      
      if (CAMPO_EMPTY_COLUMN) {
        CAMPO_EMPTY_COLUMN.mostrar = true; 
        CAMPO_EMPTY_COLUMN.clase = 'd-none'; 
      }
      
      if (CAMPO_TITULO_SEMANA) {
        CAMPO_TITULO_SEMANA.mostrar = false;
      }

      [CAMPO_LUNES, CAMPO_MARTES, CAMPO_MIERCOLES, CAMPO_JUEVES, CAMPO_VIERNES, CAMPO_SABADO, CAMPO_DOMINGO].forEach(campo => {
        if (campo) {
          campo.mostrar = false;
        }
      });
      
    } else if (SELECTED_ID_NUMBER === 2) {
      if (CAMPO_FECHA_OPERACION) {
        CAMPO_FECHA_OPERACION.mostrar = true;
      }
      if (CAMPO_FECHA_INICIO) {
        CAMPO_FECHA_INICIO.mostrar = true;
      }
      if (CAMPO_FECHA_FIN) {
        CAMPO_FECHA_FIN.mostrar = true;
      }

      if (CAMPO_EMPTY_COLUMN) {
        CAMPO_EMPTY_COLUMN.mostrar = true;
        CAMPO_EMPTY_COLUMN.clase = 'col-md-6'; 
      }
 
      
      if (CAMPO_TITULO_SEMANA) {
        CAMPO_TITULO_SEMANA.mostrar = true;
      }
      
      [CAMPO_LUNES, CAMPO_MARTES, CAMPO_MIERCOLES, CAMPO_JUEVES, CAMPO_VIERNES, CAMPO_SABADO, CAMPO_DOMINGO].forEach(campo => {
        if (campo) {
          campo.mostrar = true;
        }
      });
      
    } else {
      if (CAMPO_FECHA_OPERACION) {
        CAMPO_FECHA_OPERACION.mostrar = true;
      }
      if (CAMPO_FECHA_INICIO) {
        CAMPO_FECHA_INICIO.mostrar = false;
      }
      if (CAMPO_FECHA_FIN) {
        CAMPO_FECHA_FIN.mostrar = false;
      }
      
      if (CAMPO_EMPTY_COLUMN) {
        CAMPO_EMPTY_COLUMN.mostrar = true; 
        CAMPO_EMPTY_COLUMN.clase = 'd-none'; 
      }
      
      if (CAMPO_TITULO_SEMANA) {
        CAMPO_TITULO_SEMANA.mostrar = false;
      }
      
      [CAMPO_LUNES, CAMPO_MARTES, CAMPO_MIERCOLES, CAMPO_JUEVES, CAMPO_VIERNES, CAMPO_SABADO, CAMPO_DOMINGO].forEach(campo => {
        if (campo) {
          campo.mostrar = false;
        }
      });
    }
  }
  

  /**
   * Método genérico para actualizar valores en el store.
   * @param form Formulario reactivo que contiene el campo a actualizar.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el store para actualizar el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite5601Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite5601Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método para establecer un cambio de valor en el store.
   * @param event Objeto que contiene el campo y el valor a actualizar.
   * Si el campo es 'tipoOperacion', se ejecuta el método alCambiarTipoOperacion.
   */
  establecerCambioDeValor(event: { campo: string; valor: object | string }): void {
    if (event) {
      // Actualiza el valor dinámico en el store.
      this.tramite5601Store.setDynamicFieldValue(event.campo, event.valor);

      // Si el campo es 'tipoOperacion', actualiza la visibilidad de los campos de fecha.
      if (event.campo === 'tipoOperacion') {
        this.alCambiarTipoOperacion(event.valor as Catalogo | number);
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
