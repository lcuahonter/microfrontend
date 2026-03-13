import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, map, merge, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Contribuyente, ContribuyenteRespuesta } from '../../models/donaciones-extranjeras.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegistroDeDonacion10303State, Tramite10303Store } from '../../estados/tramites/tramite10303.store';
import { Catalogo } from '@ng-mf/data-access-user';
import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';
import { Tramite10303Query } from '../../estados/queries/tramite10303.query';

/**
 * Componente para gestionar los datos del fabricante.
 */
@Component({
  selector: 'app-datos-del-fabricante',
  templateUrl: './datos-del-fabricante.component.html',
  styleUrl: './datos-del-fabricante.component.scss'
})
export class DatosDelFabricanteComponent implements OnInit, OnDestroy {
  /**
   * Formulario de datos del fabricante.
   */
  datosDelFabricanteForm!: FormGroup;

  /**
   * Subject para destruir las suscripciones.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /** 
    * Lista de países obtenida desde el servicio.
    * @type {Catalogo[]}
    */
  pais!: Catalogo[];

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
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private tramite10303Store: Tramite10303Store,
    private tramite10303Query: Tramite10303Query
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Se ejecuta al inicializar el componente.
   * Llama a la función `inicializaCatalogos()` para obtener los catálogos.
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
    this.crearDatosDelFabricanteForm();

    this.paisSeleccion();
    
    if (this.formularioDeshabilitado) {
      this.datosDelFabricanteForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.datosDelFabricanteForm.enable();
    }
  }

  /**
    * Inicializa el formulario reactivo
    * @returns {void}
    */
  crearDatosDelFabricanteForm(): void {
    this.datosDelFabricanteForm = this.fb.group({
      rfcFabricante: [this.registroDeDonacionState?.rfcFabricante],
      nombreFabricante: [{ value: this.registroDeDonacionState?.nombreFabricante, disabled: true }],
      calleFabricante: [{ value: this.registroDeDonacionState?.calleFabricante, disabled: true }],
      numExteriorFabricante: [{ value: this.registroDeDonacionState?.numExteriorFabricante, disabled: true }],
      numInteriorFabricante: [{ value: this.registroDeDonacionState?.numInteriorFabricante, disabled: true }],
      cvePaisFabricante: [{ value: this.registroDeDonacionState?.cvePaisFabricante, disabled: true }],
      codigoPostalFabricante: [{ value: this.registroDeDonacionState?.codigoPostalFabricante, disabled: true }],
      estadoFabricante: [{ value: this.registroDeDonacionState?.estadoFabricante, disabled: true }],
      coloniaFabricante: [{ value: this.registroDeDonacionState?.coloniaFabricante, disabled: true }]
    });
  }

  /**
   * Inicializa los catálogos necesarios, como el de países.
   */
  inicializaCatalogos(): void {
    const PAIS$: Observable<void> = this.donacionesExtranjerasService
      .getPaises()
      .pipe(
        map((resp) => {
          this.pais = resp.data;
        })        
      );

    merge(
      PAIS$
    )
    .pipe(takeUntil(this.destruirNotificador$))
    .subscribe();
  }

  /**
   * Establece el país seleccionado en el store de tramite10303.
   */
  paisSeleccion(): void {
    const PAIS = this.datosDelFabricanteForm.get('cvePaisFabricante')?.value;
    this.tramite10303Store.setCvePaisFabricante(PAIS);
  }

  /**
   * Busca un contribuyente por su RFC.
   * 
   * @param valor Valor numérico para la búsqueda.
   * @param id Identificador del contribuyente.
   */
  buscarContribuyenteRfc(valor: number, id: string): void {
    //Implementar la lógica para buscar el colaborador por RFC
    this.donacionesExtranjerasService.buscarContribuyente(id).pipe(
      takeUntil(this.destruirNotificador$)
    ).subscribe({
      next: (result: ContribuyenteRespuesta) => {
        const DATA = result?.data[0];
        if (DATA !== null) {
          if (valor === 6) {
            this.fabricante(DATA, true);
          }
          else {
            this.toastrService.error('Valor erronio');
          }
        } else {
          if (valor === 6) {
            this.fabricante(DATA, false);
          } else {
            this.toastrService.error('Valor erronio');
          }
        }
      }
    });
  }

  /**
   * Procesa los datos del fabricante.
   * 
   * @param data Datos del contribuyente.
   * @param encontrado Indica si el contribuyente fue encontrado.
   */
  fabricante(data: Contribuyente, encontrado: boolean): void {
    if (encontrado) {
      const VALORES_DE_FORMATO = {
        nombreFabricante: data.rfc.length === 12 ? data.razonSocial ?? '' : `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        calleFabricante: data.calle,
        numExteriorFabricante: data.numeroExterior,
        numInteriorFabricante: data.numeroInterior ?? '',
        estadoFabricante: data.estado,
        coloniaFabricante: data.colonia,
        codigoPostalFabricante: data.codigoPostal,
        cvePaisFabricante: data.pais
      };

      this.datosDelFabricanteForm.patchValue(VALORES_DE_FORMATO);

      this.tramite10303Store.setNombreFabricante(VALORES_DE_FORMATO.nombreFabricante);
      this.tramite10303Store.setCalleFabricante(VALORES_DE_FORMATO.calleFabricante);
      this.tramite10303Store.setNumExteriorFabricante(VALORES_DE_FORMATO.numExteriorFabricante);
      this.tramite10303Store.setNumInteriorFabricante(VALORES_DE_FORMATO.numInteriorFabricante);
      this.tramite10303Store.setEstadoFabricante(VALORES_DE_FORMATO.estadoFabricante);
      this.tramite10303Store.setColoniaFabricante(VALORES_DE_FORMATO.coloniaFabricante);
      this.tramite10303Store.setCodigoPostalFabricante(VALORES_DE_FORMATO.codigoPostalFabricante);
      this.tramite10303Store.setCvePaisFabricante(VALORES_DE_FORMATO.cvePaisFabricante);
    } else {
      this.restablecerFormulario();
    }
  }

  /**
   * Resetea todos los campos del formulario a sus valores iniciales.
   */
  restablecerFormulario(): void {
    this.datosDelFabricanteForm.reset();
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
