import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,
  ConsultaioStore,} from "@ng-mf/data-access-user";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Solicitud221603State,
  Tramite221603Store,
} from '../../estados/tramite221603.store';
import { Subject, map, takeUntil } from 'rxjs';
import { FormularioDatos } from '../../enum/sanidad.enum';
import { SanidadService } from '../../service/sanidad.service';
import { Tramite221603Query } from '../../estados/tramite221603.query';

/**
 * Decorador que define el componente de Angular.
 * Especifica el selector, la plantilla HTML y los estilos asociados al componente.
 *
 * selector Define el nombre del selector que se utiliza para insertar este componente en una plantilla.
 * templateUrl Ruta al archivo HTML que contiene la estructura de la interfaz de usuario del componente.
 * styleUrls Ruta al archivo SCSS que contiene los estilos específicos del componente.
 */
@Component({
  selector: 'app-movilizacion',
  templateUrl: './movilizacion.component.html',
  styleUrls: ['./movilizacion.component.scss'],
})
/**
 * Componente que representa la sección de movilización.
 * Gestiona el formulario reactivo y los datos relacionados con la movilización, como medio, transporte,
 * verificación y empresa.
 */
export class MovilizacionComponent implements OnInit, OnDestroy {
  /**
   * Estado de la solicitud 221603, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: Solicitud221603State;
  /**
   * Formulario reactivo que gestiona los datos de la movilización.
   */
  medioForm!: FormGroup;
  /**
   * Datos del formulario relacionados con la movilización.
   */
  formularioDatos!: FormularioDatos;
  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Inyecta las dependencias necesarias para gestionar el formulario y los datos de la movilización.
   * formBuilder Servicio para construir formularios reactivos.
   * tramite221603Store Servicio para gestionar el estado del trámite.
   * Tramite221603Query Servicio para consultar el estado del trámite.
   * sanidadService Servicio para obtener datos relacionados con la sanidad.
   */
  constructor(
    private formBuilder: FormBuilder,
    private tramite221603Store: Tramite221603Store,
    private Tramite221603Query: Tramite221603Query,
    public sanidadService: SanidadService,
    private consultaQuery: ConsultaioQuery,
    private consultaStore: ConsultaioStore
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }
  /**
   * Método que se ejecuta cuando el componente es inicializado.
   * Inicializa el formulario reactivo con los valores actuales de la solicitud y carga los datos necesarios.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();   
  }

  /**
   * Inicializa el estado del formulario según si está en modo solo lectura o editable.
   * Si el formulario está en modo solo lectura, deshabilita los campos 'empresa' y 'transporte'.
   * Si el formulario es editable, habilita los campos 'empresa' y 'transporte'.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
  }

    /**
 * @method
 * @name guardarDatosFormulario
 * @description
 * Inicializa los formularios y obtiene los datos de la tabla. 
 * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`), 
 * deshabilita o habilita todos los formularios del componente.
 * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
 * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
 * 
 * @returns {void}
 */  
  guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
       this.medioForm.get('empresa')?.disable();
       this.medioForm.get('transporte')?.disable();
      } else {
        this.medioForm.get('empresa')?.enable();
        this.medioForm.get('transporte')?.enable();
      } 
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   * Configura el formulario para gestionar los campos relacionados con la movilización, como medio, transporte,
   * verificación y empresa. También asigna valores predeterminados a algunos campos.
   */
 inicializarFormulario(): void {
 this.Tramite221603Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state: Solicitud221603State) => {
        this.solicitudState = state;
      });
    this.sanidadService.inicializaMovilizacionDatosCatalogos();

    this.sanidadService
      .obtenerFormularioDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((formularioDatos: FormularioDatos) => {
        this.formularioDatos = formularioDatos;
        this.rellenarValoresPredeterminados();
      });


    this.medioForm = this.formBuilder.group({
      medio: [
        this.solicitudState?.medio ? this.solicitudState?.medio : 1,
        Validators.required,
      ],
      transporte: [this.solicitudState?.transporte, Validators.required],
      verificacion: [
        this.solicitudState?.verificacion
          ? this.solicitudState?.verificacion
          : 14,
        Validators.required,
      ],
      empresa: [this.solicitudState?.empresa, Validators.required],
    });
  }

  /**
   * Rellena los valores predeterminados en el formulario reactivo.
   * Asigna valores por defecto a los campos del formulario si no están definidos en el estado actual.
   */
  rellenarValoresPredeterminados(): void {
    if (!this.solicitudState?.transporte) {
      this.medioForm
        .get('transporte')
        ?.setValue(this.formularioDatos?.transporte);
    }
    if (!this.solicitudState?.empresa) {
      this.medioForm.get('empresa')?.setValue(this.formularioDatos?.empresa);
    }
  }
  /**
   * Actualiza el estado del store con los valores del formulario.
   * campo Nombre del campo del formulario a actualizar.
   * metodoNombre Nombre del método del store que se debe invocar.
   */
  setValoresStore(campo: string, metodoNombre: keyof Tramite221603Store): void {
    const VALOR = this.medioForm.get(campo)?.value;
    (this.tramite221603Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Limpia los recursos y previene memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
