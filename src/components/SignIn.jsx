import { auth } from '../firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function SignIn(){
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    await signInWithPopup(auth, provider);
  }

  return(
    <button onClick={signInWithGoogle}>
      Sign In With Google
    </button>
  )
}

export default SignIn;