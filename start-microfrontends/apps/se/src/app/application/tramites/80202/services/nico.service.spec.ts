// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { NicoService } from './nico.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('NicoService', () => {
  let service;

  beforeEach(() => {
    service = new NicoService({});
  });

  it('should run #obtenerMenuDesplegable()', async () => {
    service.http = service.http || {};
    service.http.get = jest.fn().mockReturnValue(observableOf({}));
    service.obtenerMenuDesplegable({});
    expect(service.http.get).toHaveBeenCalled();
  });

});