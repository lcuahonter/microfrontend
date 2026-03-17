import {
  AlertComponent,
  CatalogosService,
  FormularioDinamico,
  InputConfig,
  InputFechaComponent,
  InputRadioComponent,
  InputTypes,
  LabelValueDatos,
  MenuConfig,
  Props,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TablaDinamicaComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DATOS_TRANSPORTE } from '../../constants/input-datos-config';
import { ExportaccionAcuicolaService } from '../../services/exportaccion-acuicola.service';
import { Tramite220403Query } from '../../estados/tramite220403.query';
import { Tramite220403Store } from '../../estados/tramite220403.store';
import { Transporte } from '../../models/acuicola.module';

/**
 * @component
 * @name TransporteComponent
 * @description
 * Componente encargado de gestionar el formulario y la lógica relacionada con la sección de transporte en el trámite acuícola.
 * Permite la captura, validación y gestión de los datos de transporte, así como la interacción con los servicios y el estado global de la aplicación.
 * 
 * @author Equipo VUCEM
 * @since 2025
 */
@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.component.html',
  styleUrl: './transporte.component.scss',
  standalone: true,
  imports: [TituloComponent, AlertComponent, TablaDinamicaComponent, InputRadioComponent, InputFechaComponent, CatalogoSelectComponent, FormsModule, ReactiveFormsModule, CommonModule ], 
})
export class TransporteComponent implements OnInit, OnDestroy {

  /**
   * @input
   * @description
   * Indica si el formulario debe estar deshabilitado. Cuando es `true`, los controles del formulario estarán inactivos y no permitirán la edición por parte del usuario.
   * @type {boolean}
   */
   @Input() formularioDeshabilitado: boolean = false;

   /**
   * @descripcion
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los controles del formulario estarán deshabilitados.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Notificador para la destrucción de suscripciones.
   * @access private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa los datos de transporte seleccionados en el formulario.
   */
  transporte!: Transporte;

  /**
   * Configuración de los campos del formulario para la sección de transporte.
   * Define los tipos de entrada y sus propiedades correspondientes.
   */
  configuracion: InputConfig[] = [
    {
      title: 'Transporte',
      formGroupName: 'transporte',
      menu: [
        {
          inputType: InputTypes.SELECT,
          props: DATOS_TRANSPORTE[0] as unknown as Props,
          class: 'col-md-4',
        },
        {
          inputType: InputTypes.TEXT,
          props: DATOS_TRANSPORTE[1] as unknown as Props,
          class: 'col-md-4',
        },
        {
          inputType: InputTypes.TEXT,
          props: DATOS_TRANSPORTE[2] as unknown as Props,
          class: 'col-md-4',
        },
        {
          inputType: InputTypes.TEXT,
          props: DATOS_TRANSPORTE[3] as unknown as Props,
          class: 'col-md-4',
        },
        {
          inputType: InputTypes.TEXT,
          props: DATOS_TRANSPORTE[4] as unknown as Props,
          class: 'col-md-4',
        },
      ],
    },
  ];

  /**
   * Arreglo que almacena la configuración de los formularios dinámicos para información fiscal.
   */
  fiscal: FormularioDinamico[] = [];

  /**
   * Formulario reactivo que almacena los datos ingresados por el usuario.
   */
  formulario!: FormGroup;

  /**
   * Objeto utilizado para capturar eventos del formulario.
   */
  evento = {};

  /**
   * Tipos de entrada disponibles en el formulario.
   */
  inputTypes = InputTypes;

  /**
   * Estado de la sección utilizado para gestionar la lógica interna del componente de transporte.
   * @access private
   */
  private seccionState!: SeccionLibState;

