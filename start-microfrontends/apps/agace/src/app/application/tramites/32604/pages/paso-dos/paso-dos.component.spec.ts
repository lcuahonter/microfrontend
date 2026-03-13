import { NO_ERRORS_SCHEMA, Component } from '@angular/core';

@Component({selector: 'ng-titulo', template: ''})
class MockNgTitulo {}
@Component({selector: 'ng-alert', template: ''})
class MockNgAlert {}
@Component({selector: 'anexar-documentos', template: ''})
class MockAnexarDocumentos {}
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoDosComponent } from './paso-dos.component';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent, MockNgTitulo, MockNgAlert, MockAnexarDocumentos],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
