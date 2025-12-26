import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { dummyProjects } from "../assets/assets"
import { Loader2Icon } from "lucide-react"
import ProjectPreview from "../components/ProjectPreview"
import type { Project } from "../types"

const View = () => {
  const { projectId } = useParams()
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const project = dummyProjects.find(p => p.id === projectId)

    if (project?.current_code) {
      setCode(project.current_code)
    }

    setLoading(false)
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200" />
      </div>
    )
  }

  if (!code) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Project preview not found
      </div>
    )
  }

  return (
    <div className="h-screen">
      <ProjectPreview
        project={{ current_code: code } as Project}
        isGenerating={false}
        showEditorPanel={false}
      />
    </div>
  )
}

export default View
