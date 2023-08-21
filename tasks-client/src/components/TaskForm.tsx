import { useState } from 'react';

import { NewTask, Task } from "@/interfaces/task";

const TaskForm = ({ onSave, update, task }:
    { onSave: any, task: Task|null, update: boolean}) => {

    const [title, setTitle] = useState(update ? task?.title ?? '' : '');
    const [description, setDescription] = useState(update ? task?.description ?? '' : '');
    const [done, setDone] = useState(update ? task?.done ?? false : false);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const newTask: NewTask = {
            title,
            description,
            done,
        };

        onSave(newTask);

        if (!update) {
            setTitle('');
            setDescription('');
            setDone(false);
        }
    };

    return (
      <div className="max-w-md mx-auto mt-8">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Task title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Task description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="done">
              Done
            </label>
            <input
              className="mr-2 leading-tight"
              id="done"
              type="checkbox"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded my-5 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              { update ? "Update" : "Create" } Task
            </button>
          </div>
        </form>
      </div>
    );
}

export default TaskForm;