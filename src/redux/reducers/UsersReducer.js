import { ActionTypes } from "../constants/actionTypes"


const initialState = {
    Users: [],
};

const CurrentUserState = {
    CurrentUser: []
}





export const UsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_USER:
            return { ...state, Users: action.payload };
        default:
            return state;
    }
}

export const CurrentUserReducer = (state = CurrentUserState, action) => {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_USER:
            return { ...state, CurrentUser: action.payload };
        case ActionTypes.GET_CURRENT_USER:
            return { ...state, CurrentUser: action.payload };
        case ActionTypes.UPDATE_CURRENT_USER:
            return { ...state, CurrentUser: action.payload };
        case ActionTypes.DELETE_CURRENT_USER:
            return { ...state, CurrentUser: [] };
        default:
            return state;
    }
}


