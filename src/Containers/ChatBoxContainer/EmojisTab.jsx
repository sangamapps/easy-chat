import React from 'react';
import 'styles/emojis-tab.scss';

const emojisMap = require('./emojis-map.json');

export default class EmojisTab extends React.PureComponent {

    getEmoji = (map, key) => {
        const emoji = map.emoji.substr(0, map.emoji.length);
        return <button key={key}
            onClick={() => this.props.onClick(emoji)}
            className="emoji">{emoji}</button>;
    }

    getEmojisTab(category, emojis, key) {
        return <div className="emoji-group" key={key}>
            <span className="emoji-group-name">{category}</span>
            {emojis.map(this.getEmoji)}
        </div>
    }

    render() {
        return <div className="emojis-tab">
            {_.keys(emojisMap).map((o, i) => this.getEmojisTab(o, emojisMap[o], i))}
        </div>;
    }
}