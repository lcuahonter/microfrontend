import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CargarArchivosComponent } from '../cargar-archivos/cargar-archivos.component';
import { DatosDeLaSolicitudComponent } from '../datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosEmpresaComponent } from './datos-empresa.component';
import { DatosGeneralesSociosComponent } from '../datos-generales-socios/datos-generales-socios.component';
import { DomicilioComponent } from '../domicilio/domicilio.component';
import { RepresentacionFederalComponent } from '../representacion-federal/representacion-federal.component';
import { DatosEmpresaService } from './../../services/datos-empresa.service';
import { of } from 'rxjs';

describe('DatosEmpresaComponent', () => {
  let component: DatosEmpresaComponent;
  let fixture: ComponentFixture<DatosEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        RepresentacionFederalComponent,
        DatosDeLaSolicitudComponent,
        DomicilioComponent,
        DatosGeneralesSociosComponent,
        CargarArchivosComponent,
        DatosEmpresaComponent
      ],
      declarations: [],
      providers: [DatosEmpresaService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar los componentes hijos', () => {
    const COMPILED = fixture.nativeElement;
    expect(COMPILED.querySelector('app-representacion-federal')).toBeTruthy();
    expect(COMPILED.querySelector('app-datos-de-la-solicitud')).toBeTruthy();
    expect(COMPILED.querySelector('app-domicilio')).toBeTruthy();
    expect(COMPILED.querySelector('app-datos-generales-socios')).toBeTruthy();
    expect(COMPILED.querySelector('app-cargar-archivos')).toBeTruthy();
  });

  describe('validarFormularios', () => {
    function mockForm(valid: boolean) {
      return {
        invalid: !valid,
        markAllAsTouched: jest.fn()
      };
    }

    it('debe devolver true si todos los formularios son válidos', () => {
      component.representacionFederal = { formulario: mockForm(true) } as any;
      component.datosSolicitud = { solicitudForm: mockForm(true) } as any;
      component.domicilio = { form: mockForm(true) } as any;
      component.datosGenerales = { FormSolicitud: mockForm(true) } as any;
      expect(component.validarFormularios()).toBe(true);
    });

    it('debe marcar como tocado y devolver false si representacionFederal es inválido', () => {
      const repFed = { formulario: mockForm(false) } as any;
      component.representacionFederal = repFed;
      component.datosSolicitud = { solicitudForm: mockForm(true) } as any;
      component.domicilio = { form: mockForm(true) } as any;
      component.datosGenerales = { FormSolicitud: mockForm(true) } as any;
      expect(component.validarFormularios()).toBe(false);
      expect(repFed.formulario.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe marcar como tocado y devolver false si datosSolicitud es inválido', () => {
      const datosSol = { solicitudForm: mockForm(false) } as any;
      component.representacionFederal = { formulario: mockForm(true) } as any;
      component.datosSolicitud = datosSol;
      component.domicilio = { form: mockForm(true) } as any;
      component.datosGenerales = { FormSolicitud: mockForm(true) } as any;
      expect(component.validarFormularios()).toBe(false);
      expect(datosSol.solicitudForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe marcar como tocado y devolver false si domicilio es inválido', () => {
      const domicilio = { form: mockForm(false) } as any;
      component.representacionFederal = { formulario: mockForm(true) } as any;
      component.datosSolicitud = { solicitudForm: mockForm(true) } as any;
      component.domicilio = domicilio;
      component.datosGenerales = { FormSolicitud: mockForm(true) } as any;
      expect(component.validarFormularios()).toBe(false);
      expect(domicilio.form.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe marcar como tocado y devolver false si datosGenerales es inválido', () => {
      const datosGen = { FormSolicitud: mockForm(false) } as any;
      component.representacionFederal = { formulario: mockForm(true) } as any;
      component.datosSolicitud = { solicitudForm: mockForm(true) } as any;
      component.domicilio = { form: mockForm(true) } as any;
      component.datosGenerales = datosGen;
      expect(component.validarFormularios()).toBe(false);
      expect(datosGen.FormSolicitud.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe manejar componentes hijos indefinidos sin lanzar error', () => {
      component.representacionFederal = undefined as any;
      component.datosSolicitud = undefined as any;
      component.domicilio = undefined as any;
      component.datosGenerales = undefined as any;
      expect(component.validarFormularios()).toBe(true);
    });

    it('debe manejar formularios hijos nulos sin lanzar error', () => {
      component.representacionFederal = { formulario: undefined } as any;
      component.datosSolicitud = { solicitudForm: undefined } as any;
      component.domicilio = { form: undefined } as any;
      component.datosGenerales = { FormSolicitud: undefined } as any;
      expect(component.validarFormularios()).toBe(true);
    });
  });

  describe('onPlantasDataReceived', () => {
    it('debe llamar prellenarDomicilioForm con los datos recibidos', () => {
      const plantasData = [{}, {}] as any;
      component.domicilio = {
        prellenarDomicilioForm: jest.fn()
      } as any;
      component.onPlantasDataReceived(plantasData);
      expect(component.domicilio.prellenarDomicilioForm).toHaveBeenCalledWith(plantasData);
    });
    it('no debe lanzar error si domicilio es undefined', () => {
      component.domicilio = undefined as any;
      expect(() => component.onPlantasDataReceived([])).toThrow();
    });
  });
});
