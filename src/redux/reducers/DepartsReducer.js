import { ActionTypes } from "../constants/actionTypes"


const initialState = {
    Departs: [],
};

const APS_State = {
    actionTypesData: [],
    prioritiesData: [],
    secretsData: []
}



export const DepartsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_DEPARTS:
            return { ...state, Departs: action.payload };
        default:
            return state;
    }
}

export const APS_Reducer = (state = APS_State, action) => {
    switch (action.type) {
        case ActionTypes.GET_APS:
            return {
                ...state,
                actionTypesData: action.payload.actionTypesData,
                prioritiesData: action.payload.prioritiesData,
                secretsData: action.payload.secretsData,
            };
        default:
            return state;
    }
}

