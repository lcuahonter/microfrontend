import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { Router } from '@angular/router';
import { TramiteCofeprisStore } from '../../../../estados/tramite.store';
import { of, throwError } from 'rxjs';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let certificadosSvc: CertificadosLicenciasService;
  let router: Router;
  let tramiteStore: TramiteCofeprisStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [
        { provide: CertificadosLicenciasService, useValue: { obtenerTramite: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: TramiteCofeprisStore, useValue: { establecerTramite: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    certificadosSvc = TestBed.inject(CertificadosLicenciasService);
    router = TestBed.inject(Router);
    tramiteStore = TestBed.inject(TramiteCofeprisStore);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener la firma y navegar si la firma es válida', () => {
    const tramiteMock = { data: { folio: 'FOLIO123' } };
    (certificadosSvc.obtenerTramite as jest.Mock).mockReturnValueOnce(of(tramiteMock));
    const spyEstablecer = jest.spyOn(tramiteStore, 'establecerTramite');
    const spyNavigate = jest.spyOn(router, 'navigate');

    component.obtieneFirma('FIRMA_VALIDA');

    expect(certificadosSvc.obtenerTramite).toHaveBeenCalledWith(19);
    expect(spyEstablecer).toHaveBeenCalledWith(tramiteMock.data, 'FIRMA_VALIDA');
    expect(spyNavigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('no debería llamar a los servicios si la firma es vacía', () => {
    const spyObtener = jest.spyOn(certificadosSvc, 'obtenerTramite');
    const spyEstablecer = jest.spyOn(tramiteStore, 'establecerTramite');
    const spyNavigate = jest.spyOn(router, 'navigate');
    component.obtieneFirma('');
    expect(spyObtener).not.toHaveBeenCalled();
    expect(spyEstablecer).not.toHaveBeenCalled();
    expect(spyNavigate).not.toHaveBeenCalled();
  });

  it('debería manejar error en la obtención del trámite sin lanzar excepción', () => {
    (certificadosSvc.obtenerTramite as jest.Mock).mockReturnValueOnce(throwError(() => new Error('error')));
    expect(() => component.obtieneFirma('FIRMA_ERROR')).not.toThrow();
  });

  it('debería destruir correctamente el componente y completar destroyed$', () => {
    const spyNext = jest.spyOn<any, any>(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn<any, any>(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});