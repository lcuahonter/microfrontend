import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite10301Store } from '../../10301/estados/tramite10301.store';
import { ExencionImpuestosService } from './exencion-impuestos.service';

describe('ExencionImpuestosService', () => {
  let service: ExencionImpuestosService;
  let httpMock: HttpTestingController;
  let store: Tramite10301Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExencionImpuestosService, Tramite10301Store]
    });

    service = TestBed.inject(ExencionImpuestosService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Tramite10301Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
});