import React, {useState} from 'react'
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

const auth = getAuth(app)
const db = getFirestore(app)

function App() {
  const [user] = useAuthState(auth)

  return (
    <>
      <div>
        <header>
          <h1>⚛️🔥💬</h1>
        </header>

        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
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
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </>
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
  const messagesRef = collection(db, 'messages')
  const queryMsg = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(queryMsg, {idField: 'id'})
  console.log(messages)
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
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={e=>setFormValue(e.target.value)}/>

        <button type="submit">Send</button>

      </form>

      <div>
        <SignOut />
      </div>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid } = props.message
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  return (
      <div>
        {uid}
        {text}
      </div>
  )
}

export default App
