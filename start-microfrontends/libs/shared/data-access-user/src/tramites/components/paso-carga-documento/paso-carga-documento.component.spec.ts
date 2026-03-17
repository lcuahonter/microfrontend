import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasoCargaDocumentoComponent } from './paso-carga-documento.component';
import { TestBed } from '@angular/core/testing';
import { provideToastr } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

describe('PasoCargaDocumentoComponent', () => {
  let fixture;
  let component!: PasoCargaDocumentoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [ provideToastr({
        positionClass: 'toast-top-right',
      }),

      ]
    }).overrideComponent(PasoCargaDocumentoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoCargaDocumentoComponent);
    component = fixture.debugElement.componentInstance;
  });
  it('debería ejecutar #constructor()', () => {
    expect(component).toBeTruthy();
  });

});