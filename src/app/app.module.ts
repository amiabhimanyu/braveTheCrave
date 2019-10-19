import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BraveTheCravePage } from '../pages/brave-the-crave/brave-the-crave';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { LearnToQuitPage } from '../pages/learn-to-quit/learn-to-quit';
import { ResourcesPage } from '../pages/resources/resources';
import { MyStatsPage } from '../pages/my-stats/my-stats';
import { MyTriggerPage } from '../pages/my-trigger/my-trigger';
import { WhyIGaveInPage } from '../pages/why-i-gave-in/why-i-gave-in';
import { ActivityListPage } from '../pages/activity-list/activity-list';
import { SetTimerPage } from '../pages/set-timer/set-timer';
import { DidYouBravePage } from '../pages/did-you-brave/did-you-brave';
import { BraveYesPage } from '../pages/brave-yes/brave-yes';
import { BraveNoPage } from '../pages/brave-no/brave-no';
import { AddActivityPage } from '../pages/add-activity/add-activity';
import { AddReasonPage } from '../pages/add-reason/add-reason';

import { SQLite } from '@ionic-native/sqlite';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Keyboard } from '@ionic-native/keyboard';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BraveTheCravePage,
    MyProfilePage,
    LearnToQuitPage,
    ResourcesPage,
    MyStatsPage,
    MyTriggerPage,
    WhyIGaveInPage,
    ActivityListPage,
    SetTimerPage,
    DidYouBravePage,
    BraveYesPage,
    BraveNoPage,
    AddActivityPage,
    AddReasonPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { pageTransition: 'ios-transition' })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BraveTheCravePage,
    MyProfilePage,
    LearnToQuitPage,
    ResourcesPage,
    MyStatsPage,
    MyTriggerPage,
    WhyIGaveInPage,
    ActivityListPage,
    SetTimerPage,
    DidYouBravePage,
    BraveYesPage,
    BraveNoPage,
    AddActivityPage,
    AddReasonPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    AppAvailability,
    InAppBrowser,
    WheelSelector,
    LocalNotifications,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
