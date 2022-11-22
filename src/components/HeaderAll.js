import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/items'
import { useDispatch, useSelector } from 'react-redux'
import { GiveTemp, UpdateCurrentUser, GetUser, GetCurrentUser } from '../redux/actions/productActions';





const HeaderAll = ({ CurrentUserData, userChildrenData }) => {
    const dispatch = useDispatch();
    const Users = useSelector((state) => state.UsersReducer.Users)
    const [HasMyAuthNames, setHasMyAuthNames] = useState()


    useEffect(() => {
        dispatch(GetCurrentUser())
        dispatch(GetUser())
        getTempData()
        HasMyAuth()
    }, [dispatch, CurrentUserData])

    console.log(CurrentUserData)
    console.log(userChildrenData)

    const navigate = useNavigate()

    const HasMyAuth = async () => {

        const response = await api.get('/Users/HasMyAuth', { params: { CurrentUser: CurrentUserData && CurrentUserData.Unique_User_Id } })
        setHasMyAuthNames(response.data)
    }

    const getTempData = async () => {
        // let bodySwitchParentFormData = new FormData();
        // bodySwitchParentFormData.append('user_id', UserId && UserId);
        // const SwitchResponse = await api.post(`/postSystem/get_temp_user_id.php`, bodySwitchParentFormData
        //     , { headers: { 'Content-Type': 'multipart/form-data' } })
        // setTempUserData(SwitchResponse.data[0])

        ///Site Name
        if (CurrentUserData && CurrentUserData.User_Temp_Id !== ``) {
            // let bodyTempSiteNameFormData = new FormData();
            // bodyTempSiteNameFormData.append('user_id', SwitchResponse.data[0].user_temp_id);
            // const TempSitenameResponse = await api.post(`/postSystem/temp_site_name.php`, bodyTempSiteNameFormData
            //     , { headers: { 'Content-Type': 'multipart/form-data' } })

            //     console.log(TempSitenameResponse.data)
            const TempUserName = Users.length > 0 && Users.filter((item) => item.Unique_User_Id === CurrentUserData.User_Temp_Id)[0].User_Name;
            console.log(TempUserName)
            setTempSiteName(TempUserName && TempUserName)
        } else {

        }
    }



    const Signout = () => {
        notifyFail()
        navigate(`/`)
    }

    const [AuthToChild, setAuthToChild] = useState()

    const DeleteAuth = (TempId) => {
        dispatch(GiveTemp(``, TempId))
        HasMyAuth()
    }


    const GiveAuthToChild = () => {
        dispatch(GiveTemp(CurrentUserData.Unique_User_Id, AuthToChild))
        HasMyAuth()
    }

    const [tempSiteName, setTempSiteName] = useState()






    const SwitchToParent = () => {
        console.log(CurrentUserData)
        dispatch(UpdateCurrentUser(CurrentUserData && CurrentUserData.Unique_User_Id, CurrentUserData && CurrentUserData.User_Temp_Id))

        localStorage.setItem(`old_user_id`, CurrentUserData && CurrentUserData.Unique_User_Id)

        navigate(0)
    }

    const BackFromManager = () => {
        const OldUserId = localStorage.getItem(`old_user_id`)
        dispatch(UpdateCurrentUser(CurrentUserData && CurrentUserData.Unique_User_Id, OldUserId))

        localStorage.setItem(`old_user_id`, ``)

        navigate(`/Consumer`)
    }

    const Back = () => {
        const OldUserId = localStorage.getItem(`old_user_id`)
        dispatch(UpdateCurrentUser(CurrentUserData && CurrentUserData.Unique_User_Id, OldUserId))

        localStorage.setItem(`old_user_id`, ``)

        navigate(0)
    }


    const notifyFail = () => {
        toast.error(<><p className='text-white font-bold text-lg'>تم تسجيل الخروج</p></>, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom
        });

    };
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pt-2 ">
                <div className='flex-none'>
                <img
                    src="/Logo.jpg"
                    className=" w-[150px] h-[120px]"
                    style={{ zIndex: -1000 }}
                    alt='logo'
                />
                </div>
                <div className="items-center justify-start flex-1">
                    <button onClick={Signout} className=" rounded-[12px] whitespace-nowrap p-2 bg-[#c90b0b] text-white active:bg-white active:text-[#c90b0b]">
                        تسجيل الخروج
                    </button>
                </div>
                <div className=" flex-1">
                    <p className='text-[30px] p-2 font-bold rounded-[12px] border-2 border-[#05351b]  text-[#05351b]'>
                        {CurrentUserData !== undefined && CurrentUserData.Depart.department}
                    </p>
                </div>
                <div className="flex-1 flex flex-col flex-end items-end gap-[5px] ">
                    <div className='flex:1 flex flex-row flex-end items-center justify-center gap-[20px]'>
                        <p className='text-md font-medium text-[#05351b]'>
                            {CurrentUserData !== undefined && CurrentUserData.User_Name}
                        </p>
                        <img
                            className="h-8 w-auto "
                            src="/Avatar.png"
                            alt="Avatar"
                        />
                    </div>
                    {
                        CurrentUserData !== undefined && CurrentUserData.Unique_User_Id.slice(0, 3) === `LSO` && CurrentUserData.role !== `1` ? (
                            <div>
                                <div className='flex:1 flex flex-row flex-end items-center justify-center gap-[10px] ' >
                                    <button onClick={GiveAuthToChild} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                        إعطاء الصلاحية
                                    </button>
                                    <select onChange={(e) => { setAuthToChild(e.target.value) }} id='Role' className='border-2 font-bold text-[#05351b] border-[#05351b] rounded-[12px] shadow-lg p-1 my-2 text-center'>
                                        <option> إعطاء الصلاحية </option>
                                        {userChildrenData.length > 0 && userChildrenData.map((item, index) => {
                                            return (
                                                <option key={index} value={item._id}>{item.User_Name}</option>
                                            )
                                        })}
                                    </select>
                                    <label htmlFor="Role" className='text-lg font-bold text-[#05351b]'>الإنابة</label>
                                </div>
                                {HasMyAuthNames && HasMyAuthNames.length > 0 ? (
                                    <div className='flex:1 flex flex-col gap-[10px] flex-end items-center justify-center border-2 border-[#05351b] rounded-[12px] p-2 ' >
                                        {
                                            HasMyAuthNames.map((item, index) => {
                                                return (
                                                    <div key={index} className='flex:1 flex flex-row flex-end items-center justify-center'>
                                                        <button onClick={() => { DeleteAuth(item._id) }} className=" rounded-[12px] whitespace-nowrap p-1 px-2 mr-2 bg-[#972a2a] text-white">حذف الإنابة</button>
                                                        <p className='font-bold text-[#05351b]'>{item.User_Name}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                ) : null
                                }
                                {CurrentUserData && CurrentUserData.User_Temp_Id !== `` ? (
                                    <div className='flex:1 flex flex-row flex-end items-center justify-end gap-[10px] ' >
                                        <button onClick={SwitchToParent} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                            تحويل الى {tempSiteName && tempSiteName}
                                        </button>
                                    </div>
                                ) : null}
                                {
                                    localStorage.getItem(`old_user_id`) !== `` ? (
                                        <div className='flex:1 flex flex-row flex-end items-center justify-end gap-[10px] ' >
                                            <button onClick={Back} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                                عودة من الصلاحية
                                            </button>
                                        </div>
                                    ) : null
                                }

                            </div>
                        ) : CurrentUserData !== undefined && CurrentUserData.role === `1` ? (
                            <div className='flex:1 flex flex-col flex-end items-center justify-center gap-[10px] ' >
                                <div className='flex:1 flex flex-row flex-end items-center justify-center gap-[10px] ' >
                                    <button onClick={GiveAuthToChild} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                        إعطاء الصلاحية
                                    </button>
                                    <select onChange={(e) => { setAuthToChild(e.target.value) }} id='Role' className='border-2 font-bold text-[#05351b] border-[#05351b] rounded-[12px] shadow-lg p-1 my-2 text-center'>
                                        <option> إعطاء الصلاحية </option>
                                        {userChildrenData.length > 0 && userChildrenData.map((item, index) => {
                                            return (
                                                <option key={index} value={item._id}>{item.User_Name}</option>
                                            )
                                        })}
                                    </select>
                                    <label htmlFor="Role" className='text-lg font-bold text-[#05351b]'>الإنابة</label>
                                </div>
                                {HasMyAuthNames && HasMyAuthNames.length > 0 ? (
                                    <div className='flex:1 flex flex-col gap-[10px] flex-end items-center justify-center border-2 border-[#05351b] rounded-[12px] p-2 ' >
                                        {
                                            HasMyAuthNames.map((item, index) => {
                                                return (
                                                    <div key={index} className='flex:1 flex flex-row flex-end items-center justify-center'>
                                                        <button onClick={() => { DeleteAuth(item._id) }} className=" rounded-[12px] whitespace-nowrap p-1 px-2 mr-2 bg-[#972a2a] text-white">حذف الإنابة</button>
                                                        <p className='font-bold text-[#05351b]'>{item.User_Name}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                ) : null
                                }
                                {
                                    localStorage.getItem(`old_user_id`) !== `` ? (
                                        <div className='flex:1 flex flex-row flex-end items-center justify-end gap-[10px] ' >
                                            <button onClick={BackFromManager} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                                عودة من الصلاحية
                                            </button>
                                        </div>
                                    ) : null
                                }
                            </div>
                        ) : CurrentUserData !== undefined && (CurrentUserData.Unique_User_Id.slice(0, 3) === `LSE` || CurrentUserData.Unique_User_Id.slice(0, 3) === `LSX`) ? (
                            <div>
                                {CurrentUserData && CurrentUserData.User_Temp_Id !== `` ? (
                                    <div className='flex:1 flex flex-row flex-end items-center justify-end gap-[10px] ' >
                                        <button onClick={SwitchToParent} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                            تحويل الى {tempSiteName && tempSiteName}
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : (null)
                    }

                </div>
            </div>
        </div>
    )
}
export default HeaderAll
