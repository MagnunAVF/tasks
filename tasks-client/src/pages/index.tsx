import { GetServerSideProps } from 'next';
import { Inter } from 'next/font/google'

import { Task } from '@/interfaces/task';
import TaskCard from '@/components/TaskCard';

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'experimental-edge';

export default function Home({ tasks }: { tasks: Task[]}) {
  return (
    <main className={`flex-grow p-4 ${inter.className}`}>
        <section className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <h3 className="text-2xl font-bold">Tasks List</h3>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Create</button>
        </section>

        <section className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </section>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<{
  tasks: Task[]
}> = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BFF_API_URL}/tasks`);
  const respBody = await res.json();
  const tasks = respBody.data;

  return { props: { tasks } };
}
