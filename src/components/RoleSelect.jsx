import { firestore } from "../firebase/firebase";

function RoleSelect({ user, setRole }) {
  const selectRole = async (role) => {
    await firestore.collection('users').doc(user.uid).set({
      role: role, //user role
      email: user.email, //user email
      createdAt: new Date() //when user was made
    });
    setRole(role); //set the role
  };

  return(
    <>
      <div className="p-20">
        <h2>Select your role</h2>

        <button onClick={() => selectRole("worker")}>
          I am a Worker
        </button>

        <button onClick={() => selectRole("manager")}>
          I am a Manager
        </button>

      </div>
    </>
  );
}

export default RoleSelect;