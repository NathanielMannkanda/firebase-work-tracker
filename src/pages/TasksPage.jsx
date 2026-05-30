import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import { firestore } from "../firebase/firebase";

import { auth } from "../firebase/firebase";

import {
  collection,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { motion } from "framer-motion";
motion

function TasksPage({ role }) {

  const [tasks, setTasks] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {

    if (!user) return;

    const tasksRef = collection(
      firestore,
      "tasks"
    );

    let q;

    // manager sees all tasks
    if (role === "manager") {

      q = query(tasksRef);

    } else {

      // worker only sees their tasks
      q = query(
        tasksRef,
        where("assignedTo", "==", user.uid)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        const taskList = [];

        snapshot.forEach((doc) => {

          taskList.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setTasks(taskList);
      }
    );

    return () => unsubscribe();

  }, [user, role]);

  return (
    <DashboardLayout title="Tasks">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">
          All Tasks
        </h2>

        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map((task) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              key={task.id}
              className="bg-[#1c1c1e] p-5 rounded-2xl shadow-sm border border-gray-800 overflow-hidden w-full"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 min-w-0">

                <div className="flex-1 min-w-0">

                  <h3 className="text-xl font-semibold break-words">
                    {task.title}
                  </h3>

                  <p className="text-gray-500 mt-1 break-all">
                    {task.description}
                  </p>

                  <div className="mt-4 space-y-1">
                    <p className="text-sm">
                      Assigned To:{" "}

                      <span className="font-medium">
                        {task.assignedToName}
                      </span>
                    </p>

                    <p>
                      Status:{" "}

                      <span
                        className={
                          task.status === "completed"
                            ? "text-green-600 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {task.status}
                      </span>
                    </p>

                  </div>

                </div>

              </div>
            </motion.div>
          ))
        )}
      </div>

    </DashboardLayout>
  )
}

export default TasksPage;