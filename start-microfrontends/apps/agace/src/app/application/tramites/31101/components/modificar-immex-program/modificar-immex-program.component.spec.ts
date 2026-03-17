import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarImmexProgramComponent } from './modificar-immex-program.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud31101Store } from '../../estados/solicitud31101.store';
import { Solicitud31101Query } from '../../estados/solicitud31101.query';
import { CatalogoSelectComponent, ConsultaioQuery, InputRadioComponent } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import {
  Domicilios,
  DatosGeneralesDeLaSolicitudRadioLista,
  DatosGeneralesDeLaSolicitudCatologo,
} from '../../models/solicitud.model';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModificarImmexProgramComponent', () => {
  let component: ModificarImmexProgramComponent;
  let fixture: ComponentFixture<ModificarImmexProgramComponent>;
  let solicitudServiceMock: any;
  let solicitud31101StoreMock: any;
  let solicitud31101QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirDatosGeneralesOpcionDeRadio: jest
        .fn()
        .mockReturnValue(of({ requisitos: { radio: 'mock' } })),
      conseguirDatosGeneralesCatologo: jest
        .fn()
        .mockReturnValue(of({ tipoDeInstalacion: { catalogo: 'mock' } })),
    };
    solicitud31101StoreMock = {
      actualizarInstalacionesPrincipales: jest.fn(() => of()),
      actualizarMunicipio: jest.fn(() => of()),
      actualizarTipoDeInstalacion: jest.fn(() => of()),
      actualizarFederativa: jest.fn(() => of()),
      actualizarRegistroSE: jest.fn(() => of()),
      actualizarDesceripe: jest.fn(() => of()),
      actualizarCodigoPostal: jest.fn(() => of()),
      actualizarProcesoProductivo: jest.fn(() => of()),
    };
    solicitud31101QueryMock = {
      selectSolicitud$: of({
        instalacionesPrincipales: 'inst',
        municipio: 'mun',
        tipoDeInstalacion: 'tipo',
        federativa: 'fed',
        registroSE: 'reg',
        desceripe: 'desc',
        codigoPostal: '12345',
        procesoProductivo: 'proc',
      }),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ModificarImmexProgramComponent,
        CommonModule,
        CatalogoSelectComponent,
        InputRadioComponent,
        HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud31101Store, useValue: solicitud31101StoreMock },
        { provide: Solicitud31101Query, useValue: solicitud31101QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarImmexProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from state', () => {
    expect(component.modificarImmexProgramForm.value).toEqual({
      instalacionesPrincipales: 'inst',
      municipio: 'mun',
      tipoDeInstalacion: 'tipo',
      federativa: 'fed',
      registroSE: 'reg',
      desceripe: 'desc',
      codigoPostal: '12345',
      procesoProductivo: 'proc',
    });
  });

  it('should call store update methods on ngOnChanges when seleccionarDomiciliosDatos changes', () => {
    const domicilios: Domicilios[] = [
      {
        id: 1,
        instalacionPrincipal: 'A',
        municipioDelegacion: 'B',
        tipoInstalacion: 'C',
        entidadFederativa: 'D',
        registroSESAT: 'E',
        direccion: 'F',
        codigoPostal: 'G',
        procesoProductivo: 'H',
      } as any,
    ];

    component.seleccionarDomiciliosDatos = domicilios;
    component.ngOnChanges({
      seleccionarDomiciliosDatos: {
        currentValue: domicilios,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(
      solicitud31101StoreMock.actualizarInstalacionesPrincipales
    ).toHaveBeenCalledWith('A');
    expect(solicitud31101StoreMock.actualizarMunicipio).toHaveBeenCalledWith(
      'B'
    );
    expect(
      solicitud31101StoreMock.actualizarTipoDeInstalacion
    ).toHaveBeenCalledWith('C');
    expect(solicitud31101StoreMock.actualizarFederativa).toHaveBeenCalledWith(
      'D'
    );
    expect(solicitud31101StoreMock.actualizarRegistroSE).toHaveBeenCalledWith(
      'E'
    );
    expect(solicitud31101StoreMock.actualizarDesceripe).toHaveBeenCalledWith(
      'F'
    );
    expect(solicitud31101StoreMock.actualizarCodigoPostal).toHaveBeenCalledWith(
      'G'
    );
    expect(
      solicitud31101StoreMock.actualizarProcesoProductivo
    ).toHaveBeenCalledWith('H');
  });

  it('should disable the form if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.modificarImmexProgramForm.disabled).toBe(true);
  });

  it('should enable the form if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.modificarImmexProgramForm.enabled).toBe(true);
  });

  it('should emit modificarImmexValor with correct value on aceptarImmexProgram', () => {
    const domicilios: Domicilios[] = [{ id: 99 } as any];
    component.DOMICILIOS = domicilios;
    component.modificarImmexProgramForm.setValue({
      instalacionesPrincipales: 'inst',
      municipio: 'mun',
      tipoDeInstalacion: 'tipo',
      federativa: 'fed',
      registroSE: 'reg',
      desceripe: 'desc',
      codigoPostal: '12345',
      procesoProductivo: 'proc',
    });
    jest.spyOn(component.modificarImmexValor, 'emit');

    component.aceptarImmexProgram();

    expect(component.modificarImmexValor.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        instalacionPrincipal: 'inst',
        municipioDelegacion: 'mun',
        tipoInstalacion: 'tipo',
        entidadFederativa: 'fed',
        registroSESAT: 'reg',
        direccion: 'desc',
        codigoPostal: '12345',
        procesoProductivo: 'proc',
        id: 99,
      })
    );
  });

  it('should not emit modificarImmexValor if form is invalid on aceptarImmexProgram', () => {
    component.modificarImmexProgramForm.reset();
    jest.spyOn(component.modificarImmexValor, 'emit');
    component.aceptarImmexProgram();
    expect(component.modificarImmexValor.emit).not.toHaveBeenCalled();
  });

  it('should emit undefined and reset form on cancelarImmexProgram', () => {
    jest.spyOn(component.modificarImmexValor, 'emit');
    component.modificarImmexProgramForm.setValue({
      instalacionesPrincipales: 'inst',
      municipio: 'mun',
      tipoDeInstalacion: 'tipo',
      federativa: 'fed',
      registroSE: 'reg',
      desceripe: 'desc',
      codigoPostal: '12345',
      procesoProductivo: 'proc',
    });
    component.cancelarImmexProgram();
    expect(component.modificarImmexValor.emit).toHaveBeenCalledWith(undefined);
  });

  it('noEsValido should return true if control is invalid and touched', () => {
    const control = component.modificarImmexProgramForm.get('municipio');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.noEsValido('municipio')).toBe(true);
  });

  it('noEsValido should return undefined if control is valid or not touched', () => {
    const control = component.modificarImmexProgramForm.get('municipio');
    control?.setValue('mun');
    control?.markAsTouched();
    expect(component.noEsValido('municipio')).toBe(false);
    control?.markAsUntouched();
    expect(component.noEsValido('municipio')).toBe(false);
  });

  it('actualizarInstalacionesPrincipales should call store', () => {
    component.actualizarInstalacionesPrincipales('valor');
    expect(
      solicitud31101StoreMock.actualizarInstalacionesPrincipales
    ).toHaveBeenCalledWith('valor');
  });

  it('actualizarMunicipio should call store', () => {
    const event = { target: { value: 'mun' } } as any;
    component.actualizarMunicipio(event);
    expect(solicitud31101StoreMock.actualizarMunicipio).toHaveBeenCalledWith(
      'mun'
    );
  });

  it('actualizarTipoDeInstalacion should call store', () => {
    component.actualizarTipoDeInstalacion({ id: 'tipo' } as any);
    expect(
      solicitud31101StoreMock.actualizarTipoDeInstalacion
    ).toHaveBeenCalledWith('tipo');
  });

  it('actualizarFederativa should call store', () => {
    const event = { target: { value: 'fed' } } as any;
    component.actualizarFederativa(event);
    expect(solicitud31101StoreMock.actualizarFederativa).toHaveBeenCalledWith(
      'fed'
    );
  });

  it('actualizarRegistroSE should call store', () => {
    const event = { target: { value: 'reg' } } as any;
    component.actualizarRegistroSE(event);
    expect(solicitud31101StoreMock.actualizarRegistroSE).toHaveBeenCalledWith(
      'reg'
    );
  });

  it('actualizarDesceripe should call store', () => {
    const event = { target: { value: 'desc' } } as any;
    component.actualizarDesceripe(event);
    expect(solicitud31101StoreMock.actualizarDesceripe).toHaveBeenCalledWith(
      'desc'
    );
  });

  it('actualizarCodigoPostal should call store', () => {
    const event = { target: { value: '12345' } } as any;
    component.actualizarCodigoPostal(event);
    expect(solicitud31101StoreMock.actualizarCodigoPostal).toHaveBeenCalledWith(
      '12345'
    );
  });

  it('actualizarProcesoProductivo should call store', () => {
    component.actualizarProcesoProductivo('proc');
    expect(
      solicitud31101StoreMock.actualizarProcesoProductivo
    ).toHaveBeenCalledWith('proc');
  });

  it('should clean up destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroy$, 'next');
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set sinoOpcion and tipoDeInstalacion from service observables', () => {
    expect(component.sinoOpcion).toEqual({});
    expect(component.tipoDeInstalacion).toEqual({});
  });
});
