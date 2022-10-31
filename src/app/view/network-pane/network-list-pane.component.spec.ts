import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkListPaneComponent } from './network-list-pane.component';

describe('NetworkPaneComponent', () => {
  let component: NetworkListPaneComponent;
  let fixture: ComponentFixture<NetworkListPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkListPaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkListPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
