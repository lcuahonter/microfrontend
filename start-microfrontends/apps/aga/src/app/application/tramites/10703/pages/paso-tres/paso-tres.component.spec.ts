import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PasoTresComponent } from './paso-tres.component';
import { TramiteFolioService, TramiteFolioStore } from '@ng-mf/data-access-user';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let router: jest.Mocked<Router>;
  let tramiteFolioService: jest.Mocked<TramiteFolioService>;
  let tramiteFolioStore: jest.Mocked<TramiteFolioStore>;

  beforeEach(() => {
    const routerMock = { navigate: jest.fn() } as any;
    const tramiteFolioServiceMock = { obtenerTramite: jest.fn() } as any;
    const tramiteFolioStoreMock = { establecerTramite: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        PasoTresComponent,
        { provide: Router, useValue: routerMock },
        { provide: TramiteFolioService, useValue: tramiteFolioServiceMock },
        { provide: TramiteFolioStore, useValue: tramiteFolioStoreMock },
      ],
    });

    component = TestBed.inject(PasoTresComponent);
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    tramiteFolioService = TestBed.inject(TramiteFolioService) as jest.Mocked<TramiteFolioService>;
    tramiteFolioStore = TestBed.inject(TramiteFolioStore) as jest.Mocked<TramiteFolioStore>;
  });

  
  it('should handle errors when obtieneFirma is called and the service fails', () => {
    tramiteFolioService.obtenerTramite.mockReturnValue(throwError(() => new Error('Service error')));

    component.obtieneFirma('valid-signature');

    expect(tramiteFolioService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(tramiteFolioStore.establecerTramite).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
