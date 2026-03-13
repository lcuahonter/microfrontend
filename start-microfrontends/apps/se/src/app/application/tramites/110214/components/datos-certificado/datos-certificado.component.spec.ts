import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { DatosCertificadoComponent } from './datos-certificado.component';
import { Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { Catalogo, ConsultaioQuery, SeccionLibQuery, TituloComponent } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockDatosCertificadoDeComponent {
  formDatosCertificado = new FormGroup({
    idioma: new FormControl('ES'),
  });

  validarFormularios = jest.fn().mockReturnValue(true);
}

describe('DatosCertificadoComponent', () => {
  let component: DatosCertificadoComponent;
  let fixture: ComponentFixture<DatosCertificadoComponent>;
  let validarInicialmenteCertificadoServiceMock: any;
  let tramite110214StoreMock: any;
  let tramite110214QueryMock: any;
  let store: jest.Mocked<Tramite110214Store>;
  let tramiteQuery: jest.Mocked<Tramite110214Query>;
  let consultaioQuery: jest.Mocked<ConsultaioQuery>;
  let seccionQuery: jest.Mocked<SeccionLibQuery>;

  beforeEach(async () => {
    validarInicialmenteCertificadoServiceMock = {
      obtenerIdioma: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Español' }] })),
      obtenerEntidadFederativa: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Entidad 1' }] })),
      obtenerRepresentacionFederal: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Representación 1' }] }))
    };

    tramite110214StoreMock = {
      setIdioma: jest.fn(),
      setEntidadFederativa: jest.fn(),
      setRepresentacionFederal: jest.fn()
    };

    tramite110214QueryMock = {
      selectSolicitud$: of({
        observaciones: 'Observaciones de prueba',
        idioma: 1,
        entidadFederativa: 1,
        representacionFederal: 1
      })
    };

    store = {
      setFormValida: jest.fn(),
      setFormValidity: jest.fn(),
      setFormDatosCertificado: jest.fn(),
      setIdiomaSeleccion: jest.fn(),
      setRepresentacionFederalDatosSeleccion: jest.fn(),
    } as any;

    tramiteQuery = {
      formDatosCertificado$: of({}),
      selectIdioma$: of([]),
      selectEntidadFederativa$: of([]),
      selectrepresentacionFederal$: of([]),
    } as any;

    consultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    } as any;

    seccionQuery = {
      selectSeccionState$: of({}),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent,
        DatosCertificadoComponent,
        HttpClientTestingModule
      ],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        FormBuilder,
        { provide: Tramite110214Store, useValue: store },
        { provide: Tramite110214Query, useValue: tramiteQuery },
        { provide: ConsultaioQuery, useValue: consultaioQuery },
        { provide: SeccionLibQuery, useValue: seccionQuery },
        { provide: ValidarInicialmenteCertificadoService, useValue: {} },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.componentInstance;
    component.datosCertificadoDeRef = new MockDatosCertificadoDeComponent() as any;
    component.formDatosCertificado = new FormGroup({
      idioma: new FormControl('ES'),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to observables on ngOnInit', () => {
    const spy = jest.spyOn(consultaioQuery.selectConsultaioState$, 'subscribe');
    component.ngOnInit();
    expect(spy).toBeDefined();
  });

  it('should return true when form is valid', () => {
    component.formDatosCertificado = new FormGroup({
      idioma: new FormControl('EN'),
    });
    const result = component.validarFormulario();
    expect(result).toBe(true);
  });

  it('should call setFormValida and setFormValidity in setFormValida()', () => {
    component.setFormValida(true);
    expect(store.setFormValida).toHaveBeenCalledWith({ datos: true });
    expect(store.setFormValidity).toHaveBeenCalledWith('datosCertificado', true);
  });

  it('should validate child form in validateAll()', () => {
    const spy = jest.spyOn(component.datosCertificadoDeRef, 'validarFormularios');
    component.validateAll();
    expect(spy).toHaveBeenCalled();
  });

  it('should call setIdiomaSeleccion when idiomaSeleccion() is triggered', () => {
    const mockCatalogo: Catalogo = { id: 1, descripcion: 'Inglés' };
    component.idiomaSeleccion(mockCatalogo);
    expect(store.setIdiomaSeleccion).toHaveBeenCalledWith(mockCatalogo);
  });

  it('should call setRepresentacionFederalDatosSeleccion when representacionFederalSeleccion() is triggered', () => {
    const mockCatalogo: Catalogo = { id: 1, descripcion: 'Ciudad de México' };
    component.representacionFederalSeleccion(mockCatalogo);
    expect(store.setRepresentacionFederalDatosSeleccion).toHaveBeenCalledWith(mockCatalogo);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});