import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CERTIFICADO_PANAMA_COLUMNAS, CertificadoPanama, MercanciaCertificadoALADI, MERCANCIAS_CERTIFICADO_ALADI_COLUMNAS, SGP_CERTIFICADO_COLUMNAS, SGPcertificado, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { CertificadoOrigenResponse } from '../../models/certificados-disponsible.model';
import { CommonModule } from '@angular/common';
import { DatosDelDestinatarioComponent } from '../datos-del-destinatario/datos-del-destinatario.component';
import { DomicilioDelDestinatarioComponent } from '../domicilio-del-destinatario/domicilio-del-destinatario.component';
import { DatosDelCertificadoComponent } from '../datos-del-certificado/datos-del-certificado.component';
import { DomicilioTablaComponent } from '../domicilio-tabla/domicilio-tabla.component';

@Component({
  selector: 'app-certificado-pantalla-dos',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    DatosDelDestinatarioComponent,
    DomicilioDelDestinatarioComponent,
    TituloComponent,
    DatosDelCertificadoComponent,
    DomicilioTablaComponent
  ],
  templateUrl: './certificado-pantalla-dos.component.html',
  styleUrl: './certificado-pantalla-dos.component.scss',
})
export class CertificadoPantallaDosComponent implements OnInit, OnChanges {
/**
   * Datos del certificado de origen.
   * @type {CertificadoOrigenResponse | null}
   */
  @Input() certificadoDatos: CertificadoOrigenResponse | null = null;

  /**
   * Valor que indica si el trámite es tratado.
   * @type {string}
   */
  @Input() tratado: string = '';

 /**
   * Selección de la tabla inicializada como indefinida.
   * @type {TablaSeleccion}
   */
  seleccionTabla = TablaSeleccion.UNDEFINED;
  
  /**
   * Configuración de la tabla que se utilizará en el componente.
   * @type {any}
   */
  configuracionTabla = MERCANCIAS_CERTIFICADO_ALADI_COLUMNAS;

  /**
   * Configuración del certificado SGP.
   * @type {any}
   */
  configuracionCertificado = SGP_CERTIFICADO_COLUMNAS;

  /** Configuración del certificado Panamá.
   * @type {any}
   */
  configuracionPanama = CERTIFICADO_PANAMA_COLUMNAS;

  /**
   * Datos que se mostrarán en la tabla.
   * @type {MercanciaCertificadoALADI[]}
   */
  datosTabla: MercanciaCertificadoALADI[] = [];

  /** Datos del certificado SGP.
   * @type {SGPcertificado[]}
   */
  datosCertificado: SGPcertificado[] = [];

  /** Datos del certificado Panamá.
   * @type {CertificadoPanama[]}
   */
  datosPanama: CertificadoPanama[] = [];

  /**
   * Grupo de formulario para el formulario de certificadoALANDI.
   */
  certificadoALANDI!: FormGroup;

  /**  * Grupo de formulario para el formulario de transporte.
   */
  transporteForm!: FormGroup;

  /**  * Grupo de formulario para el formulario de certificado.
   */
  certificadoForm!: FormGroup;

  /**  * Grupo de formulario para el formulario de certificadoPanama.
   */
  certificadoPanama!: FormGroup;

  /**
   * Constructor del componente.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   */
  constructor(private fb: FormBuilder) {
    
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se configura el formulario reactivo con los datos del certificado.
   */
  ngOnInit() {
    this.createForm();
  }

  /**
   * Crea el formulario reactivo `certificadoALANDI` y establece los valores iniciales
   * basados en los datos del certificado proporcionados.
   */
  public createForm(): void {
    this.certificadoALANDI = this.fb.group({
      observaciones: [{value: this.certificadoDatos?.observaciones || '', disabled: true}],
      numeroCertificado: [{value: this.certificadoDatos?.numeroCertificadoOrigen || '', disabled: true}],
    });

    this.transporteForm = this.fb.group({
      medioTransporte: [{value: '' , disabled: true}],
      rutaCompleta: [{value: '', disabled: true}],
      puertoEmbarque: [{value: '', disabled: true}],
      puertoDesembarque: [{value: '', disabled: true}],
    });

    this.certificadoForm = this.fb.group({
      tratadoAcuerdoClave: [{value: this.certificadoDatos?.tratadoAcuerdo || '', disabled: true}],
      paisBloqueClave: [{value: this.certificadoDatos?.paisBloque || '', disabled: true}],
      fichaExpedicion: [{value: this.certificadoDatos?.fechaExpedicion || '', disabled: true}],
      fechaVecimiento: [{value: this.certificadoDatos?.fechaVencimiento || '', disabled: true}],
      cveRegistroProductor: [{value: this.certificadoDatos?.numeroCertificadoOrigen || '', disabled: true}],
    });

    this.certificadoPanama = this.fb.group({
      observacionesPanama: [{value: this.certificadoDatos?.observaciones || '', disabled: true}],
      nombresPanama: [{value:'', disabled: true}],
      primerApellidoPanama: [{value: this.certificadoDatos?.primerApellido || '', disabled: true}],
      segundoApellidoPanama: [{value: this.certificadoDatos?.segundoApellido || '', disabled: true}],
      numeroRegistroFiscalPanama: [{value: this.certificadoDatos?.numeroRegistroFiscal || '', disabled: true}],
      razonSocialPanama: [{value: this.certificadoDatos?.razonSocial || '', disabled: true}],
      ciudadPanama: [{value: this.certificadoDatos?.ciudad || '', disabled: true}],
      callePanama: [{value: this.certificadoDatos?.calle || '', disabled: true}],
      numeroLetraPanama: [{value: this.certificadoDatos?.numeroLetra || '', disabled: true}],
      telefonoPanama: [{value: this.certificadoDatos?.telefono || '', disabled: true}],
      faxPanama: [{value: this.certificadoDatos?.fax || '', disabled: true}],
      correoElectronicoPanama: [{value: this.certificadoDatos?.correoElectronico || '', disabled: true}],
      paisPanama: [{value: this.certificadoDatos?.paisBloque || '', disabled: true}],
      numeroCertificadoPanama: [{value: this.certificadoDatos?.numeroCertificadoOrigen || '', disabled: true}],
    });

    this.datosCertificado = (this.certificadoDatos?.mercancias ?? []) as SGPcertificado[];
    this.datosPanama = (this.certificadoDatos?.mercancias ?? []) as CertificadoPanama[];
    this.datosTabla = (this.certificadoDatos?.mercancias ?? []) as MercanciaCertificadoALADI[];
    
  }

  /**
   * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * Actualiza el formulario reactivo `certificadoALANDI` con los nuevos datos del certificado.
   */
  ngOnChanges(): void {
    this.createForm();
  }
}
