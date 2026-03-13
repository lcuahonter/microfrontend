import {
  CONFIGURATION_TABLA_MERCANCIAS,
  DATOS_SOLICITUD,
  FormularioDatos,
  Mercancia,
} from '../../enum/sanidad.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfiguracionColumna,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { ConsultaioQuery,
  ConsultaioStore,} from "@ng-mf/data-access-user";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Solicitud221603State,
  Tramite221603Store,
} from '../../estados/tramite221603.store';
import { Subject, map, takeUntil } from 'rxjs';
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
  selector: 'app-datos-de-la-solicitud',
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrls: ['./datos-de-la-solicitud.component.scss'],
})
/**
 * Componente que gestiona la visualización y el manejo de los datos de la solicitud 221603, incluyendo
 * la gestión de mercancías y la visualización de una tabla dinámica con los requisitos y detalles de las mercancías.
 *
 * Este componente utiliza formularios reactivos para capturar los datos de la solicitud y gestionar el estado
 * de los campos. También incluye la opción de mostrar u ocultar contenido relacionado con la solicitud.
 */
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Estado de la solicitud 221603, que contiene los valores actuales de la solicitud.
   */
  solicitudState!: Solicitud221603State;
  /**
   * Formulario reactivo que gestiona los datos de la solicitud.
   */
  datosSolicitudForm!: FormGroup;
  /**
   * Datos del formulario relacionados con la solicitud.
   */
  formularioDatos!: FormularioDatos;
  /**
   * Constante para definir el tipo de selección de tabla (checkbox).
   */
  checkbox = TablaSeleccion.CHECKBOX;
  /**
   * Texto que contiene los datos de la solicitud.
   */
  TEXTOS: string = DATOS_SOLICITUD;
  /**
   * Variable para mostrar u ocultar el contenido de la solicitud.
   */
  mostrarContenido = true;
  /**
   * Configuración de las columnas para la tabla dinámica que muestra las mercancías.
   */
  configuracionTabla: ConfiguracionColumna<Mercancia>[] =
    CONFIGURATION_TABLA_MERCANCIAS;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

   /**
   * Indica si el formulario es colapsable.
   */
  colapsable: boolean = true;

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * Constructor del componente DatosDeLaSolicitud.
   * 
   * Inicializa las dependencias necesarias mediante inyección de servicios y stores.
   * Suscribe al estado de consulta para actualizar el modo de solo lectura del formulario
   * y para inicializar el estado del formulario cuando cambie el estado de la sección.
   * 
   *  formBuilder Servicio para construir formularios reactivos.
   *  tramite221603Store Store para gestionar el estado del trámite 221603.
   *  tramite221603Query Query para consultar el estado del trámite 221603.
   *  sanidadService Servicio relacionado con sanidad.
   *  consultaQuery Query para consultar el estado de la consulta.
   *  consultaStore Store para gestionar el estado de la consulta.
   */
  constructor(
    private formBuilder: FormBuilder,
    private tramite221603Store: Tramite221603Store,
    private tramite221603Query: Tramite221603Query,
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
   *
   * Inicializa el formulario reactivo y carga los datos necesarios para la solicitud.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
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
        this.datosSolicitudForm.get('guia')?.disable();
        this.datosSolicitudForm.get('justificacionDescription')?.disable();
      } else {
        this.datosSolicitudForm.get('guia')?.enable();
        this.datosSolicitudForm.get('justificacionDescription')?.enable();
      } 
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales del estado de la solicitud.
   *
   * Carga los datos de la solicitud, como justificación, aduana, oficina, punto, y régimen.
   */
  inicializarFormulario(): void {
    
     this.tramite221603Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state: Solicitud221603State) => {
        this.solicitudState = state;
      });

       this.sanidadService
      .obtenerFormularioDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp: FormularioDatos) => {
        this.formularioDatos = resp;
        this.rellenarValoresPredeterminados();
      });
    this.sanidadService.inicializaCatalogosRegimen();
    this.sanidadService.inicializaDatosMercancia();


    this.datosSolicitudForm = this.formBuilder.group({
      justificacionDescription: [this.solicitudState.justificacionDescription, Validators.required],
      aduana: [this.solicitudState.aduana, Validators.required],
      oficina: [this.solicitudState.oficina, Validators.required],
      punto: [this.solicitudState.punto, Validators.required],
      guia: [this.solicitudState.guia],
      regimen: [
        this.solicitudState.regimen ? this.solicitudState.regimen : 3,
        Validators.required,
      ],
    });
  }

  /**
   * Método para rellenar valores predeterminados en el formulario.
   */
  rellenarValoresPredeterminados(): void {
    this.datosSolicitudForm.get('punto')?.setValue(this.formularioDatos?.punto);
    this.datosSolicitudForm.get('punto')?.disable();
    this.datosSolicitudForm
      .get('aduana')
      ?.setValue(this.formularioDatos?.aduana);
    this.datosSolicitudForm.get('aduana')?.disable();
    this.datosSolicitudForm
      .get('oficina')
      ?.setValue(this.formularioDatos?.oficina);
    this.datosSolicitudForm.get('oficina')?.disable();
  }

  /**
   * Método que abre o cierra el contenido de la solicitud.
   */
  public toggleContent(): void {
    this.mostrarContenido = !this.mostrarContenido;
  }
  /**
   * Actualiza el estado del store con los valores del formulario.
   * campo Nombre del campo del formulario a actualizar.
   * metodoNombre Nombre del método del store que se debe invocar.
   */
  setValoresStore(campo: string, metodoNombre: keyof Tramite221603Store): void {
    const VALOR = this.datosSolicitudForm.get(campo)?.value;
    (this.tramite221603Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

   /**
   * Método para mostrar u ocultar el formulario colapsable.
   * Cambia el estado de la variable `colapsable`.
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
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
