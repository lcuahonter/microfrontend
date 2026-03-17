import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ConcluirRelacionComponent } from './concluir-relacion.component';
import { ConcluirRelacionService } from '../../services/concluir-relacion.service';
import { Tramite420103Query } from '../../estados/tramite420103.query';
import { Tramite420103Store } from '../../estados/tramite420103.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConcluirRelacionComponent (Jest)', () => {
  let component: ConcluirRelacionComponent;
  let fixture: ComponentFixture<ConcluirRelacionComponent>;

  let mockConcluirRelacionService: any;
  let mockTramiteQuery: any;
  let mockTramiteStore: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockConcluirRelacionService = {
      getDetallesDelMercanciaDatos: jest.fn().mockReturnValue(of({
        descripcion: 'Producto de prueba',
        cantidad: 100,
      })),
    };

    mockTramiteQuery = {
      selectSeccionState$: of({ rfc: 'XAXX010101000' }),
    };

    mockTramiteStore = {
      setRFC: jest.fn(),
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      declarations: [ConcluirRelacionComponent],
      providers: [
        FormBuilder,
        { provide: ConcluirRelacionService, useValue: mockConcluirRelacionService },
        { provide: Tramite420103Query, useValue: mockTramiteQuery },
        { provide: Tramite420103Store, useValue: mockTramiteStore },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConcluirRelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should disable the form when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.formularioConcluirRelacion.disabled).toBeTruthy();
  });

  it('should enable the form when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.formularioConcluirRelacion.enabled).toBeTruthy();
  });
});