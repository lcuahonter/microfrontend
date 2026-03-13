import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcusePageComponent } from './acuse-page.component';

describe('AcusePageComponent', () => {
  let component: AcusePageComponent;
  let fixture: ComponentFixture<AcusePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcusePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcusePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
