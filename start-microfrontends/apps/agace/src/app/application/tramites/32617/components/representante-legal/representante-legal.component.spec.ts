import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite32617Store } from '../../estados/tramites32617.store';
import { Tramite32617Query } from '../../estados/tramites32617.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;

  const mockStore = {
    actualizarEstadoFormulario: jest.fn(),
    establecerDatos: jest.fn()
  };

  const mockQuery = {
    selectTramite32617$: of({
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
    { provide: Tramite32617Store, useValue: mockStore },
    { provide: Tramite32617Query, useValue: mockQuery },
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

  it('debe mostrar notificación si el RFC es inválido al buscar', () => {
    component.representante.controls['representanteRegistro'].setValue('');
    component.botonBuscar();
    expect(component.nuevaNotificacion.mensaje).toBe(
      'No se ha proporcionado información que es requerida'
    );
  });

  it('debe llamar a establecerDatos al cambiar un campo', () => {
    const form = component.representante;
    form.get('representanteCorreo')?.setValue('correo@prueba.com');
    component.setValoresStore(form, 'representanteCorreo');
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
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

  it('debe cargar datos mock y actualizar el store cuando el RFC es válido', () => {
    const validRFC = 'XAXX010101000';
    const mockData = {
      representanteRfc: validRFC,
      representanteNombre: 'EUROFOODS DE MEXICO',
      representanteApellidoPaterno: 'GONZALEZ',
      representanteApellidoMaterno: 'PINAL',
      representanteTelefono: '618-256-2532',
      representanteCorreo: 'vucem2.5@hotmail.com',
    };

    // Spy on methods
    const spyMostrarNotificacion = jest.spyOn(component, 'mostrarNotificacionDeBusqueda');
    const spySetValoresStore = jest.spyOn(component, 'setValoresStore');
    
    // Set valid RFC value
    component.representante.controls['representanteRegistro'].setValue(validRFC);
    
    // Call the search method (assuming it's botonBuscar or similar)
    component.botonBuscar();

    // Verify tieneValorRfc is set to true
    expect(component.tieneValorRfc).toBe(true);
    
    // Verify notification is shown
    expect(spyMostrarNotificacion).toHaveBeenCalled();
    
    // Verify form is patched with mock data
    expect(component.representante.get('representanteRfc')?.value).toBe(mockData.representanteRfc);
    expect(component.representante.get('representanteNombre')?.value).toBe(mockData.representanteNombre);
    expect(component.representante.get('representanteApellidoPaterno')?.value).toBe(mockData.representanteApellidoPaterno);
    expect(component.representante.get('representanteApellidoMaterno')?.value).toBe(mockData.representanteApellidoMaterno);
    expect(component.representante.get('representanteTelefono')?.value).toBe(mockData.representanteTelefono);
    expect(component.representante.get('representanteCorreo')?.value).toBe(mockData.representanteCorreo);
    
    // Verify setValoresStore is called for each field
    expect(spySetValoresStore).toHaveBeenCalledTimes(7);
    expect(spySetValoresStore).toHaveBeenCalledWith(component.representante, 'representanteRegistro');
    expect(spySetValoresStore).toHaveBeenCalledWith(component.representante, 'representanteRfc');
    expect(spySetValoresStore).toHaveBeenCalledWith(component.representante, 'representanteNombre');
    expect(spySetValoresStore).toHaveBeenCalledWith(component.representante, 'representanteApellidoPaterno');
    expect(spySetValoresStore).toHaveBeenCalledWith(component.representante, 'representanteApellidoMaterno');
    expect(spySetValoresStore).toHaveBeenCalledWith(component.representante, 'representanteTelefono');
    expect(spySetValoresStore).toHaveBeenCalledWith(component.representante, 'representanteCorreo');
  });

  it('debe actualizar el store con todos los valores después del patch', () => {
    const validRFC = 'XAXX010101000';
    component.representante.controls['representanteRegistro'].setValue(validRFC);
    
    // Clear previous calls
    jest.clearAllMocks();
    
    component.botonBuscar();
    
    // Verify establecerDatos is called for each field with the correct values
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
      representanteRfc: validRFC
    });
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
      representanteNombre: 'EUROFOODS DE MEXICO'
    });
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
      representanteApellidoPaterno: 'GONZALEZ'
    });
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
      representanteApellidoMaterno: 'PINAL'
    });
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
      representanteTelefono: '618-256-2532'
    });
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
      representanteCorreo: 'vucem2.5@hotmail.com'
    });
  });

  it('debe manejar campos deshabilitados al obtener valores con getRawValue', () => {
    const validRFC = 'XAXX010101000';
    
    // Disable some controls to test getRawValue functionality
    component.representante.get('representanteNombre')?.disable();
    component.representante.get('representanteApellidoPaterno')?.disable();
    
    component.representante.controls['representanteRegistro'].setValue(validRFC);
    
    const spyGetRawValue = jest.spyOn(component.representante, 'getRawValue');
    
    component.botonBuscar();
    
    // Verify getRawValue is called (which includes disabled controls)
    expect(spyGetRawValue).toHaveBeenCalled();
    
    // Verify disabled fields are still updated in the store
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
      representanteNombre: 'EUROFOODS DE MEXICO'
    });
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({
      representanteApellidoPaterno: 'GONZALEZ'
    });
  });
});
