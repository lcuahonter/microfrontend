import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { PasoTresComponent } from './paso-tres.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteCofeprisStore } from '../../../../estados/tramite.store';
import { ToastrModule, ToastrService
 } from 'ngx-toastr';
import {  HttpClientModule } from '@angular/common/http';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: jest.Mocked<Router>;
  let serviciosPantallaService: jest.Mocked<ServiciosPantallaService>;
  let tramiteStore: jest.Mocked<TramiteCofeprisStore>;
  let toastrService: jest.Mocked<ToastrService>;

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    const serviciosPantallaServiceMock = {
      obtenerTramite: jest.fn(),
    } as unknown as jest.Mocked<ServiciosPantallaService>;

    const tramiteStoreMock = {
      establecerTramite: jest.fn(),
    } as unknown as jest.Mocked<TramiteCofeprisStore>;

    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn()
    } as unknown as jest.Mocked<ToastrService>;

    await TestBed.configureTestingModule({
  imports: [PasoTresComponent,HttpClientModule, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ServiciosPantallaService, useValue: serviciosPantallaServiceMock },
        { provide: TramiteCofeprisStore, useValue: tramiteStoreMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    serviciosPantallaService = TestBed.inject(ServiciosPantallaService) as jest.Mocked<ServiciosPantallaService>;
    tramiteStore = TestBed.inject(TramiteCofeprisStore) as jest.Mocked<TramiteCofeprisStore>;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valid signature and navigate to acuse', () => {
    const mockTramite = {
      id: 1,
      descripcion: 'Test Tramite',
      codigo: 'ABC123',
      data: JSON.stringify({ id: 1, name: 'Test Tramite' })
    };

    serviciosPantallaService.obtenerTramite.mockReturnValue(of(mockTramite));

    component.obtieneFirma('VALID_SIGNATURE');

    expect(serviciosPantallaService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(router.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should handle error when obtaining tramite fails', () => {
    const mockError = new Error('Failed to fetch tramite');
    serviciosPantallaService.obtenerTramite.mockReturnValue(throwError(() => mockError));

    component.obtieneFirma('VALID_SIGNATURE');

    expect(serviciosPantallaService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(tramiteStore.establecerTramite).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
   
  });

  it('should not call services if signature is empty', () => {
    component.obtieneFirma('');

    expect(serviciosPantallaService.obtenerTramite).not.toHaveBeenCalled();
    expect(tramiteStore.establecerTramite).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
