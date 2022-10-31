import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSliderComponent } from './network-slider.component';

describe('NetworkSliderComponent', () => {
  let component: NetworkSliderComponent;
  let fixture: ComponentFixture<NetworkSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
