import { firestore } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";


function RoleSelect({ user, setRole }) {
  const chooseRole = async (selectRole) => {
    try{
      //reference to user doc
      const userRef = doc(firestore,"users", user.uid);

      //saves data to firestore
      await setDoc(userRef, {
        role: selectRole,
        email: user.email,
        name: user.displayName,
        createdAt: new Date()
      });

      //update app state instantly
      setRole(selectRole);
    }catch(error){
      console.log(error)
    }
  }

  return(
    <>
      <div className="p-20">
        <h2>Select your role</h2>

        <button onClick={() => chooseRole("worker")}>
          Worker
        </button>

        <button onClick={() => chooseRole("manager")}>
          Manager
        </button>

      </div>
    </>
  );
}

export default RoleSelect;