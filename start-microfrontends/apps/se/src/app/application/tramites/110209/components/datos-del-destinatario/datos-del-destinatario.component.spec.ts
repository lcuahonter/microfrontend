import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelDestinatarioComponent } from './datos-del-destinatario.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

const NOMBRE = 'nombre';
const PRIMER_APELLIDO = 'primerApellido';
const SEGUNDO_APELLIDO = 'segundoApellido';
const NUMERO_DE_REGISTRO_FISCAL = 'numeroDeRegistroFiscal';
const RAZON_SOCIAL = 'razonSocial';

describe('DatosDelDestinatarioComponent', () => {
  let component: DatosDelDestinatarioComponent;
  let fixture: ComponentFixture<DatosDelDestinatarioComponent>;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    storeMock = {
      setTramite110209: jest.fn()
    };

    queryMock = {
      selectTramite110209$: of({
        [NOMBRE]: 'Juan',
        [PRIMER_APELLIDO]: 'Pérez',
        [SEGUNDO_APELLIDO]: 'García',
        [NUMERO_DE_REGISTRO_FISCAL]: '123456',
        [RAZON_SOCIAL]: 'Empresa S.A.'
      })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDelDestinatarioComponent,HttpClientModule],
      providers: [
        FormBuilder,
        { provide: Tramite110209Store, useValue: storeMock },
        { provide: Tramite110209Query, useValue: queryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe crear el formulario correctamente', () => {
    component.crearFormulario();
    expect(component.datosDelDestinatarioForm).toBeDefined();
    expect(component.datosDelDestinatarioForm.get(NOMBRE)).toBeDefined();
    expect(component.datosDelDestinatarioForm.get(RAZON_SOCIAL)).toBeDefined();
  });

  it('debe inicializar el formulario con valores del store en ngOnInit', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.datosDelDestinatarioForm.get(NOMBRE)?.value).toBe('');
    expect(component.datosDelDestinatarioForm.get(PRIMER_APELLIDO)?.value).toBe('');
    expect(component.datosDelDestinatarioForm.get(SEGUNDO_APELLIDO)?.value).toBe('');
    expect(component.datosDelDestinatarioForm.get(NUMERO_DE_REGISTRO_FISCAL)?.value).toBe('123456');
    expect(component.datosDelDestinatarioForm.get(RAZON_SOCIAL)?.value).toBe('Empresa S.A.');
  });

  it('debe actualizar el store al llamar setValoresStore', () => {
    component.crearFormulario();
    component.datosDelDestinatarioForm.get(NOMBRE)?.setValue('Pedro');
    component.setValoresStore(component.datosDelDestinatarioForm, NOMBRE);
    expect(storeMock.setTramite110209).toHaveBeenCalledWith({ [NOMBRE]: 'Pedro' });
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const NEXT_SPY = jest.spyOn(component['destroyed$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});