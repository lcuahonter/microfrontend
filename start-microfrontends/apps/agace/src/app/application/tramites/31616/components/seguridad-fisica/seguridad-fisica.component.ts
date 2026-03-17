import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud31616PerfilesState,
  Tramite31616PerfilesStore,
} from '../../../../estados/tramites/tramite31616_perfiles.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { TEXTOS_ESTATICOS_SEGURIDAD } from '../../constantes/texto-estatico-dos.enum';
import { Tramite31616PerfilesQuery } from '../../../../estados/queries/tramite31616_perfiles.query';
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
   * @property {Solicitud31616PerfilesState} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Solicitud31616PerfilesState;

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
   * @param {Tramite31616PerfilesStore} tramite31616Store - Store para gestionar el estado de la solicitud.
   * @param {Tramite31616PerfilesQuery} tramite31616Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31616Store: Tramite31616PerfilesStore,
    private tramite31616Query: Tramite31616PerfilesQuery
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
    this.tramite31616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.crearFormularioSeguridadFisica();
  }

  /**
   * @method crearFormularioSeguridadFisica
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para la seguridad física.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearFormularioSeguridadFisica(): void {
    this.seguridadFisicaForm = this.fb.group({
      indiqueMateriales: [
        this.solicitudState?.indiqueMateriales,
        Validators.required,
      ],
      queForma: [
        this.solicitudState?.queForma,
        Validators.required,
      ],
      personalResponsable: [
        this.solicitudState?.personalResponsable,
        Validators.required,
      ],
      indiqueCuantas: [
        this.solicitudState?.indiqueCuantas,
        Validators.required,
      ],
      indiqueMonitoreadas: [
        this.solicitudState?.indiqueMonitoreadas,
        Validators.required,
      ],
      detalleExisten: [
        this.solicitudState?.detalleExisten,
        Validators.required,
      ],
      describaAcceso: [
        this.solicitudState?.describaAcceso,
        Validators.required,
      ],
      describirTipo: [
        this.solicitudState?.describirTipo,
        Validators.required,
      ],
      describaAreas: [
        this.solicitudState?.describaAreas,
        Validators.required,
      ],
      senaleMismas: [
        this.solicitudState?.senaleMismas,
        Validators.required,
      ],
      casoNoContar: [
        this.solicitudState?.casoNoContar,
        Validators.required,
      ],
      periodicidadVerifica: [
        this.solicitudState?.periodicidadVerifica,
        Validators.required,
      ],
      indiqueTareas: [
        this.solicitudState?.indiqueTareas,
        Validators.required,
      ],
      describaManera: [
        this.solicitudState?.describaManera,
        Validators.required,
      ],
      indiqueSepara: [
        this.solicitudState?.indiqueSepara,
        Validators.required,
      ],
      senaleRestringido: [
        this.solicitudState?.senaleRestringido,
        Validators.required,
      ],
      describaMonitoreo: [
        this.solicitudState?.describaMonitoreo,
        Validators.required,
      ],
      responsablesControlar: [
        this.solicitudState?.responsablesControlar,
        Validators.required,
      ],
      estacionamientos: [
        this.solicitudState?.estacionamientos,
        Validators.required,
      ],
      llevaEntrada: [
        this.solicitudState?.llevaEntrada,
        Validators.required,
      ],
      politicasMecanismos: [
        this.solicitudState?.politicasMecanismos,
        Validators.required,
      ],
      procedimientoOperacion: [
        this.solicitudState?.procedimientoOperacion,
        Validators.required,
      ],
      senaleEncuentran: [
        this.solicitudState?.senaleEncuentran,
        Validators.required,
      ],
      mencioneCuenta: [
        this.solicitudState?.mencioneCuenta,
        Validators.required,
      ],
      queManera: [
        this.solicitudState?.queManera,
        Validators.required,
      ],
      describaContactar: [
        this.solicitudState?.describaContactar,
        Validators.required,
      ],
      indiqueOperativo: [
        this.solicitudState?.indiqueOperativo,
        Validators.required,
      ],
      indiqueAparatos: [
        this.solicitudState?.indiqueAparatos,
        Validators.required,
      ],
      mantenimiento: [
        this.solicitudState?.mantenimiento,
        Validators.required,
      ],
      politicasAparatos: [
        this.solicitudState?.politicasAparatos,
        Validators.required,
      ],
      programaMantenimiento: [
        this.solicitudState?.programaMantenimiento,
        Validators.required,
      ],
      indiqueRespaldo: [
        this.solicitudState?.indiqueRespaldo,
        Validators.required,
      ],
      describaAlarma: [
        this.solicitudState?.describaAlarma,
        Validators.required,
      ],
      indiqueUtilizan: [
        this.solicitudState?.indiqueUtilizan,
        Validators.required,
      ],
      describaSistemas: [
        this.solicitudState?.describaSistemas,
        Validators.required,
      ],
      indicarCamaras: [
        this.solicitudState?.indicarCamaras,
        Validators.required,
      ],
      mencioneInspeccion: [
        this.solicitudState?.mencioneInspeccion,
        Validators.required,
      ],
      senalarUbicacion: [
        this.solicitudState?.senalarUbicacion,
        Validators.required,
      ],
      indiqueHorarios: [
        this.solicitudState?.indiqueHorarios,
        Validators.required,
      ],
      indiqueRevisan: [
        this.solicitudState?.indiqueRevisan,
        Validators.required,
      ],
      indiqueDesignado: [
        this.solicitudState?.indiqueDesignado,
        Validators.required,
      ],
      comoDocumentan: [
        this.solicitudState?.comoDocumentan,
        Validators.required,
      ],
      indiqueTiempo: [
        this.solicitudState?.indiqueTiempo,
        Validators.required,
      ],
      contarPlanta: [
        this.solicitudState?.contarPlanta,
        Validators.required,
      ],
      estosSistemas: [
        this.solicitudState?.estosSistemas,
        Validators.required,
      ],
      indicarCircuito: [
        this.solicitudState?.indicarCircuito,
        Validators.required,
      ],
      describaImplementado: [
        this.solicitudState?.describaImplementado,
        Validators.required,
      ],
      formaControlan: [
        this.solicitudState?.formaControlan,
        Validators.required,
      ],
      indiqueTodas: [
        this.solicitudState?.indiqueTodas,
        Validators.required,
      ],
      indiquePlanta: [
        this.solicitudState?.indiquePlanta,
        Validators.required,
      ],
      cuentaDocumentado: [
        this.solicitudState?.cuentaDocumentado,
        Validators.required,
      ],
      indiquePuertas: [
        this.solicitudState?.indiquePuertas,
        Validators.required,
      ],
      indiqueCerrado: [
        this.solicitudState?.indiqueCerrado,
        Validators.required,
      ],
      indicarCircuitoCerrado: [
        this.solicitudState?.indicarCircuitoCerrado,
        Validators.required,
      ],
    });
  }

  /**
   * @method setValoresStore
   * @description
   * Actualiza el estado del store con el valor de un campo específico del formulario.
   * @param {FormGroup} form - Formulario reactivo que contiene los valores.
   * @param {string} campo - Nombre del campo del formulario.
   * @param {keyof Tramite31616PerfilesStore} metodoNombre - Método del store que se debe invocar.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31616PerfilesStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31616Store[metodoNombre] as (value: string) => void)(VALOR);
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