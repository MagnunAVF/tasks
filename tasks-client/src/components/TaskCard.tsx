import { Task } from "@/interfaces/task";
import { useRouter } from 'next/router';
import { useState } from 'react';

const TaskCard = ({ task, full }: { task: Task, full: boolean}) => {
    const router = useRouter();
    const goToTaskPage = () => {
        router.push(`/tasks/${task.id}`);
    };

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const generateClassname = () => {
        let classname = "bg-white p-4 rounded-lg shadow-md";

        if (!full) {
            classname += " clickable-div"

            isHovered ? classname += " hovered" : classname += "";
        }

        return classname;
    }

    const getAction = (functionToRun: any) => {
        return !full ? functionToRun : () => {};
    }

    return (
        <div className={generateClassname()}
            onMouseEnter={getAction(handleMouseEnter)}
            onMouseLeave={getAction(handleMouseLeave)}
            onClick={getAction(goToTaskPage)}>

            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-2">{task.description}</p>
            {full ?
                (<div>
                    <p className="text-gray-300 text-xs"><strong>ID:</strong> {task.id}</p>
                    <p className="text-gray-300 text-xs"><strong>Created at:</strong> <br/>{task.createdAt.toString()}</p>
                    <p className="text-gray-300 text-xs"><strong>Updated at:</strong> <br/>{task.updatedAt.toString()}</p>
                </div>) :
                false
            }

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