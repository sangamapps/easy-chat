import React from "react";
import { useSelector } from "react-redux";
import LoginContainer from 'Containers/LoginContainer';
import ChatBoxContainer from 'Containers/ChatBoxContainer';

export default function () {
    const { userInfo } = useSelector(state => state);
    return <div className="app-body">
        {userInfo && userInfo._id ?
            <ChatBoxContainer />
            : <LoginContainer />}
    </div>;
}