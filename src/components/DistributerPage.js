import React, { useEffect, useState } from 'react'
import api from '../api/items'
import { useNavigate } from "react-router-dom"
import HeaderAll from './HeaderAll'
import { useSelector, useDispatch } from 'react-redux'
import { GetAPS, GetDeparts, GetIncomes, SetAssignedIncome, GetUser } from '../redux/actions/productActions'
import { triggerBase64Download } from 'common-base64-downloader-react'



const DistributerPage = () => {
    const dispatch = useDispatch();

    const IncomesData = useSelector((state) => state.IncomesReducer.Incomes)

    const Departs = useSelector((state) => state.DepartsReducer.Departs)
    const ActionTypesData = useSelector((state) => state.APS_Reducer.actionTypesData)
    const Users = useSelector((state) => state.UsersReducer.Users)



    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);

    const [IncomeCodeClicked, setIncomeCodeClicked] = useState()
    const [IncomeIdClicked, setIncomeIdClicked] = useState()

    const [SelectedDep, setSelectedDep] = useState()
    const changeDep = (e) => {
        setSelectedDep(e.target.value)
    }

    const [SelectedAction, setAction] = useState()
    const changeAction = (e) => {
        setAction(e.target.value)
    }

    const [textArea, setTextArea] = useState()

    const [AddArray, setAddArray] = useState([])
    const AddToArray = () => {
        setAddArray([...AddArray, { SelectedAction, SelectedDep, textArea }])
        setTextArea(``)
    }




    const Click = async (ProcessNum) => {
        // window.open(`http://localhost:80/postSystem/${ProcessNum}.pdf`)
        const response = await api.get('/Incomes/GetPdf', { params: { ProcessNum: ProcessNum } })
        console.log(response.data[0].Income_Document)
        triggerBase64Download(`data:application/pdf;base64,${response.data[0].Income_Document}`, `${ProcessNum}`)

    }

    const AddClick = (ProcessNumber, Income_ID) => {
        setShowModal(true)
        setIncomeCodeClicked(ProcessNumber)
        setIncomeIdClicked(Income_ID)
    }

    const Send = async () => {
        setShowModal(false)
        let DepArr = [];
        let ActionArr = [];
        let TextAreaArr = [];
        AddArray.map((item) => {
            DepArr.push(item.SelectedDep)
            ActionArr.push(item.SelectedAction)
            TextAreaArr.push(item.textArea)
        })
        AddArray.length > 0 && AddArray.map((item, index) => {
            console.log(IncomeIdClicked, CurrentUserData.Depart._id, DepArr[index], ActionArr[index], TextAreaArr[index])
            dispatch(SetAssignedIncome(IncomeIdClicked, CurrentUserData.Depart._id, DepArr[index], ActionArr[index], TextAreaArr[index]))
        })



        setAddArray([])
    }

    const close = () => {
        setShowModal(false)
        setAddArray([])
    }

    const deleteItem = (itemIndex) => {
        setAddArray(AddArray.filter((item, index) => index !== itemIndex))
        console.log(AddArray)
    }

    const [CurrentUserData, setCurrentUserData] = useState()

    const GetCurrentUserData = async () => {
        const response = await api.get('/Users/CurrentUser')
        setCurrentUserData(response.data[0])
        console.log(response.data[0])

        const response2 = await api.get('/Users')
        setUserChildrenData(response2.data.length > 0 && response2.data.filter((item) => (item.Depart.depart_parent_id === response.data[0].Depart._id && item.Unique_User_Id.slice(0, 3) === `LSO`)))

        response.data.length > 0 ? (response.data[0].role === `1` ? navigate(`/Distributer`) : response.data[0].role === `3` ? navigate(`/Form`) : response.data[0].role === `0` ? navigate(`/Consumer`) : response.data[0].role === `2` ? navigate(`/Consumer`) : navigate(`/`)) : navigate(`/`)
    }



    const [userChildrenData, setUserChildrenData] = useState([])



    const [ShowData, setShowData] = useState()




    const ShowButton = async(incomeID) => {
        const response = await api.get(`/Incomes/GetAssignedIncome`, { params: { Income_Id: incomeID } })
        console.log(response.data)
        setShowData(response.data)
        setShowSecondModal(true)
    }


    useEffect(() => {
        GetCurrentUserData()

        dispatch(GetIncomes())
        dispatch(GetDeparts())
        dispatch(GetAPS())
        dispatch(GetUser())

    }, [navigate])


    return (
        <div className='max-w-[100%] m-auto p-4 h-[100%] overflow-scroll'>
            <HeaderAll CurrentUserData={CurrentUserData} userChildrenData={userChildrenData} />
            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-4 inline-block min-w-full sm: lg:px-8">
                        <div className=" overflow-y-auto h-[450px]">
                            <table className="min-w-full text-center">
                                <thead className="border-b sticky bg-[#05351b]">
                                    <tr>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            التوجية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            درجة الاسبقية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            درجة السرية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            وارد من جهه
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            تاريخ المعاملة
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            موضوع المعامله
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            رقم المعامله
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            م
                                        </th>
                                    </tr>
                                </thead >
                                <tbody>
                                    {
                                        IncomesData.length > 0 && IncomesData.map((item, index) => {
                                            return (
                                                <tr key={index} className="bg-[#8a8989] border-b-[2px] border-[black]">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <button onClick={() => { Click(item.Income_No) }} className='border rounded-[12px] bg-[#614405] shadow-lg p-[10px] w-content  text-center text-white font-bold' >تحميل</button>
                                                        <button onClick={() => { ShowButton(item._id) }} className='border rounded-[12px] bg-[#614405] shadow-lg p-[10px] w-content ml-2 text-center text-white font-bold ' >عرض</button>
                                                        <button onClick={() => AddClick(item.Income_No, item._id)} className='border rounded-[12px] bg-[#0e1555] shadow-lg p-[10px] w-content ml-2  text-center text-white font-bold ' >إضافه</button>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {item.degree_Of_Priority.priority_desc}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {item.degree_Of_Security.Secret_degree}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {item.from_depart}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {item.Income_Date}
                                                    </td>
                                                    <td  className="cursor-pointer text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        <p className='w-content max-w-[250px] whitespace-normal'>
                                                            {item.Income_Subject}
                                                        </p>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {item.Income_No}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-6 py-4 whitespace-nowrap">
                                                        {index + 1}
                                                    </td>
                                                </tr >
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[100%] my-6 mx-auto max-w-3xl border-[#05351b] rounded-[12px] border-4">
                            <div className="border-0 rounded-lg  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <p className="text-3xl font-semibold mt-2 mx-auto  text-[#05351b] border-[#05351b] p-2 rounded-[12px] border-2 ">
                                    توجيه الإرسال و الإجراء
                                </p>
                                <div className="relative px-6 flex-auto">
                                    <div className="my-4 flex items-center justify-around  ">
                                        <button onClick={AddToArray}
                                            className="bg-[#05351b] text-white active:bg-white active:text-[#05351b] font-bold text-md p-2 rounded-full shadow "
                                        >
                                            إضافه
                                        </button>
                                        <textarea value={textArea} onChange={(e) => { setTextArea(e.target.value) }} placeholder='إضافه توجية' className=' bg-white  font-bold border-black rounded-[12px]  transition ease-in-out p-1 text-end' cols={20} rows={2} />
                                        <select onChange={changeAction} className=' border-2 font-bold border-black rounded-[12px] shadow-lg p-1 my-2 text-center' >
                                            <option >الإجراء</option>
                                            {
                                                ActionTypesData.length > 0 && ActionTypesData.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item._id}>{item.Action_Type_Name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <select onChange={changeDep} className=' border-2 font-bold border-black rounded-[12px] shadow-lg p-1 my-2 text-center' >
                                            <option >يرسل الى</option>
                                            {
                                                Departs.length > 0 && Departs.filter((itemData) => itemData.for_drop_box === `1`).map((item, index) => {
                                                    return (
                                                        <option key={index} value={item._id}>{item.department}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="my-4 font-bold text-sm overflow-y-auto h-[300px] ">
                                        <table className="min-w-full text-center border-[#05351b] rounded-[12px] border-4">
                                            <thead className="border-b bg-[#05351b]">
                                                <tr>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        توجيه
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        الإجراء
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        شرح
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        يرسل الى
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        م
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    AddArray.length > 0 && (
                                                        AddArray.map((item, index) => {
                                                            return (
                                                                <tr key={index} className="bg-[#8a8989] border-b-[2px] border-[black]">
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        <button
                                                                            className="text-white bg-[#6e1212] active:bg-white active:text-[#6e1212] font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                            type="button"
                                                                            onClick={() => { deleteItem(index) }}
                                                                        >
                                                                            حذف
                                                                        </button>
                                                                    </td>

                                                                    <td className="text-sm font-bold text-gray-900 py-4 ">
                                                                        <p className='w-content max-w-[150px]  py-4 '>
                                                                            {item.textArea}
                                                                        </p>
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {(ActionTypesData.length > 0 && SelectedAction !== undefined) ? ActionTypesData.filter((itemData) => itemData._id === item.SelectedAction)[0].Action_Type_Name : ``}
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {/* {Departs.length > 0 ? Departs[item.SelectedDep - 1].department : ``} */}
                                                                        {(Departs.length > 0 && SelectedDep !== undefined) ? Departs.filter((itemData) => itemData._id === item.SelectedDep)[0].department : ``}
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {index + 1}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end px-6 pb-6 ">
                                    <button
                                        className="text-white bg-[#6e1212] active:bg-white active:text-[#6e1212] font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={close}
                                    >
                                        غلق
                                    </button>
                                    <button
                                        className="bg-[#05351b] text-white active:bg-white active:text-[#05351b] font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={Send}
                                    >
                                        إرسال
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
            {showSecondModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[100%] my-6 mx-auto max-w-3xl border-[#05351b] rounded-[12px] border-4">
                            <div className="border-0 rounded-lg  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <p className="text-3xl font-semibold mt-2 mx-auto  text-[#05351b] border-[#05351b] p-2 rounded-[12px] border-2 ">
                                    عرض الإرسال و الإجراء
                                </p>
                                <div className="relative px-6 flex-auto">
                                    <div className="my-4 font-bold text-sm overflow-y-auto h-[300px] ">
                                        <table className="min-w-full text-center border-[#05351b] rounded-[12px] border-4">
                                            <thead className="border-b bg-[#05351b]">
                                                <tr>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        الإجراء المتخذ
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        توجية المدير
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        الإجراء
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        يرسل الى
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        م
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ShowData.length > 0 && (
                                                        ShowData.map((item, index) => {
                                                            return (
                                                                <tr key={index} className="bg-[#8a8989] border-b-[2px] border-[black]">
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {item.Action_text !== null ? item.Action_text : `لم يتم إتخاذ إجراء`}
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900  py-4 ">
                                                                        <p className='w-content max-w-[150px]  py-4'>
                                                                            {item.manager_assigned_text !== `` ? item.manager_assigned_text : `لم يتم إضافه توجية`}
                                                                        </p>
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {item.Action_Type.Action_Type_Name}
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {item.Assigned_To.department}
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {index + 1}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end px-6 pb-6 ">
                                    <button
                                        className="text-white bg-[#6e1212] active:bg-white active:text-[#6e1212] font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => { setShowSecondModal(false) }}
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

export default DistributerPage
