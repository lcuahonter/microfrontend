import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-house-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-house me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Consulta de Documentos {{ titulo }} - Manifiestos manifestacionvalor</p>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">No. House</label>
              <input type="text" class="form-control" placeholder="Ingrese numero..." />
            </div>
            <div class="col-md-3">
              <label class="form-label">Consignatario</label>
              <input type="text" class="form-control" placeholder="Buscar consignatario..." />
            </div>
            <div class="col-md-3">
              <label class="form-label">Estado</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="cerrado">Cerrado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-primary me-2">Buscar</button>
              <button class="btn btn-secondary">Limpiar</button>
            </div>
          </div>

          <div class="table-container table-responsive">
            <table class="table table-striped table-bordered table-hover mb-0">
              <thead>
                <tr class="table-header">
                  <th>No. House</th>
                  <th>Consignatario</th>
                  <th>Peso (Kg)</th>
                  <th>Bultos</th>
                  <th>Destino</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosHouse; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numeroHouse }}</strong></td>
                    <td>{{ item.consignatario }}</td>
                    <td class="text-end">{{ item.peso | number }}</td>
                    <td class="text-center">{{ item.bultos }}</td>
                    <td>{{ item.destino }}</td>
                    <td><span class="badge" [class]="item.badgeClass">{{ item.estado }}</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-warning me-1" title="Editar"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-outline-danger" title="Eliminar"><i class="bi bi-trash"></i></button>
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
export class HousePage {
  titulo = 'House';

  links = [
    { nombre: 'Bitacora', ruta: '../bitacora' },
    { nombre: 'Contenedores', ruta: '../contenedores' },
    { nombre: 'Master', ruta: '../master' },
    { nombre: 'Manifiesto', ruta: '../manifiesto' },
    { nombre: 'Movimientos', ruta: '../movimientos' },
    { nombre: 'ISF10', ruta: '../isf10' },
    { nombre: 'Plus3', ruta: '../plus3' },
    { nombre: 'ISF5', ruta: '../isf5' }
  ];

  datosHouse = [
    { id: 1, numeroHouse: 'HSE-2024-005678', consignatario: 'Comercializadora del Norte SA', peso: 15230, bultos: 45, destino: 'CDMX', estado: 'Activo', badgeClass: 'bg-success' },
    { id: 2, numeroHouse: 'HSE-2024-005679', consignatario: 'Importadora Pacific SA de CV', peso: 8500, bultos: 22, destino: 'Guadalajara', estado: 'Activo', badgeClass: 'bg-success' },
    { id: 3, numeroHouse: 'HSE-2024-005680', consignatario: 'Distribuidora Centro SA', peso: 32100, bultos: 88, destino: 'Monterrey', estado: 'Cerrado', badgeClass: 'bg-secondary' },
    { id: 4, numeroHouse: 'HSE-2024-005681', consignatario: 'Logistica Internacional SA', peso: 5200, bultos: 15, destino: 'Queretaro', estado: 'Activo', badgeClass: 'bg-success' },
    { id: 5, numeroHouse: 'HSE-2024-005682', consignatario: 'Grupo Comercial Azteca', peso: 18750, bultos: 52, destino: 'Puebla', estado: 'Cancelado', badgeClass: 'bg-danger' },
    { id: 6, numeroHouse: 'HSE-2024-005683', consignatario: 'Importaciones del Sur SA', peso: 9800, bultos: 30, destino: 'Veracruz', estado: 'Activo', badgeClass: 'bg-success' },
  ];
}
