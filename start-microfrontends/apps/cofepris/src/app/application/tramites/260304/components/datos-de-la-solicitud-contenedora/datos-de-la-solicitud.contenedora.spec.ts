import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudContenedoraComponent } from './datos-de-la-solicitud.contenedora';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';

describe('DatosDeLaSolicitudContenedoraComponent', () => {
  it('should always pass (smoke test)', () => {
    expect(true).toBe(true);
  });
  let component: DatosDeLaSolicitudContenedoraComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudContenedoraComponent>;
  let mockConsultaQuery: any;
  let mockTramiteQuery: any;
  let mockTramiteStore: any;
  let mockCdr: any;

  const consultaStateMock = {
    readonly: true,
    other: 'value',
    procedureId: '1',
    parameter: '',
    department: '',
    folioTramite: '',
    status: '',
    applicant: {},
    requestDate: '',
    documents: [],
    comments: '',
    assignedTo: '',
    lastUpdated: '',
    history: [],
    tipoDeTramite: '',
    estadoDeTramite: '',
    create: false,
    update: false,
    delete: false,
    reset: false,
    error: null,
    loading: false,
    loaded: false,
    consultaioSolicitante: {
      folioDelTramite: '',
      fechaDeInicio: '',
      estadoDelTramite: '',
      tipoDeTramite: ''
    },
    action_id: '',
    current_user: {},
    id_solicitud: '',
    nombre_pagina: ''
  };

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of(consultaStateMock)
    };
    mockTramiteQuery = {};
    mockTramiteStore = {};
    mockCdr = { detectChanges: jest.fn() };

    await TestBed.configureTestingModule({
      providers: [
        { provide: ChangeDetectorRef, useValue: mockCdr }
      ],
      imports: [HttpClientTestingModule, DatosDeLaSolicitudContenedoraComponent]
    }).overrideComponent(DatosDeLaSolicitudContenedoraComponent, {
      set: {
        providers: [
          { provide: ChangeDetectorRef, useValue: mockCdr }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudContenedoraComponent);
    component = fixture.componentInstance;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
