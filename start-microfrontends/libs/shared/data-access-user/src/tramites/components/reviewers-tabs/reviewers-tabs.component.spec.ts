import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewersTabsComponent } from './reviewers-tabs.component';
import { CommonModule } from '@angular/common';
import { Component, Type } from '@angular/core';
import { Tabulaciones } from '../../../core/models/lista-trimites.model';

const mockTabs: Tabulaciones[] = [
    { id: '1', titulo: 'Tab 1', disabled: false },
    { id: '2', titulo: 'Tab 2', disabled: false },
    { id: '3', titulo: 'Tab 3', disabled: true }
];
@Component({ template: '' })
class DummyChildComponent { }

describe('ReviewersTabsComponent', () => {
    let component: ReviewersTabsComponent;
    let fixture: ComponentFixture<ReviewersTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, ReviewersTabsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ReviewersTabsComponent);
        component = fixture.componentInstance;
        component.tramite = 123;
        component.listaDeTabulaciones = [];
        component.viewChild = DummyChildComponent as Type<unknown>;
        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debe inicializar listaDeTabulaciones según el trámite', () => {
        component.listaDeTabulaciones = mockTabs;
        expect(component.listaDeTabulaciones.length).toBe(3);
        expect(component.listaDeTabulaciones[0].titulo).toBe('Tab 1');
    });

    it('debe seleccionar la pestaña y emitir el evento', () => {
        const spy = jest.spyOn(component.viewChildcambioDePestana, 'emit');
        component.seleccionaTab(1, mockTabs[1]);
        expect(component.indice).toBe(1);
        expect(spy).toHaveBeenCalledWith(mockTabs[1]);
    });

    it('no debe seleccionar una pestaña deshabilitada', () => {
        component.indice = 0;
        component.seleccionaTab(2, mockTabs[2]);
        expect(component.indice).toBe(0);
    });

    it('debe actualizar las pestañas al cambiar viewChild', () => {
        component.childContainer = {
            clear: jest.fn(),
            createComponent: jest.fn()
        } as any;
        component.viewChild = DummyChildComponent as Type<unknown>;
        component.ngOnChanges({ viewChild: { currentValue: DummyChildComponent } as any });
        expect(component.childContainer.clear).toHaveBeenCalled();
        expect(component.childContainer.createComponent).toHaveBeenCalledWith(DummyChildComponent);
    });

    it('debe renderizar los títulos de las pestañas', () => {
        component.listaDeTabulaciones = mockTabs;
        fixture.detectChanges();
        const tabs = fixture.nativeElement.querySelectorAll('ul.nav-tabs li a');
        expect(tabs.length).toBe(3);
        expect(tabs[0].textContent).toContain('Tab 1');
        expect(tabs[1].textContent).toContain('Tab 2');
        expect(tabs[2].textContent).toContain('Tab 3');
    });
});