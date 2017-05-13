'use strict';
// from https://github.com/mithril-components/mithril-node-linechart

// const m = require('mithril');
const h = require('virtual-dom/virtual-hyperscript/svg')

const drawXGrids = (l) => {
	const els = []

	for (let i = 0; i < (l + 1); ++i) {
		els.push(h('line', {
			x1: 10, // Grid X beginning.
			x2: 85, // Grid X ending.
			y1: 45 - (i * 35 / l),
			y2: 45 - (i * 35 / l)
		}))
	}

	return els
}

const drawYGrids = (l) => {
	const els = [];

	for (let i = 0; i < l + 1 ; ++i) {
		els.push(h('line', {
			x1: 10 + (i * 75 / l),
			x2: 10 + (i * 75 / l),
			y1: 10,
			y2: 45
		}))
	}

	return els
}

const drawYLegends = (lines, scale, color, length, i) => {
	const ySize = 35 / (length + 1)
	const elements = lines.length
	const legendSize = (ySize / elements > 2 ? 2 : ySize / elements)

	const els = []

	for (let i = (i >= 1 ? 1 : 0); i < length + 1; ++i) {
		let nb = scale / length * i
		nb = (Number(nb) === nb && nb % 1 === 0 ? nb : parseFloat(scale / length * i).toFixed(1)) // todo
		els.push(h('text', {
			x: 0,
			y: i === 0 ? ((45 - i * ySize) + i * (legendSize * 9 / 10)) : ((45 - i * ySize) - ySize / 3 + i * (legendSize * 9 / 10)),
			fill: color,
			'font-size': legendSize * 9 / 10
		}, nb))
	}

	return els
}

const drawXLegends = (lines, length) => {
	const xSize = 10 + (75 / length)
	const elements = lines.length
	const legendSize = (xSize / elements > 2 ? 2 : xSize / elements)

	const els = []

	for (let i = 0; i < length; ++i) {

		const tmp = []

		for (let l of lines) {
			if (!l.data[i]) continue
			tmp.push({
				label: l.data[i].label.length > 10 ? l.data[i].label.slice(0, 10) + '...' : l.data[i].label,
				color: l.color
			})
		}

		tmp.forEach((value, tI) => {
			const x = 5 + (i * 85 / length) + tI * legendSize
			els.push(h('text', {
				x: x,
				y: 53,
				fill: value.color,
				'font-size': legendSize * 9 / 10,
				style: `transform: rotate(-60deg); transform-origin: ${x}px 53px;`
			}, value.label))
		})
	}

	return els
}

const grapth = (lines) => {
	let total = 0;
	for (let line of lines) {
		if (line.data.length > total) total = line.data.length
	}

	const scales = lines.map((line) => {
		let copy = line.data.slice()
		copy.sort((a, b) => {
			if (a.value > b.value) return 1
			if (a.value < b.value) return -1
			return 0
		})
		return copy.pop().value
	})

	return h('svg', {
		viewBox: '0 0 100 55',
		xmlns: 'http://www.w3.org/2000/svg',
		'xmlns:xlink': 'http://www.w3.org/1999/xlink'
	}, [

		// h('g', {
		// 	stroke: 'black',
		// 	opacity: 0.3,
		// 	'stroke-width': 0.3,
		// 	'stroke-dasharray': '1, 1'
		// }, drawXGrids(total + 1)),

		// h('g', {
		// 	stroke: 'black',
		// 	opacity: 0.3,
		// 	'stroke-width': 0.3,
		// 	'stroke-dasharray': '1, 1'
		// }, drawYGrids(total)),

		h('g', [
			scales.map((scale, i) => {
				return drawYLegends(lines, scale, lines[i].color, total, i)
			})
		]),

		h('g', [
			drawXLegends(lines, total)
		]),

		h('g', [
			lines.map((line, lI) => {
				const scale = scales[lI]
				return h('g', [
					line.data.map((point, pI) => {
						return h('circle', {
						   cx: 10 + (pI * 75 / total),
						   cy: 45 - ((point.value * total / scale) * 35 / (total + 1)),
						   r: 0.7,
						   fill: line.color
						})
					})
				])
			})
		]),

		h('g', {
			'stroke-width': 0.5,
			fill: 'none'
		}, [
			lines.map((line, lI) => {
				let scale = scales[lI]
				return h('polyline', {
					points: line.data
					.map((point, pI) => {
						return 10 + (pI * 75 / total) + ',' + (45 - ((point.value * total / scale) * 35 / (total + 1)));
					})
					.join(' '),
					stroke: line.color,
				});
			})
		]),

		// lines legends
		h('g', [
			lines.map((line, i) => {
				const fontSize = ((30 / lines.length > 2) ? 2 : 30 / lines.length)
				// If the text length is above 7 characters then slice it and add '...'.
				const cutText = line.title.length > 7 ? line.title.slice(0, 7) + '...' : line.title
				return h('g', [
					h('line', {
						x1: 90,
						y1: 12 + (i * fontSize),
						x2: 92,
						y2: 12 + (i * fontSize),
						stroke: line.color,
						'stroke-width': 0.5
					}),
					h('text', {
						x: 93,
						y: 12.5 + (i * fontSize),
						'font-size': fontSize * 9 / 10 + 'px'
					}, cutText)
				])
			})
		])
	])
}

module.exports = grapth
