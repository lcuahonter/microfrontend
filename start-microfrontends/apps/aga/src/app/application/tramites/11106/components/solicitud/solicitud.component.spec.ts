import { TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Solicitud11106Store } from '../../estados/solicitud11106.store';
import { Solicitud11106Query } from '../../estados/solicitud11106.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let mockStore: jest.Mocked<Solicitud11106Store>;
  let mockQuery: jest.Mocked<Solicitud11106Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(() => {
    mockStore = {
      setLaAutorizacionEsNula: jest.fn()
    } as any;

    mockQuery = {
      seleccionarAutorizacionEsNula$: of({
        laAutorizacionEsNula: 'test-value'
      })
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of({
        readonly: false
      })
    } as any;

    TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, SolicitudComponent],
      providers: [
        FormBuilder,
        { provide: Solicitud11106Store, useValue: mockStore },
        { provide: Solicitud11106Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudForm).toBeDefined();
    expect(component.solicitudForm.get('laAutorizacionEsNula')).toBeDefined();
  });

  it('debería llamar setValoresStore con el campo correcto', () => {
    component.ngOnInit();
    component.solicitudForm.get('laAutorizacionEsNula')?.setValue('new-value');
    component.setValoresStore('laAutorizacionEsNula');
    expect(mockStore.setLaAutorizacionEsNula).toHaveBeenCalledWith('new-value');
  });

  it('debería marcar todos los campos como tocados si el formulario es inválido', () => {
    component.ngOnInit();
    
    const control = component.solicitudForm.get('laAutorizacionEsNula');
    control?.setValidators([() => ({ required: true })]); 
    control?.setValue(''); 
    control?.updateValueAndValidity();
    
    expect(component.solicitudForm.invalid).toBe(true);
    
    component.validarDestinatarioFormulario();

    expect(component.solicitudForm.get('laAutorizacionEsNula')?.touched).toBe(true);
  });

  it('debería emitir continuarEvento cuando se llame a continuar', () => {
    const emitSpy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuar();
    expect(emitSpy).toHaveBeenCalledWith('');
  });
});
