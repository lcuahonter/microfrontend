// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { TercerosRelacionadosModalPopupComponent, TipoTabla, ConfiguracionModalTerceros } from './terceros-relacionados-modal-popup.component';
// import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
// import { ConsultaioQuery } from '@ng-mf/data-access-user';
// import { of } from 'rxjs';

// describe('TercerosRelacionadosModalPopupComponent', () => {
//   let component: TercerosRelacionadosModalPopupComponent;
//   let fixture: ComponentFixture<TercerosRelacionadosModalPopupComponent>;
//   let mockValidacionesService: any;
//   let mockConsultaioQuery: any;

//   const mockConfiguracion: ConfiguracionModalTerceros = {
//     tipo: TipoTabla.FABRICANTE,
//     titulo: 'Fabricante',
//     camposRequeridos: ['rfc', 'razonSocial', 'pais'],
//     mostrarNacionalidad: true,
//     mostrarTipoPersona: true
//   };

//   beforeEach(async () => {
//     const validacionesSpy = jasmine.createSpyObj('ValidacionesFormularioService', ['validarCampo']);
//     const consultaioSpy = jasmine.createSpyObj('ConsultaioQuery', ['selectConsultaioState$']);

//     await TestBed.configureTestingModule({
//       imports: [
//         TercerosRelacionadosModalPopupComponent,
//         ReactiveFormsModule
//       ],
//       providers: [
//         FormBuilder,
//         { provide: ValidacionesFormularioService, useValue: validacionesSpy },
//         { provide: ConsultaioQuery, useValue: consultaioSpy }
//       ]
//     }).compileComponents();

//     mockValidacionesService = TestBed.inject(ValidacionesFormularioService);
//     mockConsultaioQuery = TestBed.inject(ConsultaioQuery);
//     mockConsultaioQuery.selectConsultaioState$ = of({ readonly: false });

//     fixture = TestBed.createComponent(TercerosRelacionadosModalPopupComponent);
//     component = fixture.componentInstance;
    
//     component.configuracion = mockConfiguracion;
//     component.idProcedimiento = 261101;
//   });

//   it('debería crear el componente', () => {
//     expect(component).toBeTruthy();
//   });

//   it('debería inicializar el formulario correctamente', () => {
//     component.ngOnInit();
//     expect(component.tercerosFormGroup).toBeDefined();
//     expect(component.tercerosFormGroup.get('rfc')).toBeTruthy();
//     expect(component.tercerosFormGroup.get('razonSocial')).toBeTruthy();
//     expect(component.tercerosFormGroup.get('tercerosNacionalidad')).toBeTruthy();
//   });

//   it('debería configurar validadores según la configuración', () => {
//     component.ngOnInit();
//     component.ngOnChanges();

//     const rfcControl = component.tercerosFormGroup.get('rfc');
//     const razonSocialControl = component.tercerosFormGroup.get('razonSocial');

//     expect(rfcControl?.hasError('required')).toBeTruthy();
//     expect(razonSocialControl?.hasError('required')).toBeTruthy();
//   });

//   it('debería mostrar/ocultar campos según el tipo de persona', () => {
//     component.ngOnInit();
    
//     // Configurar como persona física
//     component.tercerosFormGroup.get('tipoPersona')?.setValue('FISICA');
    
//     expect(component.mostrarCampo('nombre')).toBeTruthy();
//     expect(component.mostrarCampo('apellidoPaterno')).toBeTruthy();
//     expect(component.mostrarCampo('curp')).toBeTruthy();

//     // Configurar como persona moral
//     component.tercerosFormGroup.get('tipoPersona')?.setValue('MORAL');
    
//     expect(component.mostrarCampo('nombre')).toBeFalsy();
//     expect(component.mostrarCampo('apellidoPaterno')).toBeFalsy();
//     expect(component.mostrarCampo('curp')).toBeFalsy();
//   });

//   it('debería validar RFC según el tipo de persona', () => {
//     component.ngOnInit();
    
//     // RFC válido para persona moral
//     component.tercerosFormGroup.get('tipoPersona')?.setValue('MORAL');
//     component.tercerosFormGroup.get('rfc')?.setValue('ABC123456789');
    
//     const rfcControl = component.tercerosFormGroup.get('rfc');
//     expect(rfcControl?.valid).toBeTruthy();
//   });

//   it('debería obtener el título correcto según el modo', () => {
//     component.configuracion = mockConfiguracion;
    
//     component.modo = 'agregar';
//     expect(component.obtenerTitulo()).toBe('Agregar Fabricante');
    
//     component.modo = 'editar';
//     expect(component.obtenerTitulo()).toBe('Modificar Fabricante');
//   });

//   it('debería mostrar campos según la configuración', () => {
//     component.configuracion = {
//       ...mockConfiguracion,
//       mostrarNacionalidad: false,
//       mostrarTipoPersona: false
//     };
    
//     expect(component.mostrarCampo('nacionalidad')).toBeFalsy();
//     expect(component.mostrarCampo('tipoPersona')).toBeFalsy();
//   });

//   it('debería emitir evento al guardar con datos válidos', () => {
//     spyOn(component.guardarDatos, 'emit');
    
//     component.ngOnInit();
    
