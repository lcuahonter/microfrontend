import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelacionDeCertificateComponent } from './cancelacion-de-certificado.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Tramite140103Store } from '../../../../estados/tramites/tramite140103.store';
import { Tramite140103Query } from '../../../../estados/queries/tramite140103.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('CancelacionDeCertificateComponent', () => {
  let component: CancelacionDeCertificateComponent;
  let fixture: ComponentFixture<CancelacionDeCertificateComponent>;
  let tramite140103StoreMock: any;
  let tramite140103QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramite140103StoreMock = {
      setRegimen: jest.fn(),
      setMecanismo: jest.fn(),
      setTratado: jest.fn(),
      setProducto: jest.fn(),
      setSubproducto: jest.fn(),
      setRepresentacion: jest.fn(),
    };
    tramite140103QueryMock = {
      selectSolicitud$: of({
        regimen: 'regimen1',
        mecanismo: 'mecanismo1',
        tratado: 'tratado1',
        producto: 'producto1',
        subproducto: 'subproducto1',
        representacion: 'representacion1',
      }),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [CancelacionDeCertificateComponent, ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite140103Store, useValue: tramite140103StoreMock },
        { provide: Tramite140103Query, useValue: tramite140103QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelacionDeCertificateComponent);
    component = fixture.componentInstance;
    component.Cancelacion = [];
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los controles correctos', () => {
    expect(component.cancelacionForm.contains('regimen')).toBeTruthy();
    expect(component.cancelacionForm.contains('mecanismo')).toBeTruthy();
    expect(component.cancelacionForm.contains('tratado')).toBeTruthy();
    expect(component.cancelacionForm.contains('producto')).toBeTruthy();
    expect(component.cancelacionForm.contains('subproducto')).toBeTruthy();
    expect(component.cancelacionForm.contains('representacion')).toBeTruthy();
  });

  it('debe asignar valores al formulario desde solicitudState', () => {
    expect(component.cancelacionForm.value).toEqual({
      regimen: 'regimen1',
      mecanismo: 'mecanismo1',
      tratado: 'tratado1',
      producto: 'producto1',
      subproducto: 'subproducto1',
      representacion: 'representacion1',
    });
  });

  it('debe deshabilitar el formulario si esFormularioSoloLectura es true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.cancelacionForm.disabled).toBe(true);
  });

  it('debe habilitar el formulario si esFormularioSoloLectura es false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.cancelacionForm.enabled).toBe(true);
  });

  it('debe llamar el método correcto del store en setValoresStore', () => {
    const form = component.cancelacionForm;
    form.get('regimen')?.setValue('regimenTest');
    component.setValoresStore(form, 'regimen', 'setRegimen');
    expect(tramite140103StoreMock.setRegimen).toHaveBeenCalledWith('regimenTest');
  });

  it('debe limpiar las suscripciones en ngOnDestroy', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});