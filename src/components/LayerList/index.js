import React from 'react';
import PropTypes from 'prop-types'

import './styles.less'

function LayerList({ items, onChange }) {
    return (
        <ul className={'LayerList'}>
            {items.map((x, i) => (
                <li key={i}>
                    <input
                        type={'checkbox'}
                        checked={x.checked}
                        onChange={() => {
                            onChange(i, !x.checked)
                        }}
                    />
                    {x.name}
                </li>
            ))}
        </ul>
    )
}

LayerList.propTypes = {
    items: PropTypes.array,
    onChange: PropTypes.func.isRequired,
}

export default LayerList