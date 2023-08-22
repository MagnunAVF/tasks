import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import { Inter } from 'next/font/google';

import { Task } from '@/interfaces/task';
import TaskCard from '@/components/TaskCard';
import { generateAuthToken } from '@/utils/auth';

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'experimental-edge';

function generateErrorMessage(errorMessage: String) {
  return (
    <section className="mt-4 flex justify-center items-center">
      <p className="text-gray-600 text-center m-5">{errorMessage}</p>
    </section>
  )
}

export default function ViewPage({ task, errorMessage }: { task: Task, errorMessage: String}) {
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/');
  };

  const goToUpdatePage = () => {
    router.push({
      pathname: `/tasks/${task.id}/update`,
      query: {
        title: task.title,
        description: task.description,
        done: task.done,
      },
    });
  };

  useEffect(() => {
    const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}');

    const validCredentials = (credentials.username && credentials.password) &&
      (credentials.username !== '' && credentials.password !== '');

    if (!validCredentials) {
      window.location.href = '/';
    }
  }, []);

  const deleteTask = async (task: Task) => {
    try {
      const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}');
      const token = generateAuthToken(credentials);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_API_URL}/tasks/${task.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        throw new Error();
      }

      goToHomePage();
    } catch (error) {
      console.log();
      goToHomePage();
    }
  }

  return (
    <main className={`flex-grow p-4 ${inter.className}`}>
        <h3 className="text-2xl font-bold mb-5">Task View</h3>

        <div>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded my-5 focus:outline-none focus:shadow-outline"
            onClick={goToUpdatePage}>
            Update
          </button>

          <button
            className="bg-red-500 hover:bg-yellow-600 text-white px-4 py-2 rounded my-5 ml-5 focus:outline-none focus:shadow-outline"
            onClick={async () => await deleteTask(task)}>
            Delete
          </button>
        </div>

        {
          errorMessage !== "" ?
            generateErrorMessage(errorMessage) :
            (<TaskCard task={task} full={true}/>)
        }

        <div className="mt-5">
          <Link href="/">Go to Home</Link>
        </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<{
  task: Task|null,
}> = async (context) => {
  let errorMessage: String = "";
  let task: Task|null = null;

  const { query } = context;
  const { id } = query;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BFF_API_URL}/tasks/${id}`);
    if (res.status === 404) {
        errorMessage = "Task Not Found";
    } else if (res.status !== 200) {
      throw new Error();
    } else {
      const respBody = await res.json();
      task = respBody.data;
    }
  } catch (error) {
    errorMessage = "Error getting tasks";
  }

  return { props: { task, errorMessage } };
}
