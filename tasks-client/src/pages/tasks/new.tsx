import { useState } from 'react';
import Link from "next/link"
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google'

import { NewTask } from '@/interfaces/task';
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

export default function NewPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const goToHomePage = () => {
    router.push('/');
  };

  const handleCreateTask = async (newTask: NewTask) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_API_URL}/tasks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        }
      );
      if (res.status === 201) {
        goToHomePage();
      } else {
        throw new Error();
      }
    } catch (error) {
        setErrorMessage("Error creating task!");
    }
  };

  return (
    <main className={`flex-grow p-4 ${inter.className}`}>
        <h3 className="text-2xl font-bold mb-5">Task View</h3>

        {errorMessage !== '' ?
            generateErrorMessage(errorMessage) :
            (<TaskForm onSave={handleCreateTask} update={false} task={null}/>)
        }

        <div className="mt-5">
            <Link href="/">Go to Home</Link>
        </div>
    </main>
  )
}
