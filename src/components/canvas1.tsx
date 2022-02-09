import React, {
  useState,
  useRef,
  useEffect,
} from 'react'
import Toile from '../lib/toile'

interface ToileFramesContainer {
  [index: string] : Function 
}
let toileFrames : ToileFramesContainer = {}

function toileLoop(){
  for( let f in toileFrames ){
    toileFrames[f]()
  }
  requestAnimationFrame(toileLoop)
}
function toileSubscribe(f: () => void, k: string){
  toileFrames[k] = f
}
function toileUnsubscribe(k: string){
  delete toileFrames[k]
}
toileLoop()

const min = (...els: number[]) => els.reduce((el, min) => el < min ? el : min, els[0])

const Canvas1: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const toile = useRef<Toile | null>(null)
  const angle = useRef(0)
  const points = useRef<{x: number, y: number}[]>([])
  const [radius1, setRadius1 ] = useState(16)
  const [radius2, setRadius2 ] = useState(16)
  const [speed, setSpeed ] = useState(100)
  const [stop, setStop ] = useState(false)
  const toggleStop = () => setStop(!stop)
  const cicle = useRef(false)

  // initialization
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if(ctx){
      const size = min(window.innerWidth - 10, 400, window.innerHeight - 10)
      toile.current = new Toile(ctx, size, size)
    }
  }, [])

  // execution
  useEffect(() => {
    points.current = []
    cicle.current = false
  }, [radius1, radius2])
  useEffect(() => {
    const draw = toile.current
    // initialization
    if(draw){
      draw.Fcol = ''
      draw.origin(draw.ctx.canvas.clientWidth / 2, draw.ctx.canvas.clientHeight / 2)
    }
    // frame
    function frame(){
      if(draw){
        draw.clear()
        draw.Scol = 'blueviolet'
        draw.circle(0, 0, radius1, undefined)

        draw.Scol = 'black'
        const xc2 =Math.cos(angle.current) * radius1 + Math.cos(angle.current) * radius2 
        const yc2 =Math.sin(angle.current) * radius1 + Math.sin(angle.current) * radius2 
        const rotationAngle = angle.current +  angle.current * radius1 / radius2 + Math.PI
          draw.circle(xc2, yc2, radius2, undefined)
        
        draw.Scol = '#ff3333'

        draw.lines(points.current)
        if(stop){
          return
        } 
        if(speed !== 0){
          points.current.push({
            x : xc2 + Math.cos(rotationAngle) * radius2,
            y: yc2 + Math.sin(rotationAngle) * radius2,
          })
        }
        draw.circle(
          xc2 + Math.cos(rotationAngle) * radius2,
          yc2 + Math.sin(rotationAngle) * radius2,
          3,3)
        if(angle.current % ( Math.PI * 2 ) < 0.1){
          // cicle.current = true
        }
        angle.current += speed / 1000
      }
    }
    toileSubscribe(frame, 'canvas1')
  })

  return (
    <div className="canvasContainer">
      <canvas ref={canvas} style={{ backgroundColor : 'white'}}>
      </canvas>
      <div>
        <p className="fw-bold my-1">Controls</p>
        <label>Purple circle radius </label><input type="number" value={radius1} onChange={(e) => setRadius1(parseInt(e.target.value))}/>
        <br/>
        <label>Black circle radius </label><input type="number" value={radius2} onChange={(e) => setRadius2(parseInt(e.target.value))}/>
        <br/>
        <label>Speed </label><input type="number" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))}/>
        <br/>
        <button onClick={toggleStop}>{ stop ? ' pause ': ' play '}</button>
      </div>
    </div>
  )
}
export default Canvas1
