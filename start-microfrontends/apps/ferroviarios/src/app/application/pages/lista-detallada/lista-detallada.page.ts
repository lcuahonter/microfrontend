import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-detallada-page',
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
          <h4 class="mb-0"><i class="bi bi-list-ul me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Consulta de {{ titulo }} - Servicios Ferroviarios</p>

          <div class="row mb-3">
            <div class="col-md-2">
              <label class="form-label">No. Carro</label>
              <input type="text" class="form-control" placeholder="Numero carro..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Consist</label>
              <input type="text" class="form-control" placeholder="No. Consist..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo Carro</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="gondola">Gondola</option>
                <option value="tolva">Tolva</option>
                <option value="plataforma">Plataforma</option>
                <option value="furgon">Furgon</option>
                <option value="tanque">Tanque</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Condicion</label>
              <select class="form-select">
                <option value="">Todas</option>
                <option value="cargado">Cargado</option>
                <option value="vacio">Vacio</option>
              </select>
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
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-primary me-2">Buscar</button>
              <button class="btn btn-secondary">Limpiar</button>
            </div>
          </div>

          <div class="table-container table-responsive">
            <table class="table table-striped table-bordered table-hover mb-0">
              <thead>
                <tr class="table-header">
                  <th>No. Carro</th>
                  <th>Consist</th>
                  <th>Tipo</th>
                  <th>Propietario</th>
                  <th>Condicion</th>
                  <th>Peso (Ton)</th>
                  <th>Contenido</th>
                  <th>Destino</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosCarros; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td>{{ item.consist }}</td>
                    <td>{{ item.tipo }}</td>
                    <td>{{ item.propietario }}</td>
                    <td><span class="badge" [class]="item.condicionBadge">{{ item.condicion }}</span></td>
                    <td class="text-end">{{ item.peso | number:'1.0-0' }}</td>
                    <td>{{ item.contenido }}</td>
                    <td>{{ item.destino }}</td>
                    <td><span class="badge" [class]="item.estadoBadge">{{ item.estado }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <div class="card bg-light">
                <div class="card-body">
                  <h6 class="card-title">Resumen del Consist</h6>
                  <div class="row">
                    <div class="col-4">
                      <strong>Total Carros:</strong> {{ totalCarros }}
                    </div>
                    <div class="col-4">
                      <strong>Cargados:</strong> {{ carrosCargados }}
                    </div>
                    <div class="col-4">
                      <strong>Vacios:</strong> {{ carrosVacios }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card bg-light">
                <div class="card-body">
                  <h6 class="card-title">Peso Total</h6>
                  <h3 class="text-primary">{{ pesoTotal | number }} Toneladas</h3>
                </div>
              </div>
            </div>
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
export class ListaDetalladaPage {
  titulo = 'Lista Detallada';

  links = [
    { nombre: 'VU Consist', ruta: '../vu-consist' },
    { nombre: 'VU Despacho', ruta: '../vu-despacho' },
    { nombre: 'VU Documento Transporte', ruta: '../vu-documento-transporte' },
    { nombre: 'Operaciones Contingencia', ruta: '../operaciones-contingencia' }
  ];

  datosCarros = [
    { id: 1, numero: 'KCSM-456789', consist: 'CST-2024-001234', tipo: 'Gondola', propietario: 'KCSM', condicion: 'Cargado', condicionBadge: 'bg-success', peso: 95, contenido: 'Acero Laminado', destino: 'Monterrey', estado: 'En Transito', estadoBadge: 'bg-info' },
    { id: 2, numero: 'KCSM-456790', consist: 'CST-2024-001234', tipo: 'Tolva', propietario: 'KCSM', condicion: 'Cargado', condicionBadge: 'bg-success', peso: 110, contenido: 'Maiz', destino: 'Monterrey', estado: 'En Transito', estadoBadge: 'bg-info' },
    { id: 3, numero: 'FXE-234567', consist: 'CST-2024-001234', tipo: 'Plataforma', propietario: 'Ferromex', condicion: 'Cargado', condicionBadge: 'bg-success', peso: 85, contenido: 'Contenedores', destino: 'Monterrey', estado: 'En Transito', estadoBadge: 'bg-info' },
    { id: 4, numero: 'KCSM-456791', consist: 'CST-2024-001234', tipo: 'Furgon', propietario: 'KCSM', condicion: 'Cargado', condicionBadge: 'bg-success', peso: 75, contenido: 'Electrodomesticos', destino: 'Monterrey', estado: 'En Transito', estadoBadge: 'bg-info' },
    { id: 5, numero: 'TTX-890123', consist: 'CST-2024-001234', tipo: 'Plataforma', propietario: 'TTX', condicion: 'Vacio', condicionBadge: 'bg-secondary', peso: 25, contenido: '-', destino: 'Monterrey', estado: 'En Transito', estadoBadge: 'bg-info' },
    { id: 6, numero: 'KCSM-456792', consist: 'CST-2024-001234', tipo: 'Tanque', propietario: 'KCSM', condicion: 'Cargado', condicionBadge: 'bg-success', peso: 120, contenido: 'Combustible', destino: 'Monterrey', estado: 'En Transito', estadoBadge: 'bg-info' },
    { id: 7, numero: 'GATX-345678', consist: 'CST-2024-001234', tipo: 'Tanque', propietario: 'GATX', condicion: 'Vacio', condicionBadge: 'bg-secondary', peso: 30, contenido: '-', destino: 'Monterrey', estado: 'En Transito', estadoBadge: 'bg-info' },
    { id: 8, numero: 'FXE-234568', consist: 'CST-2024-001234', tipo: 'Gondola', propietario: 'Ferromex', condicion: 'Cargado', condicionBadge: 'bg-success', peso: 100, contenido: 'Chatarra', destino: 'Monterrey', estado: 'En Transito', estadoBadge: 'bg-info' },
  ];

  get totalCarros(): number {
    return this.datosCarros.length;
  }

  get carrosCargados(): number {
    return this.datosCarros.filter(c => c.condicion === 'Cargado').length;
  }

  get carrosVacios(): number {
    return this.datosCarros.filter(c => c.condicion === 'Vacio').length;
  }

  get pesoTotal(): number {
    return this.datosCarros.reduce((sum, c) => sum + c.peso, 0);
  }
}
