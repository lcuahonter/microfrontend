import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud31616PerfilesMensajeriaState, Tramite31616PerfilesMensajeriaStore } from '../../../../estados/tramites/tramite31616_perfilesMensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TEXTOS_ESTATICOS_SEGURIDAD_INFORMACION } from '../../constantes/texto-estatico-dos.enum';
import { Tramite31616PerfilesMensajeriaQuery } from '../../../../estados/queries/tramite31616_perfilesMensajeria.query';

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
  public solicitudState!: Solicitud31616PerfilesMensajeriaState;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * 
   * @param fb Constructor de formularios reactivos.
   * @param tramite31616Store Store personalizado del trámite 31616.
   * @param tramite31616Query Query personalizado del trámite 31616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31616Store: Tramite31616PerfilesMensajeriaStore,
    private tramite31616Query: Tramite31616PerfilesMensajeriaQuery
  ) {
    //Añade lógica aquí
  }

  /**
   * Hook de inicialización del componente.
   * Se suscribe al estado del query y genera el formulario con datos precargados.
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

    this.crearFormularioDeGestión();
  }

  /**
   * Crea el formulario reactivo utilizando los valores actuales del estado.
   * Cada campo incluye una validación requerida para asegurar su completitud.
   */
  crearFormularioDeGestión(): void {
    this.seguridadInformacion = this.fb.group({
      seguridadDeLaTecnologia: [this.solicitudState?.seguridadDeLaTecnologia],
      encuentranFuera: [this.solicitudState?.encuentranFuera, Validators.required],
      actualizacionesSeguridad: [this.solicitudState?.actualizacionesSeguridad, Validators.required],
      accesoLosMismos: [this.solicitudState?.accesoLosMismos, Validators.required],
      continuidadNegocio: [this.solicitudState?.continuidadNegocio, Validators.required],
      semanaCorresponda: [this.solicitudState?.semanaCorresponda, Validators.required],
      recuperarInformacion: [this.solicitudState?.recuperarInformacion, Validators.required],
      informacionArchivada: [this.solicitudState?.informacionArchivada, Validators.required],
      procesoDatos: [this.solicitudState?.procesoDatos, Validators.required],
      copiasSeguridad: [this.solicitudState?.copiasSeguridad, Validators.required],
      proteccionDeLaInformacion: [this.solicitudState?.proteccionDeLaInformacion, Validators.required],
      perdidaDeLaInformacion: [this.solicitudState?.perdidaDeLaInformacion, Validators.required],
      controlanSistemas: [this.solicitudState?.controlanSistemas, Validators.required],
      accionesDelResto: [this.solicitudState?.accionesDelResto, Validators.required],
      sistemasConfidenciales: [this.solicitudState?.sistemasConfidenciales, Validators.required],
      proporcionaEsasContrasenas: [this.solicitudState?.proporcionaEsasContrasenas, Validators.required],
      actualizacionesPeriodicas: [this.solicitudState?.actualizacionesPeriodicas, Validators.required],
      falsificadosLicencias: [this.solicitudState?.falsificadosLicencias, Validators.required],
      procesoDeImportacion: [this.solicitudState?.procesoDeImportacion, Validators.required],
      telecomunicaciones: [this.solicitudState?.telecomunicaciones, Validators.required],
      sistemaComprometido: [this.solicitudState?.sistemaComprometido, Validators.required]
    });
  }

  /**
   * Establece un valor en el store del trámite llamando dinámicamente al método correspondiente.
   * 
   * @param form Formulario que contiene el valor del campo.
   * @param campo Nombre del campo dentro del formulario.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite31616PerfilesMensajeriaStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31616Store[metodoNombre] as (value: string) => void)(VALOR);
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
