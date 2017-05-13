'use strict'

// const debounce = require('debounce')
const delegator = require('dom-delegator')
const document = require('global/document')
const createElement = require('virtual-dom/create-element')
const diff = require('virtual-dom/diff')
const patch = require('virtual-dom/patch')

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
	state.pending = !state.pending
	rerender()
}

const actions = {setFrom, setTo, setDeparture, setArrival, setLines, search}



const del = delegator()
del.listenTo('submit')
del.listenTo('keypress')
del.listenTo('click')

let tree = render(state, actions)
let root = createElement(tree)
document.body.appendChild(root)

const rerender = () => {
	const newTree = render(state, actions)
	root = patch(root, diff(tree, newTree))
	tree = newTree
}
