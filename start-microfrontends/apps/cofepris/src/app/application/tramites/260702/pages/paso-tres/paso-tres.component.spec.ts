import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';
import { of, throwError, Subscription } from 'rxjs';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;
  let tramiteFolioService: TramiteFolioService;
  let tramiteStore: TramiteStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: TramiteFolioService, useValue: { obtenerTramite: jest.fn() } },
        { provide: TramiteStore, useValue: { establecerTramite: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    tramiteFolioService = TestBed.inject(TramiteFolioService);
    tramiteStore = TestBed.inject(TramiteStore);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería asignar el tipo de persona correctamente', () => {
    component.obtenerTipoPersona(2);
    expect(component.tipoPersona).toBe(2);
  });

  it('no debería hacer nada en obtieneFirma si la firma es vacía', () => {
    const spy = jest.spyOn(tramiteFolioService, 'obtenerTramite');
    component.obtieneFirma('');
    expect(spy).not.toHaveBeenCalled();
  });

  it('debería llamar a los servicios y navegar al obtener una firma válida', () => {
    const tramiteMock = { data: { folio: 'ABC123' } };
    (tramiteFolioService.obtenerTramite as jest.Mock).mockReturnValueOnce(of(tramiteMock));
    const spyEstablecer = jest.spyOn(tramiteStore, 'establecerTramite');
    const spyNavigate = jest.spyOn(router, 'navigate');

    component.obtieneFirma('FIRMA123');

    expect(tramiteFolioService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(spyEstablecer).toHaveBeenCalledWith(tramiteMock.data, 'FIRMA123');
    expect(spyNavigate).toHaveBeenCalledWith(['pago/consulta/acuse']);
  });

  it('debería manejar errores en obtieneFirma', () => {
    (tramiteFolioService.obtenerTramite as jest.Mock).mockReturnValueOnce(throwError(() => new Error('error')));
    expect(() => component.obtieneFirma('FIRMA123')).not.toThrow();
  });

  it('debería desuscribirse correctamente en ngOnDestroy si existe la suscripción', () => {
    const mockSubscription = { unsubscribe: jest.fn() } as unknown as Subscription;
    component.obtienerTramiteSubscriber = mockSubscription;
    component.ngOnDestroy();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('no debería fallar en ngOnDestroy si no existe la suscripción', () => {
    component.obtienerTramiteSubscriber = undefined as any;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});