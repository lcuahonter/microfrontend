import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Solicitud32610State,
  Solicitud32610Store
} from '../../../estados/solicitud32610.store';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { Solicitud32610Query } from '../../../estados/solicitud32610.query';
import { TEXTOS_ESTATICOS_SEGURIDAD } from '../../../constants/texto-estatico-dos.enum';
/**
 * @component SeguridadFisicaComponent
 * @description
 * Componente encargado de gestionar el formulario relacionado con la seguridad física.
 * Permite la captura y validación de datos relacionados con materiales, monitoreo, acceso, y otros aspectos de seguridad física.
 */
@Component({
  selector: 'app-seguridad-fisica',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './seguridad-fisica.component.html',
  styleUrl: './seguridad-fisica.component.scss',
})
export class SeguridadFisicaComponent implements OnInit, OnDestroy {
    /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_SEGURIDAD
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} seguridadFisicaForm
   * @description
   * Formulario reactivo que contiene los campos relacionados con la seguridad física.
   */
  seguridadFisicaForm!: FormGroup;

  /**
   * @property {Solicitud32610State} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Solicitud32610State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Constructor que inicializa los servicios necesarios para el componente.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Solicitud32610Store} tramite32610Store - Store para gestionar el estado de la solicitud.
   * @param {Solicitud32610Query} tramite32610Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32610Store: Solicitud32610Store,
    private tramite32610Query: Solicitud32610Query
  ) {
    //Añade lógica aquí
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario y suscribe al estado de la solicitud.
   */
  ngOnInit(): void {
    this.tramite32610Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((seccionState) => {
        this.solicitudState = seccionState;
        if (!this.seguridadFisicaForm) {
          this.crearFormularioSeguridadFisica();
        } else {
          this.actualizarFormularioConEstado();
        }
      });
  }

  /**
   * @method crearFormularioSeguridadFisica
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para la seguridad física.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearFormularioSeguridadFisica(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.seguridadFisicaForm = this.fb.group({
      ...SeguridadFisicaComponent.crearControlesBasicos(PERFILES),
      ...SeguridadFisicaComponent.crearControlesMonitoreo(PERFILES),
      ...SeguridadFisicaComponent.crearControlesAcceso(PERFILES),
      ...SeguridadFisicaComponent.crearControlesSistemas(PERFILES),
      ...SeguridadFisicaComponent.crearControlesInspeccion(PERFILES)
    });
  }

  /**
   * @method crearControlesBasicos
   * @description
   * Crea los controles básicos del formulario de seguridad física.
   */
  private static crearControlesBasicos(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      indiqueMateriales: [perfiles['indiqueMateriales'] || '', Validators.required],
      queForma: [perfiles['queForma'] || '', Validators.required],
      personalResponsable: [perfiles['personalResponsable'] || '', Validators.required],
      indiqueCuantas: [perfiles['indiqueCuantas'] || '', Validators.required],
      indiqueMonitoreadas: [perfiles['indiqueMonitoreadas'] || '', Validators.required],
      detalleExisten: [perfiles['detalleExisten'] || '', Validators.required],
      describaAcceso: [perfiles['describaAcceso'] || '', Validators.required],
      describirTipo: [perfiles['describirTipo'] || '', Validators.required],
      describaAreas: [perfiles['describaAreas'] || '', Validators.required],
      senaleMismas: [perfiles['senaleMismas'] || '', Validators.required],
      casoNoContar: [perfiles['casoNoContar'] || '', Validators.required]
    };
  }

  /**
   * @method crearControlesMonitoreo
   * @description
   * Crea los controles relacionados con monitoreo y verificación.
   */
  private static crearControlesMonitoreo(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      periodicidadVerifica: [perfiles['periodicidadVerifica'] || '', Validators.required],
      indiqueTareas: [perfiles['indiqueTareas'] || '', Validators.required],
      describaManera: [perfiles['describaManera'] || '', Validators.required],
      indiqueSepara: [perfiles['indiqueSepara'] || '', Validators.required],
      senaleRestringido: [perfiles['senaleRestringido'] || '', Validators.required],
      describaMonitoreo: [perfiles['describaMonitoreo'] || '', Validators.required],
      responsablesControlar: [perfiles['responsablesControlar'] || '', Validators.required],
      estacionamientos: [perfiles['estacionamientos'] || '', Validators.required],
      llevaEntrada: [perfiles['llevaEntrada'] || '', Validators.required]
    };
  }

  /**
   * @method crearControlesAcceso
   * @description
   * Crea los controles relacionados con políticas y procedimientos de acceso.
   */
  private static crearControlesAcceso(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      politicasMecanismos: [perfiles['politicasMecanismos'] || '', Validators.required],
      procedimientoOperacion: [perfiles['procedimientoOperacion'] || '', Validators.required],
      senaleEncuentran: [perfiles['senaleEncuentran'] || '', Validators.required],
      mencioneCuenta: [perfiles['mencioneCuenta'] || '', Validators.required],
      queManera: [perfiles['queManera'] || '', Validators.required],
      describaContactar: [perfiles['describaContactar'] || '', Validators.required],
      indiqueOperativo: [perfiles['indiqueOperativo'] || '', Validators.required],
      indiqueAparatos: [perfiles['indiqueAparatos'] || '', Validators.required],
      mantenimiento: [perfiles['mantenimiento'] || '', Validators.required],
      politicasAparatos: [perfiles['politicasAparatos'] || '', Validators.required],
      programaMantenimiento: [perfiles['programaMantenimiento'] || '', Validators.required]
    };
  }

  /**
   * @method crearControlesSistemas
   * @description
   * Crea los controles relacionados con sistemas de seguridad y alarmas.
   */
  private static crearControlesSistemas(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      indiqueRespaldo: [perfiles['indiqueRespaldo'] || '', Validators.required],
      describaAlarma: [perfiles['describaAlarma'] || '', Validators.required],
      indiqueUtilizan: [perfiles['indiqueUtilizan'] || '', Validators.required],
      describaSistemas: [perfiles['describaSistemas'] || '', Validators.required],
      indicarCamaras: [perfiles['indicarCamaras'] || '', Validators.required],
      mencioneInspeccion: [perfiles['mencioneInspeccion'] || '', Validators.required],
      senalarUbicacion: [perfiles['senalarUbicacion'] || '', Validators.required],
      indiqueHorarios: [perfiles['indiqueHorarios'] || '', Validators.required],
      indiqueRevisan: [perfiles['indiqueRevisan'] || '', Validators.required],
      indiqueDesignado: [perfiles['indiqueDesignado'] || '', Validators.required],
      comoDocumentan: [perfiles['comoDocumentan'] || '', Validators.required]
    };
  }

  /**
   * @method crearControlesInspeccion
   * @description
   * Crea los controles relacionados con inspección y documentación.
   */
  private static crearControlesInspeccion(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      indiqueTiempo: [perfiles['indiqueTiempo'] || '', Validators.required],
      contarPlanta: [perfiles['contarPlanta'] || '', Validators.required],
      estosSistemas: [perfiles['estosSistemas'] || '', Validators.required],
      indicarCircuito: [perfiles['indicarCircuito'] || '', Validators.required],
      describaImplementado: [perfiles['describaImplementado'] || '', Validators.required],
      formaControlan: [perfiles['formaControlan'] || '', Validators.required],
      indiqueTodas: [perfiles['indiqueTodas'] || '', Validators.required],
      indiquePlanta: [perfiles['indiquePlanta'] || '', Validators.required],
      cuentaDocumentado: [perfiles['cuentaDocumentado'] || '', Validators.required],
      indiquePuertas: [perfiles['indiquePuertas'] || '', Validators.required],
      indiqueCerrado: [perfiles['indiqueCerrado'] || '', Validators.required],
      indicarCircuitoCerrado: [perfiles['indicarCircuitoCerrado'] || '', Validators.required]
    };
  }

  /**
   * @method actualizarFormularioConEstado
   * @description
   * Actualiza los valores del formulario con los datos del estado actual.
   * Se ejecuta cuando el estado cambia después de la inicialización del formulario.
   */
  actualizarFormularioConEstado(): void {
    if (!this.seguridadFisicaForm || !this.solicitudState?.perfiles) {
      return;
    }

    const PERFILES = this.solicitudState.perfiles;
    Object.keys(this.seguridadFisicaForm.controls).forEach(fieldName => {
      const CONTROL = this.seguridadFisicaForm.get(fieldName);
      const STATE_VALUE = PERFILES[fieldName as keyof typeof PERFILES];
      if (CONTROL && STATE_VALUE !== undefined && STATE_VALUE !== null && STATE_VALUE !== '') {
        if (CONTROL.value !== STATE_VALUE) {
          CONTROL.setValue(STATE_VALUE, { emitEvent: false });
        }
      }
    });
  }

  /**
   * Establece valores en el store desde un control de formulario específico.
   * Actualiza el estado global con el valor del campo si no es nulo o indefinido.
   * 
   * param form - Formulario que contiene el control
   * param campo - Nombre del campo a actualizar en el store
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite32610Store.actualizarEstado({ perfiles: { [campo]: CONTROL.value } });
    }
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}