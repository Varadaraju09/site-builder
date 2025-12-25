import React, { useEffect, useState } from 'react'
import type { Project } from '../types'
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dummyProjects } from '../assets/assets'
import Footer from '../components/Footer'

const MyProjects = () => {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>(dummyProjects)
  const navigate = useNavigate()

  const deleteProject = async (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  const wrapPreview = (code: string) => `
<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  ${code}
</body>
</html>
`

  return (
    <>
      <div className="px-4 md:px-16 lg:px-24 xl:px-32">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2Icon className="w-7 h-7 animate-spin text-indigo-200" />
          </div>
        ) : projects.length > 0 ? (
          <div className="pb-10 min-h-[80vh]">
            <div className="flex items-center justify-between pt-4">
              <h1 className="text-2xl font-medium text-white">My Projects</h1>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-white px-6 py-2 rounded bg-gradient-to-br from-indigo-500 to-indigo-600 hover:opacity-90 active:scale-95 transition-all"
              >
                <PlusIcon size={18} /> Create New
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              {projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="relative group w-72 cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden hover:border-indigo-600 transition-all"
                >
                  {/* ===== FIXED PREVIEW ===== */}
                  <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
                    {project.current_code ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <div
                          style={{
                            width: '1200px',
                            height: '800px',
                            transform: 'scale(0.25)',
                            transformOrigin: 'top left',
                          }}
                        >
                          <iframe
                            srcDoc={wrapPreview(project.current_code)}
                            className="w-full h-full border-0 pointer-events-none"
                            sandbox="allow-scripts allow-same-origin"
                            title={`preview-${project.id}`}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No Preview
                      </div>
                    )}
                  </div>

                  {/* ===== CONTENT ===== */}
                  <div className="p-4 text-white">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium line-clamp-2">
                        {project.name}
                      </h2>
                      <span className="px-2 py-0.5 text-xs bg-gray-800 border border-gray-700 rounded-full">
                        Website
                      </span>
                    </div>

                    <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                      {project.initial_prompt}
                    </p>

                    <div
                      onClick={e => e.stopPropagation()}
                      className="flex justify-between items-center mt-6"
                    >
                      <span className="text-xs text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/preview/${project.id}`)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ===== DELETE ===== */}
                  <TrashIcon
                    onClick={e => {
                      e.stopPropagation()
                      deleteProject(project.id)
                    }}
                    className="absolute top-3 right-3 scale-0 group-hover:scale-100 bg-white p-1.5 size-7 rounded text-red-500 cursor-pointer transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-semibold text-gray-300">
              You have no projects yet!
            </h1>
            <button
              onClick={() => navigate('/')}
              className="text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600"
            >
              Create New
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default MyProjects
