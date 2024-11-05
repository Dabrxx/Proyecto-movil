import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { IonicStorageModule } from '@ionic/storage-angular';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        AngularFireModule,
        AngularFireAuthModule,
        AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient(), provideFirebaseApp(() => initializeApp({"projectId":"ionicbiodiversity","appId":"1:500256860315:web:f5653dfd7f20cac0a7fe3e","databaseURL":"https://ionicbiodiversity-default-rtdb.firebaseio.com","storageBucket":"ionicbiodiversity.appspot.com","apiKey":"AIzaSyBG_25O92h-ZWRYCwI6NUhRdnBYYN5r4t4","authDomain":"ionicbiodiversity.firebaseapp.com","messagingSenderId":"500256860315"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideFirebaseApp(() => initializeApp({"projectId":"ionicbiodiversity","appId":"1:500256860315:web:f5653dfd7f20cac0a7fe3e","databaseURL":"https://ionicbiodiversity-default-rtdb.firebaseio.com","storageBucket":"ionicbiodiversity.firebasestorage.app","apiKey":"AIzaSyBG_25O92h-ZWRYCwI6NUhRdnBYYN5r4t4","authDomain":"ionicbiodiversity.firebaseapp.com","messagingSenderId":"500256860315"}))],
  bootstrap: [AppComponent],
})
export class AppModule {}
