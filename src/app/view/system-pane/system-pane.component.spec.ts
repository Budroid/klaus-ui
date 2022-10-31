import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPaneComponent } from './system-pane.component';

describe('SystemPaneComponent', () => {
  let component: SystemPaneComponent;
  let fixture: ComponentFixture<SystemPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemPaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
