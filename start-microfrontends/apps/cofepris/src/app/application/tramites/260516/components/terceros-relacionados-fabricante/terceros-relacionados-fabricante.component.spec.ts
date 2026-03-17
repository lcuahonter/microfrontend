import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosFabricanteComponent } from './terceros-relacionados-fabricante.component';

describe('TercerosRelacionadosFabricanteComponent', () => {
  let component: TercerosRelacionadosFabricanteComponent;
  let fixture: ComponentFixture<TercerosRelacionadosFabricanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TercerosRelacionadosFabricanteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosFabricanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
