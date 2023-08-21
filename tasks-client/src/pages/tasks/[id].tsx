import { GetServerSideProps } from 'next';
import Link from "next/link"
import { Inter } from 'next/font/google'

import { Task } from '@/interfaces/task';
import TaskCard from '@/components/TaskCard';

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
  return (
    <main className={`flex-grow p-4 ${inter.className}`}>
        <h3 className="text-2xl font-bold mb-5">Task View</h3>

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
}> = async ({ req, res }) => {
  let errorMessage: String = "";
  let task: Task|null = null;

  const id = req.url?.replace("/tasks/", "") ?? "0";

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
