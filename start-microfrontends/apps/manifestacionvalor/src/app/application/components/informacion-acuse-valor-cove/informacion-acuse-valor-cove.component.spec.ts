import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacionAcuseValorCoveComponent } from './informacion-acuse-valor-cove.component';

describe('InformacionAcuseValorCoveComponent', () => {
  let component: InformacionAcuseValorCoveComponent;
  let fixture: ComponentFixture<InformacionAcuseValorCoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionAcuseValorCoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InformacionAcuseValorCoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
