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
		h('button', {
			type: 'button',
			'onclick': () => actions.setPreset('a')
		}, 'preset A'),
		h('button', {
			type: 'button',
			'onclick': () => actions.setPreset('b')
		}, 'preset B'),
		h('button', {
			type: 'button',
			'onclick': () => actions.setPreset('c')
		}, 'preset C'),
		h('div', {className: styles.grid + ''}, [
			h('input', {
				type: 'text',
				className: styles.cell + ' ' + styles.left,
				placeholder: 'from (station id)',
				'onchange': debounce((e) => {
					actions.setFrom(e.target.value)
				}, 100),
				value: state.from || ''
			}),
			h('input', {
				type: 'text',
				className: styles.cell + ' ' + styles.right,
				placeholder: 'to (station id)',
				'onchange': debounce((e) => {
					actions.setTo(e.target.value)
				}, 100),
				value: state.to || ''
			})
		]),
		h('div', {className: styles.grid + ''}, [
			h('input', {
				type: 'datetime-local',
				className: styles.cell + ' ' + styles.left,
				placeholder: 'departure date (ISO)',
				'onchange': debounce((e) => actions.setDeparture(e.target.value), 100),
				value: state.departure ? state.departure.toISOString().slice(0, -1) : ''
			}),
			h('input', {
				type: 'datetime-local',
				className: styles.cell + ' ' + styles.right,
				placeholder: 'arrival date (ISO)',
				'onchange': debounce((e) => actions.setArrival(e.target.value), 100),
				value: state.arrival ? state.arrival.toISOString().slice(0, -1) : ''
			})
		]),
		h('div', {className: styles.grid + ''}, [
			h('input', {
				type: 'text',
				className: styles.cell + ' ' + styles.left,
				placeholder: 'lines, comma-separated',
				'onchange': debounce((e) => {
					const ls = e.target.value.split(/,\s?/)
					actions.setLines(ls)
				}, 100),
				value: state.lines ? state.lines.join(', ') : ''
			}),
			h('button', {
				type: 'button',
				className: styles.cell + ' ' + styles.right,
				'onclick': () => {
					actions.search()
				}
			}, state.pending ? 'please wait…' : 'lets go')
		]),
		h('input', {
			type: 'checkbox',
			checked: !!state.showLabels,
			'onchange': debounce((e) => {
				actions.setShowLabels(e.target.checked)
			}, 100)
		})
	])
}

const renderResult = (state, actions) => {
	if (!Array.isArray(state.result)) return null
	if (state.result.length === 0) return h('div', {}, 'no data')

	return renderGraph(state.result, 'dTime', 'price', state.showLabels)
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
