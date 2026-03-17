import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoUnoComponent } from './paso-uno.component';
import {
  BtnContinuarComponent,
  ConsultaioQuery,
  SolicitanteComponent,
} from '@libs/shared/data-access-user/src';
import { SolicitudService } from '../../services/solicitud.service';
import { of, Subject } from 'rxjs';
import { SolicitudModel } from '../../models/solicitud.model';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQueryMock: any;
  let solicitudServiceMock: any;

  const mockSolicitud: SolicitudModel = {
    nombreComercial: 'Empresa ABC',
    entidadFederativa: 1,
    municipio: 2,
    colonia: 3,
    calle: 'Av. Reforma',
    numeroExterior: '123',
    numeroInterior: '456',
    codigoPostal: '12345',
    lugarEntidadFederativa: 4,
    lugarMunicipioAlcaldia: 5,
    lugarColonia: 6,
    lugarCalle: 'Calle destrucción',
    lugarNumeroExterior: '789',
    lugarNumeroInterior: '101',
    lugarCodigoPostal: '67890',
    generico1: 'GEN1',
    generico2: 'GEN2',
    archivoDestruccion: new File(['contenido'], 'archivo.pdf'),
  };

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: true }),
    };

    solicitudServiceMock = {
      guardarDatosFormulario: jest.fn(() => of(mockSolicitud)),
      actualizarEstadoFormulario: jest.fn(()=> of()),
    };
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        SolicitanteComponent,
        BtnContinuarComponent,
        HttpClientTestingModule,
        PasoUnoComponent,
      ],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: SolicitudService, useValue: solicitudServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default indice value as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.indice = 1;
    expect(component.indice).toBe(1);

    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
  });

  it('should enable isEnableModificacionTab when tipoDeEndosoChanges is called with 3', () => {
    component.tipoDeEndosoChanges(3);
    expect(component.isEnableModificacionTab).toBe(true);
  });

  it('should disable isEnableModificacionTab when tipoDeEndosoChanges is called with a value other than 3', () => {
    component.tipoDeEndosoChanges(2);
    expect(component.isEnableModificacionTab).toBe(false);

    component.tipoDeEndosoChanges(0);
    expect(component.isEnableModificacionTab).toBe(false);

    component.tipoDeEndosoChanges('test');
    expect(component.isEnableModificacionTab).toBe(false);
  });

  it('should call guardarDatosFormulario when consultaState.update is true', () => {
    jest.spyOn(solicitudServiceMock, 'guardarDatosFormulario');
    solicitudServiceMock.guardarDatosFormulario();
    expect(solicitudServiceMock.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true and update store when guardarDatosFormulario is called', () => {
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(
      solicitudServiceMock.actualizarEstadoFormulario
    ).toHaveBeenCalledWith(mockSolicitud);
  });
});
