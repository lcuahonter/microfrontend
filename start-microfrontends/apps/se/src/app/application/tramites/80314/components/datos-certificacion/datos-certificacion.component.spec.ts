import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatosCertificacionComponent } from './datos-certificacion.component';
import { FormBuilder } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

describe('DatosCertificacionComponent', () => {
  let fixture;
  let component !: DatosCertificacionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder, provideHttpClient()
      ]
    }).overrideComponent(DatosCertificacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosCertificacionComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('debería ejecutar #constructor()', () => {
    expect(component).toBeTruthy();
  });

});