import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { DatosComplimentariaComponent } from './datos-complimentaria.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

describe('DatosComplimentariaComponent', () => {
  let fixture;
  let component!: DatosComplimentariaComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ FormsModule, ReactiveFormsModule, ToastrModule, HttpClientTestingModule ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
          provideToastr({
                          positionClass: 'toast-top-right',
                        }),
      ]
    }).overrideComponent(DatosComplimentariaComponent, {
    }).compileComponents();
    fixture = TestBed.createComponent(DatosComplimentariaComponent);
    component = fixture.debugElement.componentInstance;
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.obtenerComplimentaria = jest.fn().mockReturnValue(observableOf({}));
    component.solicitudService.obtenerFederetarios = jest.fn().mockReturnValue(observableOf({}));
    component.solicitudService.obtenerOperacion = jest.fn().mockReturnValue(observableOf({}));
  });


  it('debería ejecutar #constructor()', () => {
    expect(component).toBeTruthy();
  });
  it('debe ejecutar #obtenerComplimentaria()', () => {
    component.obtenerComplimentaria();
    expect(component.solicitudService.obtenerComplimentaria).toHaveBeenCalled();
  });

  it('debe ejecutar #obtenerFederetarios()', () => {
    component.obtenerFederetarios();
    expect(component.solicitudService.obtenerFederetarios).toHaveBeenCalled();
  });

  it('debería ejecutar #obtenerOperacions()', () => {
    component.obtenerOperacions();
    expect(component.solicitudService.obtenerOperacion).toHaveBeenCalled();
  });

});