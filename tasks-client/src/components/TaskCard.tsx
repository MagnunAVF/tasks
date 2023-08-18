import { Task } from "@/interfaces/task";

const TaskCard = ({ task }: { task: Task}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-2">{task.description}</p>
            <p className="text-gray-300 text-xs">Created at: <br/>{task.createdAt.toString()}</p>
            <p className="text-gray-300 text-xs">Updated at: <br/>{task.updatedAt.toString()}</p>

            <div className="flex mt-2 w-full">
                {task.done ?
                    (<span className="bg-green-500 text-white px-2 py-1 rounded-full">
                        DONE
                    </span>) :
                    (<span className="bg-red-500 text-white px-2 py-1 rounded-full">
                        NOT DONE
                    </span>)
                }
            </div>
        </div>
    );
};

export default TaskCard;