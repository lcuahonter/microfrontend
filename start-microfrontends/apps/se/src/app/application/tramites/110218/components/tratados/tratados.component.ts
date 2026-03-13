
import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';

import { EXPEDICION } from '../../constants/certificado-tecnico-japon.enum';
import { VENCIMIENTO } from '../../constants/certificado-tecnico-japon.enum';

import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { InputFecha } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * TratadosComponent
 * OnInit
 * Componente para gestionar los detalles del transporte relacionados con tratados y acuerdos.
 */
@Component({
  selector: 'app-tratados',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, InputFechaComponent],
  templateUrl: './tratados.component.html',
  styleUrl: './tratados.component.scss',
})
export class TratadosComponent implements OnInit, OnDestroy {

  /**
   * {FormGroup} detallesdeltransporte - Formulario reactivo para los detalles del transporte.
   */
  detallesdeltransporte: FormGroup;

  /**
   * 
   *{FormBuilder} fb - Constructor de formularios reactivos.
   * {CertificadoTecnicoJaponService} service - Servicio para obtener datos de tratados.
   */
  constructor(private fb: FormBuilder, private service: CertificadoTecnicoJaponService) {
    this.detallesdeltransporte = this.crearFormularioDetallesDelTransporte();
  }

  /**
   * crearFormularioDetallesDelTransporte
   * Crea y retorna un FormGroup con los campos necesarios para los detalles del transporte,
   * todos los campos están deshabilitados por defecto y algunos tienen valores iniciales.
   * @returns {FormGroup} Formulario reactivo con los campos de tratados y fechas.
   */
  private crearFormularioDetallesDelTransporte(): FormGroup {
    return this.fb.group({
      tratadoAcuerdo: [{ value: '', disabled: true }],
      paisBloque: [{ value: '', disabled: true }],
      paisdeOrigen: [{ value: '', disabled: true }],
      paisDestino: [{ value: '', disabled: true }],
      fechadeExpedicion: [{ value: '2025-01-01', disabled: true }],
      fechadeVencimiento: [{ value: '2025-04-03', disabled: true }],
    });
  }

  /**
   * ngOnInit
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  /**
   * destroyed$
   * Subject utilizado para cancelar las suscripciones activas al destruir el componente.
   */
  private destroyed$ = new Subject<void>();

  /**
   * ngOnInit
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama a obtenerDatosDeTabla para cargar los datos iniciales en el formulario.
   */
  ngOnInit(): void {
    this.obtenerDatosDeTabla();
  }
  /**
   * fechaFinalInput
   * Variable que almacena la configuración de la fecha de expedición.
   */
  fechaFinalInput: InputFecha = EXPEDICION;

  /**
   * fechaFinalInputs
   * Variable que almacena la configuración de la fecha de vencimiento.
   */
  fechaFinalInputs: InputFecha = VENCIMIENTO;

  /**
   * cambioFechaFinal
   * Método para actualizar la fecha de expedición de la factura en el formulario reactivo.
   * @param nuevo_valor - Nuevo valor de la fecha de expedición.
   */
  cambioFechaFinal(nuevo_valor: string): void {
    this.detallesdeltransporte.patchValue({
      fechaExpedicionFactura: nuevo_valor,
    });
  }
  
  /**
   * obtenerDatosDeTabla
   * Obtiene los datos de los tratados y actualiza el formulario.
   */
  obtenerDatosDeTabla(): void {
    this.service.gettratados().pipe(takeUntil(this.destroyed$)).subscribe(
      (data: { tratadoAcuerdo: string; paisBloque: string; paisdeOrigen: string; paisDestino: string; fechadeExpedicion: string; fechadeVencimiento: string }) => {
        this.detallesdeltransporte.patchValue({
          tratadoAcuerdo: data.tratadoAcuerdo,
          paisBloque: data.paisBloque,
          paisdeOrigen: data.paisdeOrigen,
          paisDestino: data.paisDestino,
          fechadeExpedicion: data.fechadeExpedicion,
          fechadeVencimiento: data.fechadeVencimiento
        });
      }
    );
  }

  /**
   * ngOnDestroy
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

