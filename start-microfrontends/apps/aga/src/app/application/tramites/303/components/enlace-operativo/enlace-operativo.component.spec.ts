import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnlaceOperativoComponent } from './enlace-operativo.component';
import { provideHttpClient } from '@angular/common/http';

describe('EnlaceOperativoComponent', () => {
    let component: EnlaceOperativoComponent;
    let fixture: ComponentFixture<EnlaceOperativoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EnlaceOperativoComponent],
            providers: [provideHttpClient()]
        }).compileComponents();

        fixture = TestBed.createComponent(EnlaceOperativoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
