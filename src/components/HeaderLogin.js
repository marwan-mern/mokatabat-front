import React from 'react'



const HeaderLogin = () => {


    return (
        <div className='flex justify-center' >
            {/* <img
                src="/header.jpg"
                className="fixed w-full h-full object-cover opacity-90 "
                style={{zIndex:-1000}}
                alt='logo'
            /> */}
            <img
                src="/Logo.jpg"
                className="fixed mt-[5%] w-[150px] h-[120px]"
                style={{ zIndex: -1000 }}
                alt='logo'
            />
        </div>
    )
}

export default HeaderLogin
