import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vu-documento-transporte-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    .table-container {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      font-family: 'Roboto', sans-serif;
      font-size: 14px;
      color: #404041;
    }
    .table-header {
      background-color: #dce0e0 !important;
      color: #6f7271 !important;
      font-weight: bold;
      text-align: center;
      font-size: 14px;
    }
    .table-header th {
      background-color: #dce0e0 !important;
      color: #6f7271 !important;
      border-color: #c0c0c0 !important;
    }
    .table-row {
      background-color: #ffffff;
    }
  `],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-file-earmark-text me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Gestion de {{ titulo }} - Servicios Ferroviarios</p>

          <div class="row mb-3">
            <div class="col-md-2">
              <label class="form-label">No. Documento</label>
              <input type="text" class="form-control" placeholder="Numero..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Carta Porte</label>
              <input type="text" class="form-control" placeholder="Carta Porte..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Embarcador</label>
              <input type="text" class="form-control" placeholder="Buscar..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="validado">Validado</option>
                <option value="pendiente">Pendiente</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Fecha</label>
              <input type="date" class="form-control" />
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-primary me-2">Buscar</button>
              <button class="btn btn-secondary">Limpiar</button>
            </div>
          </div>

          <div class="table-container table-responsive">
            <table class="table table-striped table-bordered table-hover mb-0">
              <thead>
                <tr class="table-header">
                  <th>No. Documento</th>
                  <th>Carta Porte</th>
                  <th>Embarcador</th>
                  <th>Consignatario</th>
                  <th>Mercancia</th>
                  <th>Peso (Kg)</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosDocumento; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td>{{ item.cartaPorte }}</td>
                    <td>{{ item.embarcador }}</td>
                    <td>{{ item.consignatario }}</td>
                    <td>{{ item.mercancia }}</td>
                    <td class="text-end">{{ item.peso | number }}</td>
                    <td>{{ item.fecha }}</td>
                    <td><span class="badge" [class]="item.badgeClass">{{ item.estado }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-warning me-1" title="Editar"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-info" title="Descargar"><i class="bi bi-download"></i></button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <hr>
          <h6>Navegacion del modulo:</h6>
          <div class="d-flex flex-wrap gap-2">
            @for (link of links; track link.ruta) {
              <a [routerLink]="link.ruta" class="btn btn-outline-primary btn-sm">
                {{ link.nombre }}
              </a>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class VuDocumentoTransportePage {
  titulo = 'VU Documento Transporte';

  links = [
    { nombre: 'VU Consist', ruta: '../vu-consist' },
    { nombre: 'VU Despacho', ruta: '../vu-despacho' },
    { nombre: 'Operaciones Contingencia', ruta: '../operaciones-contingencia' },
    { nombre: 'Lista Detallada', ruta: '../lista-detallada' }
  ];

  datosDocumento = [
    { id: 1, numero: 'DOC-2024-078901', cartaPorte: 'CP-KCSM-2024-45678', embarcador: 'General Motors de Mexico', consignatario: 'GM Assembly Plant Detroit', mercancia: 'Partes Automotrices', peso: 85000, fecha: '2024-12-28', estado: 'Validado', badgeClass: 'bg-success' },
    { id: 2, numero: 'DOC-2024-078902', cartaPorte: 'CP-FXE-2024-12345', embarcador: 'CEMEX SA de CV', consignatario: 'CEMEX USA Inc', mercancia: 'Cemento Portland', peso: 125000, fecha: '2024-12-28', estado: 'Validado', badgeClass: 'bg-success' },
    { id: 3, numero: 'DOC-2024-078903', cartaPorte: 'CP-KCSM-2024-45679', embarcador: 'Grupo Modelo', consignatario: 'Anheuser-Busch InBev', mercancia: 'Cerveza', peso: 45000, fecha: '2024-12-29', estado: 'Pendiente', badgeClass: 'bg-warning' },
    { id: 4, numero: 'DOC-2024-078904', cartaPorte: 'CP-FXE-2024-12346', embarcador: 'ArcelorMittal Mexico', consignatario: 'US Steel Corp', mercancia: 'Acero Laminado', peso: 180000, fecha: '2024-12-29', estado: 'Rechazado', badgeClass: 'bg-danger' },
    { id: 5, numero: 'DOC-2024-078905', cartaPorte: 'CP-KCSM-2024-45680', embarcador: 'John Deere Mexico', consignatario: 'Deere & Company', mercancia: 'Maquinaria Agricola', peso: 95000, fecha: '2024-12-30', estado: 'Validado', badgeClass: 'bg-success' },
    { id: 6, numero: 'DOC-2024-078906', cartaPorte: 'CP-FSR-2024-78901', embarcador: 'Pemex Logistica', consignatario: 'Valero Energy', mercancia: 'Combustibles', peso: 200000, fecha: '2024-12-30', estado: 'Pendiente', badgeClass: 'bg-warning' },
  ];
}
