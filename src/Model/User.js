import Request from './Request';

class PlayerModel {

    static login(userName, password) {
        return Request.post('user/login', { userName, password });
    }

}

export default PlayerModel;