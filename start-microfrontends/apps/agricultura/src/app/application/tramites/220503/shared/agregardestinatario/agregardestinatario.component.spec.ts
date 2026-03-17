import { FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { AgregardestinatarioComponent } from './agregardestinatario.component';
import { Solocitud220503Service } from '../../services/service220503.service';
import { Solicitud220503Query } from '../../estados/tramites220503.query';

describe('AgregardestinatarioComponent', () => {
  let component: AgregardestinatarioComponent;
  let tercerosService: Partial<TercerosrelacionadosService>;
  let importacionService: Partial<Solocitud220503Service>;
  let acuiculturaQuery: Partial<Solicitud220503Query>;

  beforeEach(() => {
    tercerosService = {
      obtenerSelectorList: jest.fn().mockReturnValue(of([]))
    };

    importacionService = {
      updateTercerosRelacionado: jest.fn()
    };

    const seleccionarTerceros$ = new Subject<any>();
    acuiculturaQuery = {
      seletedTerceros$: seleccionarTerceros$.asObservable()
    };

    component = new AgregardestinatarioComponent(
      new FormBuilder(),
      tercerosService as TercerosrelacionadosService,
      importacionService as Solocitud220503Service,
      acuiculturaQuery as Solicitud220503Query
    );

    component.ngOnInit();
  });

  it('debe crear el formulario con valores y validadores por defecto', () => {
    expect(component.destinatarioForm).toBeDefined();
    expect(component.destinatarioForm.controls['tipoMercancia'].value).toBe('yes');
    expect(component.destinatarioForm.controls['nombre'].valid).toBe(false);
    expect(component.destinatarioForm.controls['razonSocial'].valid).toBe(false);
  });

  it('debe cargar los catálogos en ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(tercerosService.obtenerSelectorList).toHaveBeenCalledTimes(4);
    expect(component.pairsCatalog).toEqual([]);
    expect(component.estadoCatalog).toEqual([]);
    expect(component.municipioCatalog).toEqual([]);
    expect(component.coloniaCatalog).toEqual([]);
  });

  it('debe requerir razonSocial cuando tipoMercancia es "yes"', () => {
    component.destinatarioForm.patchValue({ tipoMercancia: 'yes' });
    component.enCambioValorRadio();
    const ctrl = component.destinatarioForm.get('razonSocial');
    ctrl?.setValue('');
    expect(ctrl?.valid).toBe(false);
    ctrl?.setValue('Alguna razón social');
    expect(ctrl?.valid).toBe(true);
  });

  it('debe limpiar los validadores de razonSocial cuando tipoMercancia es "no"', () => {
    component.destinatarioForm.patchValue({ tipoMercancia: 'no' });
    component.enCambioValorRadio();
    const ctrl = component.destinatarioForm.get('razonSocial');
    ctrl?.setValue('');
    expect(ctrl?.valid).toBe(true);
  });

  it('debe emitir el evento cerrar al ejecutar onCancelarDestinatario', () => {
    const spyCerrar = jest.spyOn(component.cerrar, 'emit');
    component.onCancelarDestinatario();
    expect(spyCerrar).toHaveBeenCalled();
  });

  it('debe llamar al servicio update y emitir cerrar cuando el formulario es válido en onGuardarDestinatario', () => {
    component.destinatarioForm.patchValue({
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

    const spyUpdate = jest.spyOn(importacionService, 'updateTercerosRelacionado');
    const spyCerrar = jest.spyOn(component.cerrar, 'emit');

    component.onGuardarDestinatario();

    expect(spyUpdate).toHaveBeenCalled();
    expect(spyCerrar).toHaveBeenCalled();
  });

  it('debe marcar el formulario como tocado si es inválido en onGuardarDestinatario', () => {
    component.destinatarioForm.patchValue({
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

    const markAllAsTouchedSpy = jest.spyOn(component.destinatarioForm, 'markAllAsTouched');
    component.onGuardarDestinatario();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });
});
