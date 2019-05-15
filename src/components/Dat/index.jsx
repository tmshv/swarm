import 'react-dat-gui/build/react-dat-gui.css';
import React, { Component } from 'react';

import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';

export default class Dat extends Component {
    renderItem = (x, i) => {
        {/* <DatString path='package' label='Package' />
                <DatNumber path='power' label='Power' min={9000} max={9999} step={1} />
                <DatBoolean path='isAwesome' label='Awesome?' />
                <DatColor path='feelsLike' label='Feels Like' /> */}
        
        return (
            <DatNumber
                key={i}
                path={x.field}
                label={x.label}
                min={x.min}
                max={x.max}
                step={x.step}
            />
        )
    }

    render() {
        const { data } = this.props

        return (
            <DatGui
                data={data}
                onUpdate={this.props.onChange}
            >
                {this.props.layout.map(this.renderItem)}
            </DatGui>
        )
    }
}
