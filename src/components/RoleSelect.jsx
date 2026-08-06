import { firestore } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";


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
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-[#1c1c1e] border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">
          Work Tracker
        </h1>

        <h2 className="text-gray-400 mb-2">
          Select your role
        </h2>

        <div className="space-y-4 mb-3">
          <button 
            onClick={() => chooseRole("worker")}
            className="w-full bg-[#2c2d2e] border border-gray-700 rounded-2xl p-6 text-left hover:border-[#ff9500] hover:scale-[1.02] transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-white">
              Worker
            </h2>

            <p className="text-gray-400 mt-2">
              Clock in, track work hours and complete assigned tasks
            </p>
          </button>
        </div>

        <div className="space-y-4">
          <button 
            className="w-full bg-[#2c2d2e] border border-gray-700 rounded-2xl p-6 text-left hover:border-[#ff9500] hover:scale-[1.02] transition cursor-pointer"
            onClick={() => chooseRole("manager")}
          >
            <h2
              className="text-xl font-semibold text-white"
            >
              Manager
            </h2>

            <p className="text-gray-400 mt-2">
              Assign tasks, monitor activity, and manage workers
            </p>
          </button>
        </div>

      </motion.div>
    </div>
  );
}

export default RoleSelect;