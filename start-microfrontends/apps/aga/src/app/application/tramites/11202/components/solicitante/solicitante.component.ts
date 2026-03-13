import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ReplaySubject, Subject, map, takeUntil } from "rxjs";
import { Solicitud11202State, Solicitud11202Store } from "../../estados/solicitud11202.store";
import { Solicitud11202Query } from "../../estados/solicitud11202.query";

/**
 * Componente para gestionar el formulario del solicitante.
 */
@Component({
  selector: "app-solicitante",
  templateUrl: "./solicitante.component.html",
  styleUrl: "./solicitante.component.scss",
})
export class SolicitanteComponent implements OnInit, OnDestroy {
  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud11202State;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Formulario principal de la solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Constructor para inyectar las dependencias necesarias.
   * @param fb - Servicio FormBuilder para crear formularios reactivos.
   */
  // eslint-disable-next-line no-empty-function
  constructor(
    public fb: FormBuilder,
    public solicitudStore: Solicitud11202Store,
    private solicitudQuery: Solicitud11202Query
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario `solicitudForm` con los campos necesarios.
   * @returns {void}
   */
  ngOnInit(): void {
    this.solicitudQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    // Inicializar el formulario principal
    this.crearFormSolicitud();
  }

  /**
   * Crea el formulario de solicitud.
   * @return {void} No retorna ningún valor.
   */
  crearFormSolicitud(): void {
    this.solicitudForm = this.fb.group({
      datosGenerales: this.fb.group({
        rfc: [this.solicitudState?.rfc],
        denominacion: [this.solicitudState?.denominacion],
        actividadEconomica: [this.solicitudState?.actividadEconomica],
        correoElectronico: [this.solicitudState?.correoElectronico],
      }),
      domicilioFiscal: this.fb.group({
        pais: [this.solicitudState?.pais],
        codigoPostal: [this.solicitudState?.codigoPostal],
        estado: [this.solicitudState?.estado],
        municipioAlcaldia: [this.solicitudState?.municipioAlcaldia],
        localidad: [this.solicitudState?.localidad],
        colonia: [this.solicitudState?.colonia],
        calle: [this.solicitudState?.calle],
        numeroExterior: [this.solicitudState?.numeroExterior],
        numeroInterior: [this.solicitudState?.numeroInterior],
        lada: [this.solicitudState?.lada],
        telefono: [this.solicitudState?.telefono],
      })
    });
  }

  /**
 * Establece los valores en el store de tramite5701.
 *
 * @param {FormGroup} form - El formulario del cual se obtiene el valor.
 * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
 * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
 * @returns {void}
 */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud11202Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitudStore[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Obtiene el grupo de formulario 'datosGenerales' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'datosGenerales'.
   */
  get datosGenerales(): FormGroup {
    return this.solicitudForm.get("datosGenerales") as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'domicilioFiscal' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'domicilioFiscal'.
   */
  get domicilioFiscal(): FormGroup {
    return this.solicitudForm.get("domicilioFiscal") as FormGroup;
  }

  /**
   * Este método se utiliza para destruir la suscripción.
   * @returns destroyed$
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
