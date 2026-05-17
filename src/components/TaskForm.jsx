import { useState  } from "react";

import { 
  collection,
  addDoc,
  serverTimestamp
 } from "firebase/firestore";

import { firestore } from "../firebase/firebase";

function TaskForm({ workers }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  const handleCreateTask = async (e) => {

    e.preventDefault();

    if (!selectedWorker){
      alert("please select a worker");
      return;
    }

    const workData = workers.find(
      (worker) => worker.id === selectedWorker
    );

    try {
      await addDoc(
        collection(firestore, "tasks"),
        {
          title,
          description,
          assinedTo: selectedWorker,
          assinedToName: workData.name,
          status: "pending",
          createdAt: serverTimestamp()
        }
      );

      setTitle("");
      setDescription("");
      setSelectedWorker("");

    }catch(error){
      console.log(error);
    }
  };

  return (
    <form
    onSubmit={handleCreateTask}
    className="bg-white p-6 rounded-2xl shadow-sm border min-w-100 max-w-200"
    >
      <h2 className="text-2xl font-bold mb-6">
        Create Task
      </h2>

      <div className="space-y-4">

        <input 
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-xl p-3 h-28"
        />

        <select
          value={selectedWorker}
          onChange={(e) => setSelectedWorker(e.target.value)}
          className="w-full borer rounded-xl p-3"
        >
          <option value="">
            Select Worker
          </option>

          {workers.map((worker) => (
            <option
              key={worker.id}
              value={worker.id}>
              {worker.name}
            </option>

          ))}

        </select>

        <button
          type="submit"
          className="bg-black text-white px-4 py-3 rounded-xl w-full hover:opacity-90"
        >
          Create Task
        </button>

      </div>

    </form>
  )
}

export default TaskForm;