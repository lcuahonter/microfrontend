import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutorizarRequerimientoComponent } from './autorizar-requerimiento.component';

describe('AutorizarRequerimientoComponent', () => {
  let component: AutorizarRequerimientoComponent;
  let fixture: ComponentFixture<AutorizarRequerimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorizarRequerimientoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutorizarRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
