import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestediframeComponent } from './nestediframe.component';

describe('NestediframeComponent', () => {
  let component: NestediframeComponent;
  let fixture: ComponentFixture<NestediframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NestediframeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestediframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
