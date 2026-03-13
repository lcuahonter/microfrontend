import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { Solicitud32610Store } from '../../estados/solicitud32610.store';
import { Solicitud32610Query } from '../../estados/solicitud32610.query';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;

  const mockStore = {
    actualizarEstado: jest.fn(),
  };

  const mockQuery = {
    selectSolicitud$: of({
      representanteRfc: '',
      representanteNombre: '',
      representanteApellidoPaterno: '',
      representanteApellidoMaterno: '',
      representanteTelefono: '',
      representanteCorreo: '',
    }),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({
      readonly: false,
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
    ReactiveFormsModule,
    NotificacionesComponent,
    RepresentanteLegalComponent, 
  ],
  providers: [
    FormBuilder,
    { provide: Solicitud32610Store, useValue: mockStore },
    { provide: Solicitud32610Query, useValue: mockQuery },
    { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
  ],
}).compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario correctamente', () => {
    expect(component.representante).toBeDefined();
    expect(component.representante.controls['representanteRegistro']).toBeDefined();
  });

  it('debe deshabilitar el formulario si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.representante.disabled).toBe(true);
  });

  it('debe llamar a actualizarEstado al cambiar un campo', () => {
    const form = component.representante;
    form.get('representanteCorreo')?.setValue('correo@prueba.com');
    component.setValoresStore(form, 'representanteCorreo');
    expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
      representanteCorreo: 'correo@prueba.com',
    });
  });

  it('debe completar la suscripción y limpiar recursos en ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
