import { PasoUnoComponent } from './paso-uno.component';
import { RegistroService } from '../../services/registro.service';
import { ConsultaioQuery, SolicitanteComponent } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos_certificado.component';
import { DestinatarioDeComponent } from '../../components/destinatario-de/destinatario-de.component';
import { TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Tramite110207Store } from '../../state/Tramite110207.store';
import { Tramite110207Query } from '../../state/Tramite110207.query';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SolicitudPageComponent } from '../solicitud-page/solicitud-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let registroServiceMock: any;
  let consultaioQueryMock: any;
  let mockStore: any;
  let mockQuery: any;
  let mockRegistroService: any;

  beforeEach(async () => {
     mockStore = {
      setIdSolicitud: jest.fn(() => of()),
      setFormValida: jest.fn(() => of()),
    };
    mockQuery = {
      selectSolicitud$: of({}),
      selectDestinatarioForm$: of({ nombre: 'John', ciudad: 'CDMX' }),
      selectFormDestinatario$: of({ calle: 'Main St', numeroLetra: '123A' }),
      selectFormDatosDelDestinatario$: of(),
      selectSeccionState$: of({}),
      formDatosCertificado$: of({}),
      formCertificado$: of({}),
    };
    mockRegistroService = {
      getAllState: jest.fn().mockReturnValue(of({})),
      guardarDatosPost: jest
        .fn()
        .mockReturnValue(of({ datos: { id_solicitud: 123 } })),
      getCatalogoById: jest.fn().mockReturnValue(of({})),
      getFraccionesArancelarias: jest.fn().mockReturnValue(of([])),
      getPaisesBloques: jest.fn().mockReturnValue(of([])),
      buildMercanciaSeleccionadas: jest.fn().mockReturnValue(['mercancia']),
    };

    registroServiceMock = {
      getCatalogoById: jest.fn(() => of()),
      getRegistroTomaMuestrasMercanciasData: jest.fn(() => of()),
      actualizarEstadoFormulario: jest.fn(() => of()),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ update: false }),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        CommonModule,
        SolicitanteComponent,
        CertificadoOrigenComponent,
        DatosCertificadoComponent,
        DestinatarioDeComponent,
        PasoUnoComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        ToastrService,
        { provide: Tramite110207Store, useValue: mockStore },
        { provide: Tramite110207Query, useValue: mockQuery },
        { provide: RegistroService, useValue: mockRegistroService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    component = new PasoUnoComponent(registroServiceMock, consultaioQueryMock);
    component.certificadoDeOrigenComponent = {
      validateAll: jest.fn(() => true),
    } as any as CertificadoOrigenComponent;
    component.datosCertificadoComponent = {
      validateAll: jest.fn(() => true),
    } as any as DatosCertificadoComponent;
    component.destinatarioComponent = {
      validateAll: jest.fn(() => true),
    } as any as DestinatarioDeComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should validate all child components and return true', () => {
    expect(component.validateAll()).toBe(true);
  });

  it('should return false if certificadoDeOrigenComponent.validateAll returns false', () => {
    component.certificadoDeOrigenComponent.validateAll = jest.fn(() => false);
    expect(component.validateAll()).toBe(false);
  });

  it('should return false if datosCertificadoComponent.validateAll returns false', () => {
    component.datosCertificadoComponent.validateAll = jest.fn(() => false);
    expect(component.validateAll()).toBe(false);
  });

  it('should return false if destinatarioComponent.validateAll returns false', () => {
    component.destinatarioComponent.validateAll = jest.fn(() => false);
    expect(component.validateAll()).toBe(false);
  });

  it('should return false if any child component is missing', () => {
    component.certificadoDeOrigenComponent = undefined as any;
    expect(component.validateAll()).toBe(false);
  });

  it('should call destroyed$ next and complete on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call actualizarEstadoFormulario when guardarDatosFormularios receives data', () => {
    registroServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(
      of({ some: 'data' })
    );
    component.guardarDatosFormularios();
    expect(registroServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(
      { some: 'data' }
    );
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should not call actualizarEstadoFormulario when guardarDatosFormularios receives null', () => {
    registroServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(
      of(null)
    );
    component.guardarDatosFormularios();
    expect(
      registroServiceMock.actualizarEstadoFormulario
    ).not.toHaveBeenCalled();
  });

  it('should process entidadFederativa on ngOnInit', () => {
    const mockData = {
      data: JSON.stringify({
        domicilioFiscal: {
          entidadFederativa: { id: 1, nombre: 'Entidad' },
        },
      }),
    };
    registroServiceMock.getCatalogoById.mockReturnValue(of(mockData));
    consultaioQueryMock.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.entidadFederativa).toEqual({ id: 1, nombre: 'Entidad' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormularios if consultaState.update is true on ngOnInit', () => {
    consultaioQueryMock.selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormularios');
    registroServiceMock.getCatalogoById.mockReturnValue(of({ data: '{}' }));
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });
});
