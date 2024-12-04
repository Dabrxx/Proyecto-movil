import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirdDetailsPage } from './bird-details.page';

describe('BirdDetailsPage', () => {
  let component: BirdDetailsPage;
  let fixture: ComponentFixture<BirdDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
