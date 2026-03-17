import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { DatosDeLaMercanciaComponent } from '../../components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../components/datos-del-tramite/datos-del-tramite.component';
import { RepresentacionFederalComponent } from '../../components/representacion-federal/representacion-federal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  selector: 'app-datos-del-tramite',
  template: '<div></div>'
})
class MockDatosDelTramiteComponent {
  datosDelTramiteForm = new FormGroup({
    test: new FormControl('')
  });
}

@Component({
  selector: 'app-datos-de-la-mercancia',
  template: '<div></div>'
})
class MockDatosDeLaMercanciaComponent {
  datosDeLaMercanciaForm = new FormGroup({
    test: new FormControl('')
  });
}

@Component({
  selector: 'app-representacion-federal',
  template: '<div></div>'
})
class MockRepresentacionFederalComponent {
  formularioRepresentacionFederalForm = new FormGroup({
    test: new FormControl('')
  });
}

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DatosDeLaSolicitudComponent,
        MockDatosDelTramiteComponent,
        MockDatosDeLaMercanciaComponent,
        MockRepresentacionFederalComponent
      ],
      imports: [ReactiveFormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when all forms are valid', () => {
    const result = component.validarFormulario();
    expect(result).toBe(true);
  });

  it('should return false and mark as touched when datosDelTramiteForm is invalid', () => {
    const mockComponent = fixture.debugElement.query(
      comp => comp.componentInstance instanceof MockDatosDelTramiteComponent
    );
    component.datosDelTramiteComponent = mockComponent.componentInstance;
    component.datosDelTramiteComponent.datosDelTramiteForm.setErrors({ invalid: true });

    const markAllAsTouchedSpy = jest.spyOn(component.datosDelTramiteComponent.datosDelTramiteForm, 'markAllAsTouched');

    const result = component.validarFormulario();

    expect(result).toBe(false);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should return false and mark as touched when datosDeLaMercanciaForm is invalid', () => {
    const mockComponent = fixture.debugElement.query(
      comp => comp.componentInstance instanceof MockDatosDeLaMercanciaComponent
    );
    component.datosDeLaMercanciaComponent = mockComponent.componentInstance;
    component.datosDeLaMercanciaComponent.datosDeLaMercanciaForm.setErrors({ invalid: true });

    const markAllAsTouchedSpy = jest.spyOn(component.datosDeLaMercanciaComponent.datosDeLaMercanciaForm, 'markAllAsTouched');

    const result = component.validarFormulario();

    expect(result).toBe(false);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should return false and mark as touched when formularioRepresentacionFederalForm is invalid', () => {
    const mockComponent = fixture.debugElement.query(
      comp => comp.componentInstance instanceof MockRepresentacionFederalComponent
    );
    component.representacionFederalComponent = mockComponent.componentInstance;
    component.representacionFederalComponent.formularioRepresentacionFederalForm.setErrors({ invalid: true });

    const markAllAsTouchedSpy = jest.spyOn(component.representacionFederalComponent.formularioRepresentacionFederalForm, 'markAllAsTouched');

    const result = component.validarFormulario();

    expect(result).toBe(false);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should return false when multiple forms are invalid', () => {
    const tramiteComponent = fixture.debugElement.query(
      comp => comp.componentInstance instanceof MockDatosDelTramiteComponent
    );
    const mercanciaComponent = fixture.debugElement.query(
      comp => comp.componentInstance instanceof MockDatosDeLaMercanciaComponent
    );

    component.datosDelTramiteComponent = tramiteComponent.componentInstance;
    component.datosDeLaMercanciaComponent = mercanciaComponent.componentInstance;

    component.datosDelTramiteComponent.datosDelTramiteForm.setErrors({ invalid: true });
    component.datosDeLaMercanciaComponent.datosDeLaMercanciaForm.setErrors({ invalid: true });

    const result = component.validarFormulario();

    expect(result).toBe(false);
  });

  it('should handle undefined child components gracefully', () => {
    component.datosDelTramiteComponent = undefined as any;
    component.datosDeLaMercanciaComponent = undefined as any;
    component.representacionFederalComponent = undefined as any;

    const result = component.validarFormulario();

    expect(result).toBe(true);
  });
});
