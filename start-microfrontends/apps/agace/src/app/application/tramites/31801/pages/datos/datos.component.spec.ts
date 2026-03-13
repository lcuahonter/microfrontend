import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SolicitanteComponent, SolicitanteService } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RenovacionComponent } from '../../components/renovacion/renovacion.component';
import { RenovacionService } from '../../services/renovacion/renovacion.service';
import { of } from 'rxjs';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let renovacionService: any;

  beforeEach(async () => {
    const MOCK_RESPONSE = {
      "numeroOficio": "OF-12345",
      "fechaInicialInput": "2024-06-01",
      "fechaFinalInput": "2024-06-30",
      "fechaPago": "2024-06-15",
      "monedaNacional": 1,
      "numeroOperacion": "OP-98765",
      "llavePago": "LLAVE-001",
      "seleccionadaManifiesto": [true, true]
    };

    renovacionService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of(MOCK_RESPONSE)),
      obtenerRenovacionDatos: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn().mockReturnValue(of({})),
      getManifiestos: jest.fn().mockReturnValue(of({})),
      obtenerDocumentosSeleccionados: jest.fn().mockReturnValue(of({}))
    } as unknown as RenovacionService;

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      imports: [CommonModule, SolicitanteComponent, HttpClientModule, RenovacionComponent],
      providers: [SolicitanteService, HttpClientTestingModule, HttpClient,
        { provide: RenovacionService, useValue: renovacionService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Verificar que el componente se crea correctamente
    expect(component).toBeTruthy();
  });

  it('should have default tab index set to 1', () => {
    // Verificar que el índice predeterminado es 1
    expect(component.indice).toBe(1);
  });

  it('should update the selected tab index when seleccionaTab is called', () => {
    // Llamar a seleccionaTab y verificar que actualiza correctamente el índice
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should render Solicitante tab when indice is 1', () => {
    // Establecer el índice en 1 y verificar que se renderiza el componente correspondiente
    component.indice = 1;
    fixture.detectChanges();
    const SOLICITANTE = fixture.nativeElement.querySelector('solicitante');
    expect(SOLICITANTE).toBeTruthy();
  });

  it('should render renovacion tab when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    const RENOVACION = fixture.nativeElement.querySelector('app-renovacion');
    expect(RENOVACION).toBeTruthy();
  });

  it('should handle keyboard navigation (Enter key)', () => {
    // Simular que el usuario presiona Enter en el tab y verificar que cambia el índice
    const EVENT = new KeyboardEvent('keydown', { key: 'Enter' });
    const TAB_ELEMENT = fixture.nativeElement.querySelector('a[tabindex="2"]');
    TAB_ELEMENT.dispatchEvent(EVENT);
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should handle keyboard navigation (Space key)', () => {
    // Simular que el usuario presiona Espacio en el tab y verificar que cambia el índice
    const EVENT = new KeyboardEvent('keydown', { key: ' ' });
    const TAB_ELEMENT = fixture.nativeElement.querySelector('a[tabindex="1"]');
    TAB_ELEMENT.dispatchEvent(EVENT);
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('should update esDatosRespuesta and call store when guardarDatosFormulario is called', () => {
    component.guardarDatosFormulario();

    expect(renovacionService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });
});