import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuseResolucionPageComponent } from './acuse-page.component';

describe('AcusePageComponent', () => {
  let component: AcuseResolucionPageComponent;
  let fixture: ComponentFixture<AcuseResolucionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcuseResolucionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcuseResolucionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
