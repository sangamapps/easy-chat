import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import 'styles/home.scss';

export default function () {
    const { userInfo } = useSelector(state => state);
    return <div className="home-view">
        <div className="home-header">Your chats</div>
        <div className="friends-view">
        {userInfo.friends.map((friend, index) => <div className="friend-link sg-btn" key={index}><Link to={"/" + friend._id}>{friend.name}</Link></div>)}
        </div>
    </div>;
}