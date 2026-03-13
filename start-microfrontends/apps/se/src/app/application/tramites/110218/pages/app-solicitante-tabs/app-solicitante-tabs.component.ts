/* eslint-disable dot-notation */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { Solicitud110218State } from '../../estados/tramites/tramite110218.store';

import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';

/**
 * Componente para manejar las pestañas del solicitante.
 *
 * Este componente permite a los usuarios navegar entre diferentes secciones
 * del solicitante utilizando pestañas.
 *
 */
@Component({
  selector: 'app-solicitante-tabs',
  templateUrl: './app-solicitante-tabs.component.html',
})
export class AppSolicitanteTabsComponent implements OnInit {

  /**
   * Índice de la pestaña actualmente seleccionada.
   * Se puede recibir como entrada desde un componente padre.
   */
  @Input() indice: number = 1;
  /**
   * Estado de visualización del modal de error.
   */
  public showErrorModal: boolean = false;
  /**
   * Mensaje de error a mostrar en el modal.
   */
  public errorMessage: string = '';

  /**
   * Referencias a los componentes secundarios para la validación.
   * Estos se establecerán a través de @ViewChild para cada pestaña.
   */
  @ViewChild('tratados') tratadosComponent: { detallesdeltransporte?: { valid: boolean } } | undefined;
  /**
   * Referencia al componente de destinatario.
   */
  @ViewChild('destinatario') destinatarioComponent: { datosDelDestinatario?: { valid: boolean } } | undefined;
  /**
   * Referencia al componente de transporte.
   */
  @ViewChild('transporte') transporteComponent: { detallestransporte?: { valid: boolean } } | undefined;
  /**
   * Referencia al componente de representante legal.
   */
  @ViewChild('representanteLegal') representanteLegalComponent: { datosdelexportador?: { valid: boolean } } | undefined;
  /**
   * Referencia al componente de datos del certificado.
   */
  @ViewChild('datosCertificado') datosCertificadoComponent: { datosDelCertificado?: { valid: boolean } } | undefined;

  /**
   * Valida los campos obligatorios de cada pestaña.
   * Si algún campo es inválido, muestra un modal de error y retorna false.
   */
  public validarCamposObligatorios(): boolean {

    if (this.tratadosComponent && this.tratadosComponent.detallesdeltransporte && !this.tratadosComponent.detallesdeltransporte.valid) {
      this.errorMessage = 'Corrija los siguientes errores:\nDebe completar los campos obligatorios de Tratados.';
        this.showErrorModal = true;
        this.indice = 2;
        return false;
      }
      
      if (this.destinatarioComponent && this.destinatarioComponent.datosDelDestinatario && !this.destinatarioComponent.datosDelDestinatario.valid) {
        this.errorMessage = 'Corrija los siguientes errores:\nDebe agregar un(Nombre o razón social para el destinatario)';
        this.showErrorModal = true;
        this.indice = 3;
        return false;
      }
    
      if (this.transporteComponent && this.transporteComponent.detallestransporte && !this.transporteComponent.detallestransporte.valid) {
        this.errorMessage = 'Corrija los siguientes errores:\nDebe completar los campos obligatorios de Transporte.';
        this.showErrorModal = true;
        this.indice = 4;
        return false;
      }
      
      if (this.representanteLegalComponent && this.representanteLegalComponent.datosdelexportador && !this.representanteLegalComponent.datosdelexportador.valid) {
        this.errorMessage = 'Corrija los siguientes errores:\nDebe completar los campos obligatorios de Representante Legal.';
        this.showErrorModal = true;
        this.indice = 5;
        return false;
      }
      
      if (this.datosCertificadoComponent && this.datosCertificadoComponent.datosDelCertificado && !this.datosCertificadoComponent.datosDelCertificado.valid) {
        this.errorMessage = 'Corrija los siguientes errores:\nDebe completar los campos obligatorios de Datos Certificado.';
        this.showErrorModal = true;
        this.indice = 6;
        return false;
      }
      this.showErrorModal = false;
      return true;
    }
  /**
   * Selecciona una pestaña específica y actualiza el índice.
   * AppSolicitanteTabsComponent
   */

  constructor(private consultaQuery:ConsultaioQuery ,private servicio:CertificadoTecnicoJaponService){
 
  }
  /**
   * Indica si los datos de respuesta están disponibles.
   */
  public datosRespuestaDisponibles: boolean = false;

  /**
   * Subject utilizado para notificar la destrucción del componente y cancelar suscripciones.
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta.
   */
  public estadoConsulta!: ConsultaioState;
  /**
   * Inicializa el componente y suscribe al estado de consulta.
   * Si el estado indica una actualización, obtiene los datos de la bandeja de solicitudes.
   * De lo contrario, marca los datos de respuesta como disponibles.
   */
  ngOnInit(): void {
    // Suscribirse al observable del estado de consulta
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSeccion) => {
        this.estadoConsulta = estadoSeccion;
        // Verificar si se requiere actualización de datos
        if (this.estadoConsulta.update) {
          this.obtenerDatosBandejaSolicitudes();
        } else {
          this.datosRespuestaDisponibles = true;
        }
      });

   if (this.estadoConsulta.update) {
      this.obtenerDatosBandejaSolicitudes();
    } else {
      this.datosRespuestaDisponibles = true;
    }
  }
  /**
   * Obtiene los datos de la bandeja de solicitudes desde el servicio.
   * Marca los datos de respuesta como disponibles y actualiza el registro si la respuesta es válida.
   */
  obtenerDatosBandejaSolicitudes(): void {
    this.servicio.obtenerRegistro()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((respuesta: Solicitud110218State) => {
        if (respuesta) {
          this.datosRespuestaDisponibles = true;
          this.servicio.actualizarRegistro(respuesta);
        }
      });
  }
  /**
   * Selecciona una pestaña específica y actualiza el índice.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}