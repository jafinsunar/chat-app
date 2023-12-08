import { useRef, useState } from 'react'

import './App.css'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import 'firebase/analytics';
import {useAuthState, useSignInWithGoogle} from 'react-firebase-hooks/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';




firebase.initializeApp({
  apiKey: "AIzaSyBUWrZwfGP71t6kONrHjYSOLWyQDGUVOzc",
  authDomain: "react-chat-app-1eb14.firebaseapp.com",
  projectId: "react-chat-app-1eb14",
  databaseURL : "https://react-chat-app-1eb14.firebaseio.com",
  storageBucket: "react-chat-app-1eb14.appspot.com",
  messagingSenderId: "155464821119",
  appId: "1:155464821119:web:41766bb3a9a7c59915d24a",
  measurementId: "G-WTYTT5T672"
})


const auth = firebase.auth();

const firestore = firebase.firestore();

function App() {


  const [user] =  useAuthState(auth);


  return (
    <>
    <div className="App">
    <header>
      <h1>Let's talk</h1>
      <SignOut/>
    </header>

    <section>
      {user ? <ChatRoom/> : <SignIn/>}
    </section>
    </div>
    </>
  )
}

function SignIn() {

  const SignInWithGoogle = () => {
     const provider = new firebase.auth.GoogleAuthProvider();
     auth.signInWithPopup(provider);
  }


  return(
    <>
    <button className='sign-in' onClick={SignInWithGoogle}>Sign In with Google</button>
    <p className='hangout'>HangOut together #HaveFun</p>
    </>
  )


}

function SignOut() {


  return auth.currentUser && (
    <button className='sign-out' onClick={ () => auth.signOut()}>SignOut</button>
   
  )

}

function ChatRoom() {


  const dummy = useRef();

  const  messageRef  =  firestore.collection('message');

  const query = messageRef.orderBy('createdAt').limit(1500);
  const [message]= useCollectionData(query, {idField : 'id'})

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {

    e.preventDefault();

    const {uid ,photoURL} = auth.currentUser;

    await messageRef.add({
      text : formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')

    dummy.current.scrollIntoView({behaviour : 'smooth'});


  }
  return(
    <>
    <main>
    {message && message.map(msg => <ChatMessage key = {msg.id} message ={msg}/> )}
    <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} placeholder='Type something' />


    <button type='submit' disabled={!formValue} >GO</button>
    
    

    </form>
    </>
  )
}

// this has to print message
function ChatMessage(props){

  const {text, uid, photoURL} =props.message; 

  // i will be defining the class.....sent or received
  // According to send or received ... I can use CSS

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(
    <>
    
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>




    </div>
    </>
  )

}

export default App;