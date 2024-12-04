import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BirdDetailsPageRoutingModule } from './bird-details-routing.module';

import { BirdDetailsPage } from './bird-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BirdDetailsPageRoutingModule
  ],
  declarations: [BirdDetailsPage]
})
export class BirdDetailsPageModule {}
