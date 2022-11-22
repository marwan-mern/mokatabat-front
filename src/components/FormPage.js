import React, { useEffect, useState } from 'react'
import api from '../api/items'
import HeaderAll from './HeaderAll'
import { useNavigate } from "react-router-dom"
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux'
import { GetAPS, GetCurrentUser, SetIncome } from '../redux/actions/productActions';




const FormPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const Priorities = useSelector((state) => state.APS_Reducer.prioritiesData)
    const Secrets = useSelector((state) => state.APS_Reducer.secretsData)
    const CurrentUser = useSelector((state) => state.CurrentUserReducer.CurrentUser)

    const [CurrentUserData, setCurrentUserData] = useState()


    useEffect(() => {
        dispatch(GetAPS())
        dispatch(GetCurrentUser())
        GetUser()
    }, [dispatch])

    const [disable, setDisable] = useState(false)
    const [processNumber, setProcessNumber] = useState('')
    const [processDescription, setProcessDescription] = useState('')
    const [processDate, setProcessDate] = useState('')
    const [processSide, setProcessSide] = useState('')
    const [processData, setProcessData] = useState()
    const [processSecret, setProcessSecret] = useState('0')
    const [processUrgent, setProcessUrgent] = useState('0')

    const GetUser = async () => {
        const response = await api.get('/Users/CurrentUser')
        setCurrentUserData(response.data[0])
        console.log(response.data)
        response.data.length > 0 ? (response.data[0].role === `1` ? navigate(`/Distributer`) : response.data[0].role === `3` ? navigate(`/Form`) : response.data[0].role === `0` ? navigate(`/Consumer`) : response.data[0].role === `2` ? navigate(`/Consumer`) : navigate(`/`)) : navigate(`/`)
    }

    const changeProcessNumber = (e) => { setProcessNumber(e.target.value) }
    const changeProcessDescription = (e) => { setProcessDescription(e.target.value) }
    const changeProcessDate = (e) => { setProcessDate(e.target.value) }
    const changeProcessSide = (e) => { setProcessSide(e.target.value) }
    const changeProcessSecret = (e) => { setProcessSecret(e.target.value) }
    const changeProcessUrgent = (e) => { setProcessUrgent(e.target.value) }

    const changeProcessData = (e) => {
        const selectedFile = e.target.files
        if (!selectedFile) return;

        if (selectedFile.length > 0) {
            let fileToLoad = selectedFile[0];

            let fileReader = new FileReader();
            let base64;
            fileReader.onload = (e) => {
                base64 = e.target.result.split(",")[1];
                setProcessData(base64)
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }

    const Submit = async (e) => {
        e.preventDefault()
        setDisable(true)

        const response = await api.get(`/Incomes/CheckIncomeNo`, { params: { Income_No: processNumber } })

        if (response.data.length > 0) {
            notifyFail()
        } else {
            dispatch(SetIncome(processNumber, processDescription, processDate, processSecret, processUrgent, processSide, CurrentUser[0].Unique_User_Id, processData))
            notifySuccess()
        }

        setProcessNumber('')
        setProcessDate('')
        setProcessSide('')
        setProcessDescription('')
        setProcessSecret('0')
        setProcessUrgent('0')

        setDisable(false)
    }

    const notifyFail = () => {
        toast.error(<><p className='text-white font-bold text-lg'>برجاء تغيير رقم المعامله</p></>, {
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

    const notifySuccess = () => {
        toast.success(<><p className='text-white font-bold text-lg'>تم إرسال الوارد للمستوى الأعلى</p></>, {
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
        <div className=' m-auto p-4 h-screen'>
            <HeaderAll CurrentUserData={CurrentUserData} />
            <div className='w-[50%] inline-block '>
                <h1 className='text-2xl font-bold text-center pb-4'>الــــوارد</h1>
                <form onSubmit={Submit} className=' m-auto'>
                    <input onChange={changeProcessNumber} value={processNumber} className='border-2 border-black  shadow-lg p-3 w-full text-end' type="text" placeholder='رقم المعامله' />
                    <input onChange={changeProcessDescription} value={processDescription} className='border-2 border-black shadow-lg p-3 w-full my-2 text-end' type="text" placeholder='موضوع المعامله' />
                    <input onChange={changeProcessDate} value={processDate} className='border-2 border-black shadow-lg p-3 w-full my-2 text-end' type="date" />
                    <input onChange={changeProcessSide} value={processSide} className='border-2 border-black shadow-lg p-3 w-full my-2 text-end' type="text" placeholder='وارد من جهه' />
                    <input onChange={changeProcessData} className='border-2 border-black shadow-lg p-3 w-full my-2 text-end' type="file" accept='.pdf' />
                    <div className='w-[50%] inline-block ' >
                        <select value={processSecret} onChange={changeProcessSecret} id='Secret' className='border-2 font-bold border-black rounded-[12px] shadow-lg p-1 my-2 text-center'>
                            {Secrets.length > 0 && Secrets.map((item, index) => {
                                return (
                                    <option key={index} value={item._id}>{item.Secret_degree}</option>
                                )
                            })}
                        </select>
                        <label htmlFor="Secret" className='ml-[1.5rem]'>درجة السرية</label>
                    </div>
                    <div className='w-[50%] inline-block'>
                        <select value={processUrgent} onChange={changeProcessUrgent} id='Urgent' className='border-2 font-bold border-black rounded-[12px] shadow-lg p-1 my-2 text-center' >
                            {Priorities.length > 0 && Priorities.map((item, index) => {
                                return (
                                    <option key={index} value={item._id}>{item.priority_desc}</option>
                                )
                            })}
                        </select>
                        <label htmlFor="Urgent" className='ml-[1.5rem]'>درجة الاسبقية</label>
                    </div>
                    <button disabled={disable ? true : false} className={`border ${disable ? `bg-[#630808]` : `bg-[#05351b]`}  shadow-lg p-3 w-full mt-2 text-center text-white font-bold  active:bg-white active:text-[#05351b]`} type='submit'>إرسال</button>
                </form>
            </div>
            {/* <div className='inline-block p-4 '> */}
            {/* {processData ? <embed src={`data:application/pdf;base64,${processData}`} width="500px" height="500px"></embed> : ``} */}
            {/* <embed src={`http://localhost:80//postSystem/test.pdf`} width="500px" height="500px"></embed> */}
            {/* {fileName ? <embed src={`http://localhost:80//postSystem/${fileName}`} width="500px" height="500px"></embed> : ``} */}
            {/* </div> */}
        </div>
    )
}

export default FormPage