//     // Configurar formulario válido
//     component.tercerosFormGroup.patchValue({
//       tercerosNacionalidad: 'NACIONAL',
//       tipoPersona: 'MORAL',
//       rfc: 'ABC123456789',
//       razonSocial: 'Empresa de Prueba',
//       pais: 'México',
//       estado: 'CDMX',
//       municipio: 'Miguel Hidalgo',
//       ciudad: 'Ciudad de México',
//       colonia: 'Roma Norte',
//       codigoPostal: '06700',
//       calle: 'Av. Insurgentes',
//       numeroExterior: '123'
//     });
    
//     component.guardar();
    
//     expect(component.guardarDatos.emit).toHaveBeenCalledWith(jasmine.objectContaining({
//       tipo: TipoTabla.FABRICANTE,
//       modo: 'agregar'
//     }));
//   });

//   it('debería manejar el cambio de tipo de persona correctamente', () => {
//     component.ngOnInit();
    
//     component.cambiarTipoPersona('FISICA');
    
//     const curpControl = component.tercerosFormGroup.get('curp');
//     const nombreControl = component.tercerosFormGroup.get('nombre');
    
//     expect(curpControl?.hasError('required')).toBeTruthy();
//     expect(nombreControl?.hasError('required')).toBeTruthy();
//   });

//   it('debería cargar datos de edición correctamente', () => {
//     const datosEdicion = {
//       rfc: 'XYZ987654321',
//       razonSocial: 'Empresa Editada',
//       tercerosNacionalidad: 'NACIONAL'
//     };
    
//     component.datosEdicion = datosEdicion;
//     component.modo = 'editar';
//     component.ngOnInit();
//     component.ngOnChanges();
    
//     expect(component.tercerosFormGroup.get('rfc')?.value).toBe(datosEdicion.rfc);
//     expect(component.tercerosFormGroup.get('razonSocial')?.value).toBe(datosEdicion.razonSocial);
//   });

//   it('debería emitir evento de cancelar', () => {
//     spyOn(component.cancelar, 'emit');
    
//     component.cancelarOperacion();
    
//     expect(component.cancelar.emit).toHaveBeenCalled();
//   });

//   it('debería emitir evento de cerrar modal', () => {
//     spyOn(component.cerrarModal, 'emit');
    
//     component.cerrar();
    
//     expect(component.cerrarModal.emit).toHaveBeenCalled();
//   });

//   it('debería marcar campos como tocados al intentar guardar formulario inválido', () => {
//     component.ngOnInit();
    
//     // Formulario inválido
//     component.tercerosFormGroup.get('rfc')?.setValue('');
    
//     component.guardar();
    
//     const rfcControl = component.tercerosFormGroup.get('rfc');
//     expect(rfcControl?.touched).toBeTruthy();
//   });

//   it('debería limpiar formulario al cancelar', () => {
//     component.ngOnInit();
    
//     component.tercerosFormGroup.get('rfc')?.setValue('ABC123');
//     component.cancelarOperacion();
    
//     expect(component.tercerosFormGroup.get('rfc')?.value).toBeFalsy();
//   });

//   describe('Validación de campos específicos', () => {
//     beforeEach(() => {
//       component.ngOnInit();
//     });

//     it('debería validar formato de correo electrónico', () => {
//       const correoControl = component.tercerosFormGroup.get('correoElectronico');
      
//       correoControl?.setValue('correo-invalido');
//       expect(correoControl?.hasError('email') || correoControl?.hasError('pattern')).toBeTruthy();
      
//       correoControl?.setValue('correo@valido.com');
//       expect(correoControl?.valid).toBeTruthy();
//     });

//     it('debería validar que teléfono solo contenga números', () => {
//       const telefonoControl = component.tercerosFormGroup.get('telefono');
      
//       telefonoControl?.setValue('12345abc');
//       expect(telefonoControl?.hasError('pattern')).toBeTruthy();
      
//       telefonoControl?.setValue('1234567890');
//       expect(telefonoControl?.valid).toBeTruthy();
//     });

//     it('debería validar que código postal solo contenga números', () => {
//       const codigoPostalControl = component.tercerosFormGroup.get('codigoPostal');
      
//       codigoPostalControl?.setValue('12abc');
//       expect(codigoPostalControl?.hasError('pattern')).toBeTruthy();
      
//       codigoPostalControl?.setValue('12345');
//       expect(codigoPostalControl?.valid).toBeTruthy();
//     });
//   });

//   describe('Configuraciones específicas por tipo', () => {
//     it('debería manejar configuración para proveedor', () => {
//       const configProveedor: ConfiguracionModalTerceros = {
//         tipo: TipoTabla.PROVEEDOR,
//         titulo: 'Proveedor',
//         camposRequeridos: ['rfc', 'razonSocial'],
//         mostrarNacionalidad: true,
//         mostrarTipoPersona: true
//       };
      
//       component.configuracion = configProveedor;
//       component.ngOnChanges();
      
//       expect(component.obtenerTitulo()).toBe('Agregar Proveedor');
//     });

//     it('debería manejar configuración para distribuidor', () => {
//       const configDistribuidor: ConfiguracionModalTerceros = {
//         tipo: TipoTabla.DISTRIBUIDOR,
//         titulo: 'Distribuidor',
//         camposRequeridos: ['rfc', 'razonSocial'],
//         mostrarNacionalidad: false,
//         mostrarTipoPersona: true
//       };
      
//       component.configuracion = configDistribuidor;
//       component.ngOnChanges();
      
//       expect(component.mostrarCampo('nacionalidad')).toBeFalsy();
//       expect(component.obtenerTitulo()).toBe('Agregar Distribuidor');
//     });
//   });
// });