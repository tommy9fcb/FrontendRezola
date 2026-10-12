import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

type EscanerDocumentoProps = {
  onCerrar: () => void
}

export default function EscanerDocumento({
  onCerrar,
}: EscanerDocumentoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [resultado, setResultado] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const lector = new BrowserMultiFormatReader()
    let controles: { stop: () => void } | undefined

    async function iniciarEscaner() {
      try {
        controles = await lector.decodeFromConstraints(
          {
            video: {
              facingMode: {
                ideal: 'environment',
              },
            },
            audio: false,
          },
          videoRef.current!,
          (result) => {
            if (!result) {
              return
            }

            const textoDetectado = result.getText()

            setResultado((resultadoActual) => {
              if (resultadoActual) {
                return resultadoActual
              }

              controles?.stop()

              return textoDetectado
            })
          },
        )
      } catch (err) {
        console.error('No se pudo iniciar el escáner:', err)

        setError(
          'No se pudo acceder a la cámara. Verifica los permisos del navegador.',
        )
      }
    }

    iniciarEscaner()

    return () => {
      controles?.stop()
    }
  }, [])

  function cerrarEscaner() {
    onCerrar()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <h2 className="font-bold text-slate-900">
              Escanear documento
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Apunta la cámara hacia el código del documento.
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarEscaner}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200"
            aria-label="Cerrar cámara"
          >
            ×
          </button>
        </div>

        {!resultado && (
          <div className="bg-black p-3">
            <div className="relative overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="aspect-[3/4] w-full object-cover sm:aspect-video"
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-[85%] rounded-xl border-2 border-white/80" />
              </div>
            </div>
          </div>
        )}

        <div className="p-4">

          {!resultado && !error && (
            <p className="text-center text-sm text-slate-500">
              Mantén el código dentro del recuadro.
            </p>
          )}

          {resultado && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Código detectado
              </p>

              <p className="mt-2 break-all font-mono text-sm text-emerald-900">
                {resultado}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={cerrarEscaner}
            className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {resultado ? 'Cerrar' : 'Cancelar'}
          </button>

        </div>
      </div>
    </div>
  )
}