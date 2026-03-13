import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tramite32609Store, Tramites32609State } from '../../../estados/tramites32609.store';
import { CommonModule } from '@angular/common';
import { TEXTOS_ESTATICOS_SEGURIDAD_INFORMACION } from '../../../enums/texto-estatico-dos.enum';
import { Tramite32609Query } from '../../../estados/tramites32609.query';

/**
 * Componente encargado de gestionar la sección de "Seguridad de la Información y Documentación"
 * dentro del trámite 31616. Se encarga de construir un formulario reactivo con datos precargados,
 * sincronizados con el store del estado del trámite.
 */
@Component({
  selector: 'app-seguridad-informacion-documentacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './seguridad-informacion-documentacion.component.html',
  styleUrl: './seguridad-informacion-documentacion.component.scss'
})
export class SeguridadInformacionDocumentacionComponent implements OnInit,OnDestroy{
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_INFORMACION

  /**
   * Formulario reactivo que contiene los campos relacionados con la seguridad de la información.
   */
  seguridadInformacion!: FormGroup;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Tramites32609State;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * 
   * @param fb Constructor de formularios reactivos.
   * @param tramite32609Store Store personalizado del trámite 31616.
   * @param tramite32609Query Query personalizado del trámite 31616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32609Store: Tramite32609Store,
    private tramite32609Query: Tramite32609Query
  ) {
    //Añade lógica aquí
  }

  /**
   * Hook de inicialización del componente.
   * Se suscribe al estado del query y genera el formulario con datos precargados.
   */
  ngOnInit(): void {
    this.tramite32609Query.selectTramite32609$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.solicitudState = seccionState;
        this.actualizarFormularioConEstado();
      });
  }

  /**
   * Actualiza el formulario con el estado actual si está disponible.
   */
  private actualizarFormularioConEstado(): void {
    if (this.solicitudState) {
      this.crearFormularioDeGestión();
    }
  }

  /**
   * Crea el formulario reactivo utilizando los valores actuales del estado.
   * Cada campo incluye una validación requerida para asegurar su completitud.
   */
  crearFormularioDeGestión(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.seguridadInformacion = this.fb.group({
      ...SeguridadInformacionDocumentacionComponent.crearControlesPrimarios(PERFILES),
      ...SeguridadInformacionDocumentacionComponent.crearControlesSecundarios(PERFILES),
      ...SeguridadInformacionDocumentacionComponent.crearControlesTerciarios(PERFILES)
    });
  }

  /**
   * Crea los controles primarios del formulario de seguridad de información.
   */
  private static crearControlesPrimarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      seguridadDeLaTecnologia: [perfiles['seguridadDeLaTecnologia'] || ''],
      encuentranFuera: [perfiles['encuentranFuera'] || '', Validators.required],
      actualizacionesSeguridad: [perfiles['actualizacionesSeguridad'] || '', Validators.required],
      accesoLosMismos: [perfiles['accesoLosMismos'] || '', Validators.required],
      continuidadNegocio: [perfiles['continuidadNegocio'] || '', Validators.required],
      semanaCorresponda: [perfiles['semanaCorresponda'] || '', Validators.required],
      recuperarInformacion: [perfiles['recuperarInformacion'] || '', Validators.required],
      informacionArchivada: [perfiles['informacionArchivada'] || '', Validators.required]
    };
  }

  /**
   * Crea los controles secundarios del formulario de seguridad de información.
   */
  private static crearControlesSecundarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      procesoDatos: [perfiles['procesoDatos'] || '', Validators.required],
      copiasSeguridad: [perfiles['copiasSeguridad'] || '', Validators.required],
      proteccionDeLaInformacion: [perfiles['proteccionDeLaInformacion'] || '', Validators.required],
      perdidaDeLaInformacion: [perfiles['perdidaDeLaInformacion'] || '', Validators.required],
      controlanSistemas: [perfiles['controlanSistemas'] || '', Validators.required],
      accionesDelResto: [perfiles['accionesDelResto'] || '', Validators.required],
      sistemasConfidenciales: [perfiles['sistemasConfidenciales'] || '', Validators.required],
      proporcionaEsasContrasenas: [perfiles['proporcionaEsasContrasenas'] || '', Validators.required]
    };
  }

  /**
   * Crea los controles terciarios del formulario de seguridad de información.
   */
  private static crearControlesTerciarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      actualizacionesPeriodicas: [perfiles['actualizacionesPeriodicas'] || '', Validators.required],
      falsificadosLicencias: [perfiles['falsificadosLicencias'] || '', Validators.required],
      procesoDeImportacion: [perfiles['procesoDeImportacion'] || '', Validators.required],
      telecomunicaciones: [perfiles['telecomunicaciones'] || '', Validators.required],
      sistemaComprometido: [perfiles['sistemaComprometido'] || '', Validators.required]
    };
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
      this.tramite32609Store.establecerDatos({ perfiles: { [campo]: CONTROL.value } });
    }
  }

  /**
   * Hook de destrucción del componente.
   * Cancela todas las suscripciones activas emitiendo y completando el `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
