import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosParaMovilizacionComponent } from './datos-para-movilizacion.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CatalogoSelectComponent, TituloComponent, ConsultaioQuery } from '@ng-mf/data-access-user';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { CommonModule } from '@angular/common';

describe('DatosParaMovilizacionComponent', () => {
  let componente: DatosParaMovilizacionComponent;
  let fixture: ComponentFixture<DatosParaMovilizacionComponent>;

  let servicioMock: any;
  let consultaMock: any;

  const catalogosFalsos = [{ id: 1, descripcion: 'Camión' }];
  const formularioFalso = {
    medioDeTransporte: 'Camión',
    identificacionTransporte: '123',
    puntoVerificacion: 'Punto1',
    nombreEmpresaTransportista: 'Empresa X'
  };

  beforeEach(async () => {
    servicioMock = {
      obtenerDatos: jest.fn().mockReturnValue(of({ formularioMovilizacion: formularioFalso })),
      obtenerDetallesDelCatalogo: jest.fn().mockImplementation((archivo: string) => {
        return of({ data: catalogosFalsos });
      }),
      actualizarFormaValida: jest.fn(),
      actualizarFormularioMovilizacion: jest.fn()
    };

    consultaMock = {
      selectConsultaioState$: of({ readonly: true })
    };

    await TestBed.configureTestingModule({
      imports: [
        DatosParaMovilizacionComponent,
        ReactiveFormsModule,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent
      ],
      providers: [
        FormBuilder,
        { provide: ImportacionDeAcuiculturaService, useValue: servicioMock },
        { provide: ConsultaioQuery, useValue: consultaMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosParaMovilizacionComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente e inicializar el formulario con valores', () => {
    expect(componente).toBeTruthy();
    expect(componente.formularioMovilizacion.value.nombreEmpresaTransportista).toBe('Empresa X');
  });

  it('debe obtener los catálogos de transporte y punto de verificación', () => {
    componente.obtenerCatalogosTransporte();
    componente.obtenerCatalogosPuntos();

    expect(servicioMock.obtenerDetallesDelCatalogo).toHaveBeenCalledWith('transporte.json');
    expect(servicioMock.obtenerDetallesDelCatalogo).toHaveBeenCalledWith('punto.json');
  });

  it('debe manejar el error de catálogo correctamente', () => {
    servicioMock.obtenerDetallesDelCatalogo.mockReturnValueOnce(throwError(() => new Error('fallo')));
    const consolaSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    componente.obtenerCatalogosTransporte();
    expect(consolaSpy).toHaveBeenCalledWith('Error al obtener datos de transporte:', expect.any(Error));
    consolaSpy.mockRestore();
  });

  it('debe deshabilitar el formulario si es solo lectura', () => {
    componente.esFormularioSoloLectura = true;
    componente.inicializarEstadoFormulario();
    expect(componente.formularioMovilizacion.disabled).toBe(true);
  });

  it('debe habilitar el formulario si no es solo lectura', () => {
    componente.esFormularioSoloLectura = false;
    componente.inicializarEstadoFormulario();
    expect(componente.formularioMovilizacion.enabled).toBe(true);
  });


  it('debe llamar a actualizarFormularioMovilizacion con los valores del formulario', () => {
    componente.setValoresStore();
    expect(servicioMock.actualizarFormularioMovilizacion).toHaveBeenCalledWith(formularioFalso);
  });

  it('debe limpiar al destruir el componente', () => {
    const completarSpy = jest.spyOn((componente as any).DESTROY_NOTIFIER$, 'complete');
    componente.ngOnDestroy();
    expect(completarSpy).toHaveBeenCalled();
  });

  it('debe validar el formulario correctamente', () => {
    // Prueba formulario válido
    componente.formularioMovilizacion.patchValue({
      medioDeTransporte: 'Camión',
      nombreEmpresaTransportista: 'Empresa Test'
    });
    expect(componente.validarFormulario()).toBe(true);

    // Prueba formulario inválido
    componente.formularioMovilizacion.patchValue({
      medioDeTransporte: '',
      nombreEmpresaTransportista: ''
    });
    expect(componente.validarFormulario()).toBe(false);
  });

});
