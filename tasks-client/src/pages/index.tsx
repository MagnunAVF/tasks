import { GetServerSideProps } from 'next';
import Link from "next/link"
import { Inter } from 'next/font/google'

import { Task } from '@/interfaces/task';
import TaskCard from '@/components/TaskCard';

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'experimental-edge';

function generateTaskCards(tasks: Task[]) {
  return (
    <section className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} full={false}/>
      ))}
    </section>
  )
}

function generateErrorMessage(errorMessage: String) {
  return (
    <section className="mt-4 flex justify-center items-center">
      <p className="text-gray-600 text-center m-5">{errorMessage}</p>
    </section>
  )
}

function generateNoTasksMessage() {
  return (
    <section className="mt-4 flex justify-center items-center">
      <p className="text-gray-600 text-center m-5">No tasks found!</p>
    </section>
  )
}

export default function HomePage({ tasks, errorMessage }: { tasks: Task[], errorMessage: String}) {
  return (
    <main className={`flex-grow p-4 ${inter.className}`}>
        <h3 className="text-2xl font-bold">Tasks List</h3>

        <Link href="/tasks/new">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded my-5 focus:outline-none focus:shadow-outline">
            New
          </button>
        </Link>

        {
          errorMessage !== "" ?
            generateErrorMessage(errorMessage) :
            (tasks.length > 0 ? generateTaskCards(tasks) : generateNoTasksMessage())
        }
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<{
  tasks: Task[]
}> = async () => {
  let errorMessage: String = "";
  let tasks: Task[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BFF_API_URL}/tasks`);
    if (res.status !== 200) {
      throw new Error();
    } else {
      const respBody = await res.json();
      tasks = respBody.data;
    }
  } catch (error) {
    errorMessage = "Error getting tasks";
  }

  return { props: { tasks, errorMessage } };
}
