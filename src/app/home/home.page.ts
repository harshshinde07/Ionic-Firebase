import { Component } from '@angular/core';
// import { NavController, ModalController } from 'ionic-angular';
// import { AutocompletePage } from './AutocompletePage';

import * as firebase from 'firebase';

import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray } from '@angular/forms';

import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ToastController } from '@ionic/angular';

import { Locations } from './location';

const config = {
  apiKey: "AIzaSyBHUdSq1koLbZBxa2RjxWxwjI_s_00GUzc",
  authDomain: "sih-maps-location.firebaseapp.com",
  databaseURL: "https://sih-maps-location.firebaseio.com",
  projectId: "sih-maps-location",
  storageBucket: "sih-maps-location.appspot.com",
  messagingSenderId: "1084587570521",
  appId: "1:1084587570521:web:55eee6ef1cd0a025024848"
};

let options: NativeGeocoderOptions = {
  useLocale: true,
  maxResults: 1
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // address;
  lat: number;
  lng: number;
  location: Locations;
  // ref = firebase.database().ref('/locations/');
  // infoForm: FormGroup;


  constructor(private nativeGeocoder: NativeGeocoder, public toastController: ToastController) {

    // this.infoForm = this.formBuilder.group({
    //   'info_title': [null, Validators.required],
    // });

    firebase.initializeApp(config);
    this.getLocationData();
    this.geoCode('Kolhapur');
  }

  // options: NativeGeocoderOptions = {
  //   useLocale: true,
  //   maxResults: 5
  // };
  // place = document.getElementById('placehld').nodeValue;

  geoCode(place: string) {

    this.nativeGeocoder.forwardGeocode(place, options)
      .then((result: NativeGeocoderResult[]) => {
        // console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude)
        this.lat = +result[0].latitude;
        this.lng = +result[0].longitude;
        this.location = new Locations(place, this.lat, this.lng);
        this.presentToast(result[0].latitude, result[0].longitude);
        this.saveInfo();
      })
      .catch((error: any) => console.log(error));
  }

  async presentToast(lat: String, lng: String) {
    const toast = await this.toastController.create({
      message: lat + " " + lng,
      duration: 2000
    });
    toast.present();
  }

  ionViewDidLoad() {
    // this.geoCode("Pune");
    // this.presentToast();
  }

  saveInfo() {
    firebase.database().ref('/locations/' + this.location.name).set({ lat: this.location.lat, lng: this.location.lng });
    // newInfo.set(this.infoForm.value);
  }

  getLocationData() {
    firebase.database().ref('/locations/').once('value').then(function (data) {
      // alert(JSON.stringify(data.val()));
      data.forEach(function (snapshot) {
        console.log('key:' + snapshot.key);
        console.log('lat:' + snapshot.val().lat);
        console.log('lng:' + snapshot.val().lng);
      });
    });
  }

}
