import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Project } from '../types'
import { iframeScript } from '../assets/assets'
import EditorPanel from './EditorPanel'

interface ProjectPreviewProps {
  project: Project
  isGenerating: boolean
  device?: 'phone' | 'tablet' | 'desktop'
  showEditorPanel?: boolean
}

export interface ProjectPreviewRef {
  getCode: () => string | undefined
}

const ProjectPreview = forwardRef<
  ProjectPreviewRef,
  ProjectPreviewProps
>(({ project, isGenerating, device = 'desktop', showEditorPanel = true }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [selectedElement, setSelectedElement] = useState<any>(null)

  /* ---------- expose methods to parent ---------- */
  useImperativeHandle(ref, () => ({
    getCode: () => project.current_code,
  }))

  /* ---------- device widths ---------- */
  const resolutions: Record<'phone' | 'tablet' | 'desktop', string> = {
    phone: 'w-[412px]',
    tablet: 'w-[768px]',   
    desktop: 'w-full',
  }

  /* ---------- iframe messages ---------- */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ELEMENT_SELECTED') {
        setSelectedElement(event.data.payload) 
      } else if (event.data?.type === 'CLEAR_SELECTION') {
        setSelectedElement(null)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  /* ---------- update selected element ---------- */
  const handleUpdate = (updates: any) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'UPDATE_ELEMENT',
        payload: updates,
      },
      '*'
    )
  }

  /* ---------- inject editor script ---------- */
  const injectPreview = (html: string) => {
    if (!html) return ''
    if (!showEditorPanel) return html

    return html.includes('</body>')
      ? html.replace('</body>', iframeScript + '</body>')
      : html + iframeScript
  }

  return (
    <div
      className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden
      max-sm:ml-2"
    >
      {project.current_code ? (
        <>
          <iframe
            ref={iframeRef}
            srcDoc={injectPreview(project.current_code)}
            className={`h-full max-sm:w-full ${resolutions[device]} mx-auto transition-all`}
          />

          {showEditorPanel && selectedElement && (
            <EditorPanel
              selectedElement={selectedElement}
              onUpdate={handleUpdate}
              onClose={() => {
                setSelectedElement(null)
                iframeRef.current?.contentWindow?.postMessage(
                  { type: 'CLEAR_SELECTION_REQUEST' }, 
                )
              }}
            />
          )}
        </>
      ) : (
        isGenerating && (
          <div className="flex items-center justify-center h-full text-white">
            Loading…
          </div>
        )
      )}
    </div>
  )
})

ProjectPreview.displayName = 'ProjectPreview'

export default ProjectPreview
