import { ActionTypes } from "../constants/actionTypes";
import api from '../../api/items.js'



export const fetchAllData = () => {

    return async (dispatch, getState) => {
        const response = await api.get('/Users')
        dispatch({ type: ActionTypes.GET_USER, payload: response.data })

        const response2 = await api.get('/Departs')
        dispatch({ type: ActionTypes.GET_DEPARTS, payload: response2.data })

        const response3 = await api.get('/Departs/ActionPrioritySecret')
        dispatch({ type: ActionTypes.GET_APS, payload: response3.data })

    }

};

export const GetUser = () => {
    return async (dispatch, getState) => {
        const response = await api.get('/Users')
        dispatch({ type: ActionTypes.GET_USER, payload: response.data })
    }
};

export const SetCurrentUser = (CurrentUser) => {
    console.log(CurrentUser)
    return async (dispatch, getState) => {
        const response = await api.post('/Users/CurrentUser', { Depart: CurrentUser.Depart, Pass: CurrentUser.Pass, Unique_User_Id: CurrentUser.Unique_User_Id, User_Name: CurrentUser.User_Name, User_Temp_Id: CurrentUser.User_Temp_Id, role: CurrentUser.role })
        dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: response.data })
    }
};

export const GetCurrentUser = () => {
    return async (dispatch, getState) => {
        const response = await api.get('/Users/CurrentUser')
        dispatch({ type: ActionTypes.GET_CURRENT_USER, payload: response.data })

    }
};

export const DeleteCurrentUser = () => {
    return async (dispatch, getState) => {
        await api.delete('/Users/CurrentUser')
        dispatch({ type: ActionTypes.DELETE_CURRENT_USER })
    }
};

export const GetDeparts = () => {
    return async (dispatch, getState) => {
        const response = await api.get('/Departs')
        dispatch({ type: ActionTypes.GET_DEPARTS, payload: response.data })
    }
};

export const GetAPS = () => {
    return async (dispatch, getState) => {
        const response = await api.get('/Departs/ActionPrioritySecret')
        dispatch({ type: ActionTypes.GET_APS, payload: response.data })
    }
};


export const SetIncome = (Income_No, Income_Subject, Income_Date, degree_Of_Security, degree_Of_Priority, from_depart, from_user_id, Income_Document) => {
    return async (dispatch, getState) => {
        console.log(Income_No, Income_Subject, Income_Date, degree_Of_Security, degree_Of_Priority, from_depart, from_user_id, Income_Document)
        const response = await api.post('/Incomes/SetIncome', { Income_No, Income_Subject, Income_Date, degree_Of_Security, degree_Of_Priority, from_depart, from_user_id, Income_Document })
        dispatch({ type: ActionTypes.SET_INCOME, payload: response.data })
    }
};


export const GetIncomes = () => {
    return async (dispatch, getState) => {
        const response = await api.get('/Incomes/GetIncomes')
        dispatch({ type: ActionTypes.GET_INCOMES, payload: response.data })
    }
};

export const SetAssignedIncome = (Income_ID, Assigned_From, Assigned_To, Action_Type, manager_assigned_text) => {
    return async (dispatch, getState) => {
        console.log(Income_ID, Assigned_From, Assigned_To, Action_Type, manager_assigned_text)
        const response = await api.post('/Incomes/SetAssignedIncome', { Income_ID, Assigned_From, Assigned_To, Action_Type, manager_assigned_text })
        dispatch({ type: ActionTypes.SET_ASSIGNED_INCOME, payload: response.data })
    }
};

export const GiveTemp = (UserId,TempUserId) => {
    return async (dispatch, getState) => {
       await api.patch(`/Users/GiveTemp`, { UserId, TempUserId })
    }
};

export const UpdateCurrentUser = (UniqueUserId,TempUserID) => {
    return async (dispatch, getState) => {
        let TempUserData;
       TempUserData = getState().UsersReducer.Users.filter((item)=>item.Unique_User_Id === TempUserID)[0]
      console.log(TempUserData)
      const response =  await api.patch(`/Users/UpdateCurrentUser`, { UniqueUserId, TempUserData })
      dispatch({ type: ActionTypes.UPDATE_CURRENT_USER, payload: response.data })

    }
};







