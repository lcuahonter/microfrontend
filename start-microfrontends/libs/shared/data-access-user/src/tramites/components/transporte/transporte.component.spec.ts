import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransporteComponent } from './transporte.component';
import { provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { TransporteDespacho } from '../../../core/models/shared/agregar-transporte.model';

describe('TransporteComponent', () => {
    let component: TransporteComponent;
    let fixture: ComponentFixture<TransporteComponent>;

    beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [TransporteComponent],
        providers: [provideHttpClient(), FormBuilder]
    })
    .compileComponents();
    
        fixture = TestBed.createComponent(TransporteComponent);
        component = fixture.componentInstance;

        // Set required inputs
        component.catalogoTransporte = [
            { id: 1, descripcion: 'Carretero' },
            { id: 2, descripcion: 'Ferroviario' }
        ];

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});