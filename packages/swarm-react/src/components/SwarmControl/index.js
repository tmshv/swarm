import React from 'react'
import SwarmControl from './SwarmControl'
import connect from '../../lib/decorators/connect'

@connect(new Signal())
export default class SwarmControlContainer extends SwarmControl {
}
