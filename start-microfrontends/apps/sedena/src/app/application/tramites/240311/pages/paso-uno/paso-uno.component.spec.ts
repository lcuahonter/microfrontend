import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { SolicitudPermisoService } from '../../services/solicitud-permiso.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockSolicitudPermisoService: any;
  let mockConsultaioQuery: any;
  let consultaioStateSubject: Subject<any>;

  beforeEach(async () => {
    consultaioStateSubject = new Subject<any>();
    mockSolicitudPermisoService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(),
      actualizarEstadoFormulario: jest.fn()
    };
    mockConsultaioQuery = {
      selectConsultaioState$: consultaioStateSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: SolicitudPermisoService, useValue: mockSolicitudPermisoService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    consultaioStateSubject.complete();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to consultaQuery and set consultaState', () => {
    const mockState = { update: false };
    component.ngOnInit();
    consultaioStateSubject.next(mockState);
    expect(component.consultaState).toEqual(mockState);
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true } as any;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario should call actualizarEstadoFormulario if resp exists', () => {
    const resp = { foo: 'bar' };
    mockSolicitudPermisoService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(resp));
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockSolicitudPermisoService.actualizarEstadoFormulario).toHaveBeenCalledWith(resp);
  });

  it('guardarDatosFormulario should not call actualizarEstadoFormulario if resp is falsy', () => {
    mockSolicitudPermisoService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(mockSolicitudPermisoService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('seleccionaTab should set indice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  describe('template', () => {
    beforeEach(() => {
      component.indice = 1;
      fixture.detectChanges();
    });

    it('should render nav tabs', () => {
      const tabs = fixture.nativeElement.querySelectorAll('.nav-tabs li');
      expect(tabs.length).toBe(4);
    });

    it('should render solicitante when indice is 1', () => {
      component.indice = 1;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('solicitante');
    });

    it('should render app-datos-del-tramite-contenedora when indice is 2', () => {
      component.indice = 2;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('app-datos-del-tramite-contenedora');
    });

    it('should render app-terceros-relacionados-contenedora when indice is 3', () => {
      component.indice = 3;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('app-terceros-relacionados-contenedora');
    });

    it('should render app-pago-de-derechos-contenedora when indice is 4', () => {
      component.indice = 4;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('app-pago-de-derechos-contenedora');
    });

    it('should call seleccionaTab when tab is clicked', () => {
      const spy = jest.spyOn(component, 'seleccionaTab');
      const tab = fixture.nativeElement.querySelectorAll('.nav-tabs li a')[2];
      tab.click();
      expect(spy).toHaveBeenCalled();
    });
  });
});