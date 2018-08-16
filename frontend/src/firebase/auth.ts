import * as firebase from 'firebase/app'
import { auth } from './firebase';

const provider = new firebase.auth.GoogleAuthProvider()

provider.addScope('https://www.googleapis.com/auth/userinfo.email')

export const signInWithGoogle = () => auth.signInWithPopup(provider)
