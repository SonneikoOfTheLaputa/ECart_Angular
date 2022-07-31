import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuAfterLoginComponent } from './nav-menu-after-login.component';

describe('NavMenuAfterLoginComponent', () => {
  let component: NavMenuAfterLoginComponent;
  let fixture: ComponentFixture<NavMenuAfterLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavMenuAfterLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavMenuAfterLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
