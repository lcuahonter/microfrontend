jest.mock('@libs/shared/theme/assets/json/110203/mediocatalogo.json', () => ({
  __esModule: true,
  default: {
    placeholder: {
      nombre: 'Nombre',
      primer: 'Primer apellido',
      segundo: 'Segundo apellido',
      // Add others as needed based on the model
    }
  }
}));


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DESTINATARIO_DATOS } from '../../constant/destinatario.enum';

import { Destinatario110203Component } from './destinatario-110203.component';
import { Tramite110203Store } from '../../../../estados/tramites/tramite110203.store';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
import { Solicitud110203State } from '../../../../estados/tramites/tramite110203.store';

const MOCK_SOLICITUD_STATE: Solicitud110203State = {
  tratado: 'Tratado A',
  bloque: 'Bloque B',
  origen: 'México',
  destino: 'Argentina',
  expedicion: '2024-01-01',
  vencimiento: '2025-01-01',
  nombre: 'Juan',
  primer: 'Perez',
  segundo: 'Gómez',
  fiscal: '123',
  razon: 'Empresa XYZ S.A.',
  calle: 'Calle Falsa 123',
  letra: 'B',
  ciudad: 'Ciudad de México',
  correo: 'juan@example.com',
  fax: '555-1234',
  telefono: '555-6789',
  medio: 'correo',
  observaciones: 'Ninguna',
  precisa: 'Descripción',
  presenta: 'Representante',
  valorSeleccionado: 'valor1',
  numeroDeCertificado: '12345',
  tratadoAcuerdo: 'Acuerdo Z',
  paisBloque: 'Bloque X',
  medida: 'medida1',
  comercializacion: 'comercial1',
  tipo: 'tipo1',
  idSolicitud: null,
  complemento: '',
  marca: '',
  valor: '',
  bruta: '',
  factura: '',
  orden: '',
  arancelaria: '',
  tecnico: '',
  comercial: '',
  ingles: '',
  registro: '',
  cantidad: '',
  fechaFactura: '',
  pasoActivo: 0,
  cvePais: ''
};

describe('Destinatario110203Component', () => {
  let component: Destinatario110203Component;
  let fixture: ComponentFixture<Destinatario110203Component>;
  let mockStore: jest.Mocked<Tramite110203Store>;
  let mockQuery: jest.Mocked<Tramite110203Query>;

  beforeEach(async () => {
    mockStore = {
      actualizarNombre: jest.fn(),
      actualizarPrimer: jest.fn(),
      actualizarSegundo: jest.fn(),
      actualizarFiscal: jest.fn(),
      actualizarRazon: jest.fn(),
      actualizarCalle: jest.fn(),
      actualizarLetra: jest.fn(),
      actualizarCiudad: jest.fn(),
      actualizarCorreo: jest.fn(),
      actualizarFax: jest.fn(),
      actualizarTelefono: jest.fn(),
    } as unknown as jest.Mocked<Tramite110203Store>;

    mockQuery = {
      selectSolicitud$: of(MOCK_SOLICITUD_STATE)
    } as unknown as jest.Mocked<Tramite110203Query>;

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, Destinatario110203Component],
      providers: [
        { provide: Tramite110203Store, useValue: mockStore },
        { provide: Tramite110203Query, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Destinatario110203Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los valores del store', () => {
    const form = component.destinatarioForm;
    expect(form).toBeDefined();
    expect(form.get('nombre')?.value).toBe('Juan');
    expect(form.get('primer')?.value).toBe('Perez');
    expect(form.get('fiscal')?.value).toBe('123');
   
  });

  it('debe marcar campos requeridos como inválidos si están vacíos', () => {
    component.destinatarioForm.get('fiscal')?.setValue('');
    component.destinatarioForm.get('razon')?.setValue('');
    component.destinatarioForm.get('calle')?.setValue('');
    component.destinatarioForm.get('letra')?.setValue('');
    component.destinatarioForm.get('ciudad')?.setValue('');
    component.destinatarioForm.get('correo')?.setValue('');

    expect(component.destinatarioForm.get('fiscal')?.valid).toBeFalsy();  
    expect(component.destinatarioForm.get('calle')?.valid).toBeFalsy();
    expect(component.destinatarioForm.get('letra')?.valid).toBeFalsy();
    expect(component.destinatarioForm.get('ciudad')?.valid).toBeFalsy();
    expect(component.destinatarioForm.get('correo')?.valid).toBeFalsy();
  });

  it('debe completar destroyNotifier$ al destruir el componente', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

    it('debe limpiar nombre, primer y segundo y activar solo lectura si razon tiene valor', () => {
    component.destinatarioForm.patchValue(DESTINATARIO_DATOS);
    
    component.destinatarioForm.get('razon')?.setValue('Nueva Empresa');
    
    expect(component.destinatarioForm.get('nombre')?.value).toBe('');
    expect(component.destinatarioForm.get('primer')?.value).toBe('');
    expect(component.destinatarioForm.get('segundo')?.value).toBe('');
    expect(component.camposNombreSoloLectura).toBe(true);
  });

  it('debe desactivar solo lectura si razon está vacía', () => {
    component.destinatarioForm.patchValue(DESTINATARIO_DATOS);

    // Simula un valor y luego lo limpia
    component.destinatarioForm.get('razon')?.setValue('Empresa Test');
    component.destinatarioForm.get('razon')?.setValue('');
    
  expect(component.camposNombreSoloLectura).toBe(false);

  });

});
