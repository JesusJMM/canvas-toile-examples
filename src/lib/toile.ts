import type { coordinate2d } from './types'
class Toile {
  ctx : CanvasRenderingContext2D
  Fcol = 'white'
  Scol = 'black'
  Swidth = 1
  width: number
  height: number
  x = 0
  y = 0
  constructor( ctx : CanvasRenderingContext2D, width: number | undefined, height: number | undefined){
    this.ctx = ctx
    if(width) this.ctx.canvas.width = width
    if(height) this.ctx.canvas.height = height
    this.ctx.strokeStyle = this.Scol
    this.ctx.fillStyle = this.Fcol
    this.ctx.lineWidth = this.Swidth
    this.width = ctx.canvas.width
    this.height = ctx.canvas.height
  }
  private stroke() {
    if(this.Scol && this.Swidth){
      if(this.Fcol !== this.ctx.strokeStyle){
        this.ctx.strokeStyle = this.Scol
      }
      if(this.Swidth !== this.ctx.lineWidth){
        this.ctx.lineWidth = this.Swidth
      }
      this.ctx.stroke()
    }
  }
  private fill() {
    if(this.Fcol){
      if(this.Fcol !== this.ctx.fillStyle){
        this.ctx.fillStyle = this.Fcol
      }
      this.ctx.fill()
    }
  }
  private draw() {
    this.stroke()
    this.fill()
  }
  origin(x: number, y: number){
    this.ctx.translate(-this.x, -this.y)
    this.ctx.translate(x, y)
    this.x = x
    this.y = y
  }
  // methods
  clear(fill = ""){
    if(!fill){
      this.ctx.clearRect(-this.x, -this.y, this.width, this.height)
    }else{
      this.ctx.fillStyle=fill
      this.ctx.fillRect(-this.x, -this.y, this.width, this.height)
    }
  }
  point(x: number, y: number){
    this.ctx.beginPath()
    this.ctx.moveTo(x+0.5, y)
    this.ctx.lineTo(x+0.5, y+1)
    this.stroke()
    this.ctx.closePath()
  }
  rect(x: number, y: number, width:number, height:number){
    this.ctx.rect(x, y, width, height)
    this.draw()
  }
  circle(x: number, y: number, radius:number, radiusY: number | undefined){
    this.ctx.beginPath()
    this.ctx.ellipse(x, y, radius, radiusY ?? radius, 0, 0, Math.PI*2)
    this.ctx.closePath()
    this.draw()
  }
  ellipse(x: number, y: number, radiusX:number, radiusY: number, rotation= 0, startAngle = 0, endAngle = Math.PI *2 ){
    this.ctx.beginPath()
    this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
    this.ctx.closePath()
    this.draw()
  }
  line(x1: number, y1: number, x2: number, y2: number){
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.stroke()
    this.ctx.closePath()
  }
  lines(vertices: coordinate2d[]){
    if(vertices.length > 1){
      this.ctx.beginPath()
      this.ctx.moveTo(vertices[0].x, vertices[0].y)
      for(let i = 0; i < vertices.length; i ++){
        this.ctx.lineTo(vertices[i].x, vertices[i].y)
      }
      this.stroke()
      this.ctx.closePath()
    }
  }
}
export default Toile
