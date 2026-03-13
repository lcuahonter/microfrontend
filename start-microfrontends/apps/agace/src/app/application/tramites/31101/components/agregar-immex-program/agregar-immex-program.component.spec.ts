import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarImmexProgramComponent } from './agregar-immex-program.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud31101Store } from '../../estados/solicitud31101.store';
import { Solicitud31101Query } from '../../estados/solicitud31101.query';
import { of } from 'rxjs';
import { Catalogo, CatalogosSelect } from '@libs/shared/data-access-user/src';
import { EntidadFederativa } from '../../models/solicitud.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarImmexProgramComponent', () => {
  let component: AgregarImmexProgramComponent;
  let fixture: ComponentFixture<AgregarImmexProgramComponent>;
  let solicitudServiceMock: jest.Mocked<SolicitudService>;
  let solicitud31101StoreMock: jest.Mocked<Solicitud31101Store>;
  let solicitud31101QueryMock: jest.Mocked<Solicitud31101Query>;

  beforeEach(async () => {
    solicitudServiceMock = {
      entidadFederativaCatalogo: jest.fn(() =>
        of({
          labelNombre: '',
          required: true,
          primerOpcion: 'Selecciona un tipo',
          catalogos: [
            {
              id: 1,
              descripcion: 'AGUASCALIENTES',
            },
            {
              id: 2,
              descripcion: 'AGUASCALIENTES -1',
            },
          ],
        })
      ),
      conseguirEntidadFederativaDatos: jest.fn(() =>
        of([
          {
            entidadFederativa: 'SINALOA',
            municipioDelegacion: 'AHOME',
            direccion: 'MIGUEL HIDALGO CAMINO VIEJO 1353',
            codigoPostal: '81210',
            registroSESAT: 'SAT',
          },
        ])
      ),
    } as unknown as jest.Mocked<SolicitudService>;

    solicitud31101StoreMock = {
      actualizarEntidadFederativa: jest.fn(),
    } as unknown as jest.Mocked<Solicitud31101Store>;

    solicitud31101QueryMock = {
      selectSolicitud$: of({ entidadFederativa: {} }),
    } as jest.Mocked<Solicitud31101Query>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AgregarImmexProgramComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud31101Store, useValue: solicitud31101StoreMock },
        { provide: Solicitud31101Query, useValue: solicitud31101QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarImmexProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.agregarImmexProgramForm).toBeDefined();
    expect(
      component.agregarImmexProgramForm.get('entidadFederativa')
    ).toBeTruthy();
  });

  it('should call entidadFederativaCatalogo and update entidadFederativa', () => {
    const mockCatalogosSelect: CatalogosSelect = {
      labelNombre: '',
      required: true,
      primerOpcion: 'Selecciona un tipo',
      catalogos: [
        {
          id: 1,
          descripcion: 'AGUASCALIENTES',
        },
        {
          id: 2,
          descripcion: 'AGUASCALIENTES -1',
        },
      ],
    };
    solicitudServiceMock.entidadFederativaCatalogo = jest
      .fn()
      .mockReturnValue(of(mockCatalogosSelect));

    component.entidadFederativaCatalogo();

    expect(solicitudServiceMock.entidadFederativaCatalogo).toHaveBeenCalled();
    expect(component.entidadFederativa).toEqual(mockCatalogosSelect);
  });

  it('should call conseguirEntidadFederativaDatos on initialization', () => {
    solicitudServiceMock.conseguirEntidadFederativaDatos.mockReturnValue(
      of([
        {
          entidadFederativa: 'SINALOA',
          municipioDelegacion: 'AHOME',
          direccion: 'MIGUEL HIDALGO CAMINO VIEJO 1353',
          codigoPostal: '81210',
          registroSESAT: 'SAT',
        },
      ])
    );
    component.conseguirEntidadFederativaDatos();
    expect(
      solicitudServiceMock.conseguirEntidadFederativaDatos
    ).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario when esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const guardarDatosFormularioSpy = jest.spyOn(
      component,
      'guardarDatosFormulario'
    );
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario when esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const inicializarFormularioSpy = jest.spyOn(
      component,
      'inicializarFormulario'
    );
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should disable the form when esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    jest.spyOn(component, 'inicializarFormulario').mockImplementation(() => {});

    const disableSpy = jest.spyOn(component.agregarImmexProgramForm, 'disable');
    component.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should enable the form when esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    jest.spyOn(component, 'inicializarFormulario').mockImplementation(() => {});

    const enableSpy = jest.spyOn(component.agregarImmexProgramForm, 'enable');
    component.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should handle seleccionArentidadFederativa correctly', () => {
    const mockCatalogo: Catalogo = { id: 1, descripcion: 'Test' };
    component.domiciliosDatos = [
      {
        cveEntidadFederativa: '1'
      } as EntidadFederativa,
    ];
    component.seleccionArentidadFederativa(mockCatalogo);
     expect(
      solicitud31101StoreMock.actualizarEntidadFederativa
    ).toHaveBeenCalledWith(1);
  });

  it('should emit agregarImmexValor on agregarImmexProgram', () => {
    const emitSpy = jest.spyOn(component.agregarImmexValor, 'emit');
    component.domicilioslista = [
      {
        cveEntidadFederativa: '1',
        municipioDelegacion: 'Test',
        direccion: 'Test Address',
        codigoPostal: '12345',
        registroSESAT: 'Test SESAT',
      } as EntidadFederativa,
    ];
    component.agregarImmexProgram();
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
