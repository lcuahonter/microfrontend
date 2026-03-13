import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-master-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-file-earmark-text me-2"></i>{{ titulo }}</h4>
        </div>
        <div class="card-body">
          <p class="lead">Consulta de Conocimientos {{ titulo }} - Manifiestos manifestacionvalor</p>

          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">No. Master B/L</label>
              <input type="text" class="form-control" placeholder="Ingrese numero..." />
            </div>
            <div class="col-md-3">
              <label class="form-label">Naviera</label>
              <select class="form-select">
                <option value="">Todas</option>
                <option value="maersk">Maersk</option>
                <option value="msc">MSC</option>
                <option value="cosco">COSCO</option>
                <option value="hapag">Hapag-Lloyd</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha Arribo</label>
              <input type="date" class="form-control" />
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
                  <th>No. Master B/L</th>
                  <th>Naviera</th>
                  <th>Buque</th>
                  <th>Viaje</th>
                  <th>Puerto Origen</th>
                  <th>Fecha Arribo</th>
                  <th>Contenedores</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of datosMaster; track item.id) {
                  <tr class="table-row">
                    <td><strong>{{ item.numero }}</strong></td>
                    <td>{{ item.naviera }}</td>
                    <td>{{ item.buque }}</td>
                    <td>{{ item.viaje }}</td>
                    <td>{{ item.puertoOrigen }}</td>
                    <td>{{ item.fechaArribo }}</td>
                    <td class="text-center">{{ item.contenedores }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" title="Ver detalle"><i class="bi bi-eye"></i></button>
                      <button class="btn btn-sm btn-outline-success me-1" title="Houses"><i class="bi bi-list-ul"></i></button>
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
export class MasterPage {
  titulo = 'Master B/L';

  links = [
    { nombre: 'Bitacora', ruta: '../bitacora' },
    { nombre: 'House', ruta: '../house' },
    { nombre: 'Contenedores', ruta: '../contenedores' },
    { nombre: 'Manifiesto', ruta: '../manifiesto' },
    { nombre: 'Movimientos', ruta: '../movimientos' },
    { nombre: 'ISF10', ruta: '../isf10' },
    { nombre: 'Plus3', ruta: '../plus3' },
    { nombre: 'ISF5', ruta: '../isf5' }
  ];

  datosMaster = [
    { id: 1, numero: 'MAEU123456789', naviera: 'Maersk', buque: 'MAERSK SELETAR', viaje: '2451E', puertoOrigen: 'Shanghai, CN', fechaArribo: '2024-12-28', contenedores: 12 },
    { id: 2, numero: 'MSCU987654321', naviera: 'MSC', buque: 'MSC GULSUN', viaje: '2452W', puertoOrigen: 'Busan, KR', fechaArribo: '2024-12-29', contenedores: 8 },
    { id: 3, numero: 'COSU456789123', naviera: 'COSCO', buque: 'COSCO SHIPPING LEO', viaje: '0125E', puertoOrigen: 'Ningbo, CN', fechaArribo: '2024-12-30', contenedores: 15 },
    { id: 4, numero: 'HLCU789123456', naviera: 'Hapag-Lloyd', buque: 'BERLIN EXPRESS', viaje: '2453S', puertoOrigen: 'Hamburg, DE', fechaArribo: '2024-12-31', contenedores: 6 },
    { id: 5, numero: 'EGLV321654987', naviera: 'Evergreen', buque: 'EVER GOLDEN', viaje: '1245N', puertoOrigen: 'Kaohsiung, TW', fechaArribo: '2025-01-02', contenedores: 10 },
    { id: 6, numero: 'YMLU654987321', naviera: 'Yang Ming', buque: 'YM WARMTH', viaje: '0126E', puertoOrigen: 'Tokyo, JP', fechaArribo: '2025-01-03', contenedores: 7 },
  ];
}
