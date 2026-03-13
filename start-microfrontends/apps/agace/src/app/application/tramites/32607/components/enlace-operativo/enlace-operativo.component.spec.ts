import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnlaceOperativoComponent } from './enlace-operativo.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import { CatalogoSelectComponent, ConsultaioQuery, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('EnlaceOperativoComponent', () => {
  let component: EnlaceOperativoComponent;
  let fixture: ComponentFixture<EnlaceOperativoComponent>;
  let mockSolicitudService: any;
  let mockStore: any;
  let mockQuery: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockSolicitudService = {
      guardarEntidadFederative: jest.fn().mockReturnValue(of([])),
      guardarInstalacions: jest.fn().mockReturnValue(of([])),
    };
    mockStore = {
      actualizarEntidad: jest.fn(),
    };
    mockQuery = {
      selectSolicitud$: of({ entidad: 1 }),
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        CatalogoSelectComponent,
        TablaDinamicaComponent,
        EnlaceOperativoComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud32607Store, useValue: mockStore },
        { provide: Solicitud32607Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnlaceOperativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with entity value', () => {
    expect(component.enlaceOperativoForm.value.entidad).toBe(1);
  });

  it('should call actualizarEntidadFederative and guardarInstalacions', () => {
    const mockCatalogo = { id: 123, descripcion: '' };
    component.actualizarEntidadFederative(mockCatalogo);
    expect(mockStore.actualizarEntidad).toHaveBeenCalledWith(123);
    expect(mockSolicitudService.guardarInstalacions).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
});
 
it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
});
 
it('should disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.enlaceOperativoForm = new FormBuilder().group({ test: ['value'] });
    component.guardarDatosFormulario();
    expect(component.enlaceOperativoForm.disabled).toBe(true);
});
 
it('should enable form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.enlaceOperativoForm = new FormBuilder().group({ test: ['value'] });
    component.guardarDatosFormulario();
    expect(component.enlaceOperativoForm.enabled).toBe(true);
});

  it('should set instalacions when seleccionarInstalacionsDato is called', () => {
    const data = [
      {
        entidadFederativa: 'Test',
        municipioDelegacion: '',
        direccion: '',
        codigoPostal: '',
        registroSESAT: '',
      },
    ];
    component.seleccionarInstalacionsDato(data);
    expect(component.instalacions).toEqual(data);
  });
});
