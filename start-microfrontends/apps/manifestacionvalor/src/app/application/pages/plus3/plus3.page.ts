import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-plus3-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-plus-circle me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Documentos {{ titulo }} (24-Hour Rule) - Manifiestos manifestacionvalor</p>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">No. Documento</label>
              <input type="text" class="form-control" placeholder="Numero documento..." />
            </div>
            <div class="col-md-3">
              <label class="form-label">Embarcador</label>
              <input type="text" class="form-control" placeholder="Buscar embarcador..." />
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado</label>
              <select class="form-select">
                <option value="">Todos</option>
                <option value="enviado">Enviado</option>
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
                  <th>Embarcador</th>
                  <th>Consignatario</th>
                  <th>Puerto Carga</th>
                  <th>Puerto Descarga</th>
                  <th>Fecha Envio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosPlus3; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td>{{ item.embarcador }}</td>
                    <td>{{ item.consignatario }}</td>
                    <td>{{ item.puertoCarga }}</td>
                    <td>{{ item.puertoDescarga }}</td>
                    <td>{{ item.fechaEnvio }}</td>
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
export class Plus3Page {
  titulo = 'Plus3';

  links = [
    { nombre: 'Bitacora', ruta: '../bitacora' },
    { nombre: 'House', ruta: '../house' },
    { nombre: 'Contenedores', ruta: '../contenedores' },
    { nombre: 'Master', ruta: '../master' },
    { nombre: 'Manifiesto', ruta: '../manifiesto' },
    { nombre: 'Movimientos', ruta: '../movimientos' },
    { nombre: 'ISF10', ruta: '../isf10' },
    { nombre: 'ISF5', ruta: '../isf5' }
  ];

  datosPlus3 = [
    { id: 1, numero: 'P3-2024-001001', embarcador: 'Shanghai Logistics Co', consignatario: 'Comercializadora del Norte SA', puertoCarga: 'Shanghai', puertoDescarga: 'Manzanillo', fechaEnvio: '2024-12-24', estado: 'Enviado', badgeClass: 'bg-success' },
    { id: 2, numero: 'P3-2024-001002', embarcador: 'Korea Shipping Ltd', consignatario: 'Importadora Pacific SA', puertoCarga: 'Busan', puertoDescarga: 'Lazaro Cardenas', fechaEnvio: '2024-12-25', estado: 'Enviado', badgeClass: 'bg-success' },
    { id: 3, numero: 'P3-2024-001003', embarcador: 'Ningbo Exports Inc', consignatario: 'Distribuidora Centro SA', puertoCarga: 'Ningbo', puertoDescarga: 'Veracruz', fechaEnvio: '2024-12-26', estado: 'Pendiente', badgeClass: 'bg-warning' },
    { id: 4, numero: 'P3-2024-001004', embarcador: 'Hamburg Trading GmbH', consignatario: 'Logistica Internacional SA', puertoCarga: 'Hamburg', puertoDescarga: 'Altamira', fechaEnvio: '2024-12-27', estado: 'Rechazado', badgeClass: 'bg-danger' },
    { id: 5, numero: 'P3-2024-001005', embarcador: 'Taiwan Freight Corp', consignatario: 'Grupo Comercial Azteca', puertoCarga: 'Kaohsiung', puertoDescarga: 'Manzanillo', fechaEnvio: '2024-12-28', estado: 'Enviado', badgeClass: 'bg-success' },
    { id: 6, numero: 'P3-2024-001006', embarcador: 'Tokyo Marine Services', consignatario: 'Importaciones del Sur SA', puertoCarga: 'Tokyo', puertoDescarga: 'Veracruz', fechaEnvio: '2024-12-29', estado: 'Pendiente', badgeClass: 'bg-warning' },
  ];
}
