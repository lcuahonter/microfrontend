import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PasoTresComponent } from './paso-tres.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteAgaceStore } from '../../../../estados/tramite.store';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockServiciosPantallaService: jest.Mocked<ServiciosPantallaService>;
  let mockTramiteAgaceStore: jest.Mocked<TramiteAgaceStore>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockServiciosPantallaService = {
      obtenerTramite: jest.fn(),
    } as unknown as jest.Mocked<ServiciosPantallaService>;

    mockTramiteAgaceStore = {
      establecerTramite: jest.fn(),
    } as unknown as jest.Mocked<TramiteAgaceStore>;

    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ServiciosPantallaService, useValue: mockServiciosPantallaService },
        { provide: TramiteAgaceStore, useValue: mockTramiteAgaceStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerTramite and navigate on valid signature', () => {
    const mockTramite = { data: 'mockTramiteData' };

    component.obtieneFirma('validSignature');

    expect(mockServiciosPantallaService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(mockTramiteAgaceStore.establecerTramite).toHaveBeenCalledWith('mockTramiteData', 'validSignature');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
  });

  it('should handle error when obtenerTramite fails', () => {
    const mockError = new Error('Error fetching tramite');
    mockServiciosPantallaService.obtenerTramite.mockReturnValue(throwError(() => mockError));

    component.obtieneFirma('validSignature');

    expect(mockServiciosPantallaService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(mockTramiteAgaceStore.establecerTramite).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not call obtenerTramite if signature is empty', () => {
    component.obtieneFirma('');

    expect(mockServiciosPantallaService.obtenerTramite).not.toHaveBeenCalled();
    expect(mockTramiteAgaceStore.establecerTramite).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const destroyedSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
