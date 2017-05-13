'use strict';
// from https://github.com/mithril-components/mithril-node-linechart

const h = require('virtual-dom/virtual-hyperscript/svg')

const graph = (sets, xProp, yProp) => {
	console.log(sets)
	let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

	for (let items of sets) {
		for (let item of items) {
			const xVal = item[xProp]
			if (xVal < minX) minX = xVal
			if (xVal > maxX) maxX = xVal

			const yVal = item[yProp]
			if (yVal < minY) minY = yVal
			if (yVal > maxY) maxY = yVal
		}
	}

	const deltaX = maxX - minX
	const deltaY = maxY - minY

	const width = 200
	const height = 50
	const project = (xVal, yVal) => ({
		x: width - width * (xVal - minX) / deltaX,
		y: height - height * (yVal - minY) / deltaY
	})

	const isTextAt = {}

	return h('svg', {
		viewBox: `-5 -10 ${width + 10} ${height + 20}`,
		xmlns: 'http://www.w3.org/2000/svg',
		'xmlns:xlink': 'http://www.w3.org/1999/xlink'
	}, [].concat(
		// h('polyline', {
		// 	points: '0,50 200,50',
		// 	stroke: '#888',
		// }),

		sets.map((items) => {
			const line = []
			for (let item of items) {
				const {x, y} = project(item[xProp], item[yProp])
				line.push(x + ',' + y)
			}

			return h('polyline', {
				points: line.join(' '),
				stroke: items[0].color,
				'stroke-width': '.5px',
				fill: 'none'
			})
		}),

		sets.map((items) => {
			return h('g', {}, items.map((item) => {
				const {x, y} = project(item[xProp], item[yProp])
				const drawText = !isTextAt[x + '-' + y]
				isTextAt[x + '-' + y] = true

				return h('g', {}, [
					drawText ? h('text', {
						x, y,
						fill: '#666',
						style: 'font-size: 2px',
						transform: `rotate(-90 ${x} ${y}) translate(1 1)`
					}, item.label) : null,
					h('circle', {
						cx: x,
						cy: y,
						r: .7,
						fill: item.color
					})
				])
			}))
		})
	))
}

module.exports = graph
