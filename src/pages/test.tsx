import { useGetProjects } from "../api/endpoints/users/users.gen";
import { useEffect, useState } from "react";
import viteLogo from "../assets/vite.svg";
import reactLogo from "../assets/react.svg";

export default function TestPage() {
  const [count, setCount] = useState(0);
  const { data, isLoading, error } = useGetProjects("me");

  useEffect(() => {
    if (data) {
      console.log("Projects data:", data);
      console.log("data.data:", data.data);
      console.log("Error:", error);
    }
  }, [data, error]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      {/* Projects List */}
      <div className="projects-list">
        <h2>Your Projects</h2>
        {isLoading && <p>Loading projects...</p>}
        {error && <p>Error loading projects: {error.message}</p>}
        {data?.data.projects && (
          <ul>
            {data.data.projects.map((project) => (
              <li key={project.id}>
                <h3>{project.name}</h3>
                <p>Repository: {project.repository.url}</p>
                <p>Users: {project.users.length}</p>
                <p>Tasks: {project.tasks.length}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
