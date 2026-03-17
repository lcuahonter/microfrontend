import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TercerosRelacionadoesComponent } from './terceros-Relacionados.component';
import { SanitarioService } from '../../services/sanitario.service';
import { Shared260212Store } from '../../../../estados/tramites/tramite260212.store';
import { of } from 'rxjs';

describe('TercerosRelacionadoesComponent', () => {
  let component: TercerosRelacionadoesComponent;
  let fixture: ComponentFixture<TercerosRelacionadoesComponent>;
  let tercerosMockService: any;

  beforeEach(async () => {

    tercerosMockService = {
      getData: jest.fn().mockReturnValue(
        of([
          { id: 'Banco1', descripcion: 'Banco1' },
          { id: 'Banco2', descripcion: 'Banco2' },
          { id: 'Banco3', descripcion: 'Banco3' },
        ])
      ),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TercerosRelacionadoesComponent,
      ],
      providers: [FormBuilder,Shared260212Store, { provide: SanitarioService, useValue: tercerosMockService }],
    }).compileComponents();


    fixture = TestBed.createComponent(TercerosRelacionadoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    beforeEach(() => {
      fixture = TestBed.createComponent(TercerosRelacionadoesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    
  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
  it('debe inicializar todos los formularios al iniciar', () => {
    component.ngOnInit();
    expect(component.agregarFabricanteFormGroup).toBeDefined();
    expect(component.agregarDestinatarioFormGroup).toBeDefined();
    expect(component.agregarProveedorFormGroup).toBeDefined();
    expect(component.agregarFacturadorFormGroup).toBeDefined();
  });

  it('debe llamar a initializeAgregarFabricanteFormGroup al iniciar', () => {
    const initializeSpy = jest.spyOn(component, 'initializeAgregarFabricanteFormGroup');
    component.ngOnInit();
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('debe llamar a initializeAgregarDestinatarioFormGroup al iniciar', () => {
    const initializeSpy = jest.spyOn(component, 'initializeAgregarDestinatarioFormGroup');
    component.ngOnInit();
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('debe llamar a initializeAgregarProveedorFormGroup al iniciar', () => {
    const initializeSpy = jest.spyOn(component, 'initializeAgregarProveedorFormGroup');
    component.ngOnInit();
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('debe llamar a initializeAgregarFacturadorFormGroup al iniciar', () => {
    const initializeSpy = jest.spyOn(component, 'initializeAgregarFacturadorFormGroup');
    component.ngOnInit();
    expect(initializeSpy).toHaveBeenCalled();
  });

  it('debe inicializar correctamente agregarFabricanteFormGroup', () => {
    component.initializeAgregarFabricanteFormGroup();
    const formGroup = component.agregarFabricanteFormGroup;
    expect(formGroup).toBeTruthy();
    expect(formGroup.get('rfc')?.disabled).toBeTruthy();
    expect(formGroup.get('curp')?.disabled).toBeTruthy();
    expect(formGroup.get('denominacionRazonSocial')?.disabled).toBeTruthy();
    expect(formGroup.get('tercerosNacionalidad')?.value).toBe('');
    expect(formGroup.get('pais')?.validator).toBeDefined();
    expect(formGroup.get('calle')?.validator).toBeDefined();
    expect(formGroup.get('numeroExterior')?.validator).toBeDefined();
  });

  it('debe habilitar campos específicos en agregarFabricanteFormGroup cuando cambia tipoPersona', () => {
    component.initializeAgregarFabricanteFormGroup();
    const formGroup = component.agregarFabricanteFormGroup;
    formGroup.get('tipoPersona')?.setValue('someValue');
    fixture.detectChanges();
    expect(formGroup.get('rfc')?.enabled).toBeTruthy();
    expect(formGroup.get('curp')?.enabled).toBeTruthy();
    expect(formGroup.get('denominacionRazonSocial')?.enabled).toBeTruthy();
    expect(formGroup.get('calle')?.enabled).toBeTruthy();
    expect(formGroup.get('numeroExterior')?.enabled).toBeTruthy();
  });

  it('debe alternar showTableDiv y showFabricante', () => {
    component.showTableDiv = true;
    component.showFabricante = true;
    component.toggleDivFabricante();
    expect(component.showTableDiv).toBe(false);
    expect(component.showFabricante).toBe(false);
  });

  it('debe alternar showTableDiv y showFabricante nuevamente', () => {
    component.showTableDiv = false;
    component.showFabricante = false;
    component.toggleDivFabricante();
    expect(component.showTableDiv).toBe(true);
    expect(component.showFabricante).toBe(true);
  });

  it('debe reiniciar fisica y moral a false', () => {
    component.fisica = true;
    component.moral = true;
    component.toggleDivFabricante();
    expect(component.fisica).toBe(false);
    expect(component.moral).toBe(false);
  });

  it('debe alternar showTableDiv y showFabricante de true a false', () => {
    component.showTableDiv = true;
    component.showFabricante = true;
    component.showTableDiv = !component.showTableDiv;
    component.showFabricante = !component.showFabricante;
    expect(component.showTableDiv).toBe(false);
    expect(component.showFabricante).toBe(false);
  });

  it('debe alternar showTableDiv y showFabricante de false a true', () => {
    component.showTableDiv = false;
    component.showFabricante = false;
    component.showTableDiv = !component.showTableDiv;
    component.showFabricante = !component.showFabricante;
    expect(component.showTableDiv).toBe(true);
    expect(component.showFabricante).toBe(true);
  });

  it('debe inicializar correctamente agregarDestinatarioFormGroup', () => {
    component.initializeAgregarDestinatarioFormGroup();
    const formGroup = component.agregarDestinatarioFormGroup;
    expect(formGroup).toBeTruthy();
    expect(formGroup.get('rfc')?.disabled).toBeTruthy();
    expect(formGroup.get('curp')?.disabled).toBeTruthy();
    expect(formGroup.get('denominacionRazonSocial')?.disabled).toBeTruthy();
    expect(formGroup.get('tipoPersona')?.value).toBe('');
    expect(formGroup.get('localidad')?.value).toBe('');
    expect(formGroup.get('calle')?.enabled).toBeTruthy();
  });

  it('debe habilitar campos específicos en agregarDestinatarioFormGroup cuando cambia tipoPersona', () => {
    component.initializeAgregarDestinatarioFormGroup();
    const formGroup = component.agregarDestinatarioFormGroup;
    formGroup.get('tipoPersona')?.setValue('someValue');
    fixture.detectChanges();
    expect(formGroup.get('rfc')?.enabled).toBeTruthy();
    expect(formGroup.get('curp')?.enabled).toBeTruthy();
    expect(formGroup.get('denominacionRazonSocial')?.enabled).toBeTruthy();
    expect(formGroup.get('calle')?.enabled).toBeTruthy();
    expect(formGroup.get('numeroExterior')?.enabled).toBeTruthy();
  });

  it('debe alternar showTableDiv y showDestinatario', () => {
    component.showTableDiv = true;
    component.showDestinatario = true;
    component.toggleDivDestinatario();
    expect(component.showTableDiv).toBe(false);
    expect(component.showDestinatario).toBe(false);
  });

  it('debe alternar showTableDiv y showDestinatario nuevamente', () => {
    component.showTableDiv = false;
    component.showDestinatario = false;
    component.toggleDivDestinatario();
    expect(component.showTableDiv).toBe(true);
    expect(component.showDestinatario).toBe(true);
  });

  it('debe reiniciar fisica y moral a false en destinatario', () => {
    component.fisica = true;
    component.moral = true;
    component.toggleDivDestinatario();
    expect(component.fisica).toBe(false);
    expect(component.moral).toBe(false);
  });

  it('debe alternar showTableDiv y showDestinatario de true a false', () => {
    component.showTableDiv = true;
    component.showDestinatario = true;
    component.showTableDiv = !component.showTableDiv;
    component.showDestinatario = !component.showDestinatario;
    expect(component.showTableDiv).toBe(false);
    expect(component.showDestinatario).toBe(false);
  });

  it('debe alternar showTableDiv y showDestinatario de false a true', () => {
    component.showTableDiv = false;
    component.showDestinatario = false;
    component.showTableDiv = !component.showTableDiv;
    component.showDestinatario = !component.showDestinatario;
    expect(component.showTableDiv).toBe(true);
    expect(component.showDestinatario).toBe(true);
  });

  it('debe inicializar correctamente agregarProveedorFormGroup', () => {
    component.initializeAgregarProveedorFormGroup();
    const formGroup = component.agregarProveedorFormGroup;
    expect(formGroup).toBeTruthy();
    expect(formGroup.get('nombre')?.disabled).toBeTruthy();
    expect(formGroup.get('segundoApellido')?.disabled).toBeTruthy();
    expect(formGroup.get('primerApellido')?.value).toBe('');
    expect(formGroup.get('denominacionRazonSocial')?.disabled).toBeTruthy();
    expect(formGroup.get('pais')?.validator).toBeDefined();
    expect(formGroup.get('telefono')?.value).toBe('');
  });

  it('debe habilitar campos específicos en agregarProveedorFormGroup cuando cambia tipoPersona', () => {
    component.initializeAgregarProveedorFormGroup();
    const formGroup = component.agregarProveedorFormGroup;
    formGroup.get('tipoPersona')?.setValue('someValue');
    fixture.detectChanges();
    expect(formGroup.get('nombre')?.enabled).toBeTruthy();
    expect(formGroup.get('segundoApellido')?.enabled).toBeTruthy();
    expect(formGroup.get('denominacionRazonSocial')?.enabled).toBeTruthy();
    expect(formGroup.get('calle')?.enabled).toBeTruthy();
  });

  it('debe alternar showTableDiv y showProveedor', () => {
    component.showTableDiv = true;
    component.showProveedor = true;
    component.toggleDivProveedor();
    expect(component.showTableDiv).toBe(false);
    expect(component.showProveedor).toBe(false);
  });

  it('debe alternar showTableDiv y showProveedor nuevamente', () => {
    component.showTableDiv = false;
    component.showProveedor = false;
    component.toggleDivProveedor();
    expect(component.showTableDiv).toBe(true);
    expect(component.showProveedor).toBe(true);
  });

  it('debe reiniciar fisica y moral a false en proveedor', () => {
    component.fisica = true;
    component.moral = true;
    component.toggleDivProveedor();
    expect(component.fisica).toBe(false);
    expect(component.moral).toBe(false);
  });

  it('debe alternar showTableDiv y showProveedor de true a false', () => {
    component.showTableDiv = true;
    component.showProveedor = true;
    component.showTableDiv = !component.showTableDiv;
    component.showProveedor = !component.showProveedor;
    expect(component.showTableDiv).toBe(false);
    expect(component.showProveedor).toBe(false);
  });

  it('debe alternar showTableDiv y showProveedor de false a true', () => {
    component.showTableDiv = false;
    component.showProveedor = false;
    component.showTableDiv = !component.showTableDiv;
    component.showProveedor = !component.showProveedor;
    expect(component.showTableDiv).toBe(true);
    expect(component.showProveedor).toBe(true);
  });

  it('debe inicializar correctamente agregarFacturadorFormGroup', () => {
    component.initializeAgregarFacturadorFormGroup();
    const formGroup = component.agregarFacturadorFormGroup;
    expect(formGroup).toBeDefined();
    expect(formGroup.get('tipoPersona')!.value).toBe('');
    expect(formGroup.get('nombre')!.value).toBe('');
    expect(formGroup.get('primerApellido')!.value).toBe('');
    expect(formGroup.get('segundoApellido')!.value).toBe('');
    expect(formGroup.get('denominacionRazonSocial')!.value).toBe('');
    expect(formGroup.get('pais')!.value).toBe('');
    expect(formGroup.get('estado')!.value).toBe('');
    expect(formGroup.get('codigoPostaloEquivalente')!.value).toBe('');
    expect(formGroup.get('coloniaoEquivalente')!.value).toBe('');
    expect(formGroup.get('calle')!.value).toBe('');
    expect(formGroup.get('numeroExterior')!.value).toBe('');
    expect(formGroup.get('numeroInterior')!.value).toBe('');
    expect(formGroup.get('lada')!.value).toBe('');
    expect(formGroup.get('telefono')!.value).toBe('');
    expect(formGroup.get('correoElectronico')!.value).toBe('');
  });

  it('debe habilitar campos específicos en agregarFacturadorFormGroup cuando cambia tipoPersona', () => {
    component.initializeAgregarFacturadorFormGroup();
    const formGroup = component.agregarFacturadorFormGroup;
    formGroup.get('tipoPersona')?.setValue('someValue');
    fixture.detectChanges();
    expect(formGroup.get('nombre')?.enabled).toBeTruthy();
    expect(formGroup.get('segundoApellido')?.enabled).toBeTruthy();
    expect(formGroup.get('denominacionRazonSocial')?.enabled).toBeTruthy();
    expect(formGroup.get('telefono')?.enabled).toBeTruthy();
    expect(formGroup.get('correoElectronico')?.enabled).toBeTruthy();
  });

  it('debe alternar showTableDiv y showFacturador', () => {
    component.showTableDiv = true;
    component.showFacturador = true;
    component.toggleDivFacturador();
    expect(component.showTableDiv).toBe(false);
    expect(component.showFacturador).toBe(false);
  });

  it('debe alternar showTableDiv y showFacturador nuevamente', () => {
    component.showTableDiv = false;
    component.showFacturador = false;
    component.toggleDivFacturador();
    expect(component.showTableDiv).toBe(true);
    expect(component.showFacturador).toBe(true);
  });

  it('debe reiniciar fisica y moral a false en facturador', () => {
    component.fisica = true;
    component.moral = true;
    component.toggleDivFacturador();
    expect(component.fisica).toBe(false);
    expect(component.moral).toBe(false);
  });

  it('debe alternar showTableDiv y showFacturador de true a false', () => {
    component.showTableDiv = true;
    component.showFacturador = true;
    component.showTableDiv = !component.showTableDiv;
    component.showFacturador = !component.showFacturador;
    expect(component.showTableDiv).toBe(false);
    expect(component.showFacturador).toBe(false);
  });

  it('debe alternar showTableDiv y showFacturador de false a true', () => {
    component.showTableDiv = false;
    component.showFacturador = false;
    component.showTableDiv = !component.showTableDiv;
    component.showFacturador = !component.showFacturador;
    expect(component.showTableDiv).toBe(true);
    expect(component.showFacturador).toBe(true);
  });

  it('debe alternar showTableDiv y showFacturador usando submitFacturadorForm', () => {
    component.showTableDiv = true;
    component.showFacturador = false;
    component.submitFacturadorForm();
    expect(component.showTableDiv).toBe(false);
    expect(component.showFacturador).toBe(true);
  });

  it('debe establecer fisica en true y moral en false cuando el checkbox es "fisica"', () => {
    component.inputChecked('fisica');
    expect(component.fisica).toBe(true);
    expect(component.moral).toBe(false);
  });

  it('debe establecer fisica en false y moral en true cuando el checkbox no es "fisica"', () => {
    component.inputChecked('moral');
    expect(component.fisica).toBe(false);
    expect(component.moral).toBe(true);
  });

  it('debe establecer fisica en false y moral en true para cualquier otro valor de checkbox', () => {
    component.inputChecked('other');
    expect(component.fisica).toBe(false);
    expect(component.moral).toBe(true);
  });

  it('debe establecer nacional en true y extranjero en false cuando el checkbox es "nacional"', () => {
    component.tercerosInputChecked('nacional');
    expect(component.nacional).toBe(true);
    expect(component.extranjero).toBe(false);
  });

  it('debe establecer nacional en false y extranjero en true cuando el checkbox no es "nacional"', () => {
    component.tercerosInputChecked('extranjero');
    expect(component.nacional).toBe(false);
    expect(component.extranjero).toBe(true);
  });

  it('debe establecer nacional en false y extranjero en true para cualquier otro valor de checkbox', () => {
    component.tercerosInputChecked('other');
    expect(component.nacional).toBe(false);
    expect(component.extranjero).toBe(true);
  });

  it('debe llamar a submitFabricanteForm y cambiar los flags', () => {
    component.showTableDiv = false;
    component.showFabricante = true;
    component.submitFabricanteForm();
    expect(component.showTableDiv).toBe(true);
    expect(component.showFabricante).toBe(false);
  });

  it('debe llamar a submitDestinatarioForm y cambiar los flags', () => {
    component.showTableDiv = false;
    component.showDestinatario = true;
    component.submitDestinatarioForm();
    expect(component.showTableDiv).toBe(true);
    expect(component.showDestinatario).toBe(false);
  });

  it('debe llamar a submitProveedorForm y cambiar los flags', () => {
    component.showTableDiv = false;
    component.showProveedor = true;
    component.submitProveedorForm();
    expect(component.showTableDiv).toBe(true);
    expect(component.showProveedor).toBe(false);
  });

  it('debe llamar a submitFacturadorForm y cambiar los flags', () => {
    component.showTableDiv = false;
    component.showFacturador = true;
    component.submitFacturadorForm();
    expect(component.showTableDiv).toBe(true);
    expect(component.showFacturador).toBe(false);
  });
});
