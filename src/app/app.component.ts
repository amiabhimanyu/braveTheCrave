import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { HomePage } from '../pages/home/home';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DidYouBravePage } from '../pages/did-you-brave/did-you-brave';
import { App } from 'ionic-angular';


import moment from 'moment';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    // rootPage: any = HomePage;
    rootPage: any;
    isSubmit:boolean = false;
    reasonCategory: any[] = ['Emotional', 'Social', 'Withdrawal', 'My personal reason'];
    reason: any[] = [
        {
            cat: 'Emotional',
            name: 'Stressed'
        },
        {
            cat: 'Emotional',
            name: 'Anxious'
        },
        {
            cat: 'Emotional',
            name: 'Excited'
        },
        {
            cat: 'Emotional',
            name: 'Bored'
        },
        {
            cat: 'Emotional',
            name: 'Sad'
        },
        {
            cat: 'Emotional',
            name: 'Happy'
        },
        {
            cat: 'Emotional',
            name: 'Lonely'
        }, {
            cat: 'Social',
            name: 'Saw someone else vaping'
        },
        {
            cat: 'Social',
            name: 'Smelling another vape pen'
        },
        {
            cat: 'Social',
            name: 'Hanging out with friends who vape'
        },
        {
            cat: 'Social',
            name: 'At party or other social event'
        },
        {
            cat: 'Social',
            name: 'Studying with friends'
        },
        {
            cat: 'Social',
            name: 'Offered vape or a new flavor'
        },
        {
            cat: 'Social',
            name: 'Seeing vaping on social media'
        },

        {
            cat: 'Withdrawal',
            name: 'Have the crave to vape'
        },
        {
            cat: 'Withdrawal',
            name: 'Smelling a vape pen'
        },
        {
            cat: 'Withdrawal',
            name: 'Handling a vape pen'
        },
        {
            cat: 'Withdrawal',
            name: 'Needing to do something with your hands or mouth'
        },
        {
            cat: 'Withdrawal',
            name: 'Feeling restless or having other withdrawal symptoms'
        }
    ]
    activity: any = [
        'Chew some gum! Try out a new flavor or stick with your favorite',
        'Suck on a piece of tart candy – Skittles, SweetTarts, and Jolly Ranchers are all good options!',
        'Have something cold, like ice cold water or a popsicle',
        'Pick up a new book – you can either visit the library or select one that is on your bookshelf!',
        'Take a walk: enjoy the weather and get your blood flowing',
        'Call up a friend to chat and catch up',
        'Hang out with friends who don’t vape – catch a movie together, play a game, or get something to eat!',
        'Put your earphones in and listen to your favorite song',
        'Feeling tired? Take a quick cat nap',
        'Watch a movie – is there a film you’ve been meaning to watch?',
        'Get some exercise. Run in place, do jumping jacks, and get in some push-ups',
        'Occupy your mouth by flossing and brushing your teeth',
        'Occupy your hands with a craft or even a fidget spinner!',
        'Spend some quality time with your family',
        'Grab a camera and take some photos of nature, other people, or even yourself!',
        'Play a game: you can try an app, some crosswords puzzles, or sudoku',
        'Is there a sport you’ve always wanted to try? Start learning how to play',
        'Is there a hobby you want to pick up? Channel your thoughts into something constructive',
        'Make a gratitude list – what are you grateful for?',
        'Bake a treat for you and your friends to enjoy later'
    ]
    randomMessage: any = [
        {
            type: 'motivate',
            message: 'Difficult roads lead to beautiful destinations.'
        },
        {
            type: 'motivate',
            message: 'Great work is performed not by strength but by perseverance.'
        },
        {
            type: 'motivate',
            message: 'You never fall until you give up.'
        },
        {
            type: 'motivate',
            message: 'The struggle you are in today is developing the strength you need for tomorrow.'
        },
        {
            type: 'motivate',
            message: 'Let perseverance be your engine and hope your fuel.'
        },
        {
            type: 'keepmind',
            message: '99% of e-cig products sold contain nicotine, which is highly addictive. Nicotine can harm brain development, which continues into the early to mid-20s.'
        },
        {
            type: 'keepmind',
            message: 'Defective, poorly manufactured and improperly modified e-cigarettes have been known to explode and cause injury.'
        },
        {
            type: 'keepmind',
            message: 'E-cigs contain substances, such as delivery solvents and propylene glycol, which can potentially cause dry mouth and upper respiratory infections.'
        },
        {
            type: 'keepmind',
            message: 'The aerosol from e-cigs can contain potentially harmful chemicals, including nicotine; ultrafine particles; volatile organic compounds, and heavy metals.'
        },
        {
            type: 'keepmind',
            message: 'Young people who use e-cigarettes are four times more likely to start smoking cigarettes.'
        },
        {
            type: 'keepmind',
            message: 'Nicotine levels in e-cigarettes are highly variable, with some reaching levels near combustible cigarettes.'
        },
        {
            type: 'keepmind',
            message: 'The amount of nicotine in one standard pod is roughly equal to the amount of nicotine in a pack of cigarettes, or about 200 puffs.'
        },
    ]

    constructor(
        public platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private sqlite: SQLite,
        public localNotifications: LocalNotifications,
        public events: Events,
        private keyboard: Keyboard,
        public app: App,
        public toastCtrl: ToastController) {
        platform.ready().then(() => {
            this.localNotifications.on('click').subscribe(notification => {
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", notification.data)
                console.log("Data:",localStorage.getItem('isSchedule'), localStorage.getItem('currentNotiId'), notification.id)
                setTimeout(() => {
                    if(localStorage.getItem('isSchedule') === 'true' && parseInt(localStorage.getItem('currentNotiId')) === parseInt(notification.id)){
                        localStorage.setItem('isSchedule','');
                        localStorage.setItem('currentNotiId','');
                        this.nav.push(DidYouBravePage,{ data : JSON.stringify(notification.data) })
                    }
                }, 300);
            });

            this.localNotifications.on('trigger').subscribe(notification => {
                // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Trigger", notification.data)
                setTimeout(() => {
                    if(sessionStorage.getItem('isLoaded') === 'true'){
                        localStorage.setItem('isSchedule','');
                        localStorage.setItem('currentNotiId','');
                        this.nav.push(DidYouBravePage,{ data : JSON.stringify(notification.data) })
                    }
                }, 300);
            });

            statusBar.styleLightContent();
            statusBar.backgroundColorByHexString('#036ffc');
            splashScreen.hide();

            this.keyboard.hideFormAccessoryBar(true);

            if (localStorage.getItem('isLoadFirst')) {
                console.log("Inside if");
            }
            else {
                localStorage.setItem('isLoadFirst','true')
                console.log("Inside else")

                let date = moment().format('LL');
                localStorage.setItem('quitDate', date);
                localStorage.setItem('lastVapeDate', date);
                localStorage.setItem('quitReason', '');
                localStorage.setItem('notiId', '0');
                events.publish('LoadFirst', date);
                this.createDB();
                setTimeout(() => {
                    this.insertTable();
                }, 500)
            }


            // this.handleLoaclNotification();

            setTimeout(() => {
                this.rootPage = HomePage;
            }, 200);

            setTimeout(() => {
                sessionStorage.setItem('isLoaded', 'true');
            }, 1000)

            // this.keyboard.onKeyboardWillShow().subscribe(() => {
            //     events.publish('keyboardOpen');
            // });
            // this.keyboard.onKeyboardHide().subscribe(() => {
            //     events.publish('keyboardClose');
            // });


            // Hardware back button handling

            // this.platform.registerBackButtonAction(() => {
            //     // Catches the active view
            //     // let nav = this.app.getActiveNavs()[0];
            //     let activeView = this.nav.getActive();
            //     console.log("Back button click")
            //     console.log(activeView.name, activeView.component.name);
            //     // Checks if can go back before show up the alert
            //     if (activeView.name === 'BraveYesPage') {
            //         this.nav.setRoot(HomePage);
            //     }
            //     else if (activeView.name === 'DidYouBravePage') {
            //         const toast = this.toastCtrl.create({
            //             message: 'Please take an action',
            //             duration: 3000
            //         });
            //         toast.present();
            //     }
            //     else if (activeView.name === 'BraveNoPage') {
            //         if(this.isSubmit){
            //             this.nav.setRoot(HomePage);
            //         }
            //         else{
            //             this.nav.pop();
            //         }
            //     }
            //     else if (activeView.name === 'HomePage') {
            //         this.platform.exitApp();
            //     }
            //     else{
            //         this.nav.pop();
            //     }
            // });

        });
    }

    // handleLoaclNotification() {
    //     this.localNotifications.on('click').subscribe(notification => {
    //         this.nav.push(DidYouBravePage,{ data : JSON.stringify(notification.data) })
    //     })

    //     this.localNotifications.on('trigger').subscribe(notification => {
    //         this.localNotifications.clearAll();
    //         localStorage.setItem('isSchedule','');
    //     })
    // }

    createDB() {
        this.sqlite.create({
            name: 'brave_db.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql('CREATE TABLE IF NOT EXISTS reason_category(id INTEGER PRIMARY KEY AUTOINCREMENT, reason_cat_name VARCHAR(32) NOT NULL UNIQUE,  is_created_by_own VARCHAR(32))', [])
                    .then(() => console.log('reason_category table created...'))
                    .catch(e => console.log('Create table1 Error' + JSON.stringify(e)));

                db.executeSql('CREATE TABLE IF NOT EXISTS reason(id INTEGER PRIMARY KEY AUTOINCREMENT, reason_name VARCHAR(32) NOT NULL UNIQUE, reason_cat_id INTEGER)', [])
                    .then(() => console.log('reason_category table created...'))
                    .catch(e => console.log('Create table1 Error' + JSON.stringify(e)));

                db.executeSql('CREATE TABLE IF NOT EXISTS activity(id INTEGER PRIMARY KEY AUTOINCREMENT, activity_name VARCHAR(32) NOT NULL UNIQUE,  is_created_by_own VARCHAR(32))', [])
                    .then(() => console.log('activity table created...'))
                    .catch(e => console.log('Create table2 Error' + JSON.stringify(e)));

                db.executeSql('CREATE TABLE IF NOT EXISTS activity_schedule(id INTEGER PRIMARY KEY AUTOINCREMENT, reason_id INTEGER, activity_id INTEGER, time VARCHAR(32), is_active VARCHAR(32), created_date VARCHAR(32), schedule_date VARCHAR(32))', [])
                    .then(() => console.log('activity table created...'))
                    .catch(e => console.log('Create table2 Error' + JSON.stringify(e)));

                db.executeSql('CREATE TABLE IF NOT EXISTS activity_schedule_result(id INTEGER PRIMARY KEY AUTOINCREMENT, activity_id INTEGER, reason_id INTEGER, answer VARCHAR(32), created_date VARCHAR(32), time VARCHAR(32), reason_for_give_in VARCHAR(32), last_vape_date VARCHAR(32))', [])
                    .then(() => console.log('activity table created...'))
                    .catch(e => console.log('Create table2 Error' + JSON.stringify(e)));

                db.executeSql('CREATE TABLE IF NOT EXISTS random_message(id INTEGER PRIMARY KEY AUTOINCREMENT, type VARCHAR(32), message VARCHAR(32))', [])
                    .then(() => console.log('activity table created...'))
                    .catch(e => console.log('Create table2 Error' + JSON.stringify(e)));
            })
            .catch(e => console.log('Create Error' + JSON.stringify(e)));
    }

    insertTable() {
        for (let i = 0; i < this.reasonCategory.length; i++) {
            this.sqlite.create({
                name: 'brave_db.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql('INSERT INTO reason_category( reason_cat_name, is_created_by_own) VALUES(?, ?)', [this.reasonCategory[i], 'no']).then(() => { })
                        .catch(e => console.log('Insert Error' + JSON.stringify(e)));
                })
                .catch(e => console.log(e));
        }

        for (let j = 0; j < this.activity.length; j++) {
            this.sqlite.create({
                name: 'brave_db.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql('INSERT INTO activity( activity_name, is_created_by_own) VALUES(?, ?)', [this.activity[j], 'no']).then(() => { })
                        .catch(e => console.log('Insert Error' + JSON.stringify(e)));
                })
                .catch(e => console.log(e));
        }

        for (let reason of this.reason) {
            this.sqlite.create({
                name: 'brave_db.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql('SELECT * FROM reason_category WHERE reason_cat_name=?', [reason.cat]).then((data) => {
                        if (data.rows.length > 0) {
                            let id = data.rows.item(0).id;
                            console.log(id)
                            db.executeSql('INSERT INTO reason( reason_name, reason_cat_id ) VALUES(?, ?)', [reason.name, id]).then(() => { })
                                .catch(e => console.log('Insert Error' + JSON.stringify(e)));
                        }
                    }).catch(e => console.log('Insert Error' + JSON.stringify(e)));
                })
                .catch(e => console.log(e));
        }

        for (let message of this.randomMessage) {
            this.sqlite.create({
                name: 'brave_db.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql('INSERT INTO random_message( message, type) VALUES(?, ?)', [message.message, message.type]).then(() => { })
                        .catch(e => console.log('Insert Error' + JSON.stringify(e)));
                })
                .catch(e => console.log(e));
        }
    }
}


