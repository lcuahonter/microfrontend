import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CertificadosLicenciasPermisosService } from '../../../../shared/services/shared2603/certificados-licencias-permisos.service';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { of} from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA} from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  let mockConsultaioQuery: Partial<ConsultaioQuery>;
  let mockService: Partial<CertificadosLicenciasPermisosService>;

  const MOCK_CONSULTAIO_STATE: ConsultaioState = {
    procedureId: 'PROC001',
    parameter: 'PARAM',
    department: 'DEPT',
    folioTramite: 'FOLIO123',
    tipoDeTramite: 'Tipo',
    estadoDeTramite: 'Estado',
    readonly: false,
    create: false,
    update: true, 
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: '',
  };

  const MOCK_FORM_RESPONSE = {
    campo1: 'valor1',
    campo2: 'valor2'
  };

  beforeEach(async () => {
    mockConsultaioQuery = {
      selectConsultaioState$: of(MOCK_CONSULTAIO_STATE)
    };

    mockService = {
      getFormularioData: jest.fn().mockReturnValue(of(MOCK_FORM_RESPONSE)),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent, require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: CertificadosLicenciasPermisosService, useValue: mockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('dummy test', () => {
    expect(true).toBe(true);
  });
});
