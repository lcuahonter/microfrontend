import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';

import { Contribuyente, ContribuyenteRespuesta } from '../../models/donaciones-extranjeras.model';
import { RegistroDeDonacion10303State, Tramite10303Store } from '../../estados/tramites/tramite10303.store';
import { Catalogo } from '@ng-mf/data-access-user';
import { Tramite10303Query } from '../../estados/queries/tramite10303.query';

/**
 * Componente para gestionar los datos del donantario.
 */
@Component({
  selector: 'app-datos-donatario',
  templateUrl: './datos-donatario.component.html',
  styleUrl: './datos-donatario.component.scss'
})
export class DatosDonatarioComponent implements OnInit, OnDestroy {
  /**
   * Formulario de datos del donatario.
   */
  datosDonatarioForm!: FormGroup;

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
    private fb: FormBuilder,
    private tramite10303Store: Tramite10303Store,
    private tramite10303Query: Tramite10303Query,
    private toastr: ToastrService
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
    this.crearDatosDonatarioForm();

    this.paisSeleccion();

    if (this.formularioDeshabilitado) {
      this.datosDonatarioForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.datosDonatarioForm.enable();
    }
  }

  /**
    * Inicializa el formulario reactivo
    * @returns {void}
    */
  crearDatosDonatarioForm(): void {
    this.datosDonatarioForm = this.fb.group({
      rfcDonatario: [this.registroDeDonacionState?.rfcDonatario],
      nombreDonatario: [{ value: this.registroDeDonacionState?.nombreDonatario, disabled: true }],
      calleDonatario: [{ value: this.registroDeDonacionState?.calleDonatario, disabled: true }],
      numExteriorDonatario: [{ value: this.registroDeDonacionState?.numExteriorDonatario, disabled: true }],
      numInteriorDonatario: [{ value: this.registroDeDonacionState?.numInteriorDonatario, disabled: true }],
      cvePaisDonatario: [{ value: this.registroDeDonacionState?.cvePaisDonatario, disabled: true }],
      codigoPostalDonatario: [{ value: this.registroDeDonacionState?.codigoPostalDonatario, disabled: true }],
      estadoDonatario: [{ value: this.registroDeDonacionState?.estadoDonatario, disabled: true }],
      coloniaDonatario: [{ value: this.registroDeDonacionState?.coloniaDonatario, disabled: true }],
      correoElectronicoDonatario: [{ value: this.registroDeDonacionState?.correoElectronicoDonatario, disabled: true }],
      telefonoDonatario: [{ value: this.registroDeDonacionState?.telefonoDonatario, disabled: true }]
    });
  }

  /**
   * Inicializa los catálogos necesarios, como el de países.
   */
  inicializaCatalogos(): void {
    const PAIS$ = this.donacionesExtranjerasService
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
    const PAIS = this.datosDonatarioForm.get('cvePaisDonatario')?.value;
    this.tramite10303Store.setCvePaisDonatario(PAIS);
  }

  /**
   * Busca un contribuyente por RFC y completa los datos del donatario si se encuentra.
   * @param valor - Valor que determina si se debe proceder o no con la búsqueda.
   * @param id - RFC del contribuyente a buscar.
   */
  buscarContribuyenteRfc(valor: number, id: string): void {
    //Implementar la lógica para buscar el colaborador por RFC
    this.donacionesExtranjerasService.buscarContribuyente(id).pipe(
      takeUntil(this.destruirNotificador$)
    )
      .subscribe({
        next: (result: ContribuyenteRespuesta) => {
          const DATA = result?.data[0];
          if (DATA !== null) {
            if (valor === 1) {
              this.construirDonatario(DATA, true);
            }
            else {
              this.toastr.error("Valor erronio");
            }
          } else {
            if (valor === 1) {
              this.construirDonatario(DATA, false);
            } else {
              this.toastr.error("Valor erronio");
            }
          }
        }
      });
  }

  /**
   * Completa los campos del formulario con los datos del contribuyente encontrado.
   * @param data - Datos del contribuyente obtenidos.
   * @param encontrado - Indica si el contribuyente fue encontrado.
   */
  construirDonatario(data: Contribuyente, encontrado: boolean): void {
    if (encontrado) {
      const VALORES_DE_FORMATO = {
        nombreDonatario: data.rfc.length === 12 ? data.razonSocial ?? '' : `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        calleDonatario: data.calle,
        numExteriorDonatario: data.numeroExterior,
        numInteriorDonatario: data.numeroInterior ?? '',
        estadoDonatario: data.estado,
        coloniaDonatario: data.colonia,
        codigoPostalDonatario: data.codigoPostal,
        cvePaisDonatario: data.pais,
        correoElectronicoDonatario: data.correoElectronico,
        telefonoDonatario: data.telefono
      };

      this.datosDonatarioForm.patchValue(VALORES_DE_FORMATO);
      
      this.tramite10303Store.setNombreDonatario(VALORES_DE_FORMATO.nombreDonatario);
      this.tramite10303Store.setCalleDonatario(VALORES_DE_FORMATO.calleDonatario);
      this.tramite10303Store.setNumExteriorDonatario(VALORES_DE_FORMATO.numExteriorDonatario);
      this.tramite10303Store.setNumInteriorDonatario(VALORES_DE_FORMATO.numInteriorDonatario);
      this.tramite10303Store.setEstadoDonatario(VALORES_DE_FORMATO.estadoDonatario);
      this.tramite10303Store.setColoniaDonatario(VALORES_DE_FORMATO.coloniaDonatario);
      this.tramite10303Store.setCodigoPostalDonatario(VALORES_DE_FORMATO.codigoPostalDonatario);
      this.tramite10303Store.setCvePaisDonatario(VALORES_DE_FORMATO.cvePaisDonatario);
      this.tramite10303Store.setCorreoElectronicoDonatario(VALORES_DE_FORMATO.correoElectronicoDonatario);
      this.tramite10303Store.setTelefonoDonatario(VALORES_DE_FORMATO.telefonoDonatario);
    } else {
      this.restablecerFormulario();
    }
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
   * Resetea todos los campos del formulario a sus valores iniciales.
   */
  restablecerFormulario(): void {
    this.datosDonatarioForm.reset();
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
