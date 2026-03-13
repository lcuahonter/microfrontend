import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { RegistroSolicitudComponent } from './registro-solicitud.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Store } from '../../estados/tramite80301.store';
import { LoginQuery } from '@libs/shared/data-access-user/src';

// Mocks
const mockRouter = {
  navigate: jest.fn(),
};

const mockActivatedRoute = {
  snapshot: {},
};

const mockSolicitudService = {
  obtenerListaProgramas: jest.fn().mockReturnValue(of([])),
};

const mockStore = {
  setLoginRfc: jest.fn(),
  setSelectedTipoPrograma: jest.fn(),
  setProgramaListaDatos: jest.fn(),
  setSelectedFolioPrograma: jest.fn(),
  setSelectedIdPrograma: jest.fn(),
  setDatosExportacion: jest.fn(),
  setTipoPrograma: jest.fn(),
};

const mockLoginQuery = {
  selectLoginState$: of({ rfc: 'ABC123' }),
};

describe('RegistroSolicitudComponent', () => {
  let component: RegistroSolicitudComponent;
  let fixture: ComponentFixture<RegistroSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroSolicitudComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Tramite80301Store, useValue: mockStore },
        { provide: LoginQuery, useValue: mockLoginQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroSolicitudComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerListaProgramas on init', () => {
    const spy = jest.spyOn(component, 'obtenerListaProgramas');
    component.ngOnInit();
    component.obtenerListaProgramas();
    expect(spy).toHaveBeenCalled();
  });

  it('should load programa list data', () => {
    const mockResponse = {
      datos: [
        {
          tipoPrograma: 'IMMEX',
          idProgramaCompuesto: 'CP01',
          idProgramaAutorizado: 'AUT01',
          rfc: 'TEST123',
          folioPrograma: 'FOL123',
        },
      ],
    };

    mockSolicitudService.obtenerListaProgramas.mockReturnValue(of(mockResponse));

    component.obtenerListaProgramas();

    expect(mockStore.setProgramaListaDatos).toHaveBeenCalledWith([
      {
        tipoPrograma: 'IMMEX',
        idProgramaCompuesto: 'CP01',
        idProgramaAutorizado: 'AUT01',
        rfc: 'TEST123',
        folioPrograma: 'FOL123',
      },
    ]);
  });

  it('should navigate on row click', () => {
    const mockRow = {
      folioPrograma: 'F123',
      idProgramaAutorizado: 'ID123',
    } as any;

    component.onFilaClic(mockRow);

    expect(mockStore.setSelectedFolioPrograma).toHaveBeenCalledWith('F123');
    expect(mockStore.setSelectedIdPrograma).toHaveBeenCalledWith('ID123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../registro-modificacion-page'], {
      relativeTo: mockActivatedRoute,
    });
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroyNotifier$, 'next');
    const spy2 = jest.spyOn(component.destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});