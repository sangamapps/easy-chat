import constants from './constants';

let userInfo = null;
try {
    userInfo = $("meta[name='user-info']").attr('content');
    userInfo = JSON.parse(userInfo);
} catch (e) {
    console.log("userInfo::", userInfo);
    userInfo = null;
    console.log("ERR::onParseUser", e);
}

const initialState = {
    userInfo: userInfo,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case constants.SET_USER_DETAILS:
            return Object.assign({}, state, {
                userInfo: action.userInfo,
            });
        default: return state;
    }
}
