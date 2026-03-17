import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregardestinatarioComponent } from './agregardestinatario.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { of } from 'rxjs';

describe('AgregardestinatarioComponent', () => {
  let component: AgregardestinatarioComponent;
  let fixture: ComponentFixture<AgregardestinatarioComponent>;
  let mockTercerosrelacionadosService: Partial<TercerosrelacionadosService>;

  beforeEach(async () => {
    mockTercerosrelacionadosService = {
      obtenerSelectorList: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [AgregardestinatarioComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: TercerosrelacionadosService, useValue: mockTercerosrelacionadosService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregardestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.destinatarioForm).toBeDefined();
    expect(component.destinatarioForm.controls['nombre']).toBeDefined();
  });

  it('should call obtenerSelectorList for pairsCatalogChange', () => {
    component.pairsCatalogChange();
    expect(mockTercerosrelacionadosService.obtenerSelectorList).toHaveBeenCalledWith('paisprocedencia.json');
  });

  it('should mark all fields as touched if form is invalid on onGuardarDestinatario', () => {
    component.destinatarioForm.controls['nombre'].setValue('');
    component.onGuardarDestinatario();
    expect(component.destinatarioForm.controls['nombre'].touched).toBeTruthy();
  });

  it('should reset the form on onLimpiarDestinatario', () => {
    component.destinatarioForm.controls['nombre'].setValue('Test');
    component.onLimpiarDestinatario();
    expect(component.destinatarioForm.controls['nombre'].value).toBeNull();
  });

  it('should emit cerrar event on onCancelarDestinatario', () => {
    jest.spyOn(component.cerrar, 'emit');
    component.onCancelarDestinatario();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('should update validators on enCambioValorRadio', () => {
    component.destinatarioForm.controls['tipoMercancia'].setValue('no');
    component.enCambioValorRadio();
    expect(component.destinatarioForm.get('razonSocial')?.validator).toBeNull();

    component.destinatarioForm.controls['tipoMercancia'].setValue('yes');
    component.enCambioValorRadio();
    expect(component.destinatarioForm.get('razonSocial')?.validator).toBeDefined();
  });
});