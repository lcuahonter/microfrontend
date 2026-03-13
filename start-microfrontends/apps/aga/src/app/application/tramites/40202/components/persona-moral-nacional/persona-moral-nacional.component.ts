/* eslint-disable @typescript-eslint/naming-convention */
import { Catalogo, CatalogoSelectComponent, TituloComponent, esControlValido } from "@libs/shared/data-access-user/src";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ModificacionTransportacionMaritimaService } from "../../services/modificacion-transportacion-maritima/modificacion-transportacion-maritima.service";
import { PersonaCaat } from "../../models/empresa-caat.model";
import { TEXTOS } from "../../../40201/constantes/transportacion-maritima.enum";

/**
 * Componente para gestionar la información de personas morales nacionales.
 */
@Component({
  selector: 'app-persona-moral-nacional',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './persona-moral-nacional.component.html',
  styleUrl: './persona-moral-nacional.component.css',
})
export class PersonaMoralNacionalComponent implements OnInit, OnChanges {

  personaMoralForm!: FormGroup;

  /**
   * País.
   * @type {Catalogo[]}
   * @description Este arreglo contiene los catálogos de países.
   */
  pais!: Catalogo[];

  /**
   * Estado.
   * @type {Catalogo[]}
   * @description Este arreglo contiene los catálogos de estados.
   */
  estado!: Catalogo[];

  /**
   * Municipio.
   * @type {Catalogo[]}
   * @description Este arreglo contiene los catálogos de municipios.
   */
  municipio!: Catalogo[];

  /**
   * Colonia.
   * @type {Catalogo[]}
   * @description Este arreglo contiene los catálogos de colonias.
   */
  colonia!: Catalogo[];

  /**
   * Configuración para el persona moral nacional encabezado de la tabla.
 
  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param tramite40201Store Store para gestionar el estado del trámite 40201.
   * @param tramite40201Query Query para consultar el estado del trámite 40201.
   * @param transportacionMaritimaService Servicio para obtener los catálogos y datos relacionados con los transportacion marítima.
   */
  constructor(
    private fb: FormBuilder,
    private service: ModificacionTransportacionMaritimaService,
  ) { }

  /**
   * Evento que se emite al cerrar el modal.
   * @property {EventEmitter<boolean>} cerrar
   */
  @Output() cerrar = new EventEmitter<boolean>();

  /**
   * Evento que se emite al agregar o modificar una empresa CAAT.
   * @property {EventEmitter<PersonaCaat>} empresaCaat
   */
  @Output() empresaCaat = new EventEmitter<PersonaCaat>();

  /**
   * Datos de la empresa a modificar.
   * @property {PersonaCaat | null} empresaModificar
   */
  @Input() empresaModificar: PersonaCaat | null = null;

  TEXTOS = TEXTOS;

  /** Mensaje de validación para campos obligatorios. */
  mensajeCampoObligatorio: string = `<div class="text-danger">
          <small>Este campo es obligatorio</small>
        </div>`;

