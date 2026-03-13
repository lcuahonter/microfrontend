import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { DatosTramiteService } from '@libs/shared/data-access-user/src/core/services/11202/datos-tramite.service';
import { Contenedor11202Store } from '../../../../core/estados/tramites/contenedor11202.store';
import { of, Subject } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let datosTramiteServiceMock: any;
  let contenedorStoreMock: any;

  beforeEach(async () => {
    datosTramiteServiceMock = {
      getDatosConsulta: jest.fn(),
    };

    contenedorStoreMock = {
      setTipoBusqueda: jest.fn(),
      setAduana: jest.fn(),
      setInicialesContenedor: jest.fn(),
      setNumeroContenedor: jest.fn(),
      setTipoContenedor: jest.fn(),
      setContenedores: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [SolicitanteComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: DatosTramiteService, useValue: datosTramiteServiceMock },
      { provide: Contenedor11202Store, useValue: contenedorStoreMock },

      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should initialize persona and domicilioFiscal after view init', () => {
    const spy = jest.spyOn(component, 'obtenerTipoPersona');
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should select tab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should have default values', () => {
    expect(component.indice).toBe(1);
    expect(component.validacion).toBe(false);
  });

  it('should have @Input properties', () => {
    component.datosNroPedimento = { test: 'test' };
    expect(component.datosNroPedimento).toEqual({ test: 'test' });
  });

  it('should fetch data and update the store when fetchGetDatosConsulta is called', () => {
    const mockResponse = {
      success: true,
      datos: {
        tipoBusqueda: 'Test Tipo Busqueda',
        aduana: 'Test Aduana',
        inicialesContenedor: 'Test Iniciales',
        numeroContenedor: 'Test Numero',
        tipoContenedor: 'Test Tipo',
        datosDelContenedor: [{ id: 1, descripcion: 'Test Contenedor' }],
      },
    };
    datosTramiteServiceMock.getDatosConsulta.mockReturnValue(of(mockResponse));
    component.fetchGetDatosConsulta();
    expect(datosTramiteServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(contenedorStoreMock.setTipoBusqueda).toHaveBeenCalledWith('Test Tipo Busqueda');
    expect(contenedorStoreMock.setAduana).toHaveBeenCalledWith('Test Aduana');
    expect(contenedorStoreMock.setInicialesContenedor).toHaveBeenCalledWith('Test Iniciales');
    expect(contenedorStoreMock.setNumeroContenedor).toHaveBeenCalledWith('Test Numero');
    expect(contenedorStoreMock.setTipoContenedor).toHaveBeenCalledWith('Test Tipo');
    expect(contenedorStoreMock.setContenedores).toHaveBeenCalledWith([{ id: 1, descripcion: 'Test Contenedor' }]);
  });

  it('should not update the store if the response is not successful', () => {
    const mockResponse = { success: false };
    datosTramiteServiceMock.getDatosConsulta.mockReturnValue(of(mockResponse));
    component.fetchGetDatosConsulta();
    expect(datosTramiteServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(contenedorStoreMock.setTipoBusqueda).not.toHaveBeenCalled();
    expect(contenedorStoreMock.setAduana).not.toHaveBeenCalled();
    expect(contenedorStoreMock.setInicialesContenedor).not.toHaveBeenCalled();
    expect(contenedorStoreMock.setNumeroContenedor).not.toHaveBeenCalled();
    expect(contenedorStoreMock.setTipoContenedor).not.toHaveBeenCalled();
    expect(contenedorStoreMock.setContenedores).not.toHaveBeenCalled();
  });
  it('should call obtenerTipoPersona on SolicitanteComponent with TIPO_PERSONA.MORAL_NACIONAL', (done) => {
    component.solicitante = {
      obtenerTipoPersona: jest.fn(),
    } as any;
    component.obtenerTipoPersona();
    setTimeout(() => {
      expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
      done();
    }, 50);
  });

});