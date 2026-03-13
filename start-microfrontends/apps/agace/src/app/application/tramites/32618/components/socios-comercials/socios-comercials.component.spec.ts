import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SociosComercialsComponent } from './socios-comercials.component';

describe('SociosComercialsComponent', () => {
  let component: SociosComercialsComponent;
  let fixture: ComponentFixture<SociosComercialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociosComercialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SociosComercialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
