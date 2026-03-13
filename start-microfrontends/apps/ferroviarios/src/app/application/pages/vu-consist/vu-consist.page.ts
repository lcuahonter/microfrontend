import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vu-consist-page',
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
          <h4 class="mb-0"><i class="bi bi-train-front me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Gestion de {{ titulo }} - Servicios Ferroviarios</p>

          <div class="row mb-3">
            <div class="col-md-2">
              <label class="form-label">No. Consist</label>
              <input type="text" class="form-control" placeholder="Numero..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Locomotora</label>
              <input type="text" class="form-control" placeholder="No. Locomotora..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Ferrocarril</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="kcsm">KCSM</option>
                <option value="ferromex">Ferromex</option>
                <option value="ferrosur">Ferrosur</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="transito">En Transito</option>
                <option value="completado">Completado</option>
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
                  <th>No. Consist</th>
                  <th>Locomotora</th>
                  <th>Ferrocarril</th>
                  <th>Carros</th>
                  <th>Peso (Ton)</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosConsist; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td>{{ item.locomotora }}</td>
                    <td>{{ item.ferrocarril }}</td>
                    <td class="text-center">{{ item.carros }}</td>
                    <td class="text-end">{{ item.peso | number }}</td>
                    <td>{{ item.origen }}</td>
                    <td>{{ item.destino }}</td>
                    <td><span class="badge" [class]="item.badgeClass">{{ item.estado }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-warning me-1" title="Editar"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-info" title="Imprimir"><i class="bi bi-printer"></i></button>
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
export class VuConsistPage {
  titulo = 'VU Consist';

  links = [
    { nombre: 'VU Despacho', ruta: '../vu-despacho' },
    { nombre: 'VU Documento Transporte', ruta: '../vu-documento-transporte' },
    { nombre: 'Operaciones Contingencia', ruta: '../operaciones-contingencia' },
    { nombre: 'Lista Detallada', ruta: '../lista-detallada' }
  ];

  datosConsist = [
    { id: 1, numero: 'CST-2024-001234', locomotora: 'KCSM-4567', ferrocarril: 'KCSM', carros: 85, peso: 12500, origen: 'Nuevo Laredo', destino: 'Monterrey', estado: 'En Transito', badgeClass: 'bg-info' },
    { id: 2, numero: 'CST-2024-001235', locomotora: 'FXE-2890', ferrocarril: 'Ferromex', carros: 72, peso: 9800, origen: 'Guadalajara', destino: 'Manzanillo', estado: 'Activo', badgeClass: 'bg-success' },
    { id: 3, numero: 'CST-2024-001236', locomotora: 'KCSM-4123', ferrocarril: 'KCSM', carros: 95, peso: 14200, origen: 'Mexico DF', destino: 'Lazaro Cardenas', estado: 'En Transito', badgeClass: 'bg-info' },
    { id: 4, numero: 'CST-2024-001237', locomotora: 'FSR-1567', ferrocarril: 'Ferrosur', carros: 60, peso: 8500, origen: 'Veracruz', destino: 'Coatzacoalcos', estado: 'Completado', badgeClass: 'bg-secondary' },
    { id: 5, numero: 'CST-2024-001238', locomotora: 'FXE-3201', ferrocarril: 'Ferromex', carros: 88, peso: 13100, origen: 'Torreon', destino: 'Chihuahua', estado: 'Activo', badgeClass: 'bg-success' },
    { id: 6, numero: 'CST-2024-001239', locomotora: 'KCSM-4890', ferrocarril: 'KCSM', carros: 78, peso: 11200, origen: 'Saltillo', destino: 'San Luis Potosi', estado: 'En Transito', badgeClass: 'bg-info' },
  ];
}
