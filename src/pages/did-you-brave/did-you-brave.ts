import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { BraveYesPage } from '../brave-yes/brave-yes';
import { BraveNoPage } from '../brave-no/brave-no';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import moment from 'moment';

import { Navbar } from 'ionic-angular';
/**
 * Generated class for the DidYouBravePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-did-you-brave',
    templateUrl: 'did-you-brave.html',
})
export class DidYouBravePage {

    @ViewChild(Navbar) navBar: Navbar;

    braveDetails:any;

    public unregisterBackButtonAction: any;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public sqlite: SQLite,
        public toastCtrl: ToastController,
        public platform: Platform) {
    }

    ionViewDidEnter() {
        // console.log('ionViewDidLoad DidYouBravePage');
        // console.log(this.navParams.get('data'))
        // console.log(this.navParams.get('data1'))
        // console.log(this.navParams.get('data2'))
        this.braveDetails = JSON.parse(this.navParams.get('data'));
    }

    ionViewDidLoad(){
        this.setBackButtonAction();
        this.initializeBackButtonCustomHandler();
    }

    ionViewDidLeave() {
        // Unregister the custom back button action for this page
        this.unregisterBackButtonAction && this.unregisterBackButtonAction();
    }

    gotoBraveYes() {
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql('INSERT INTO activity_schedule_result( activity_id, reason_id, answer, created_date, time,  reason_for_give_in, last_vape_date) VALUES(?, ?, ?, ?, ?, ?, ?)', [this.braveDetails.activityID, this.braveDetails.reasonID, 'yes', this.braveDetails.date, this.braveDetails.time, '', '']).then(() => { })
                .catch(e => console.log('Insert Error' + JSON.stringify(e)));
        })
        .catch(e => console.log(e));
        this.navCtrl.push(BraveYesPage);
    }

    gotoBraveNo() { 
        // let date = moment().format('LL');
        // localStorage.setItem('lastVapeDate', date);
        this.navCtrl.push(BraveNoPage, { data : this.navParams.get('data') });
    }

    setBackButtonAction(){
        this.navBar.backButtonClick = () => {
            const toast = this.toastCtrl.create({
                message: 'Please take an action',
                duration: 3000
            });
            toast.present();
        }
    }

    initializeBackButtonCustomHandler() {
        this.unregisterBackButtonAction = this.platform.registerBackButtonAction((event) => {
            const toast = this.toastCtrl.create({
                message: 'Please take an action',
                duration: 3000
            });
            toast.present();
        });
    }  
}