  /**
   * Inicializa el componente.
   * Suscribe a los cambios en el estado de la sección y crea el formulario reactivo.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();
    this.crearAgregarPMNForm();
  }


  /**
   * Detecta cambios en las propiedades de entrada del componente.
   * @param changes cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empresaModificar'] && this.empresaModificar) {
      this.crearAgregarPMNForm();
    }
  }

  /**
   * Inicializa el formulario reactivo para agregar personas morales nacionales.
   * @returns {void}
   */
  crearAgregarPMNForm(): void {
    if (!this.empresaModificar) {
      return;
    }
    const { rfc, razonSocial, correoElectronico, clavePais, codigoPostal, claveEntidad, claveDelegacionMunicipio, claveColonia, calle,
      numeroExterior, numeroInterio, nombreDirector, directorApellidoPaterno, directorApellidoMaterno, nombre, apellidoPaterno, apellidoMaterno
    } = this.empresaModificar || {};

    const NOMBRE_COMPLETO = nombre + ' ' + apellidoPaterno + ' ' + (apellidoMaterno || '');
    this.personaMoralForm = this.fb.group({
      rfcPMN: [{ value: rfc, disabled: true }, Validators.maxLength(13)],
      denominacionPMN: [
        { value: razonSocial || NOMBRE_COMPLETO, disabled: true },
        [Validators.maxLength(254)],
      ],
      correoPMN: [{ value: correoElectronico, disabled: true }, [Validators.maxLength(320)]],
      paisPMN: [clavePais || ''],
      codigoPostalPMN: [
        { value: codigoPostal, disabled: true },
        [Validators.maxLength(12)],
      ],
      estadoPMN: [claveEntidad || ''],
      municipioPMN: [claveDelegacionMunicipio || ''],
      localidadPMN: [
        { value: '', disabled: true },
        [Validators.maxLength(120)],
      ],
      coloniaPMN: [claveColonia || ''],
      callePMN: [{ value: calle, disabled: true }, [Validators.maxLength(100)]],
      numeroExteriorPMN: [
        { value: numeroExterior, disabled: true },
        [Validators.maxLength(100)],
      ],
      numeroInteriorPMN: [
        { value: numeroInterio, disabled: true },
        [Validators.maxLength(55)],
      ],
      nombreDirectorGeneral: [
        nombreDirector || '',
        [Validators.required, Validators.maxLength(200)],
      ],
      apellidoPaternoDirectorGeneral: [
        directorApellidoPaterno || '',
        [Validators.required, Validators.maxLength(200)],
      ],
      apellidoMaternoDirectorGeneral: [directorApellidoMaterno, [Validators.maxLength(200)]],
    });

    this.buscarMunicipio(claveDelegacionMunicipio);
    this.buscarColonias(claveColonia);
  }



  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  inicializaCatalogos(): void {
    this.service
      .obtenerPaises()
      .subscribe((res) => (this.pais = res.datos || []));

    this.service
      .obtenerEstados()
      .subscribe((res) => (this.estado = res.datos || []));
  }

  /**
   * busca y establece la lista de municipios para la clave de estado proporcionada.
   * @param cveEstado 
   */
  buscarMunicipio(cveEstado?: string): void {
    if (cveEstado) {
      this.service
        .obtenerMunicipios(cveEstado)
        .subscribe((res) => {
          this.municipio = res.datos || [];
        });
    }
  }

  /**
   * Obtiene y establece la lista de municipios para la clave de estado proporcionada.
   * @param cveEstado - Clave del estado para obtener los municipios.
   */

  buscarColonias(cveMunicipio?: string): void {
    if (cveMunicipio) {
      this.service
        .obtenerColonias(cveMunicipio)
        .subscribe((res) => {
          this.colonia = res.datos || [];
        });
    }
  }


  /**
   * Verifica si un control específico del formulario es inválido y fue tocado.
   * @param control Nombre del control dentro del formulario.
   * @returns true si el control es inválido y ha sido tocado; false en caso contrario.
   */
  esControlInvalido(control: string): boolean {
    return esControlValido(this.personaMoralForm, control) || false;
  }


  /**
    * agrega al candidato modificado y emite el evento con la empresa modificada.
    */
  agregarCandidato(): void {
    const FORM = this.personaMoralForm.getRawValue();
    this.empresaModificar = {
      ...this.empresaModificar,
      nombreDirector: FORM.nombreDirectorGeneral,
      directorApellidoPaterno: FORM.apellidoPaternoDirectorGeneral,
      directorApellidoMaterno: FORM.apellidoMaternoDirectorGeneral,
    } as PersonaCaat

    this.empresaCaat.emit(this.empresaModificar);
  }


  /**
   * Cierra el modal y emite el evento de cierre.
   */
  cerrarModal(): void {
    this.cerrar.emit(false);
  }
}