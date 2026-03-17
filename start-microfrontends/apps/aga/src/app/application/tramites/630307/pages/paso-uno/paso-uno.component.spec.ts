import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

class MockRetornoImportacionTemporalService {
  getDatosDeLaSolicitud = jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) });
  actualizarEstadoFormulario = jest.fn();
}

import { of } from 'rxjs';
class MockConsultaioQuery {
  selectConsultaioState$ = of({ update: false });
}

/**
 * Mock component for 'solicitante' to avoid dependency errors
 */
@Component({
  selector: 'solicitante',
  template: '<div></div>',
})
class MockSolicitanteComponent {}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, MockSolicitanteComponent],
      providers: [
        { provide: RetornoImportacionTemporalService, useClass: MockRetornoImportacionTemporalService },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
