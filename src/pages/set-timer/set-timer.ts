import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DidYouBravePage } from '../did-you-brave/did-you-brave';

import { WheelSelector } from '@ionic-native/wheel-selector';
import { LocalNotifications } from '@ionic-native/local-notifications';

import moment from 'moment';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

@Component({
    selector: 'page-set-timer',
    templateUrl: 'set-timer.html',
})
export class SetTimerPage {

    minute: number = 5;
    displayMinute : number = 5;
    sec: number = 0;
    minuteText: any = '05';
    secondTest: any = '00';

    isStart: boolean = false;

    notiID:any;
    timer:any;


    jsonData = {
        numbers: [
            { description: "1" },
            { description: "2" },
            { description: "3" },
            { description: "4" },
            { description: "5" },
            { description: "6" },
            { description: "7" },
            { description: "8" },
            { description: "9" },
            { description: "10" },
            { description: "11" },
            { description: "12" },
            { description: "13" },
            { description: "14" },
            { description: "15" },
            { description: "16" },
            { description: "17" },
            { description: "18" },
            { description: "19" },
            { description: "20" },
            { description: "21" },
            { description: "22" },
            { description: "23" },
            { description: "24" },
            { description: "25" },
            { description: "26" },
            { description: "27" },
            { description: "28" },
            { description: "29" },
            { description: "30" },
            { description: "31" },
            { description: "32" },
            { description: "33" },
            { description: "34" },
            { description: "35" },
            { description: "36" },
            { description: "37" },
            { description: "38" },
            { description: "39" },
            { description: "40" },
            { description: "41" },
            { description: "42" },
            { description: "43" },
            { description: "44" },
            { description: "45" },
            { description: "46" },
            { description: "47" },
            { description: "48" },
            { description: "49" },
            { description: "50" },
            { description: "51" },
            { description: "52" },
            { description: "52" },
            { description: "54" },
            { description: "55" },
            { description: "56" },
            { description: "57" },
            { description: "58" },
            { description: "59" }]
    };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private selector: WheelSelector,
        private localNotifications: LocalNotifications,
        public sqlite: SQLite) {
        console.log(parseInt(navParams.get('categoryID')))
        console.log(parseInt(navParams.get('reasonID')))
        console.log(parseInt(navParams.get('activityID')))
        // this.isStart = localStorage.getItem('isSchedule') ? true : false;
    }

    ionViewWillEnter() {
        this.isStart = localStorage.getItem('isSchedule') === 'true' ? true : false;
    }

    gotoBrave() {
        this.navCtrl.push(DidYouBravePage);
    }

    startTimer() {
        console.log(this.minute)
        if (this.minute === undefined) {
            console.log(this.minute);
        }
        else {
            if (this.minute > 0) {

                let data = moment().format('MM/DD/YY');
                let time = moment().format('hh:mm A');
                let braveDetails;
                let today = new Date();
                let date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes() + this.minute, today.getSeconds());

                braveDetails = {
                    categoryID : this.navParams.get('categoryID'),
                    reasonID : this.navParams.get('reasonID'),
                    activityID : this.navParams.get('activityID'),
                    date : data,
                    time : time
                };

                this.sqlite.create({
                    name: 'brave_db.db',
                    location: 'default'
                })
                .then((db: SQLiteObject) => {
                    db.executeSql('INSERT INTO activity_schedule( reason_id, activity_id, time, is_active, created_date, schedule_date) VALUES(?, ?, ?, ?, ?, ?)', [braveDetails.reasonID, braveDetails.activityID, braveDetails.time, 'yes', braveDetails.date, braveDetails.date]).then(() => { })
                    .catch(e => console.log('Insert Error' + JSON.stringify(e)));
                })
                .catch(e => console.log(e));
                this.notiID = Math.ceil(Math.random() * 10);
                localStorage.setItem('currentNotiId', this.notiID);
                this.localNotifications.schedule({
                    id: this.notiID,
                    title: 'Brave the crave',
                    text: 'Time is over',
                    // at: date,
                    trigger: {at: date},
                    data: braveDetails
                });
                console.log(this.notiID);

                localStorage.setItem('isSchedule','true');
                this.isStart = true;
                this.sec = 59;
                this.minute = this.minute - 1;
                this.secondTest = this.sec;
                if (this.minute < 10) {
                    this.minuteText = '0' + this.minute;
                }
                else {
                    this.minuteText = this.minute;
                }

                this.timer = setInterval(() => {
                    if (this.sec === 0 && this.minute === 0) {
                        // this.sec = 0;
                        // this.minute = 0;
                        clearInterval(this.timer);
                        this.isStart = false;
                        // this.navCtrl.push(DidYouBravePage, { data : braveDetails });
                    }
                    else if (this.sec === 0 && this.minute > 0) {
                        this.sec = 59;
                        this.minute--;
                        this.secondTest = this.sec;
                        if (this.minute < 10) {
                            this.minuteText = '0' + this.minute;
                        }
                        else {
                            this.minuteText = this.minute;
                        }
                    }
                    else if (this.sec > 0) {
                        this.sec--;
                        if (this.sec < 10) {
                            this.secondTest = '0' + this.sec;
                        }
                        else {
                            this.secondTest = this.sec;
                        }
                    }
                }, 1000)
            }
        }
    }

    selectANumber() {
        this.selector.show({
            title: "Select minute",
            items: [
                this.jsonData.numbers
            ],
        }).then(
            result => {
                console.log(result[0].description + ' at index: ' + result[0].index);
                this.minute = parseInt(result[0].description);
                this.displayMinute = parseInt(result[0].description);
                if (this.minute > 9) {
                    this.minuteText = this.minute;
                }
                else {
                    this.minuteText = '0' + this.minute;
                }
            },
            err => console.log('Error: ', err)
        );
    }

    cancleTimer(){
        clearInterval(this.timer);
        this.isStart = false;

        this.minute = 5;
        this.displayMinute = 5;
        this.sec = 0;
        this.minuteText = '05';
        this.secondTest = '00';
        console.log("Noti id", localStorage.getItem('currentNotiId'))
        this.localNotifications.cancel(localStorage.getItem('currentNotiId'));
        localStorage.setItem('currentNotiId','');
    }
}
