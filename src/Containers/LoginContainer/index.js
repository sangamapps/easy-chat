import React from "react";
import { toast } from 'react-toastify';
import User from 'Model/User';
import 'styles/login.scss';

class Login extends React.PureComponent {

    handleSubmit = (e) => {
        e.preventDefault();
        const userName = $('#userName').val(), password = $('#password').val();
        User.login(userName, password).then(resp => {
            location.reload();
        }).catch(err => toast.error(err.message, { toastId: err.errCode }));
    }

    render() {
        return <div className="login-view d-flex">
            <div className="sg-card m-auto">
                <form className="sg-form login-form"
                    onSubmit={this.handleSubmit} autoComplete="off">
                    <label htmlFor="userName">User Name</label>
                    <input type="text" id="userName" required placeholder="Eg : john" />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" required />
                    <button>Login</button>
                </form>
            </div>
        </div>;
    }
}

export default Login;