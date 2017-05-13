'use strict'

const h = require('virtual-dom/h')
const debounce = require('debounce')
const ms = require('ms')

const styles = require('./index.css.js')
const renderGraph = require('./graph-2')

const formatTime = (d) => {
	return [
		('0' + d.getUTCHours()).slice(-2),
		('0' + d.getUTCMinutes()).slice(-2)
	].join(':')
}

const renderForm = (state, actions) => {
	return h('form', {
		action: '/',
		className: styles.form + ''
	}, [
		h('input', {
			type: 'text',
			placeholder: 'from (station id)',
			'onchange': debounce((e) => {
				actions.setFrom(e.target.value)
			}, 100),
			value: state.from || ''
		}),
		h('input', {
			type: 'text',
			placeholder: 'to (station id)',
			'onchange': debounce((e) => {
				actions.setTo(e.target.value)
			}, 100),
			value: state.to || ''
		}),
		h('input', {
			type: 'datetime-local',
			placeholder: 'departure date (ISO)',
			'onchange': debounce((e) => {
				actions.setDeparture(e.target.value)
			}, 100),
			value: state.departure ? state.departure.toISOString().slice(0, -1) : ''
		}),
		h('input', {
			type: 'datetime-local',
			placeholder: 'arrival date (ISO)',
			'onchange': debounce((e) => {
				actions.setArrival(e.target.value)
			}, 100),
			value: state.arrival ? state.arrival.toISOString().slice(0, -1) : ''
		}),
		h('input', {
			type: 'text',
			placeholder: 'lines, comma-separated',
			'onchange': debounce((e) => {
				const ls = e.target.value.split(/,\s?/)
				actions.setLines(ls)
			}, 100),
			value: state.lines ? state.lines.join(', ') : ''
		}),
		h('button', {
			type: 'button',
			'onclick': () => {
				actions.search()
			}
		}, state.pending ? 'please wait' : 'lets go')
	])
}

const renderResult = (state, actions) => {
	if (!Array.isArray(state.result)) return null
	if (state.result.length === 0) return h('div', {}, 'no data')

	const data = state.result
	.sort((a, b) => {
		const dA = new Date(a.requestDate)
		const dB = new Date(b.requestDate)
		return dA - dB
	})
	.map((journey) => {
		const d1 = new Date(journey.requestDate)
		const d2 = new Date(journey.trips[0].start)
		return {
			label: ms(d2 - d1),
			value: journey.offer.price
		}
	})

	return renderGraph([
		{title: 'bar', color: '#2980b9', data}
	])
}

const render = (state, actions) => {
	return h('div', {
		className: styles.wrapper + ''
	}, [
		renderForm(state, actions),
		renderResult(state, actions)
	])
}

module.exports = render
