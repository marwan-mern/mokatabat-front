import { combineReducers } from "redux";
import { UsersReducer ,CurrentUserReducer} from "./UsersReducer";
import { DepartsReducer , APS_Reducer} from "./DepartsReducer";
import { IncomesReducer ,AssignedIncomesReducer} from "./IncomesReducer";


const reducers = combineReducers({
    UsersReducer:UsersReducer,
    CurrentUserReducer:CurrentUserReducer,
    DepartsReducer:DepartsReducer,
    APS_Reducer:APS_Reducer,
    IncomesReducer:IncomesReducer,
    AssignedIncomesReducer:AssignedIncomesReducer
});

export default reducers