'use strict'

const h = require('virtual-dom/h')

const styles = require('./index.css.js')

// const renderBar = require('./bar')
// const renderMap = require('./map')

const result = (state, actions) => {
	return h('div', {}, [])
}

const render = (state, actions) => {
	return h('form', {
		action: '/',
		className: styles.wrapper + ''
	}, [
		h('input', {
			type: 'text',
			placeholder: 'from (station id)',
			'ev-change': (e) => setTimeout(() => {
				actions.setFrom(e.target.value)
			}, 1),
			value: state.from || ''
		}),
		h('input', {
			type: 'text',
			placeholder: 'to (station id)',
			'ev-change': (e) => setTimeout(() => {
				actions.setTo(e.target.value)
			}, 1),
			value: state.to || ''
		}),
		h('input', {
			type: 'datetime-local',
			placeholder: 'departure date (ISO)',
			'ev-change': (e) => setTimeout(() => {
				actions.setDeparture(e.target.value)
			}, 1),
			value: state.departure ? state.departure.toISOString().slice(0, -1) : ''
		}),
		h('input', {
			type: 'datetime-local',
			placeholder: 'arrival date (ISO)',
			'ev-change': (e) => setTimeout(() => {
				actions.setArrival(e.target.value)
			}, 1),
			value: state.arrival ? state.arrival.toISOString().slice(0, -1) : ''
		}),
		h('input', {
			type: 'text',
			placeholder: 'lines, comma-separated',
			'ev-change': (e) => setTimeout(() => {
				const ls = e.target.value.split(/,\s?/)
				actions.setLines(ls)
			}, 1),
			value: state.lines ? state.lines.join(', ') : ''
		}),
		h('button', {
			type: 'button',
			'ev-click': () => {
				actions.search()
			}
		}, state.pending ? 'please wait' : 'lets go'),
		state.result ? result(state, actions) : null
	])
}

module.exports = render
