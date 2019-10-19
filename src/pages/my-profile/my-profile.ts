import { Component } from '@angular/core';
import { NavController, ToastController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyStatsPage } from '../my-stats/my-stats';

import moment from 'moment';
/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-my-profile',
    templateUrl: 'my-profile.html',
})
export class MyProfilePage {

    quitDate: any;
    reason: any;
    minDate:any;
    maxDate:any;

    isKeyboardOpen:boolean = false;
    isInvalid:boolean;
    isInvalidDate:boolean;
    constructor(
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public events: Events) {
            this.minDate = moment().format('YYYY-MM-DD');
            let today = new Date();
            let date = new Date(today.getFullYear() + 100, today.getMonth(), today.getDate())
            // console.log(date)
            this.maxDate = moment(date).format('YYYY-MM-DD');
            // console.log(this.maxDate)

            // events.subscribe('keyboardOpen', () => {
            //     this.isKeyboardOpen = true;
            //     console.log(this.isKeyboardOpen)
            // })

            // events.subscribe('keyboardClose', () => {
            //     this.isKeyboardOpen = false;
            //     console.log(this.isKeyboardOpen)
            // })
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad MyProfilePage');
        let date;
        this.reason = localStorage.getItem('quitReason') ? localStorage.getItem('quitReason') : '';
        date = localStorage.getItem('quitDate') ? moment(localStorage.getItem('quitDate')).format('YYYY-MM-DD') : '';
        // console.log(localStorage.getItem('quitDate'), date)
        this.quitDate = new Date(date).toISOString();
        // console.log(this.quitDate)
    }
    gotohome() {
        this.navCtrl.setRoot(HomePage);
    }

    gotomystats() {
        this.navCtrl.push(MyStatsPage);
    }

    submitDate(){
        // console.log(this.quitDate, this.reason);
        if(this.reason === undefined || this.reason === ''){
            // const toast = this.toastCtrl.create({
            //     message: 'Please enter reason',
            //     duration: 3000
            // });
            // toast.present();
            this.isInvalid = true;
        }
        else if(this.quitDate === undefined){
            // const toast = this.toastCtrl.create({
            //     message: 'Please select date',
            //     duration: 3000
            // });
            // toast.present();

            this.isInvalidDate = true;
        }
        else{
            let date = moment(this.quitDate).format('LL')
            localStorage.setItem('quitDate', date);
            localStorage.setItem('quitReason', this.reason);
            const toast = this.toastCtrl.create({
                message: 'Quit reason and date added successfully',
                duration: 3000
            });
            toast.present();
            // this.reason = '';
            // this.quitDate = '';
        }
    }

    focused(){
        this.isKeyboardOpen = true;
    }

    blured(){
        this.isKeyboardOpen = false;
    }

    checkValid(){
        if(this.reason === undefined || this.reason === ''){
            this.isInvalid = true;
        }
        else{
            this.isInvalid = false;
        }
    }

    checkValidDate(){
        if(this.quitDate === undefined){
            this.isInvalidDate = true;
        }
        else{
            this.isInvalidDate = false;
        }
    }
}
