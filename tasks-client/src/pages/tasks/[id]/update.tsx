import { useState } from 'react';
import Link from "next/link"
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google'
import { GetServerSideProps } from 'next';

import { NewTask, UpdateTask } from '@/interfaces/task';
import TaskForm from '@/components/TaskForm';

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'experimental-edge';

function generateErrorMessage(errorMessage: String) {
  return (
    <section className="mt-4 flex justify-center items-center">
      <p className="text-gray-600 text-center m-5">{errorMessage}</p>
    </section>
  )
}

export default function UpdatePage({ task } : { task: UpdateTask }) {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const goToHomePage = () => {
    router.push('/');
  };

  const handleUpdateTask = async (newTask: NewTask) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_API_URL}/tasks/${task?.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        }
      );
      if (res.status === 200) {
        goToHomePage();
      } else {
        throw new Error();
      }
    } catch (error) {
        setErrorMessage("Error updating task!");
    }
  };

  return (
    <main className={`flex-grow p-4 ${inter.className}`}>
        <h3 className="text-2xl font-bold mb-5">Update Task</h3>

        {errorMessage !== '' ?
            generateErrorMessage(errorMessage) :
            (<TaskForm onSave={handleUpdateTask} update={true} task={task}/>)
        }

        <div className="mt-5">
            <Link href={`/tasks/${task?.id}`}>Go Back</Link>
        </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<{
  task: UpdateTask|null,
}> = async (context) => {
    let task: UpdateTask|null = null;
    try {
      const { query } = context;
      const { id, title, description, done } = query;

      if (!id || !title || !description || !done) {
        throw new Error("Invalid task attributes.");
      } else {
        task = {
          id: parseInt(id?.toString() || ""),
          title: title?.toString() || "",
          description: description?.toString() || "",
          done: done?.toString() === "true",
        }
      }
    } catch (error) {
      console.log(error);

      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return { props: { task } };
}
