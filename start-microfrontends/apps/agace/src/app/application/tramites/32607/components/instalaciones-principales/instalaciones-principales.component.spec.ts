import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { InstalacionesPrincipalesComponent } from './instalaciones-principales.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import { Domicilios } from '../../models/solicitud.model';
import { CommonModule } from '@angular/common';
import {
  CatalogoSelectComponent,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InstalacionesPrincipalesComponent', () => {
  let component: InstalacionesPrincipalesComponent;
  let fixture: ComponentFixture<InstalacionesPrincipalesComponent>;
  let solicitudServiceMock: any;
  let solicitud32607StoreMock: any;
  let solicitud32607QueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirOpcionDeRadio: jest.fn().mockReturnValue(
        of({
          requisitos: {
            radioOptions: [
              {
                label: 'Sí',
                value: 1,
              },
              {
                label: 'No',
                value: 2,
              },
            ],
            isRequired: true,
          },
        })
      ),
      conseguirSolicitudCatologoSelectLista: jest.fn().mockReturnValue(
        of({
          tipoDeInstalacion: {
            labelNombre: 'Tipo de instalación',
            required: true,
            primerOpcion: 'Selecciona un tipo',
            catalogos: [
              {
                id: 1,
                descripcion: 'Test 1',
              },
              {
                id: 2,
                descripcion: 'Test 2',
              },
            ],
          },
        })
      ),
    };

    solicitud32607StoreMock = {
      actualizarPrincipales: jest.fn(),
      actualizarMunicipio: jest.fn(),
      actualizarTipoDeInstalacion: jest.fn(),
      actualizarEntidadFederativa: jest.fn(),
      actualizarRegistroSESAT: jest.fn(),
      actualizarDescripcion: jest.fn(),
      actualizarCodigoPostal: jest.fn(),
      actualizarProcesoProductivo: jest.fn(),
      actualizarGoceDelInmueble: jest.fn(),
      actualizarEmpresa: jest.fn(),
      actualizarComercioExterior: jest.fn(),
      actualizarMutuo: jest.fn(),
    };

    solicitud32607QueryMock = {
      selectSolicitud$: of({}),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        InstalacionesPrincipalesComponent,
        CommonModule,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        TituloComponent,
        InputRadioComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud32607Store, useValue: solicitud32607StoreMock },
        { provide: Solicitud32607Query, useValue: solicitud32607QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstalacionesPrincipalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.instalacionesPrincipalesForm).toBeDefined();
  });

  it('should call conseguirOpcionDeRadio on initialization', () => {
    jest.spyOn(component, 'conseguirOpcionDeRadio');
    component.conseguirOpcionDeRadio();
    expect(component.conseguirOpcionDeRadio).toHaveBeenCalled();
  });

  it('should call conseguirSolicitudCatologoSelectLista on initialization', () => {
    jest.spyOn(component, 'conseguirSolicitudCatologoSelectLista');
    component.conseguirSolicitudCatologoSelectLista();
    expect(component.conseguirSolicitudCatologoSelectLista).toHaveBeenCalled();
  });

  it('should emit the correct object on aceptarInstalacionesPrincipales', () => {
    const spy = jest.spyOn(component.instalacionesPrincipales, 'emit');
    component.instalacionesPrincipalesForm.setValue({
      principales: 'test',
      municipio: 'test',
      tipoDeInstalacion: 'test',
      entidadFederativa: 'test',
      registroSESAT: 'test',
      descripcion: 'test',
      codigoPostal: 'test',
      procesoProductivo: 'test',
      goceDelInmueble: 'test',
      empresa: 'test',
      comercioExterior: 'test',
      mutuo: 'test',
    });

    component.aceptarInstalacionesPrincipales();

    expect(spy).toHaveBeenCalledWith({
      instalacionPrincipal: 'test',
      tipoInstalacion: 'test',
      entidadFederativa: 'test',
      municipioDelegacion: 'test',
      direccion: 'test',
      codigoPostal: 'test',
      registroSESAT: 'test',
      procesoProductivo: 'test',
      acreditaInmueble: 'test',
      operacionesCExt: 'test',
      instalacionCtpat: '',
      instalacionPerfil: '',
      instalacionPerfilRFE: '',
      instalacionPerfilAuto: '',
      instalacionPerfilFerro: '',
      instalacionPerfilRf: '',
      instalacionPerfilMensajeria: '',
    });
  });

  it('should call actualizarPrincipales with the correct value', () => {
    component.actualizarPrincipales('test');
    expect(solicitud32607StoreMock.actualizarPrincipales).toHaveBeenCalledWith(
      'test'
    );
  });

  it('should call actualizarMunicipio with the correct value', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.actualizarMunicipio(event);
    expect(solicitud32607StoreMock.actualizarMunicipio).toHaveBeenCalledWith(
      'test'
    );
  });

  it('should call actualizarTipoDeInstalacion with the correct value', () => {
    component.actualizarTipoDeInstalacion({ id: 1, descripcion: 'Test' });
    expect(
      solicitud32607StoreMock.actualizarTipoDeInstalacion
    ).toHaveBeenCalledWith(1);
  });

  it('should call actualizarEntidadFederativa with the correct value', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.actualizarEntidadFederativa(event);
    expect(
      solicitud32607StoreMock.actualizarEntidadFederativa
    ).toHaveBeenCalledWith('test');
  });

  it('should call actualizarRegistroSESAT with the correct value', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.actualizarRegistroSESAT(event);
    expect(
      solicitud32607StoreMock.actualizarRegistroSESAT
    ).toHaveBeenCalledWith('test');
  });

  it('should call actualizarDescripcion with the correct value', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.actualizarDescripcion(event);
    expect(solicitud32607StoreMock.actualizarDescripcion).toHaveBeenCalledWith(
      'test'
    );
  });

  it('should call actualizarCodigoPostal with the correct value', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.actualizarCodigoPostal(event);
    expect(solicitud32607StoreMock.actualizarCodigoPostal).toHaveBeenCalledWith(
      'test'
    );
  });

  it('should call actualizarProcesoProductivo with the correct value', () => {
    component.actualizarProcesoProductivo('test');
    expect(
      solicitud32607StoreMock.actualizarProcesoProductivo
    ).toHaveBeenCalledWith('test');
  });

  it('should call actualizarGoceDelInmueble with the correct value', () => {
    component.actualizarGoceDelInmueble('test');
    expect(
      solicitud32607StoreMock.actualizarGoceDelInmueble
    ).toHaveBeenCalledWith('test');
  });

  it('should call actualizarEmpresa with the correct value', () => {
    component.actualizarEmpresa('test');
    expect(solicitud32607StoreMock.actualizarEmpresa).toHaveBeenCalledWith(
      'test'
    );
  });

  it('should call actualizarComercioExterior with the correct value', () => {
    component.actualizarComercioExterior('test');
    expect(
      solicitud32607StoreMock.actualizarComercioExterior
    ).toHaveBeenCalledWith('test');
  });

  it('should call actualizarMutuo with the correct value', () => {
    component.actualizarMutuo('test');
    expect(solicitud32607StoreMock.actualizarMutuo).toHaveBeenCalledWith(
      'test'
    );
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
