import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddbirdPage } from './addbird.page';

describe('AddbirdPage', () => {
  let component: AddbirdPage;
  let fixture: ComponentFixture<AddbirdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbirdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
