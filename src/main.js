// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase'
import App from './App'
import router from './router'
import vuelidate from 'vuelidate'

import store from '@/store'

import AppDate from '@/components/AppDate'

Vue.component('AppDate', AppDate)
Vue.use(vuelidate)

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // Shorthad for store: store
  template: '<App/>',
  components: { App }
  // whenever we need to run code on every page we can use the root instance (main.js file)
})
