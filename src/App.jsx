import './App.css'

import { useAuthState} from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebase';

import SignIn from './components/SignIn';
import WorkerPage from './pages/WorkerPage';


function App() {

  const [user] = useAuthState(auth);

  return (
    <>
      {/*Check if user is signed in*/}
      <div className='App'>
        <header>
          <h1>Work Tracker</h1>
        </header>

        <section>
          {user ? <WorkerPage /> : <SignIn />}
        </section>

      </div>
    </>
  )
}



export default App
