import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicilioDelDestinatarioComponent } from './domicilio-del-destinatario.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

const CALLE = 'calle';
const NUMERO_LETRA = 'numeroLetra';
const CIUDAD = 'ciudad';
const CORREO_ELECTRONICO = 'correoElectronico';
const FAX = 'fax';
const TELEFONO = 'telefono';

describe('DomicilioDelDestinatarioComponent', () => {
  let component: DomicilioDelDestinatarioComponent;
  let fixture: ComponentFixture<DomicilioDelDestinatarioComponent>;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    storeMock = {
      setTramite110209: jest.fn()
    };

    queryMock = {
      selectTramite110209$: of({
        [CALLE]: 'Calle 1',
        [NUMERO_LETRA]: '123A',
        [CIUDAD]: 'Ciudad X',
        [CORREO_ELECTRONICO]: 'correo@dominio.com',
        [FAX]: '5551234',
        [TELEFONO]: '5556789'
      })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DomicilioDelDestinatarioComponent,HttpClientModule],
      providers: [
        FormBuilder,
        { provide: Tramite110209Store, useValue: storeMock },
        { provide: Tramite110209Query, useValue: queryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioDelDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe crear el formulario correctamente', () => {
    component.crearFormulario();
    expect(component.domicilioDelDestinatarioForm).toBeDefined();
    expect(component.domicilioDelDestinatarioForm.get(CALLE)).toBeDefined();
    expect(component.domicilioDelDestinatarioForm.get(CORREO_ELECTRONICO)).toBeDefined();
  });

  it('debe inicializar el formulario con valores del store en ngOnInit', () => {
    component.ngOnInit();
    expect(component.domicilioDelDestinatarioForm.get(CALLE)?.value).toBe('Calle 1');
    expect(component.domicilioDelDestinatarioForm.get(NUMERO_LETRA)?.value).toBe('123A');
    expect(component.domicilioDelDestinatarioForm.get(CIUDAD)?.value).toBe('Ciudad X');
    expect(component.domicilioDelDestinatarioForm.get(CORREO_ELECTRONICO)?.value).toBe('correo@dominio.com');
    expect(component.domicilioDelDestinatarioForm.get(FAX)?.value).toBe('5551234');
    expect(component.domicilioDelDestinatarioForm.get(TELEFONO)?.value).toBe('5556789');
  });

  it('debe actualizar el store al llamar setValoresStore', () => {
    component.crearFormulario();
    component.domicilioDelDestinatarioForm.get(CALLE)?.setValue('Nueva Calle');
    component.setValoresStore(component.domicilioDelDestinatarioForm, CALLE);
    expect(storeMock.setTramite110209).toHaveBeenCalledWith({ [CALLE]: 'Nueva Calle' });
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const NEXT_SPY = jest.spyOn(component['destroyed$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});