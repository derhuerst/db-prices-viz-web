'use strict'

const document = require('global/document')
const createElement = require('virtual-dom/create-element')
const diff = require('virtual-dom/diff')
const patch = require('virtual-dom/patch')
const prices = require('db-prices-viz/client')

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

		const prices = []
		s.on('data', (price) => {
			prices.push(price)
		})
		s.once('end', () => {
			state.result = prices
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
