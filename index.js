'use strict'

// const debounce = require('debounce')
// const delegator = require('dom-delegator')
const document = require('global/document')
const createElement = require('virtual-dom/create-element')
const diff = require('virtual-dom/diff')
const patch = require('virtual-dom/patch')
// const vbb = require('vbb-client')
// const scrollIntoView = require('scroll-into-view')

const styles = require('./ui/styles')
const render = require('./ui')



const state = {
}



const foo = (bar) => {
	rerender()
}

const actions = {
	foo
}



// delegator().listenTo('submit')

let tree = render(state, actions)
let root = createElement(tree)
document.body.appendChild(root)

const rerender = () => {
	const newTree = render(state, actions)
	root = patch(root, diff(tree, newTree))
	tree = newTree
}
