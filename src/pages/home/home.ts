import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
//import { BraveTheCravePage } from '../brave-the-crave/brave-the-crave';
import { MyProfilePage } from '../my-profile/my-profile';
import { ResourcesPage } from '../resources/resources';
import { BraveTheCravePage } from '../brave-the-crave/brave-the-crave';
import { LearnToQuitPage } from '../learn-to-quit/learn-to-quit';
//import { ResourcesPage } from '../resources/resources';
//import { LearnToQuitPage } from '../learn-to-quit/learn-to-quit';

import moment from 'moment';
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    quitDate:any;
    quitReason:any;
    vapeFree:any;

    isReasonPresent:boolean = false;
    constructor(
        public navCtrl: NavController,
        public events: Events) {
        events.subscribe('LoadFirst', (date) => {
            this.quitDate = date;
            let lastVape = localStorage.getItem('lastVapeDate');
            let date1 = moment().format('YYYY, MM, DD');
            let date2 = moment(lastVape).format('YYYY, MM, DD');
            var a = moment(date1);
            var b = moment(date2);
            // console.log(a.diff(b, 'days'), date1, date2)
            this.vapeFree = a.diff(b, 'days');
        })
    }
    ionViewWillEnter(){
        this.quitDate = localStorage.getItem('quitDate');
        this.quitReason = localStorage.getItem('quitReason');
        if(localStorage.getItem('quitReason')){
            this.isReasonPresent = true;
        }
        let lastVape = localStorage.getItem('lastVapeDate');
        let date1 = moment().format('YYYY, MM, DD');
        let date2 = moment(lastVape).format('YYYY, MM, DD');
        var a = moment(date1);
        var b = moment(date2);
        // console.log(a.diff(b, 'days'), date1, date2)
        this.vapeFree = a.diff(b, 'days');
    }

    gotomyprofile() {
        this.navCtrl.push(MyProfilePage);
    }

    gotoresources() {
        this.navCtrl.push(ResourcesPage);
    }

    gotobravethecrave() {
        this.navCtrl.push(BraveTheCravePage);
    }
    gotolearnquit() {
        this.navCtrl.push(LearnToQuitPage);
    }

    ionViewDidLoad() {
        let data = moment().format('MM/DD/YY');
        let time = moment().format('hh:mm A');
        console.log('today is: ', data + ' and time: ', time);
    }
}
