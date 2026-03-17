import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let tramiteFolioService: TramiteFolioService;
  let tramiteStore: TramiteStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [
        { provide: TramiteFolioService, useValue: { obtenerTramite: jest.fn() } },
        { provide: TramiteStore, useValue: { establecerTramite: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    tramiteFolioService = TestBed.inject(TramiteFolioService);
    tramiteStore = TestBed.inject(TramiteStore);
    router = TestBed.inject(Router);
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
    expect(spyNavigate).toHaveBeenCalledWith(['/pago/catalogos/acuse']);
  });

  it('debería manejar errores en obtieneFirma sin lanzar excepción', () => {
    (tramiteFolioService.obtenerTramite as jest.Mock).mockReturnValueOnce(throwError(() => new Error('error')));
    expect(() => component.obtieneFirma('FIRMA_ERROR')).not.toThrow();
  });

  it('debería destruir correctamente el componente y limpiar destroyed$', () => {
    const spyNext = jest.spyOn<any, any>(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn<any, any>(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});