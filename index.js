'use strict'

const document = require('global/document')
const createElement = require('virtual-dom/create-element')
const diff = require('virtual-dom/diff')
const patch = require('virtual-dom/patch')
const prices = require('db-prices-viz/client')
const ms = require('ms')
const randomColor = require('random-color')

const styles = require('./ui/styles')
const render = require('./ui')



const now = new Date()
now.setUTCMilliseconds(0)
now.setUTCSeconds(0)

const state = {
	from: '',
	to: '',
	departure: now,
	arrival: now,
	lines: null,
	pending: false,
	result: null,
}



const setFrom = (id) => {
	state.from = id
	rerender()
}

const setTo = (id) => {
	state.to = id
	rerender()
}

const setDeparture = (date) => {
	const d = new Date(date)
	if (isNaN(+d)) return
	state.departure = d
	rerender()
}

const setArrival = (date) => {
	const d = new Date(date)
	if (isNaN(+d)) return
	state.arrival = d
	rerender()
}

const setLines = (lines) => {
	const filled = lines.filter((l) => !!l.trim())
	if (filled.length === 0 || lines.length !== filled.length) return
	state.lines = lines
	rerender()
}

const search = () => {
	state.pending = true
	rerender()

	const s = state
	prices(s.from, s.to, s.departure, s.arrival, s.lines)
	.then((s) => {
		s.on('error', console.error)

		const color = randomColor().hexString()
		const journeys = []

		s.on('data', (journey) => {
			const d1 = new Date(journey.requestDate)
			const d2 = new Date(journey.trips[0].start)
			journeys.push({
				dTime: d2 - d1,
				price: journey.offer.price,
				label: ms(d2 - d1) + ' ' + journey.offer.price + '€',
				color
			})
		})
		s.once('end', () => {
			journeys.sort((a, b) => b.dTime - a.dTime)
			state.result.push(journeys)
			state.pending = false
			rerender()
		})
	})
	.catch(console.error)
}

const actions = {setFrom, setTo, setDeparture, setArrival, setLines, search}



let tree = render(state, actions)
let root = createElement(tree)
document.body.appendChild(root)

const rerender = () => {
	const newTree = render(state, actions)
	root = patch(root, diff(tree, newTree))
	tree = newTree
}
