import { useState, useEffect } from 'react';

import { Credentials } from '@/interfaces/credentials';

const Login = () => {
    const [alreadyLogged, setAlreadyLogged] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}');

        const validCredentials = (credentials.username && credentials.password) &&
            (credentials.username !== '' && credentials.password !== '');

        if (validCredentials) {
            setAlreadyLogged(true);
            setUsername(credentials.username);
            setPassword(credentials.password);
        }
    }, []);

    const clearCredentials = () => {
        setAlreadyLogged(false);
        setUsername('');
        setPassword('');

        localStorage.removeItem('credentials');

        window.location.reload();
    }

    const handleSubmit = (e: any) => {
      e.preventDefault();

      const credentials: Credentials = { username, password };

      localStorage.setItem('credentials', JSON.stringify(credentials));

      window.location.reload();
    };

    const generateLoggedMessage = () => {
        return (
            <div className="flex items-center justify-center">
                <p className="text-gray-600 text-center m-5">User already logged!</p>
                <button
                    className="bg-blue-500 hover:bg-green-600 text-white px-4 py-2 rounded my-5 focus:outline-none focus:shadow-outline"
                    type="submit"
                    onClick={clearCredentials}
                >
                    Logout
                </button>
            </div>
        );
    }

    const generateLoginForm = () => {
        return (
          <div className="max-w-md mx-auto mt-8">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="text"
                  placeholder="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-green-600 text-white px-4 py-2 rounded my-5 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        );
    }

    return (
        alreadyLogged ? generateLoggedMessage() : generateLoginForm()
    );
}

export default Login;