  /**
   * Constructor del componente TransporteComponent.
   * Inicializa los servicios y dependencias necesarias para el funcionamiento del componente.
   * 
   * @param fb Servicio FormBuilder para la creación de formularios reactivos.
   * @param catalogosServicios Servicio para la obtención de catálogos.
   * @param exportaccionAcuicolaServcios Servicio para operaciones relacionadas con exportación acuícola.
   * @param tramite220403Query Query para el estado del trámite 220403.
   * @param tramite220403store Store para el estado del trámite 220403.
   * @param seccionQuery Query para el estado de la sección.
   * @param seccionStore Store para el estado de la sección.
   */
  constructor(
    private fb: FormBuilder,
    private catalogosServicios: CatalogosService,
    private exportaccionAcuicolaServcios: ExportaccionAcuicolaService,
    private tramite220403Query: Tramite220403Query,
    private tramite220403store: Tramite220403Store,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore
  ) {
    this.crearFormulario();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura los formularios y suscriptores.
   */
  ngOnInit(): void {
    this.configuracion.forEach((eachConfig: InputConfig, groupIndex: number) => {
      this.inicializarFormGroup(eachConfig.menu, eachConfig.formGroupName, groupIndex);
    });
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
  
    this.tramite220403Query.setTransporte$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.formulario.get('transporte')?.patchValue(state);
        })
      )
      .subscribe();

    this.formulario.statusChanges
      .pipe(takeUntil(this.destroyNotifier$)) // Asegura la desuscripción al destruir el componente
      .subscribe(
        () => {
    this.tramite220403store.setTransporte(this.formulario.get('transporte')?.value);
    if (this.formulario.get('transporte')?.valid) {
      const VALIDA = this.formulario.get('transporte')?.valid ? true : false;
      this.tramite220403store.setTransporteValidada(VALIDA);
    }
  });

  if(this.formularioDeshabilitado){
      this.esFormularioSoloLectura = true;
      this.inicializarEstadoFormulario();
  }

  }

  /**
   * Inicializa el estado del formulario según si está en modo solo lectura o editable.
   * Si el formulario está en modo solo lectura, deshabilita todos los controles.
   * Si no, habilita los controles para permitir la edición.
   *
   * @method
   * @memberof CertificadoOrigenComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.formulario.disable();
    }
    else {
      this.formulario.enable();
    } 
  }

  /**
   * Crea el formulario principal e inicializa los subgrupos.
   */
  crearFormulario(): void {
    this.formulario = this.fb.group({
      transporte: this.fb.group({}),
    });
  }

  /**
   * Inicializa un grupo de formularios con controles basados en la configuración proporcionada.
   * @param configuracion La configuración para los controles del formulario.
   * @param nombreGrupo El nombre del grupo de formularios.
   * @param indiceGrupo El índice del grupo en la matriz de configuración.
   */
  inicializarFormGroup(
    configuracion: MenuConfig[],
    nombreGrupo: string,
    indiceGrupo: number
  ): void {
    const GRUPO = this.formulario.get(nombreGrupo) as FormGroup;
    configuracion.forEach((campo: MenuConfig, menuIndex: number) => {
      const VALIDATORS = campo.props.validators
        ? TransporteComponent.getValidators(campo.props.validators)
        : [];
      const CONTROL_NAME = campo.props.campo;
      GRUPO.addControl(
        CONTROL_NAME,
        this.fb.control(
          { value: '', disabled: campo.props.disabled },
          VALIDATORS
        )
      );
      if (campo.inputType === InputTypes.SELECT) {
        this.obtenerValoresCatalogo(indiceGrupo, menuIndex, CONTROL_NAME);
      }
    });
  }

  /**
   * Obtiene las opciones de entrada de radio del servicio.
   * @param fileName Nombre del archivo JSON que contiene las opciones.
   * @param callback Función de devolución de llamada donde se establece la opción en el menú.
   */
  getRadioData(
    fileName: string,
    callback: (data: LabelValueDatos[]) => void
  ): void {
    this.exportaccionAcuicolaServcios.getDatos(fileName)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((data) => {
      callback(data);
    });
  }

  /**
   * Obtiene los valores del catálogo y actualiza la configuración.
   * @param indiceGrupo El índice del grupo en la matriz de configuración.
   * @param indiceMenu El índice del menú en el grupo.
   * @param clave La clave para obtener los valores del catálogo.
   */
  obtenerValoresCatalogo(
    indiceGrupo: number,
    indiceMenu: number,
    clave: string
  ): void {
    this.exportaccionAcuicolaServcios
      .obtenerMenuDesplegable(clave)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((resp) => {
          if (resp.length > 0) {
            this.configuracion[indiceGrupo].menu[indiceMenu].props.catalogos =
              resp;
          }
        })
      )
      .subscribe();
  }

  /**
   * Genera una matriz de validadores de formularios basada en los patrones proporcionados.
   * @param validadores Una matriz de patrones regex que se utilizarán para la validación.
   * @returns Una matriz de validadores de formularios.
   */
  static getValidators(validadores: string[]): ValidatorFn[] {
    const FORM_VALIDATORS: ValidatorFn[] = [];
    validadores.forEach((validadore) => {
      if (validadore === 'required') {
        FORM_VALIDATORS.push(Validators.required);
      } else if (validadore.includes('maxLength')) {
        const MAX = validadore.split(':')[1];
        FORM_VALIDATORS.push(Validators.maxLength(Number(MAX)));
      } else if (validadore.includes('pattern')) {
        const PATTERN = validadore.split(':')[1];
        FORM_VALIDATORS.push(Validators.pattern(PATTERN));
      }
    });
    return FORM_VALIDATORS;
  }

  /**
   * Maneja el evento de cambio para la entrada de fecha.
   * @param evento El nuevo valor de la fecha como cadena.
   */
  fechaCambiado(evento: string): void {
    // Manejar cambio de fecha
    this.evento = evento;
  }

  /**
   * Maneja el evento de selección para un catálogo.
   * @param nombreControlFormulario El nombre del control del formulario a actualizar.
   * @param evento El valor seleccionado del catálogo.
   */
  seleccionCatalogo(nombreControlFormulario: string, evento: Event): void {
    this.formulario.get(nombreControlFormulario)?.setValue(evento);
  }

  /**
   * Maneja el evento de cambio para una entrada de radio.
   * @param claveRadio La clave de la entrada de radio.
   * @param groupIndex Índice del grupo en la configuración.
   * @param menuIndex Índice del menú en el grupo.
   * @param evento El nuevo valor de la entrada de radio.
   */
  cambioValorRadio(
    claveRadio: string,
    groupIndex: number,
    menuIndex: number,
    evento: string | number
  ): void {
    this.configuracion[groupIndex].menu[menuIndex].props.radioSelectedValue =
      evento;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera recursos y cancela suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}