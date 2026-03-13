import { FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { AcuiculturaQuery } from '../../estados/sanidad-certificado.query';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { AgregardestinatarioComponent } from './agregardestinatario.component';

describe('AgregardestinatarioComponent', () => {
  let componente: AgregardestinatarioComponent;
  let servicioTerceros: Partial<TercerosrelacionadosService>;
  let servicioImportacion: Partial<ImportacionDeAcuiculturaService>;
  let consultaAcuicultura: Partial<AcuiculturaQuery>;

  beforeEach(() => {
    servicioTerceros = {
      obtenerSelectorList: jest.fn().mockReturnValue(of([]))
    };

    servicioImportacion = {
      updateTercerosRelacionado: jest.fn()
    };

    const seleccionarTerceros$ = new Subject<any>();
    consultaAcuicultura = {
      seleccionarTerceros$: seleccionarTerceros$.asObservable()
    };

    componente = new AgregardestinatarioComponent(
      new FormBuilder(),
      servicioTerceros as TercerosrelacionadosService,
      {} as any,
      servicioImportacion as ImportacionDeAcuiculturaService,
      consultaAcuicultura as AcuiculturaQuery,
      {} as any
    );

    componente.ngOnInit();
  });

  it('debe crear el formulario con valores predeterminados y validadores', () => {
    expect(componente.destinatarioForm).toBeDefined();
    expect(componente.destinatarioForm.controls['tipoMercancia'].value).toBe('yes');
    expect(componente.destinatarioForm.controls['nombre'].valid).toBe(false);
    expect(componente.destinatarioForm.controls['razonSocial'].valid).toBe(false);
  });

  it('debe cargar los catálogos en ngAfterViewInit', () => {
    componente.ngAfterViewInit();
    expect(servicioTerceros.obtenerSelectorList).toHaveBeenCalledTimes(4);
    expect(componente.pairsCatalog).toEqual([]);
    expect(componente.estadoCatalog).toEqual([]);
    expect(componente.municipioCatalog).toEqual([]);
    expect(componente.coloniaCatalog).toEqual([]);
  });

  it('debe requerir razonSocial cuando tipoMercancia es "yes"', () => {
    componente.destinatarioForm.patchValue({ tipoMercancia: 'yes' });
    componente.enCambioValorRadio();
    const ctrl = componente.destinatarioForm.get('razonSocial');
    ctrl?.setValue('');
    expect(ctrl?.valid).toBe(false);
    ctrl?.setValue('Alguna Razón Social');
    expect(ctrl?.valid).toBe(true);
  });

  it('debe limpiar los validadores de razonSocial cuando tipoMercancia es "no"', () => {
    componente.destinatarioForm.patchValue({ tipoMercancia: 'no' });
    componente.enCambioValorRadio();
    const ctrl = componente.destinatarioForm.get('razonSocial');
    ctrl?.setValue('');
    expect(ctrl?.valid).toBe(true);
  });

  it('debe emitir el evento cerrar en onCancelarDestinatario', () => {
    const espiaCerrar = jest.spyOn(componente.cerrar, 'emit');
    componente.onCancelarDestinatario();
    expect(espiaCerrar).toHaveBeenCalled();
  });

  it('debe llamar al servicio de actualización y emitir cerrar cuando el formulario es válido en onGuardarDestinatario', () => {
    componente.destinatarioForm.patchValue({
      tipoMercancia: 'yes',
      nombre: 'Juan',
      primerApellido: 'Perez',
      razonSocial: 'Empresa SA',
      pais: '1',
      codigoPostal: '12345',
      estado: '01',
      calle: 'Calle 1',
      numeroExterior: '123'
    });

    const espiaActualizar = jest.spyOn(servicioImportacion, 'updateTercerosRelacionado');
    const espiaCerrar = jest.spyOn(componente.cerrar, 'emit');

    componente.onGuardarDestinatario();

    expect(espiaActualizar).toHaveBeenCalled();
    expect(espiaCerrar).toHaveBeenCalled();
  });

  it('debe marcar el formulario como tocado si es inválido en onGuardarDestinatario', () => {
    componente.destinatarioForm.patchValue({
      tipoMercancia: 'yes',
      nombre: '',
      primerApellido: '',
      razonSocial: '',
      pais: '',
      codigoPostal: '',
      estado: '',
      calle: '',
      numeroExterior: ''
    });

    const espiaMarcarTocado = jest.spyOn(componente.destinatarioForm, 'markAllAsTouched');
    componente.onGuardarDestinatario();
    expect(espiaMarcarTocado).toHaveBeenCalled();
  });
});
