import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import './styles.css'

const { func, any } = PropTypes


////////////////////////////////////////////////////////////////////////////////
// Requirements
//
// Make this work like a normal <select><option/></select>

class Select extends React.Component {
  static propTypes = {
    onChange: func,
    value: any,
    defaultValue: any
  }

  static childContextTypes = {
    select: React.PropTypes.func
  }

  getChildContext() {
    return {
      select: this.props.onChange
    }
  }

  state = {
    isOpen: false,
    value: this.props.defaultValue || null
  }

  isControlled = () => {
    return this.props.value != null
  }


  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  close = () => {
    this.setState({
      isOpen: false
    })
  }

  handleSelect(value) {
    const nextState = { showChildren: false }

    if (this.isControlled())
      nextState.value = value

    this.setState(nextState, () => {
      if (this.props.onChange)
        this.props.onChange(value)
    })
  }

  getLabel() {
    let label
    const { value } = this.isControlled() ? this.props : this.state
    React.Children.forEach(this.props.children, (child) => {
      if (value === child.props.value) {
        onSelect: this.handleSelect();
      }
    })
    return label
  }

  renderChildren() {
    return React.Children.map(this.props.children, (child) => (
      React.cloneElement(child, {
        onSelect: (value) => this.handleSelect(value)
      })
    ))
  }

  render() {
    const label = this.getLabel();
    return (
      <div tabIndex="0" onBlur={this.close} className="select" onClick={this.toggle}>
        <div className="label">{label} <span className="arrow">▾</span></div>
        {this.state.isOpen && (
          <div className="options">
            {this.renderChildren()}
          </div>
        )}
      </div>
    )
  }
}


class Option extends React.Component {

  static contextTypes = {
    select: React.PropTypes.func
  }

  handleClick = () => {
    this.context.select(this.props.value)
  }

  render() {
    return (
      <div className="option" onClick={this.handleClick}>{this.props.children}</div>
    )
  }
}

class App extends React.Component {
  state = {
    selectValue: 'dosa'
  }

  setToMintChutney = () => {
    this.setState({
      selectValue: 'mint-chutney'
    })
  }

  render() {
    return (
      <div>
        <h1>Select/Option</h1>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>

        <h2>Controlled</h2>
        <p>
          <button onClick={this.setToMintChutney}>Set to Mint Chutney</button>
        </p>

        <Select
          value={this.state.selectValue}
          onChange={(selectValue) => this.setState({ selectValue })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Uncontrolled</h2>
        <Select defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
