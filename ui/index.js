'use strict'

const h = require('virtual-dom/h')
const ms = require('ms')

const styles = require('./index.css.js')
const renderGraph = require('./graph')

const result = (state, actions) => {
	if (state.result.length === 0) return h('div', {}, 'no data')

	const data = state.result.map((journey) => {
		const d1 = new Date(journey.requestDate)
		const d2 = new Date(journey.trips[0].start)
		return {
			label: ms(d2 - d1),
			value: journey.offer.price
		}
	})

	return h('div', {}, [
		renderGraph([
			{title: 'bar', color: '#2980b9', data}
		])
	])
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
