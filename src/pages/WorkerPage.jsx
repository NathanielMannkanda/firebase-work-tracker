import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { auth, firestore } from "../firebase/firebase";
import { motion } from "framer-motion";


import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

function WorkerPage() {

  const [activeSession, setActiveSession] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("");
  const [tasks, setTasks] = useState([]);

  const user = auth.currentUser;

  //check if worker is alr working/clocked in
  useEffect(() => {

    if (!user) return;

    const sessionsRef = collection(
      firestore,
      "workSessions"
    );

    const q = query(
      sessionsRef,
      where("userId", "==", user.uid),
      where("status", "==", "active")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      if (!snapshot.empty) {

        const sessionDoc = snapshot.docs[0];

        setActiveSession({
          id: sessionDoc.id,
          ...sessionDoc.data()
        });

      } else {

        setActiveSession(null);
      }
    });

    return () => unsubscribe();

  }, [user]);

  //Clock in
  const handleClockIn = async () => {
    try {
      const sessionData = {
        userId: user.uid,
        userName: user.displayName,
        status: "active",
        clockIn: new Date(),
        clockOut: null
      };

      const sessionsRef = collection(
        firestore,
        "workSessions"
      );

      const q = query(
        sessionsRef,
        where("userId", "==", user.uid),
        where("status", "==", "active")
      );

      const existingSession = await getDocs(q);

      if (!existingSession.empty) {
        alert("You already have an active session.");
        return;
      }

      const docRef = await addDoc(
        collection(firestore, "workSessions"),
        sessionData
      );

      setActiveSession({
        id: docRef.id,
        ...sessionData
      });

    } catch (error) {
      console.log(error)
    }
  }

  //Clock out 
  const handleClockOut = async () => {
    try {
      const sessionRef = doc(
        firestore,
        "workSessions",
        activeSession.id
      );

      await updateDoc(sessionRef, {
        status: "completed",
        clockOut: new Date()
      });

      setActiveSession(null);

    } catch (error) {
      console.log(error)
    }
  }

  //Task completion checker
  const handleCompleteTask = async (taskId) => {
    try {
      const taskRef = doc(
        firestore,
        "tasks",
        taskId
      );

      await updateDoc(taskRef, {
        status: "completed"
      });
    } catch (error) {
      console.log(error);
    }
  }

  //for clearing tasks
  const handleClearTask = async (taskId) => {
    try {
      const taskRef = doc(
        firestore,
        "tasks",
        taskId
      );

      await updateDoc(taskRef, {
        clearedByWorker: true
      });
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (!activeSession?.clockIn) {
      // eslint-disable-next-line
      setElapsedTime(`${elapsedTime}`);
      return;
    }

    const updateTimer = () => {

      const clockInTime =
        activeSession.clockIn.seconds
          ? activeSession.clockIn.seconds * 1000
          : new Date(activeSession.clockIn).getTime();

      const now = Date.now();

      const difference = now - clockInTime;

      const hours = Math.floor(
        difference / (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (difference % (1000 * 60 * 60))
        / (1000 * 60)
      );

      const seconds = Math.floor(
        (difference % (1000 * 60))
        / 1000
      );

      setElapsedTime(
        `${hours}h ${minutes}m ${seconds}s`
      );
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [activeSession]);

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(
      firestore,
      "tasks"
    );

    const q = query(
      tasksRef,
      where("assignedTo", "==", user.uid),
      where("clearedByWorker", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = [];

      snapshot.forEach((doc) => {
        taskList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  //animations
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  // eslint-disable-next-line
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <DashboardLayout title="Worker Dashboard">

      <div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >

        {/* STATUS CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1c1c1e] p-6 rounded-2xl shadow-sm h-50">

          <h3 className="text-lg font-semibold mb-4">
            Work Status
          </h3>

          {!activeSession ? (

            <div>

              <p className="text-gray-500 mb-4">
                You are currently off duty
              </p>

              <button
                onClick={handleClockIn}
                className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer"
              >
                Clock In
              </button>

            </div>

          ) : (

            <div>

              <p className="text-green-600 font-medium mb-4">
                Currently Working
              </p>

              <button
                onClick={handleClockOut}
                className="bg-red-500 text-white px-4 py-2 rounded-xl cursor-pointer"
              >
                Clock Out
              </button>

            </div>

          )}

        </motion.div>

        {/* HOURS CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1c1c1e] p-6 rounded-2xl shadow-sm h-50">

          <h3 className="text-lg font-semibold mb-2">
            Time Spent Working
          </h3>

          <p className="text-3xl font-bold">
            {elapsedTime}
          </p>

        </motion.div>

        {/* TASKS CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1c1c1e] p-6 rounded-2xl shadow-sm md:col-span-3">

          <h3 className="text-xl font-semibold mb-6">
            Assigned Taks
          </h3>

          {tasks.length === 0 ? (
            <p className="text-3xl font-bold">
              No assigned tasks
            </p>
          ) : (
            <div className="flex-1 min-w-0">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 overflow-hidden"
                >
                  <div className="flex-1 min-w-0">

                    <h4 className="font-semibold break-words">
                      {task.title}
                    </h4>

                    <p className="text-gray-500 break-all">
                      {task.description}
                    </p>

                    <p className="mt-2 text-sm">
                      Status:{" "}

                      <span
                        className={
                          task.status === "completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {task.status}
                      </span>
                    </p>

                  </div>

                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-black text-white px-4 py-2 rounded-xl w-full md:w-auto"
                    >
                      Complete
                    </button>
                  )}

                  {task.status === "completed" && (
                    <button
                      onClick={() => handleClearTask(task.id)}
                      className="cursor-pointer bg-[#ff9f0a] px-4 py-2 rounded-xl w-full md:w-auto"
                    >
                      Clear
                    </button>
                  )}
                </div>

              ))}
            </div>
          )}

        </motion.div>

      </div>

    </DashboardLayout>
  );
}

export default WorkerPage