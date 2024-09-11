import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticaService } from 'src/app/authentica.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  constructor(public route : Router, public formBuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthenticaService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
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

  get errorControl(){
    return this.loginForm?.controls;
  }

  async login (){
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if(this.loginForm?.valid){
      const user = await this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).catch((error) =>{
        console.log(error);
        loading.dismiss()
      })

      if(user){
        loading.dismiss()
        this.route.navigate(['/home'])

      }else{
        console.log('provide correct value');
        
      }
    }
  }

}
