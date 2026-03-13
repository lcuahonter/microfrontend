import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

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
      declarations: [PasoUnoComponent, MockSolicitanteComponent], // Declare the mock
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
