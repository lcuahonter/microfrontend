import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { Tramite130401Store } from '../../../../estados/tramites/tramite130401.store';
import { Tramite130401Query } from '../../../../estados/queries/tramite130401.query';
import { Subject, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { ModificacionDescripcionService } from '../../services/modificacion-descripcion.service';



describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let modificacionDescripcionServiceMock: any;

  beforeEach(async () => {
    tramiteStoreMock = {
      setPestanaActiva: jest.fn(),
      setSolicitud: jest.fn(),
      setMercancia: jest.fn(),
      setMercanciaTablaDatos: jest.fn(),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        pestanaActiva: 1,
      }),
    };
    modificacionDescripcionServiceMock = {
      getDatosConsulta: jest.fn().mockReturnValue(
        of({
          success: true,
          datos: {
            datosSolicitud: { id: 1, descripcion: 'Solicitud Test' },
            mercancia: [{ id: 1, descripcion: 'Mercancia Test' }],
            mercanciaTablaDatos: [{ id: 1, descripcion: 'Tabla Test' }],
          },
        })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, SolicitanteComponent],
      providers: [
        provideHttpClient(),
        { provide: Tramite130401Store, useValue: tramiteStoreMock },
        { provide: Tramite130401Query, useValue: tramiteQueryMock },
        { provide: ModificacionDescripcionService, useValue: modificacionDescripcionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState and set the active tab index on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tramiteState).toEqual({ pestanaActiva: 1 });
    expect(component.indice).toBe(1);
  });

  it('should call setPestanaActiva when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
    expect(tramiteStoreMock.setPestanaActiva).toHaveBeenCalledWith(2);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should fetch data and update the store when fetchGetDatosConsulta is called', () => {
    component.fetchGetDatosConsulta();
    expect(modificacionDescripcionServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(tramiteStoreMock.setSolicitud).toHaveBeenCalledWith({ id: 1, descripcion: 'Solicitud Test' });
    expect(tramiteStoreMock.setMercancia).toHaveBeenCalledWith([{ id: 1, descripcion: 'Mercancia Test' }]);
    expect(tramiteStoreMock.setMercanciaTablaDatos).toHaveBeenCalledWith([{ id: 1, descripcion: 'Tabla Test' }]);
    expect(component.esDatosRespuesta).toBe(true);
  });

});