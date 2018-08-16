import * as firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyBFv7kOLF-0kedjBLCxkaes-NElanNY8jg',
  authDomain: 'sert-invite.firebaseapp.com',
  databaseURL: 'https://sert-invite.firebaseio.com',
  projectId: 'sert-invite',
  storageBucket: 'sert-invite.appspot.com',
  messagingSenderId: '217678875066',
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const auth = firebase.auth()

export { auth }
