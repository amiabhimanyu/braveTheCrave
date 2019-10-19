import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

/**
 * Generated class for the WhyIGaveInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-why-i-gave-in',
    templateUrl: 'why-i-gave-in.html',
})
export class WhyIGaveInPage {

    allList:any[] = [];
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public sqlite: SQLite) {
    }

    gotohome() {
        this.navCtrl.setRoot(HomePage);
    }

    ionViewWillEnter(){
        this.allList = [];
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql(' SELECT * from activity_schedule_result WHERE answer=? ORDER BY id DESC', ['no']).then((data1) => {
                console.log("Select activity res", data1)
                // this.total = data1.rows.item(0).mycount;
                for (let i = 0; i < data1.rows.length; i++) {
                    // console.log(data1.rows.item(i).mycount,data1.rows.item(i).reason_id)

                    db.executeSql('SELECT * from activity WHERE id=?', [data1.rows.item(i).activity_id])
                    .then((data) => {
                        console.log("Select activity",data.rows.length, data)
                        this.allList.push({
                            name : data.rows.item(0).activity_name,
                            date : data1.rows.item(i).created_date,
                            time : data1.rows.item(i).time,
                            why : data1.rows.item(i).reason_for_give_in
                        })
                    })
                    .catch(e => console.log('Select activity Error' + JSON.stringify(e)));
                }

                setTimeout(() => {
                    console.log(this.allList);
                }, 500)
            }).catch(e => console.log('Select activity res Error' + JSON.stringify(e)));

        })
        .catch(e => console.log(e));
    }
}
