// import 'react-dat-gui/build/react-dat-gui.css';
import React, { Component } from 'react';

import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';

export default class Dat extends Component {
    renderItem = (x, i) => {      
        switch (x.type) {
            case 'number': {
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
                
            case 'color': {
                return (
                    <DatColor
                        key={i}
                        path={x.field}
                        label={x.label}
                    />
                )
            }
            
            case 'boolean': {
                return (
                    <DatBoolean
                        key={i}
                        path={x.field}
                        label={x.label}
                    />
                )
            }

            case 'string': {
                return (
                    <DatString
                        key={i}
                        path={x.field}
                        label={x.label}
                    />
                )
            }
        }
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
