import BackDrop from './BackDrop'
import React, { useEffect, useState } from 'react';


const Modal = ({ children, setShowModal }: any) => {

    const [showContent, setShowContent] = useState(false);
    const [closing, setclosing] = useState(false);


    useEffect(() => {
        setTimeout(() => setShowContent(true), 10);
    }, []);

    const closeModal = () => {
        setclosing(true);
        setTimeout(() => {
            setShowModal(false);
        }, 400);
      };

    if (closing) return null;

    return (
        <>
        <BackDrop showBackDrop={showContent}/>
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center`}>
            <div 
                 className={`relative bg-white rounded-lg shadow-lg p-6 w-[70%] max-w-[550px] min-w-[450px] transition-all duration-400 ease-in-out
                        ${showContent ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-90 -translate-y-5 invisible'}
                    `}
            >
                <button
                    className="cursor-pointer absolute top-2 right-2 text-gray-700 hover:text-red-600 text-2xl font-bold transition-transform duration-200"
                    onClick={closeModal}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
        </>

    );
}

export default Modal;