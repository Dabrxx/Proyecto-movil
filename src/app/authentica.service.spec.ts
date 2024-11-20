import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class AuthenticaService {

  constructor(
    private ngFireAuth: AngularFireAuth,
    private angularFireDatabase: AngularFireDatabase,
  ) { }

  async registerUser(email: string, password: string, fullname: string): Promise<any> {
    try {
      // Registro del usuario en Firebase Authentication
      const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);

      // Obtener el UID del usuario recién creado
      const uid = userCredential.user?.uid;

      if (uid) {
        // Registrar al usuario en Firebase Realtime Database
        await this.angularFireDatabase.object(`users/${uid}`).set({
          displayName: fullname,
          email: email,
        });
      }

      return userCredential;
    } catch (error) {
      throw error; // Pasar el error al `SignUpUseCase` para manejarlo
    }
  }

  async updateUserProfile(uid: string, displayName: string, email: string): Promise<void> {
    try {
      await this.angularFireDatabase.object(`users/${uid}`).update({
        displayName: displayName,
        email: email,
      });
    } catch (error) {
      throw error;
    }
  }

  async loginUser (email:string, password:string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }

  async resetPassword(email:string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }

  async signOut() {
    return await this.ngFireAuth.signOut()
  }

  async getProfile() {
    const user = await this.ngFireAuth.currentUser;
    if (user && !user.displayName) {
      console.warn('El displayName no está configurado en Firebase');
    }
    return user;
  }
}
