import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Events, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

import { Navbar } from 'ionic-angular';
import moment from 'moment';

/**
 * Generated class for the BraveNoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-brave-no',
    templateUrl: 'brave-no.html',
})
export class BraveNoPage {

    @ViewChild(Navbar) navBar: Navbar;

    inputReason:any;
    keepMind:any;

    isKeyboardOpen:boolean = false;
    isInvalid:boolean;

    isSubmit:boolean = false;
    public unregisterBackButtonAction: any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public sqlite: SQLite,
        public events: Events,
        public platform: Platform) {

            // events.subscribe('keyboardOpen', () => {
            //     this.isKeyboardOpen = true;
            //     console.log(this.isKeyboardOpen)
            // })

            // events.subscribe('keyboardClose', () => {
            //     this.isKeyboardOpen = false;
            //     console.log(this.isKeyboardOpen)
            // })
    }

    gotoHome() {
        this.navCtrl.setRoot(HomePage);
    }

    ionViewDidLeave(){
        this.unregisterBackButtonAction && this.unregisterBackButtonAction();
    }

    ionViewDidLoad(){
        this.setBackButtonAction();
        this.initializeBackButtonCustomHandler();
    }

    ionViewWillEnter(){
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql('SELECT * from random_message WHERE type=? ORDER BY RANDOM() LIMIT 1', ['keepmind'])
                .then((data) => {
                    this.keepMind = data.rows.item(0).message;
                })
                .catch(e => console.log('Select Error' + JSON.stringify(e)));
        })
        .catch(e => console.log(e));
    }

    submitReason() {
        if(this.inputReason === undefined || this.inputReason === ''){
            // const toast = this.toastCtrl.create({
            //     message: 'Please enter reason',
            //     duration: 3000
            // });
            // toast.present();
            this.isInvalid = true;
        }
        else{
            let braveDetails = JSON.parse(this.navParams.get('data'));
            console.log('Dtls', braveDetails)
            console.log(braveDetails.activityID, braveDetails.reasonID, 'no', braveDetails.date, braveDetails.time, this.inputReason, braveDetails.date)
            this.sqlite.create({
                name: 'brave_db.db',
                location: 'default'
            })
            .then((db: SQLiteObject) => {
                db.executeSql('INSERT INTO activity_schedule_result( activity_id, reason_id, answer, created_date, time, reason_for_give_in, last_vape_date) VALUES(?, ?, ?, ?, ?, ?, ?)', [braveDetails.activityID, braveDetails.reasonID, 'no', braveDetails.date, braveDetails.time, this.inputReason, braveDetails.date]).then(() => { 
                    const toast = this.toastCtrl.create({
                        message: 'Reason successfully added.',
                        duration: 3000
                    });
                    toast.present();
                    this.inputReason = '';
                    // this.setBackButtonAction();
                    this.isSubmit = true;
                    let date = moment().format('LL');
                    localStorage.setItem('lastVapeDate', date);
                    this.navCtrl.setRoot(HomePage);

                    // this.events.publish('submitReason', 'true');
                })
                .catch(e => console.log('Insert Error' + JSON.stringify(e)));
            })
            .catch(e => console.log(e));
        }
    }

    focused(){
        this.isKeyboardOpen = true;
    }

    blured(){
        this.isKeyboardOpen = false;
    }

    checkValid(){
        if(this.inputReason === undefined || this.inputReason === ''){
            this.isInvalid = true;
        }
        else{
            this.isInvalid = false;
        }
    }

    setBackButtonAction(){
        this.navBar.backButtonClick = () => {
            if(this.isSubmit){
                this.navCtrl.setRoot(HomePage);
            }
            else{
                this.navCtrl.pop();
            }
        }
    }

    initializeBackButtonCustomHandler() {
        this.unregisterBackButtonAction = this.platform.registerBackButtonAction((event) => {
            if(this.isSubmit){
                this.navCtrl.setRoot(HomePage);
            }
            else{
                this.navCtrl.pop();
            }
        });
    }  
}
