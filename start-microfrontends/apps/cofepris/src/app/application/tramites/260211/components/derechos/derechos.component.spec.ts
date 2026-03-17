import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DerechosComponent } from './derechos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { SanitarioService } from '../../services/sanitario.service';
import { Tramite260211Store } from '../../../../estados/tramites/tramite260211.store';
import { Permiso260211Query } from '../../../../estados/queries/permiso260211.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite260211Query } from '../../../../estados/queries/tramite260211.query';

describe('DerechosComponent', () => {
  let component: DerechosComponent;
  let fixture: ComponentFixture<DerechosComponent>;

  const mockSanitarioService = {
    getDatos: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Derecho 1' }])),
  };

  const mockTramiteStore = {
    setReferencia: jest.fn(),
    setCadenaDependencia: jest.fn(),
    setLlave: jest.fn(),
    setBanco: jest.fn(),
    setDeFetch: jest.fn(),
    setImporte: jest.fn(),
  };

  const mockPermisoQuery = {};
  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };

  const mockTramiteQuery = {
    selectSolicitud$: of({
      referencia: 'REF123',
      cadenaDependencia: 'CADDEP',
      Llave: 'KEY1',
      banco: 'BANK1',
      deFetch: '2025-07-21',
      importe: 1000,
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CatalogoSelectComponent, InputFechaComponent,DerechosComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SanitarioService, useValue: mockSanitarioService },
        { provide: Tramite260211Store, useValue: mockTramiteStore },
        { provide: Permiso260211Query, useValue: mockPermisoQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: Tramite260211Query, useValue: mockTramiteQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DerechosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con el estado de la solicitud', () => {
    expect(component.derechosForm.value).toEqual({
      referencia: 'REF123',
      cadenaDependencia: 'CADDEP',
      Llave: 'KEY1',
      banco: 'BANK1',
      deFetch: '2025-07-21',
      importe: 1000,
    });
  });

  it('debe cargar la lista de derechos desde el servicio', () => {
    component.loadComboUnidadMedida();
    expect(mockSanitarioService.getDatos).toHaveBeenCalled();
    expect(component.derechosList).toEqual([{ id: 1, descripcion: 'Derecho 1' }]);
  });

  it('debe actualizar el campo de fecha al cambiar la fecha', () => {
    component.onFechaCambiada('2025-08-01');
    expect(component.derechosForm.get('deFetch')?.value).toBe('2025-08-01');
  });

  it('debe deshabilitar el formulario si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.derechosForm.disabled).toBeTruthy();
  });

  it('debe habilitar el formulario si no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.derechosForm.enabled).toBeTruthy();
  });

  it('debe limpiar los observables al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});
