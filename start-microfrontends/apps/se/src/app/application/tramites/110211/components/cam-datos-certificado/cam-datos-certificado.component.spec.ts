import { TestBed } from '@angular/core/testing';
import { CamDatosCertificadoComponent } from './cam-datos-certificado.component';
import { CamCertificadoService } from '../../services/cam-certificado.service';
import { camCertificadoStore } from '../../estados/cam-certificado.store';
import { camCertificadoQuery } from '../../estados/cam-certificado.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosCertificadoDeComponent } from '../../../../shared/components/datos-certificado-de/datos-certificado-de.component';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('CamDatosCertificadoComponent', () => {
  let component: CamDatosCertificadoComponent;
  let fixture: any;
  let storeMock: jest.Mocked<camCertificadoStore>;
  let queryMock: Partial<camCertificadoQuery>;
  let consultaioQueryMock: Partial<ConsultaioQuery>;

  beforeEach(async () => {
    storeMock = {
      setFormDatosCertificadoGenric: jest.fn(()=> of()),
      setFormDatosCertificado: jest.fn(()=> of()),
      setIdiomaSeleccion: jest.fn(()=> of()),
      setEntidadFederativaSeleccion: jest.fn(()=> of()),
      setRepresentacionFederalDatosSeleccion: jest.fn(()=> of()),
      setFormValida: jest.fn(()=> of())
    } as any;

    queryMock = {
      selectFormDatosDelDestinatario$: of({ test: 'value' })
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ 
        readonly: true,
        procedureId: '123',
        parameter: 'test',
        department: 'HR',
        folioTramite: '456',
        tipoDeTramite: 'type',
        estadoDeTramite: 'state',
        create: true,
        update: false,
        consultaioSolicitante: null,
        action_id: 'action_1',
        current_user: 'user_1',
        id_solicitud: 'solicitud_1',
        nombre_pagina: 'pagina_1',
        idSolicitudSeleccionada: 'solicitud_2'
      })
    };

    await TestBed.configureTestingModule({
      imports: [CamDatosCertificadoComponent, DatosCertificadoDeComponent, CommonModule, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        ToastrService,
        { provide: CamCertificadoService, useValue: {} },
        { provide: camCertificadoStore, useValue: storeMock },
        { provide: camCertificadoQuery, useValue: queryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CamDatosCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formDatosCertificadoValues from query', () => {
    expect(component.formDatosCertificadoValues).toEqual({ test: 'value' });
  });

  it('should set esFormularioSoloLectura from consultaioQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('setValoresStore should call store.setFormDatosCertificadoGenric', () => {
    const event = { formGroupName: 'group', campo: 'campo', valor: 'valor', storeStateName: 'state' };
    component.setValoresStore(event);
    expect(storeMock.setFormDatosCertificadoGenric).toHaveBeenCalledWith({ campo: 'valor' });
  });

  it('obtenerDatosFormulario should call store.setFormDatosCertificado', () => {
    const data = { foo: 'bar' };
    component.obtenerDatosFormulario(data);
    expect(storeMock.setFormDatosCertificado).toHaveBeenCalledWith(data);
  });

  it('idiomaSeleccion should call store.setIdiomaSeleccion', () => {
    const catalogo = { id: 1, nombre: 'Español' } as any;
    component.idiomaSeleccion(catalogo);
    expect(storeMock.setIdiomaSeleccion).toHaveBeenCalledWith(catalogo);
  });

  it('entidadFederativaSeleccion should call store.setEntidadFederativaSeleccion', () => {
    const catalogo = { id: 2, nombre: 'Entidad' } as any;
    component.entidadFederativaSeleccion(catalogo);
    expect(storeMock.setEntidadFederativaSeleccion).toHaveBeenCalledWith(catalogo);
  });

  it('representacionFederalSeleccion should call store.setRepresentacionFederalDatosSeleccion', () => {
    const catalogo = { id: 3, nombre: 'Representación' } as any;
    component.representacionFederalSeleccion(catalogo);
    expect(storeMock.setRepresentacionFederalDatosSeleccion).toHaveBeenCalledWith(catalogo);
  });

  it('setFormValida should call store.setFormValida', () => {
    component.setFormValida(true);
    expect(storeMock.setFormValida).toHaveBeenCalledWith({ datos: true });
  });

  it('validarFormularios should call datosCertificadoDeComponent.validarFormularios', () => {
    component.datosCertificadoDeComponent = { validarFormularios: jest.fn().mockReturnValue(true) } as any;
    expect(component.validarFormularios()).toBe(true);
    expect(component.datosCertificadoDeComponent.validarFormularios).toHaveBeenCalled();
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
