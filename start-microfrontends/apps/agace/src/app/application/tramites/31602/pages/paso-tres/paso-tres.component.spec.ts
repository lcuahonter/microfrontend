import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let routerMock: any;
  let comercioExteriorSvcMock: any;
  let tramiteCofeprisStoreMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    comercioExteriorSvcMock = { obtenerTramite: jest.fn() };
    tramiteCofeprisStoreMock = { establecerTramite: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FirmaElectronicaComponent, ToastrModule.forRoot()],
      declarations: [PasoTresComponent],
      providers: [
        { provide: 'Router', useValue: routerMock },
        { provide: 'ComercioExteriorService', useValue: comercioExteriorSvcMock },
        { provide: 'TramiteAgaceStore', useValue: tramiteCofeprisStoreMock }
      ]
    })
      .overrideComponent(PasoTresComponent, {
        set: {
          providers: [
            { provide: 'Router', useValue: routerMock },
            { provide: 'ComercioExteriorService', useValue: comercioExteriorSvcMock },
            { provide: 'TramiteAgaceStore', useValue: tramiteCofeprisStoreMock }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;

    (component as any).router = routerMock;
    (component as any).comercioExteriorSvc = comercioExteriorSvcMock;
    (component as any).TramiteCofeprisStore = tramiteCofeprisStoreMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call establecerTramite and navigate when obtieneFirma is called with a valid signature', (done) => {
    const mockTramite = { data: { id: 1 } };
    comercioExteriorSvcMock.obtenerTramite.mockReturnValue(of(mockTramite));

    component.obtieneFirma('FIRMA123');

    setTimeout(() => {
      expect(tramiteCofeprisStoreMock.establecerTramite).toHaveBeenCalledWith(mockTramite.data, 'FIRMA123');
      expect(routerMock.navigate).toHaveBeenCalledWith(['servicios-extraordinarios/acuse']);
      done();
    }, 0);
  });

  it('should not call anything if obtieneFirma is called with a falsy signature', () => {
    component.obtieneFirma('');
    expect(comercioExteriorSvcMock.obtenerTramite).not.toHaveBeenCalled();
    expect(tramiteCofeprisStoreMock.establecerTramite).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should unsubscribe destroyed$ on ngOnDestroy', () => {
    const destroyed$ = (component as any).destroyed$;
    const completeSpy = jest.spyOn(destroyed$, 'complete');
    const nextSpy = jest.spyOn(destroyed$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});