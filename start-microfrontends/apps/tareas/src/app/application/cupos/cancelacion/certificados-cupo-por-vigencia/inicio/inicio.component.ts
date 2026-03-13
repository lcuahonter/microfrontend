import { CertificadoCancelado, DatosSolicitante, DomicilioFiscal } from '../service/model/response/certificados-vigencia.model';
import { ErrorMessagesComponent, TituloComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanceladosPorVigenciaComponent } from '../components/cancelados-por-vigencia/cancelados-por-vigencia.component';
import { CertificadosVigenciaService } from '../service/certificados-vigencia.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TituloComponent, 
    ErrorMessagesComponent, 
    CanceladosPorVigenciaComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class CertificadosCupoPorVigenciaComponent {
  form: FormGroup;
  activeTab = 0;
  
  tabs = [
    { id: 0, titulo: 'Solicitante', show: true },
    { id: 1, titulo: 'Certificados cancelados por vigencia', show: false }
  ];

  datosSolicitante: DatosSolicitante | null = null;
  domicilioFiscal: DomicilioFiscal | null = null;
  certificados: CertificadoCancelado[] = [];
  
  errors: string[] = [];
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: CertificadosVigenciaService
  ) {
    this.form = this.fb.group({
      rfc: [null, [Validators.required]]
    });
  }

  /**
   * Cambia la pestaña activa.
   * @param indice Índice de la pestaña.
   */
  seleccionaTab(indice: number): void {
    this.activeTab = indice;
  }

  /**
   * Realiza la búsqueda por RFC.
   */
  onBuscar(): void {
    if (this.form.invalid) {
      return;
    }
    
    this.errors = [];
    this.successMessage = '';
    this.datosSolicitante = null;
    this.domicilioFiscal = null;
    this.certificados = [];

    const RFC = this.form.get('rfc')?.value;

    this.service.getDatosSolicitante(RFC).subscribe({
      next: (res) => {
        this.datosSolicitante = res.datosSolicitante;
        this.domicilioFiscal = res.domicilioFiscal;
        
        // Cargar los certificados también
        this.service.getCertificadosCancelados(RFC).subscribe({
          next: (certs) => {
            this.certificados = certs;
            if (this.certificados.length === 0) {
              this.errors = ['El RFC ingresado no tiene certificados cancelados en la Representación Federal que usted representa.'];
            } else {
              this.tabs[1].show = true;
            }
          }
        });
      },
      error: (err) => {
        this.errors = [err.message];
      }
    });
  }
}