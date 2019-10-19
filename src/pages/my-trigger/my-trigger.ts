import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WhyIGaveInPage } from '../why-i-gave-in/why-i-gave-in';
import { HomePage } from '../home/home';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';


@Component({
    selector: 'page-my-trigger',
    templateUrl: 'my-trigger.html',
})
export class MyTriggerPage {

    allTrigger:any[] = [];
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public sqlite: SQLite) {
    }

    ionViewWillEnter(){
        this.allTrigger = [];
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql(' SELECT reason_id, count(*) AS mycount FROM activity_schedule_result GROUP BY reason_id ORDER BY mycount DESC', []).then((data1) => {
                console.log("Select trigger", data1)
                // this.total = data1.rows.item(0).mycount;

                for (let i = 0; i < data1.rows.length; i++) {
                    console.log(data1.rows.item(i).mycount,data1.rows.item(i).reason_id)

                    db.executeSql('SELECT * from reason WHERE id=?', [data1.rows.item(i).reason_id])
                    .then((data) => {
                        console.log("Select reason",data.rows.length, data)
                        this.allTrigger.push({
                            name : data.rows.item(0).reason_name,
                            count : data1.rows.item(i).mycount
                        })
                    })
                    .catch(e => console.log('Select reason Error' + JSON.stringify(e)));
                }

                setTimeout(() => {
                    console.log(this.allTrigger);
                }, 500)
            }).catch(e => console.log('Select trigger Error' + JSON.stringify(e)));

        })
        .catch(e => console.log(e));
    }

    gotoWhyIGaveIn() {
        this.navCtrl.push(WhyIGaveInPage);
    }

    gotoHome() {
        this.navCtrl.setRoot(HomePage);
    }
}
