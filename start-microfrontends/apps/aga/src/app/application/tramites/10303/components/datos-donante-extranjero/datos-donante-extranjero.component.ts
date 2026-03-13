import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';

import { RegistroDeDonacion10303State, Tramite10303Store } from '../../estados/tramites/tramite10303.store';
import { Catalogo } from '@ng-mf/data-access-user';
import { DATOS_DONAR_EXTRANJERO_LABELS } from '../../constantes/donaciones-extranjeras.enum';
import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';
import { Tramite10303Query } from '../../estados/queries/tramite10303.query';

/**
 * Componente para gestionar los datos del donante extranjero.
 */
@Component({
  selector: 'app-datos-donante-extranjero',
  templateUrl: './datos-donante-extranjero.component.html',
  styleUrl: './datos-donante-extranjero.component.scss'
})
export class DatosDonanteExtranjeroComponent implements OnInit, OnDestroy {
  /**
   * Formulario de datos del donante extranjero.
   */
  datosDonanteExtranjeroForm!: FormGroup;
  
  /**
   * Subject para destruir las suscripciones.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Lista de países.
   */
  pais!: Catalogo[];

  /**
   * Lista de documentos de residencia.
   */
  cveDocumentoResidencia!: Catalogo[];

  /**
   * Etiquetas de los datos del donante extranjero.
   */
  datosDonanteExtranjero = DATOS_DONAR_EXTRANJERO_LABELS;

  /**
    * Estado de la registro de donacion.
    */
  public registroDeDonacionState: RegistroDeDonacion10303State | undefined;

  /**
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado!: boolean;

  /**
   * Constructor del componente.
   * 
   * @param donacionesExtranjerasService Servicio para gestionar las donaciones extranjeras.
   */
  constructor(
    private donacionesExtranjerasService: DonacionesExtranjerasService,
    private fb: FormBuilder,
    private tramite10303Store: Tramite10303Store,
    private tramite10303Query: Tramite10303Query
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.tramite10303Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.registroDeDonacionState = seccionState;
        })
      )
      .subscribe();

    // Inicializar el formulario principal
    this.crearDatosDonateExtranjeroForm();

    this.paisSeleccion();
    this.documentoResidenciaSeleccion();

    if (this.formularioDeshabilitado) {
      this.datosDonanteExtranjeroForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.datosDonanteExtranjeroForm.enable();
    }
  }

  /**
    * Inicializa el formulario reactivo
    * @returns {void}
    */
  crearDatosDonateExtranjeroForm(): void {
    this.datosDonanteExtranjeroForm = this.fb.group({
      razonSocial: [this.registroDeDonacionState?.razonSocial],
      calleDonante: [this.registroDeDonacionState?.calleDonante],
      numExteriorLabel: [this.registroDeDonacionState?.numExteriorLabel],
      numInteriorDonante: [this.registroDeDonacionState?.numInteriorDonante],
      pais: [this.registroDeDonacionState?.pais],
      codigoPostal: [this.registroDeDonacionState?.codigoPostal],
      informacionExtra: [this.registroDeDonacionState?.informacionExtra],
      coloniaDonante: [this.registroDeDonacionState?.coloniaDonante],
      correoElectronicoDonante: [this.registroDeDonacionState?.correoElectronicoDonante],
      telefonoDonante: [this.registroDeDonacionState?.telefonoDonante],
      cveDocumentoResidencia: [this.registroDeDonacionState?.cveDocumentoResidencia]
    });
  }

  /**
   * Inicializa los catálogos de países y documentos de residencia.
   */
  inicializaCatalogos(): void {
    const PAIS$ = this.donacionesExtranjerasService
      .getPaises()
      .pipe(
        map((resp) => {
          this.pais = resp.data;
        })        
      );

    const CVE_DOCUMENTO_RESIDENCIA$ = this.donacionesExtranjerasService
      .getDocumentoResidencia()
      .pipe(
        map((resp) => {
          this.cveDocumentoResidencia = resp.data;
        })
      );

    merge(
      PAIS$,
      CVE_DOCUMENTO_RESIDENCIA$
    )
    .pipe(takeUntil(this.destruirNotificador$))
    .subscribe();
  }

  /**
   * Establece el país seleccionado en el store de tramite10303.
   */
  paisSeleccion(): void {
    const PAIS = this.datosDonanteExtranjeroForm.get('pais')?.value;
    this.tramite10303Store.setPais(PAIS);
  }

  /**
   * Establece el documento de residencia seleccionado en el store de tramite10303.
   */
  documentoResidenciaSeleccion(): void {
    const DOCUMENTO_RESIDENCIA = this.datosDonanteExtranjeroForm.get('cveDocumentoResidencia')?.value;
    this.tramite10303Store.setDocumentoResidencia(DOCUMENTO_RESIDENCIA);
  }

  /**
    * Establece los valores en el store de tramite5701.
    *
    * @param {FormGroup} form - El formulario del cual se obtiene el valor.
    * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
    * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
    * @returns {void}
    */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite10303Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite10303Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}
