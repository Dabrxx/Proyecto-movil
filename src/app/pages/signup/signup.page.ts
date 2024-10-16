import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticaService } from 'src/app/authentica.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  regForm: FormGroup;

  constructor(public formBuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthenticaService, public router : Router, public toastController:ToastController) { }

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

  async signUp (){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if(this.regForm?.valid){
      const user = await this.authService.registerUser(this.regForm.value.email, this.regForm.value.password, this.regForm.value.fullname).catch((error) =>{
        console.log(error);
        this.presentToast('Este correo ya está registrado.')
        loading.dismiss()
      })

      if(user){
        loading.dismiss()
        this.router.navigate(['/home'])

      }else{
        console.log('provide correct value')
        
      }
    } else {
      loading.dismiss()
      this.presentToast('Formulario inválido, Por favor, llene los campos correctamente.')
    }
  }

}
