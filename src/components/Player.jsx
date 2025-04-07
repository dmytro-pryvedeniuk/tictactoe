import { useState } from "react";

export default function Player({ initialName, symbol, isActive, onNameChange }) {
    const [playerName, setPlayerName] = useState(initialName);
    const [isEditing, setIsEditing] = useState(false);

    function handleSaveClick() {
        setIsEditing(false);
        onNameChange(symbol, playerName);
    }

    function handleEditClick() {
        setIsEditing(true);
    }

    function handleChange(event) {
        setPlayerName(event.target.value.toUpperCase())
    }

    let onButtonClick = handleEditClick;
    let buttonCaption = "Edit";
    let editablePlayerName = (
        <span className="player-name">
            {playerName}
        </span>
    );
    if (isEditing) {
        editablePlayerName = (<input type="text" required value={playerName} onChange={handleChange}></input>);
        onButtonClick = handleSaveClick;
        buttonCaption = "Save";
    }

    return (
        <li className={isActive ? "active" : undefined}>
            <span className="player">
                {editablePlayerName}
                <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={onButtonClick}>{buttonCaption}</button>
        </li>
    );
}