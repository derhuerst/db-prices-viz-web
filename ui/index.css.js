'use strict'

const css = require('csjs')

const styles = css `
.wrapper {
	margin: 1rem auto;
	padding: 0 1rem;
	height: 100%;
	text-align: center;
}
.form {
	margin: 0 auto;
	max-width: 30rem;
}

.grid {
	display: flex;
}
.grid .cell {
	flex-basis: 50%;
	margin-left: .25rem;
	margin-right: .25rem;
}
.grid .cell.left {
	margin-left: 0;
}
.grid .cell.right {
	margin-right: 0;
}
`

module.exports = styles
