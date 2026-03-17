// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { PermisoSanitarioImportacionMedicamentosService } from './permiso-sanitario-importacion-medicamentos.service';
import { HttpClient } from '@angular/common/http';
import { Tramite260204Store } from '../estados/stores/tramite260204Store.store';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockTramite260204Store {}

describe('PermisoSanitarioImportacionMedicamentosService', () => {
  let service;

  beforeEach(() => {
    service = new PermisoSanitarioImportacionMedicamentosService({}, {});
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    service.tramite260204Store = service.tramite260204Store || {};
    service.tramite260204Store.update = jest.fn().mockReturnValue([
      null
    ]);
    service.actualizarEstadoFormulario({});
    expect(service.tramite260204Store.update).toHaveBeenCalled();
  });

  it('should run #getTramiteDatos()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn();
    service.getTramiteDatos();
    expect(service.http.get).toHaveBeenCalled();
  });

});