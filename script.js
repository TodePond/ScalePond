

const stage = Stage.make()
const {canvas, context} = stage
stage.tick = () => {}

let scale = 1.0
let position = {x: 0, y: 0}

on.load(() => {
	document.body.appendChild(canvas)
	document.body.style["margin"] = 0
	canvas.style["background-color"] = "rgb(23, 29, 40)"
	canvas.style["image-rendering"] = "pixelated"
})

on.resize(() => {
	canvas.width = innerWidth
	canvas.height = innerHeight
	canvas.style["width"] = innerWidth
	canvas.style["height"] = innerHeight
})

trigger("resize")


let rects = []

const makeRect = (x, y, w, h) => {
	return {x, y, w, h}
}

const addRect = (rect) => {
	rects.push(rect)
}

const removeRects = (rs) => {
	rects = rects.filter(rect => !rs.includes(rect))
}

const createRect = (...args) => {
	const rect = makeRect(...args)
	addRect(rect)
	return rect
}

const getScreenRect = (rect) => {
	const [x, y] = [rect.x*scale + position.x*scale, rect.y*scale + position.y*scale]
	const [w, h] = [rect.w*scale, rect.h*scale]
	return {x, y, w, h}
}

const tick = () => {
	context.fillStyle = "rgb(255, 204, 70)"
	context.clearRect(0, 0, canvas.width, canvas.height)
	for (const rect of rects) {
		const {x, y, w, h} = getScreenRect(rect)
		context.fillRect(x, y, w, h)
	}
	requestAnimationFrame(tick)
}

on.mousewheel((e) => {
	const scaleMod = e.deltaY > 0? 0.9 : 1.1
	scale *= scaleMod
})

on.mousemove((e) => {
	if (!Mouse.Left) return
	position.x += e.movementX / scale
	position.y += e.movementY / scale
})

tick()

scale = 7.5
position.x = 65
position.y = -865

const animateWorld = (x, y, w, speed=(w*w)/5000, delay=0) => {
	const h = w
	let cx = 0
	let cy = 0
	const worldTick = () => {
		for (let t = 0; t < speed; t++) {
			createRect(x+cx, y-cy, 1, 1)
			cx++
			if (cx >= w) {
				rects = rects.slice(0, -w)
				if (cy > 0) rects = rects.slice(0, -1)
				createRect(x, y-cy, w, 1+cy)

				cy++
				cx = 0
			}
			if (cy >= h) break
		}
		
		if (cy < h) {
			setTimeout(worldTick, delay)
		}
	}

	worldTick()

}

const canvasWorld = [0, 1000, 100]
const lazyWorld = [150, 1000, 200]
const pathWorld = [400, 1000, 300]
const dataWorld = [750, 1000, 500]
const invisWorld = [1300, 1000, 1000]
const neighbourWorld = [2350, 1000, 1500]
const wasmWorld = [3900, 1000, 2000]
const gpuWorld = [5950, 1000, 3000]
const laptopWorld = [9750, 1000, 1500]
const desktopWorld = [9000, -500, 3000]
const phoneWorld = [9750, -3500, 1500]

const worlds = [
	canvasWorld, lazyWorld, pathWorld, dataWorld, invisWorld, neighbourWorld, wasmWorld, gpuWorld, laptopWorld, desktopWorld, phoneWorld
]

//animateWorld(...canvasWorld)
//animateWorld(...lazyWorld)
//animateWorld(20, 1000, 100, 100, 0)

on.keydown(e => {
	if (e.key === " ") {
		animateWorld(...worlds[rects.length])
	}
})
