import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermisoRenunciaDeDerechosComponent } from './permiso-renuncia-de-derechos.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { Tramite140111Query } from '../../estados/tramite140111.query';
import { Tramite140111Store } from '../../estados/tramite140111.store';
import { RenunciaDeDerechosAlServicio } from '../../services/renuncia-de-derechos-al.service';
import { TituloComponent } from '@ng-mf/data-access-user';

describe('PermisoRenunciaDeDerechosComponent', () => {
  let component: PermisoRenunciaDeDerechosComponent;
  let fixture: ComponentFixture<PermisoRenunciaDeDerechosComponent>;
  let tramite140111Store: Tramite140111Store;
  let tramite140111Query: Tramite140111Query;
  let renunciaDeDerechosServicio: RenunciaDeDerechosAlServicio;

  beforeEach(async () => {
    const tramite140111StoreMock = {
      establecerDatos: jest.fn()
    };

    const tramite140111QueryMock = {
      selectTramite140111$: of({
        motivoRenunciaDeDerechos: 'Motivo de prueba'
      })
    };

    const renunciaDeDerechosServicioMock = {
      getDescripcionDelCupo: jest.fn().mockReturnValue(
        of({
          folioTramite: '12345',
          tipoDeSolicitud: 'Importación',
          regimen: 'Regular',
          clasificacionDelRegimen: 'Especial',
          periodoDeVigencia: '2025-12-31',
          unidadDeMedida: 'Kilogramos',
          fraccionArancelaria: 'ABC123',
          cantidadAutorizada: '100',
          valorAutorizado: '5000',
          nico: 'NICO-01',
          descripcionNico: 'Descripción NICO',
          acotacion: 'Acotación de prueba',
          permisoValidoDesde: '2025-01-01',
          permisoValidoHasta: '2025-12-31'
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [PermisoRenunciaDeDerechosComponent, ReactiveFormsModule, TituloComponent],
      providers: [
        { provide: Tramite140111Store, useValue: tramite140111StoreMock },
        { provide: Tramite140111Query, useValue: tramite140111QueryMock },
        { provide: RenunciaDeDerechosAlServicio, useValue: renunciaDeDerechosServicioMock },
        FormBuilder
      ],
    }).compileComponents();

    tramite140111Store = TestBed.inject(Tramite140111Store);
    tramite140111Query = TestBed.inject(Tramite140111Query);
    renunciaDeDerechosServicio = TestBed.inject(RenunciaDeDerechosAlServicio);

    fixture = TestBed.createComponent(PermisoRenunciaDeDerechosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el formulario con valores predeterminados', () => {
    expect(component.formulario).toBeDefined();
    expect(component.formulario.get('mercanciaSolicitudFolioTramite')?.value).toBe('12345'); // Updated expectation
  });
  

  it('Debería parchear el formulario con datos de la API', () => {
    component.enPatchForm();
    fixture.detectChanges();

    expect(component.formulario.get('mercanciaSolicitudFolioTramite')?.value).toBe('12345');
    expect(component.formulario.get('mercacniaSolicitudTipoSolicitud')?.value).toBe('Importación');
    expect(component.formulario.get('mercacniaSolicitudRegimen')?.value).toBe('Regular');
    expect(component.formulario.get('mercacniaSolicitudFraccionArancelaria')?.value).toBe('ABC123');
  });

  it('Debe actualizar los valores del formulario desde la tienda al iniciar.', () => {
    component.datosGuardadosParche();
    fixture.detectChanges();

    expect(component.formulario.get('motivoRenunciaDeDerechos')?.value).toBe('Motivo de prueba');
  });

  it('debe llamar a establecerDatos en la tienda cuando se llama a setValoresStore', () => {
    component.setValoresStore(component.formulario, 'motivoRenunciaDeDerechos');
    expect(tramite140111Store.establecerDatos).toHaveBeenCalledWith({ motivoRenunciaDeDerechos: 'Motivo de prueba' }); 
  });
  

  it('Debería comprobar si el control de formulario no es válido', () => {
    component.formulario.get('motivoRenunciaDeDerechos')?.setValue('');
    component.formulario.get('motivoRenunciaDeDerechos')?.markAsTouched();

    expect(component.esInvalido('motivoRenunciaDeDerechos')).toBe(true);
  });

  it('Debería completar la destrucción$ en la destrucción del componente', () => {
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
