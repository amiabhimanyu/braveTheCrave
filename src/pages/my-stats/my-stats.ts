import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyTriggerPage } from '../my-trigger/my-trigger';
import { HomePage } from '../home/home';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

/**
 * Generated class for the MyStatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-my-stats',
    templateUrl: 'my-stats.html',
})
export class MyStatsPage {

    total:number = 0;
    yesTotal:number = 0;
    noTotal: number = 0;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public sqlite: SQLite) {
    }

    ionViewWillEnter(){
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql(' SELECT count(*) AS mycount FROM activity_schedule_result', []).then((data1) => {
                // console.log("Data", data1)
                this.total = data1.rows.item(0).mycount;
            }).catch(e => console.log('Insert Error' + JSON.stringify(e)));

            db.executeSql(' SELECT count(*) AS mycount FROM activity_schedule_result WHERE answer=?', ['yes']).then((data2) => {
                // console.log("Data", data2)
                this.yesTotal = data2.rows.item(0).mycount;
            }).catch(e => console.log('Insert Error' + JSON.stringify(e)));

            db.executeSql(' SELECT count(*) AS mycount FROM activity_schedule_result WHERE answer=?', ['no']).then((data3) => {
                // console.log("Data", data3)
                this.noTotal = data3.rows.item(0).mycount;
            }).catch(e => console.log('Insert Error' + JSON.stringify(e)));
        })
        .catch(e => console.log(e));
    }

    gotoMyTrigger() {
        this.navCtrl.push(MyTriggerPage);
    }

    gotoHome() {
        this.navCtrl.setRoot(HomePage);
    }
}
