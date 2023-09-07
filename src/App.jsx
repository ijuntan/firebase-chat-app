import React, {useRef, useState} from 'react'
import './App.css'

import {initializeApp}from 'firebase/app'
import {getFirestore, collection, query, orderBy, limit, serverTimestamp, addDoc} from 'firebase/firestore'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth' 

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const app = initializeApp({
  apiKey: "AIzaSyAog8quM3rDppja7PwbmbivPh1CHNPHg7g",
  authDomain: "chat-app-94000.firebaseapp.com",
  projectId: "chat-app-94000",
  storageBucket: "chat-app-94000.appspot.com",
  messagingSenderId: "399819046034",
  appId: "1:399819046034:web:6047799fd386773751ba4b",
  measurementId: "G-TZ691GQWYT"
})
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)

function App() {
  const [user] = useAuthState(auth)

  return (
    <>
      <div>
        <header>
          <h1>Firebase 💬</h1>
          {user ? <SignOut /> : null}
        </header>

        
          {user ? <section><ChatRoom /> </section>: <SignIn />}
        
      </div>
    </>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  return (
    <div className='signIn'>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(db, 'messages')
  const queryMsg = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(queryMsg, {idField: 'id'})

  const [formValue, setFormValue] = useState('') 

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>
      
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={e=>setFormValue(e.target.value)}/>

        <button type="submit">Send</button>

      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
  )
}

export default App
