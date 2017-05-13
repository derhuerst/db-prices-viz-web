'use strict'

const document = require('global/document')
const createElement = require('virtual-dom/create-element')
const diff = require('virtual-dom/diff')
const patch = require('virtual-dom/patch')
const prices = require('db-prices-viz/client')
// const ms = require('ms')
const randomColor = require('random-color')

const styles = require('./ui/styles')
const render = require('./ui')



const presets = {
	a: {
		from: '8011160', // Berlin
		to: '8000105', // Frankfurt Main
		departure: new Date('2017-02-02T11:02:00'),
		arrival: new Date('2017-02-02T15:37:00'),
		lines: ['ICE 1730', 'ICE 1558']
	},
	b: {
		from: '8011160', // Berlin
		to: '8000261', // München
		departure: new Date('2017-02-14T12:30:00'),
		arrival: new Date('2017-02-14T19:16:00'),
		lines: ['ICE 2301']
	},
	c: {
		from: '8011160', // Berlin
		to: '8002549', // Hamburg
		departure: new Date('2017-03-14T20:42:00'),
		arrival: new Date('2017-03-14T23:23:00'),
		lines: ['ICE 1504']
	}
}

const now = new Date()
now.setUTCMilliseconds(0)
now.setUTCSeconds(0)

const state = {
	from: '',
	to: '',
	departure: now,
	arrival: now,
	lines: null,
	showLabels: true,
	pending: false,
	result: []
}



const setPreset = (id) => {
	if (!presets[id]) return
	Object.assign(state, presets[id])
	rerender()
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

const setShowLabels = (showLabels) => {
	state.showLabels = !!showLabels
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
				label: journey.offer.price + '€',
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

const actions = {
	setPreset,
	setFrom, setTo, setDeparture, setArrival, setLines,
	setShowLabels,
	search
}



let tree = render(state, actions)
let root = createElement(tree)
document.body.appendChild(root)

const rerender = () => {
	const newTree = render(state, actions)
	root = patch(root, diff(tree, newTree))
	tree = newTree
}
