import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticaService } from 'src/app/authentica.service';
import { ToastController } from '@ionic/angular';
import { SignUpUseCase } from 'src/app/use-cases/signup.usecase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  regForm: FormGroup;

  constructor(public formBuilder:FormBuilder,
              public loadingCtrl: LoadingController,
              public authService:AuthenticaService,
              public router : Router,
              public toastController:ToastController,
              private signUpUseCase: SignUpUseCase) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fullname :['', [Validators.required]],
      email :['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"),
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}")
      ]]

    })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'top'
    });
    toast.present();
  }
  
  get errorControl(){
    return this.regForm?.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm?.valid) {
      const { email, password, fullname } = this.regForm.value;
      const result = await this.signUpUseCase.executeSignUp(email, password, fullname);
      loading.dismiss();

      if (result.success) {
        this.router.navigate(['/home']);
      } else {
        this.presentToast(result.message);
      }
    } else {
      loading.dismiss();
      this.presentToast('Formulario inválido, Por favor, llene los campos correctamente.');
    }
  }


}
