import { ActionTypes } from "../constants/actionTypes"


const initialState = {
    Incomes: [],
};

const initialAssignedState = {
    AssignedIncomes: [],
};



export const IncomesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_INCOME:
            return { ...state, Incomes: action.payload };
        case ActionTypes.GET_INCOMES:
            return { ...state, Incomes: action.payload };
        default:
            return state;
    }
}

export const AssignedIncomesReducer = (state = initialAssignedState, action) => {
    switch (action.type) {
        case ActionTypes.SET_ASSIGNED_INCOME:
            return { ...state, AssignedIncomes: action.payload };
        // case ActionTypes.GET_ASSIGNED_INCOME:
        //     return { ...state, AssignedIncomes: action.payload };
        default:
            return state;
    }
}


