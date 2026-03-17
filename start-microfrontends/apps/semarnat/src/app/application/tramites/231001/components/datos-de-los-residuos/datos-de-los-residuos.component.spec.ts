import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLosResiduosComponent } from './datos-de-los-residuos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { MateriaprimaformserviceService } from '../../services/materia-prima-formservice.service';
import { Tramite231001Query } from '../../../../tramites/231001/estados/queries/tramite231001.query';
import { Tramite231001Store } from '../../../../tramites/231001/estados/tramites/tramite231001.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosDeLosResiduosComponent', () => {
  let component: DatosDeLosResiduosComponent;
  let fixture: ComponentFixture<DatosDeLosResiduosComponent>;
  let mockService: any;
  let mockTramiteQuery: any;
  let mockTramiteStore: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockService = {
      getUnidadMedida: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Unidad' }])),
      getCapituloFraccion: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Capítulo' }])),
      getPartidaFraccion: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Partida' }])),
      getSubPartidaFraccion: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'SubPartida' }])),
      getFraccionArancelariaParametros: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Fracción' }])),
    };
    mockTramiteQuery = {
      selectSolicitud$: of({
        nombreDeLaMateriaPrima: 'Test',
        cantidad: 10,
        cantidadEnLetra: 'DIEZ',
        unidadMedidaComercial: 1,
        capituloFraccion: 1,
        partidaFraccion: 1,
        subPartidaFraccion: 1,
        fraccion: 1,
      }),
    };
    mockTramiteStore = {
      actualizarEstado: jest.fn(),
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDeLosResiduosComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: MateriaprimaformserviceService, useValue: mockService },
        { provide: Tramite231001Query, useValue: mockTramiteQuery },
        { provide: Tramite231001Store, useValue: mockTramiteStore },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLosResiduosComponent);
    component = fixture.componentInstance;
    component.ngOnInit(); // Ensure ngOnInit is called to initialize combos
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load combos on ngOnInit', () => {
    component.ngOnInit();
    expect(component.comboUnidadMedida).toEqual([{ id: 1, descripcion: 'Unidad' }]);
    expect(component.comboCapituloFraccion).toEqual([{ id: 1, descripcion: 'Capítulo' }]);
    expect(component.comboPartidaFraccion).toEqual([{ id: 1, descripcion: 'Partida' }]);
    expect(component.comboSubPartidaFraccion).toEqual([{ id: 1, descripcion: 'SubPartida' }]);
    expect(component.comboFraccionArancelariaParametros).toEqual([{ id: 1, descripcion: 'Fracción' }]);

  });

});