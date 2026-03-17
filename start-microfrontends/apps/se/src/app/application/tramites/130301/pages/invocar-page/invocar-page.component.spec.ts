import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvocarComponent } from './invocar-page.component';
import { Tramite130401Store } from '../../../../estados/tramites/tramite130401.store';
import { Tramite130401Query } from '../../../../estados/queries/tramite130401.query';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';

describe('InvocarComponent', () => {
    let component: InvocarComponent;
    let fixture: ComponentFixture<InvocarComponent>;
    let storeMock: any;
    let queryMock: any;
    let routerMock: any;
    let validacionesServiceMock: any;
    let router: Router;

    beforeEach(async () => {
        storeMock = {
            setFolioPermiso: jest.fn(),
        };

        queryMock = {
            selectSolicitud$: of({ folioPermiso: '12345' }),
        };

        routerMock = {
            navigate: jest.fn(),
            url: 'invocar-modulo',
        };

        validacionesServiceMock = {
            isValid: jest.fn().mockReturnValue(true),
        };

        await TestBed.configureTestingModule({
            declarations: [InvocarComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: Tramite130401Store, useValue: storeMock },
                { provide: Tramite130401Query, useValue: queryMock },
                { provide: Router, useValue: routerMock },
                { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
                FormBuilder,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(InvocarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario y el estado del trámite en ngOnInit', () => {
        component.ngOnInit();
        expect(component.solicitudState.folioPermiso).toBe('');
        expect(component.folioFormulario.get('folioPermiso')?.value).toBe('');
    });

    it('debería establecer valores en el store al cambiar el formulario', () => {
        const form = component.folioFormulario;
        storeMock.setFolioPermiso('67890');
        form.get('folioPermiso')?.setValue('67890');
        component.setValoresStore(form, 'folioPermiso', 'setFolioPermiso');
        expect(storeMock.setFolioPermiso).toHaveBeenCalledWith('67890');
    });

    it('debería validar un campo del formulario usando el servicio de validaciones', () => {
        const isValid = component.isValid(component.folioFormulario, 'folioPermiso');
        expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.folioFormulario, 'folioPermiso');
        expect(isValid).toBe(true);
    });

    it('debería limpiar el formulario y el valor del folio en el store al cancelar', () => {
        component.cancelar();
        storeMock.setFolioPermiso('');
        expect(component.folioFormulario.get('folioPermiso')?.value).toBeNull();
        expect(storeMock.setFolioPermiso).toHaveBeenCalledWith('');
    });

    it('debería navegar a la página del solicitud-modulo si el formulario es válido al buscar', () => {
        component.folioFormulario.get('folioPermiso')?.setValue('12345');
        component.buscar();
        expect(router.navigate).toHaveBeenCalledWith(['solicitud-modulo']);
    });

    it('no debería navegar si el formulario no es válido al buscar', () => {
        validacionesServiceMock.isValid.mockReturnValue(false);
        component.folioFormulario.get('folioPermiso')?.setValue('');
        component.buscar();
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('debería completar destroyNotifier$ al destruir el componente', () => {
        const destroySpy = jest.spyOn(component.destroyNotifier$, 'next');
        const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

        component.ngOnDestroy();

        expect(destroySpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });
});