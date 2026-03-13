import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { OperacionService } from '../../services/operacion.service';

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = of({ update: false });
}

@Injectable()
class MockOperacionService {
  getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(of({}));
  actualizarEstadoFormulario = jest.fn();
}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        PasoUnoComponent // Since it's standalone
      ],
      providers: [
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
        { provide: OperacionService, useClass: MockOperacionService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('should have correct sections configuration', () => {
    expect(component.seccionesDeLaSolicitud).toHaveLength(2);
    expect(component.seccionesDeLaSolicitud[0].title).toBe('Solicitante');
    expect(component.seccionesDeLaSolicitud[1].title).toBe('Operaciones de Comercio Exterior');
  });

  it('should change tab index when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });
});