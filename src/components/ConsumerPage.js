import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import api from '../api/items'
import { GetAPS, GetUser } from '../redux/actions/productActions'
import { useSelector, useDispatch } from 'react-redux'
import HeaderAll from './HeaderAll'
import { triggerBase64Download } from 'common-base64-downloader-react'




const ConsumerPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();


    const Priorities = useSelector((state) => state.APS_Reducer.prioritiesData)
    const Secrets = useSelector((state) => state.APS_Reducer.secretsData)


    const [DataIncomes, setDataIncomes] = useState([])
    const Click = async (ProcessNum) => {
        // window.open(`http://localhost:80/postSystem/${ProcessNum}.pdf`)
        const response = await api.get('/Incomes/GetPdf', { params: { ProcessNum: ProcessNum } })
        console.log(response.data[0].Income_Document)
        triggerBase64Download(`data:application/pdf;base64,${response.data[0].Income_Document}`, `${ProcessNum}`)

    }

    const [userData, setUserData] = useState()
    const [userChildrenData, setUserChildrenData] = useState()


    const GetUserDep = async () => {
        // console.log(userId)
        // let bodyFormData = new FormData();
        // bodyFormData.append('user_id', userId);
        // const response = await api.post(`/postSystem/get_user_dep.php`, bodyFormData
        //     , { headers: { 'Content-Type': 'multipart/form-data' } })
        // console.log(response.data[0])
        // setUserData(response.data[0])
        // response.data[0] && response.data[0].role === `1` ? navigate(`/Distributer`) : response.data[0].role === `3` ? navigate(`/Form`) : response.data[0].role === `0` ? navigate(`/Consumer`) : console.log(`aa`)


        //Children

        // let bodyChildrenFormData = new FormData();
        // bodyChildrenFormData.append('depart_id', userData.depart_id);
        // const ChildrenResponse = await api.post(`/postSystem/get_temp_users.php`, bodyChildrenFormData
        //     , { headers: { 'Content-Type': 'multipart/form-data' } })
        // console.log(ChildrenResponse.data)
        // setUserChildrenData(ChildrenResponse.data)
    }

    const [CurrentUserData, setCurrentUserData] = useState()


    const getDataIncomes = async () => {
        // const response = await api.get(`/postSystem/get_manager_assigned_income.php`)
        // console.log(response.data)
        const response = await api.get('/Users/CurrentUser')
        console.log(response.data[0])

        const response2 = await api.get('/Users')
        console.log(response2.data)

        setCurrentUserData(response.data[0])
        setUserChildrenData(response2.data.length > 0 && response2.data.filter((item) => ((item.Depart.depart_parent_id === `635b8b92b7e62d9688feebea` && item.Unique_User_Id.slice(0, 3) === `LSO` && item.Unique_User_Id !== response.data[0].Unique_User_Id) || (item.Depart._id === response.data[0].Depart._id && item.Unique_User_Id !== response.data[0].Unique_User_Id))))

        console.log(response2.data.length > 0 && response2.data.filter((item) => ((item.Depart.depart_parent_id === `635b8b92b7e62d9688feebea` && item.Unique_User_Id.slice(0, 3) === `LSO` && item.Unique_User_Id !== response.data[0].Unique_User_Id) || (item.Depart._id === response.data[0].Depart._id && item.Unique_User_Id !== response.data[0].Unique_User_Id))))


        const response3 = await api.get(`/Incomes/GetConsumerIncome`, { params: { Assigned_To: response.data[0].Depart._id } })
        setDataIncomes(response3.data)
        console.log(response3.data)

        response.data.length > 0 ? (response.data[0].role === `1` ? navigate(`/Distributer`) : response.data[0].role === `3` ? navigate(`/Form`) : response.data[0].role === `0` ? navigate(`/Consumer`) : response.data[0].role === `2` ? navigate(`/Consumer`) : navigate(`/`)) : navigate(`/`)
    }

    const [textArea, setTextArea] = useState()

    const Update = async (IncomeId, textArea) => {

        await api.patch(`/Incomes/UpdateConsumerIncome`, { IncomeId, textArea })

        //ٌRender Data Incomes
        getDataIncomes()
    }


    useEffect(() => {
        getDataIncomes()
        dispatch(GetAPS())
    }, [])

    const [showThirdModal, setShowThirdModal] = useState(false);
    const [MangerDirOrderShow, setMangerDirOrderShow] = useState()
    const ShowManagerDirectory = (manager_assigned_text) => {
        setShowThirdModal(true)
        setMangerDirOrderShow(manager_assigned_text)
    }

    return (
        <div className='max-w-[100%] m-auto p-4 h-[100%]'>
            <HeaderAll CurrentUserData={CurrentUserData} userChildrenData={userChildrenData} />
            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-y-auto h-[450px]">
                            <table className="min-w-full text-center">
                                <thead className="border-b sticky bg-[#05351b]">
                                    <tr>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            التوجية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            الإجراء المتخذ
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            توجية المدير
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            الإجراء المطلوب
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            مرسل الى
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            درجة الاسبقية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            درجة السرية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            وارد من جهه
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            تاريخ المعاملة
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            موضوع المعامله
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            رقم المعامله
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            م
                                        </th>
                                    </tr>
                                </thead >
                                <tbody>
                                    {
                                        DataIncomes.length > 0 ? DataIncomes.map((item, index) => {
                                            return (
                                                <tr key={index} className="bg-[#8a8989] border-b-[2px] border-[black]">
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <button onClick={() => { Click(item.Income_No) }} className='border rounded-[12px] bg-[#614405] shadow-lg p-[10px] w-content  text-center text-white font-bold' >تحميل</button>
                                                        <button disabled={item.Action_text !== null ? true : false} onClick={() => { Update(item._id, textArea) }} className={`border ml-2 rounded-[12px] ${item.Action_text !== null ? `bg-[#5bb485]` : `bg-[#05351b]`}  shadow-lg p-[5px] w-content mt-2 text-center text-white font-bold `} >إرسال</button>
                                                    </td>
                                                    <td className=" whitespace-nowrap text-sm  text-gray-900">
                                                        {CurrentUserData !== undefined && CurrentUserData.role === `2` && item.Action_text === null ? (<textarea onChange={(e) => { setTextArea(e.target.value) }} className=' bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-[#05351b] focus:outline-none text-end' cols={20} rows={2} />) : <p>{item.Action_text}</p>}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <button onClick={() => { ShowManagerDirectory(item.manager_assigned_text) }} className={`border rounded-[12px]  bg-[#614405] shadow-lg p-[5px] w-content mt-2 text-center text-white font-bold `} >عرض</button>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.Action_Type.Action_Type_Name}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.Assigned_To.department}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {Priorities.length > 0 && Priorities.filter((itemData) => itemData._id === item.Income_ID.degree_Of_Priority)[0].priority_desc}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {Secrets.length > 0 && Secrets.filter((itemData) => itemData._id === item.Income_ID.degree_Of_Security)[0].Secret_degree}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.Income_ID.from_depart}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.Income_ID.Income_Date}
                                                    </td>
                                                    <td className="cursor-pointer text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        <p className='w-content max-w-[250px] whitespace-normal'>
                                                            {item.Income_ID.Income_Subject}
                                                        </p>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.Income_ID.Income_No}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {index + 1}
                                                    </td>
                                                </tr >
                                            )
                                        }) : (<tr className="bg-[#8a8989] border-b-[2px] border-[black]">
                                            <td colSpan={11} className="text-lg font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                <p >لا توجد معاملات للفرع</p>
                                            </td>
                                        </tr>)
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {showThirdModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[100%] my-6 mx-auto max-w-3xl border-[#05351b] rounded-[12px] border-4">
                            <div className="border-0 rounded-lg  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <p className="text-3xl font-semibold mt-2 mx-auto  text-[#05351b] border-[#05351b] p-2 rounded-[12px] border-2 ">
                                    عرض توجية المدير
                                </p>
                                <div className="relative px-6 flex-auto">
                                    <div className="my-4 font-bold text-sm overflow-y-auto ">
                                        <p className='text-lg font-bold text-[#05351b] '>{MangerDirOrderShow !== null ? MangerDirOrderShow : `لا يوجد توجية من المدير`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end px-6 pb-6 ">
                                    <button
                                        className="text-white bg-[#6e1212] active:bg-white active:text-[#6e1212] font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => { setShowThirdModal(false) }}
                                    >
                                        غلق
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div>
    )
}

export default ConsumerPage
