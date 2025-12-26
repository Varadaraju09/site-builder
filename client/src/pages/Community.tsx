import { useEffect, useState } from 'react'
import type { Project } from '../types'
import { Loader2Icon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { dummyProjects } from '../assets/assets'
import Footer from '../components/Footer'

const Community = () => {
  const [loading, setLoading] = useState(true)
  const [projects] = useState<Project[]>(dummyProjects)
  const navigate = useNavigate()

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
              <h1 className="text-2xl font-medium text-white">
                Published Projects
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              {projects.map(project => (
                <Link
                  key={project.id}
                  to={`/view/${project.id}`}
                  target="_blank"
                  className="w-72 bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden hover:border-indigo-600 transition-all"
                >
                  {/* Preview */}
                  <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
                    {project.current_code ? (
                      <div className="w-full h-full overflow-hidden">
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
                            sandbox="allow-scripts"
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

                  {/* Content */}
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

                    <div className="flex justify-between items-center mt-6">
                      <span className="text-xs text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>

                      <button className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md flex items-center gap-2">
                        <span className="bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center">
                          {project.user?.name?.slice(0, 1)}
                        </span>
                        {project.user?.name}
                      </button>
                    </div>
                  </div>
                </Link>
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

export default Community
