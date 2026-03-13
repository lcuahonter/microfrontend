import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FirmarSolicitudComponent } from './firmar-solicitud.component';
import { Router } from '@angular/router';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteAgaceStore } from '../../../../estados/tramite.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';

fdescribe('FirmarSolicitudComponent', () => {
  let component: FirmarSolicitudComponent;
  let fixture: ComponentFixture<FirmarSolicitudComponent>;
  let mockRouter: any;
  let mockServiciosPantallaService: any;
  let mockTramiteAgaceStore: any;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };
   mockServiciosPantallaService = { obtenerTramite: jest.fn() };
    mockTramiteAgaceStore = { establecerTramite: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FirmaElectronicaComponent,ToastrModule.forRoot()],
      declarations: [FirmarSolicitudComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ServiciosPantallaService, useValue: mockServiciosPantallaService },
        { provide: TramiteAgaceStore, useValue: mockTramiteAgaceStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe navegar a la página de acuse al firmar exitosamente', () => {
    const mockTramite = {
      id: 1,
      descripcion: 'desc',
      codigo: 'code',
      data: 'mockData',
    };
    mockServiciosPantallaService.obtenerTramite.mockReturnValue(of(mockTramite));

    component.obtieneFirma('mockFirma');

    expect(mockServiciosPantallaService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(mockTramiteAgaceStore.establecerTramite).toHaveBeenCalledWith(
      'mockData',
      'mockFirma'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'servicios-extraordinarios/acuse',
    ]);
  });

  it('debe manejar el error cuando obtenerTramite falla', () => {
    mockServiciosPantallaService.obtenerTramite.mockReturnValue(
      throwError(() => 'error')
    );

    component.obtieneFirma('mockFirma');

    expect(mockServiciosPantallaService.obtenerTramite).toHaveBeenCalledWith(19);
    expect(mockTramiteAgaceStore.establecerTramite).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('no debe llamar a obtenerTramite si la firma está vacía', () => {
    component.obtieneFirma('');

    expect(mockServiciosPantallaService.obtenerTramite).not.toHaveBeenCalled();
    expect(mockTramiteAgaceStore.establecerTramite).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});