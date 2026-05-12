import { auth, firebase } from '../firebase/firebase'

function SignIn(){
  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    await auth.signInWithPopup(provider);
  }

  return(
    <button onClick={signInWithGoogle}>
      Sign In With Google
    </button>
  )
}

export default SignIn;