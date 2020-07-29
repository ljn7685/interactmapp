import { combineReducers } from 'redux'
import counter from './counter'
import game from './game'

export default combineReducers({
  counter,
  game
})
