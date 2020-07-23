import { combineReducers } from 'redux'
import counter from './counter';
import hotReducer from '../components/hotActivity/reducer';

export default combineReducers({
  counter,
  hotReducer
})
