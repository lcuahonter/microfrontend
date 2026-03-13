import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SolicitanteComponent, SolicitanteService, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TipoDeAvisoComponent } from '../../components/tipo-de-aviso/tipo-de-aviso.component';
import { of } from 'rxjs';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;

  beforeEach(async () => {
    const mockSolicitante = {
      obtenerTipoPersona: jest.fn(),
      getDatosGenerales: jest.fn().mockReturnValue(of({ data: JSON.stringify({ datosGenerales: {}, domicilioFiscal: {} }) }))
    } as unknown as SolicitanteComponent;

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      imports: [CommonModule, SolicitanteComponent, HttpClientModule, TipoDeAvisoComponent],
      providers: [
        HttpClientTestingModule,
        HttpClient,
        { provide: SolicitanteService, useValue: mockSolicitante }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    jest.useFakeTimers();
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    component['solicitante'] = mockSolicitante;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
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

  it('should render tipo de aviso tab when indice is 2', () => {
    component.indice = 2;
    fixture.detectChanges();
    const TIPO_DE_AVISO = fixture.nativeElement.querySelector('app-tipo-de-aviso');
    expect(TIPO_DE_AVISO).toBeTruthy();
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

  it('should call obtenerTipoPersona with MORAL_NACIONAL in ngAfterViewInit', () => {
    const mockObtenerTipoPersona = jest.fn();
    component.solicitante = { obtenerTipoPersona: mockObtenerTipoPersona } as any;

    component.ngAfterViewInit();         // manually call lifecycle hook
    jest.runAllTimers();                 // simulate setTimeout execution

    expect(mockObtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

});